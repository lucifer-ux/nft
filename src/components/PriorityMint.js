import React from "react";
import Button from "./Button/Button";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import booleanCheckValuesForPriorityMint from "./resources/booleanCheckValuesForPriorityMint";
import { contractRead } from "./resources/ReadContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import "../App.css"
import CircleLoader from "react-spinners/CircleLoader";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"

const PriorityButton = (props) => {
  const [loadingComp, setLoadingComp] = useState(false);
  const [errorModalValue, setErrorModalValue] = useState(false);

  useEffect(() => {
  }, [loadingComp ]);
  const Navigate = useNavigate()
  const ButtonEnalbled = () => {
    return true;
  };

  const mintingProcess = async () => {
    setLoadingComp(true);
    let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    await CheckPriorityMint(walletAddress, walletBalance);
    if( booleanCheckValuesForPriorityMint.hasMintedYetValue ) {
      Navigate('/formPriority')
      props.setState(true)
    }
      
   
    setLoadingComp(false);
  };

  const CheckPriorityMint = async (defaultAccount, userBalance) => {
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      booleanCheckValuesForPriorityMint.hasMintedYetValue = false;
      setErrorModalValue(true);
      console.log("already minted");
    }
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);


  return (
    <div >
      {/* <h1>balance : {userBalance}</h1> wallet balance
      <h1>account : {defaultAccount}</h1> wallet address */}
      <h1>
        {!booleanCheckValuesForPriorityMint.hasMintedYetValue &&
          !loadingComp &&
          errorModalValue && (
            <ErrorModal
              text="Aleready minted!!"
              body="You can mint only once"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
      </h1>
      <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
          <span onClick={mintingProcess}>
        <Button buttonText="Priority Mint"/>
        </span>
    </div>    );
};

export default PriorityButton;
