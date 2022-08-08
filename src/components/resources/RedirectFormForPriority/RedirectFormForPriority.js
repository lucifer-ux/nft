import React, { useState } from 'react';
import { contractRead } from "../ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../../createWriteContract";
import ErrorModal from '../../ErrorModal/ErrorModal';
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../../utilities/contract"
import CircleLoader from "react-spinners/CircleLoader";

 function RedirectForm({priorityFormElements}) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [referalCodeCheck, setReferalCodeCheck] = useState(null);
  const [linkFailure, setLinkFailure] = useState(false)

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  }

  const CheckPriorityMint = async (defaultAccount, userBalance) => {
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      setHasMintedYet(false);
      setErrorModalValue(true)
    }
    return !hasmintedYet
  };

  const initializeStates = async () => {
    setErrorModalValue(false)
    setTransState(null)
    setHasMintedYet(true)
    setReferalCodeCheck(null)
    setLinkFailure(false)
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
    let checkReturnValue = await CheckPriorityMint(walletAddress, walletBalance);
    if (
      checkReturnValue 
    ) {
      await mintContract();
    }}
    else {console.log("error bro")}
    setLoadingComp(false)
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
      setTransState(
        `https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      );
    } catch (error) {
      setLinkFailure(true)
      console.log("Error minting", error);
      if(error.code === 4001)
      setTransState(error.message);
      else
      setTransState(error.reason)
    }
    setErrorModalValue(true)
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    priorityFormElements.forEach(priorityFormElements => {
      if (formData[priorityFormElements.key] === undefined || formData[priorityFormElements.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        if(priorityFormElements.key === "referalCode"){
          setReferalCodeCheck(priorityFormElements.label + " is Missing")
          console.log(priorityFormElements.label + " is Missing")
        }
        returnValue = true;
      }
    })
    if (returnValue)
     return returnValue;

    if(!/^0x[a-f0-9]{130}$/.test(formData.referalCode)) {
      setReferalCodeCheck(/^0x[a-f0-9]{130}$/.test(formData.referalCode)?null:"Invalid Referral code Format");
      console.log(/^0x[a-f0-9]{130}$/.test(formData.referalCode)?null:"Invalid Referral code Format")
      returnValue = true
    }
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {priorityFormElements.map(priorityFormElements => {
        return <div>
          <label className='login__label'>{priorityFormElements.label}</label>
          <input className='login__input' value={formData[priorityFormElements.key]}
            onChange={(e) => { 
            handleChange(e.target.value, priorityFormElements.key) }}/>

          <p
            className={
              priorityFormElements.key === "referalCode" && referalCodeCheck!==null
                ? "visible"
                : "gone"
            }
          >
            {referalCodeCheck}
          </p>
        </div>
      })}
              <h1>
          {!hasMintedYet && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Already minted!!"
              body="You can mint only once"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
        </h1>
        {transState != null && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Transaction Status!!"
              body = {linkFailure ? transState : "click below link to see transaction"}
              buttonText={linkFailure ? "Go back" : "status"}
              setErrorModalValue={setErrorModalValue}
              link = {linkFailure ? "#" : transState}
              linkFailure = {linkFailure}
            />
          )}


              <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
        <button className='login__submit' onClick={(e) => { e.preventDefault();mintingProcess()}}>submit</button>
      </form>
    </div>
  );

}
export default RedirectForm