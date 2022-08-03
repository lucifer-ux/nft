import React, { useState } from 'react';
import { contractRead } from "../ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../../createWriteContract";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../../utilities/contract"

 function RedirectForm({priorityFormElements}) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  }

  const CheckReferralMint = async (defaultAccount, userBalance) => {
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      console.log("already minted");
      alert("already minted")
    }

    return !hasmintedYet
  };

  const mintingProcess = async () => {
    if(!( await isFormInValid()))
    {let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let checkReturnValue = await CheckReferralMint(walletAddress, walletBalance);
    if (
      checkReturnValue 
    ) {
      await mintContract();
    }}
    else {console.log("error bro")}
  };


  const mintContract = async (contractBalance) => {
    const nftContract = createWriteContract();
    try {
      let nftTx = await nftContract.becomeAPartnerChad(
        formData.referalCode,
        {
        value: 1,
      });
      console.log("Mining....", nftTx.hash);
      let tx = await nftTx.wait();
      console.log("Mined!", tx);
      setTransState(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      );
    } catch (error) {
      console.log("Error minting", error);
      setTransState(error.message);
    }
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    priorityFormElements.forEach(formElement => {
      if (formData[formElement.key] === undefined || formData[formElement.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        alert(formElement.label + " is Missing");
        returnValue = true
      }
    })
    const test = /^0x[a-f0-9]{130}$/.test(formData.referalCode);
    if(!test) {alert("invalid referal code")
  returnValue = true}
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {priorityFormElements.map(formElement => {
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
export default RedirectForm