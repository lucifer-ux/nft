import React, { useState, useEffect } from 'react';
import { contractRead } from "../ReadContract";
import { ethers } from "ethers";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../../utilities/contract"
import {generateReferralCode} from "./generateCode"
import ErrorModal from '../../ErrorModal/ErrorModal';
import CircleLoader from "react-spinners/CircleLoader";

 function RedirectFormForGenerate({generateFormElements}) {
  const [formData, setFormData] = useState({});
  const [wrongTokenEntered, setWrongTokenEntered] = useState(null);
  const [hasMintedYet, setHasMintedYet] = useState(null);
  const [mintingPriceCheck, setMintingPriceCheck] = useState(null);
  const [errorModalValue,setErrorModalValue] = useState(false);
  const [signature, setSignature] = useState("");
  const [loadingComp, setLoadingComp] = useState(false);
  const [isEliteHolder, setIsEliteHolder] = useState(true);
  const [jsonData, setjsonData] = useState([])
  const [tokenArray, setTokenArray] = useState([])

  useEffect(() => {
    ConnectWalletHandler().then((res) => {
      getPrivilegedTokens(res[0]).then((tokens) => {
        setTokenArray(tokens)
        console.log("elite cards", tokenArray)
      });
    });
  }, [loadingComp]);

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
    console.log(value)
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
    setTokenArray(ownedPrivilegedTokenIDs)
    let minReferralMintPrice = await contractRead.minReferralMintPrice();
    console.log("minReferralPrice: " + minReferralMintPrice);
    console.log(ownedPrivilegedTokenIDs[0])
    let ifRightTokenEntered = ownedPrivilegedTokenIDs.includes(parseInt(formData.tokenId))
    let MintingPriceLessThanMinReferralMintPrice = ethers.utils.parseEther(formData.mintingPrice).lt(minReferralMintPrice)
    let AddressHasMinted = await contractRead.hasMinted(formData.walletAddress)



    if (ownedPrivilegedTokenIDs.length === 0) {
      console.log("You Don't Hold Elite NFT");
      setIsEliteHolder(false);
      setErrorModalValue(true);
    }

    if (MintingPriceLessThanMinReferralMintPrice) {
      setMintingPriceCheck("low minting price")
      console.log("low minting price");
    }

    if(!ifRightTokenEntered) {
      console.log("This is not an owned Elite NFT")
      setWrongTokenEntered("This is not an owned Elite NFT")
    }

    if(AddressHasMinted) {
      setHasMintedYet("This address has already minted")
      console.log("This address has already minted")
    }
    return (ownedPrivilegedTokenIDs.length > 0) && ifRightTokenEntered && (!MintingPriceLessThanMinReferralMintPrice) && (!AddressHasMinted);
  };

  const initializeStates = async () => {
    setErrorModalValue(false)
    setIsEliteHolder(true)
    setHasMintedYet(null)
    setSignature("")
    setWrongTokenEntered(null)
    setMintingPriceCheck(null)
  }

  const mintingProcess = async () => {
    await initializeStates();
    setLoadingComp(true)
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
      setErrorModalValue(true)
      let signatureCode = (await generateReferralCode(formData.walletAddress, formData.mintingPrice, parseInt(formData.tokenId))).signature
      setSignature((await generateReferralCode(formData.walletAddress, formData.mintingPrice, parseInt(formData.tokenId))).signature);
      setjsonData(["walletAddress : "+formData.walletAddress, "\n mintingPrice : "+ formData.mintingPrice, "\n tokenId : " + parseInt(formData.tokenId), "\n referral code : " + signatureCode])
    }}
    else {console.log("error bro")}
    setLoadingComp(false)
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    generateFormElements.forEach(formElement => {
      if (formData[formElement.key] === undefined || formData[formElement.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        if(formElement.key === "tokenId")
        {setWrongTokenEntered(formElement.label + " is Missing");
        }
        if(formElement.key === "mintingPrice")
        {setMintingPriceCheck(formElement.label + " is Missing")}

        if(formElement.key === "walletAddress"){
          setHasMintedYet(formElement.label + " is Missing")
        }
        returnValue = true;
      }
    })
    if (returnValue)
     return returnValue;
    const test = /^0x[a-fA-F0-9]{40}$/.test(formData.walletAddress);
    if(!test) { 
      setHasMintedYet("invalid wallet address")
      returnValue = true
    }
    if (!Number.isInteger(parseInt(formData.tokenId))) {
      setWrongTokenEntered("tokenId should be Integer");
      returnValue = true;
    }
    if(Number.isNaN(parseFloat(formData.mintingPrice))) {
      
      setMintingPriceCheck("minting Price should be in float")
      returnValue = true;
    }
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {generateFormElements.map(formElement => {
        return (
        <div>
          <label className='login__label'>{formElement.label}</label>
          {formElement.key === "tokenId" ?
              <select className="login__input" onClick={(e) => {
                handleChange(e.target.value, formElement.key);
              }}>
                {tokenArray.map((val)=>{
                 return <option value={val} >{val}</option>
                })}
              </select> 
              : 
              <input
                className="login__input"
                value={formData[formElement.key]}
                onChange={(e) => {
                  handleChange(e.target.value, formElement.key);
                }}
              />
}        <p
          className={
            formElement.key === "tokenId" && wrongTokenEntered!==null 
              ? "visible"
              : "gone"
          }
        >
          {wrongTokenEntered}
        </p>
        <p
          className={
            formElement.key === "walletAddress" && hasMintedYet!==null 
              ? "visible"
              : "gone"
          }
        >
          {hasMintedYet}
        </p>
        <p
          className={
            formElement.key === "mintingPrice" && mintingPriceCheck!==null 
              ? "visible"
              : "gone"
          }
        >
          {mintingPriceCheck}
        </p>
            </div>)
      })}
           {!loadingComp && (errorModalValue) && signature!=="" &&
           (<ErrorModal
              text="Success"
              body="get the credentials by clicking below"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
              transactionMessageDisplay = {true}
              copyText = {jsonData}
              copyButtonText = "Copy"
            />
            )}
                       { !loadingComp && (errorModalValue) && (!isEliteHolder) &&
           (<ErrorModal
              text="Not a priviliged token"
              body="You Dont Hold Elite NFT"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
            )}

                  <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
        <button className='login__submit' onClick={(e) => { e.preventDefault();mintingProcess()}}>submit</button>
      </form>
    </div>
  );

}
export default RedirectFormForGenerate