import React from "react";
import Button from "./Button/Button";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import CircleLoader from "react-spinners/CircleLoader";
import "../App.css"
import booleanCheckValuesForGenerateReferal from "./resources/booleanCheckValuesForGenerateReferal"
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"

const GenerateReferal = (props) => {
  const [boolValue, setBoolValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [errorModalValue, setErrorModalValue] = useState(false);

  useEffect(() => {
    contractRead.isReferralMintLive().then((res) => {
      setBoolValue(res);
    });
  }, [loadingComp]);

  const Navigate = useNavigate();
  const ButtonEnalbled = () => {
    return boolValue;
  };

  const mintingProcess = async () => {
    setLoadingComp(true);
    let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
await CheckGenerateReferalMint(walletAddress, walletBalance);
    if (
      booleanCheckValuesForGenerateReferal.isPrivilegedTokenHolder
    ) {
      props.setState(true);
      Navigate('/formGenerate');
    }
    setLoadingComp(false);
  };

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



    if (ownedPrivilegedTokenIDs.length === 0) {
      booleanCheckValuesForGenerateReferal.isPrivilegedTokenHolder = false;
      setErrorModalValue(true);
      console.log("You Don't Hold Privileged Tokens");
    }
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div >
      {/* <h1>balance : {userBalance}</h1> wallet balance
      <h1>account : {defaultAccount}</h1> wallet address */}
      <h1>
        {!booleanCheckValuesForGenerateReferal.isPrivilegedTokenHolder &&
          !loadingComp &&
          errorModalValue && (
            <ErrorModal
              text="No Elite NFTs Found!!"
              body="You dont have any elite Chads"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
      </h1>
            <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
          <span onClick={mintingProcess}>
        <Button buttonText="Generate Referal"/>
        </span>
    </div>    );
};

export default GenerateReferal;
