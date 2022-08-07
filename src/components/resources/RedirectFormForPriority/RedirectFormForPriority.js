import React, { useState } from 'react';
import { contractRead } from "../ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../../createWriteContract";
import ErrorModal from '../../ErrorModal/ErrorModal';
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../../utilities/contract"

 function RedirectForm({priorityFormElements}) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true);
  const [referalCodeCheck, setReferalCodeCheck] = useState(true);

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
    setReferalCodeCheck(/^0x[a-f0-9]{130}$/.test(formData.referalCode));
  }

  const CheckPriorityMint = async (defaultAccount, userBalance) => {
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      console.log("already minted");
      alert("already minted")
      setHasMintedYet(false);
      setErrorModalValue(true)
    }
    return !hasmintedYet
  };

  const mintingProcess = async () => {
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
      let tx = await nftTx.wait();
      console.log("Mined!", tx);
      setTransState(
        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      );
    } catch (error) {
      console.log("Error minting", error);
      setTransState(error.message);
    }
    setErrorModalValue(true)
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    priorityFormElements.forEach(priorityFormElements => {
      if (formData[priorityFormElements.key] === undefined || formData[priorityFormElements.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        alert(priorityFormElements.label + " is Missing");
        returnValue = true
      }
    })
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
            </div>
      })}
              <p
                className={
                !referalCodeCheck 
                    ? "visible"
                    : "gone"
                }
              >
                Wrong Credential
              </p>
              <h1>
          {!hasMintedYet && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Aleready minted!!"
              body="You can mint only once"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
        </h1>
        <h1>
          {!walletBalanceCheck && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Low Wallet Balance!!"
              body="You dont have what it takes to become a chad"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
        </h1>
        {transState != null && !loadingComp && errorModalValue && (
          <ErrorModal
            text="Transaction Status!!"
            body={transState}
            buttonText="Ok"
            setErrorModalValue={setErrorModalValue}
            link=""
          />
        )}
        <button className='login__submit' onClick={(e) => { e.preventDefault();mintingProcess()}}>submit</button>
      </form>
    </div>
  );

}
export default RedirectForm