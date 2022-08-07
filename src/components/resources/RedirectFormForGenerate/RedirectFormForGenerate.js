import React, { useState } from 'react';
import { contractRead } from "../ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../../createWriteContract";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../../utilities/contract"
import {generateReferralCode} from "./generateCode"

 function RedirectFormForGenerate({generateFormElements}) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true);

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  }
  // get Privileged tokens
  const getPrivilegedTokens = async (defaultAccount) => {
    let privilegedTokens = []
    let ownedTokenIDs = await contractRead.tokensOf(defaultAccount);
    console.log(ownedTokenIDs)
    for(let i = 0; i<ownedTokenIDs.length; i++){
      if(await contractRead.isTokenPrivileged(ownedTokenIDs[i])){
        privilegedTokens.push(ownedTokenIDs[i].toNumber());
      }
    }
    return privilegedTokens;
  }

  const CheckGenerateReferalMint = async (defaultAccount, userBalance) => {
    let ownedPrivilegedTokenIDs = await getPrivilegedTokens(defaultAccount)
    let minReferralMintPrice = await contractRead.minReferralMintPrice();
    console.log("minReferralPrice: " + minReferralMintPrice);
    console.log(ownedPrivilegedTokenIDs[0])
    let ifRightTokenEntered = ownedPrivilegedTokenIDs.includes(parseInt(formData.tokenId))
    let MintingPriceLessThanMinReferralMintPrice = ethers.utils.parseEther(formData.mintingPrice).lt(minReferralMintPrice)
    let AddressHasMinted = await contractRead.hasMinted(formData.walletAddress)



    if (ownedPrivilegedTokenIDs.length === 0) {
      console.log("You Don't Hold Elite NFT");
      alert("You Dont Hold Elite NFT")
    }

    if (MintingPriceLessThanMinReferralMintPrice) {
      setWalletBalanceCheck(false);
      console.log("low minting price");
      alert("low minting price")
    }

    if(!ifRightTokenEntered) {
      console.log("This is not an owned Elite NFT")
      alert("This is not an owned Elite NFT")
    }

    if(AddressHasMinted) {
      console.log("This address has already minted")
      alert("This address has already minted")
    }
    return (ownedPrivilegedTokenIDs.length > 0) && ifRightTokenEntered && (!MintingPriceLessThanMinReferralMintPrice) && (!AddressHasMinted);
  };


  const mintingProcess = async () => {
    if(!( await isFormInValid()))
    {let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let checkReturnValue = await CheckGenerateReferalMint(walletAddress, walletBalance);
    if (
      checkReturnValue
    ) {
      alert((await generateReferralCode(formData.walletAddress, formData.mintingPrice, parseInt(formData.tokenId))).signature);
    }}
    else {console.log("error bro")}
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    generateFormElements.forEach(formElement => {
      if (formData[formElement.key] === undefined || formData[formElement.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        alert(formElement.label + " is Missing");
        returnValue = true
      }
    })
    const test = /^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress);
    if(!test) { 
      alert("invalid wallet address")
      returnValue = true
    }
    if (!Number.isInteger(parseInt(formData.tokenId))) {
      alert("tokenId should be Integer");
      returnValue = true;
    }
    if(Number.isNaN(parseFloat(formData.mintingPrice))) {
      
      alert("minting Price should be in float")
      returnValue = true;
    }
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {generateFormElements.map(formElement => {
        return <div>
          <label className='login__label'>{formElement.label}</label>
          <input className='login__input' value={formData[formElement.key]}
            onChange={(e) => { 
            handleChange(e.target.value, formElement.key) }}/>
            </div>
      })}
        <button className='login__submit' onClick={(e) => { e.preventDefault();mintingProcess()}}>submit</button>
      </form>
    </div>
  );

}
export default RedirectFormForGenerate