import React from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import Button from "./Button/Button";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import "../App.css"
import CircleLoader from "react-spinners/CircleLoader";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"

const PriorityButton = (props) => {
  const [loadingComp, setLoadingComp] = useState(false);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);

  useEffect(() => {
  }, [loadingComp ]);
  const Navigate = useNavigate()
  const ButtonEnalbled = () => {
    return true;
  };
  const initializeStates = async () => {
    setErrorModalValue(false)
    setHasMintedYet(true)
  }

  const mintingProcess = async () => {
    await initializeStates();
    setLoadingComp(true);
    let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let checkReturnValue = await CheckPriorityMint(walletAddress, walletBalance);
    if( checkReturnValue ) {
      Navigate('/formPriority')
      props.setState(true)
    }
      
   
    setLoadingComp(false);
  };

  const CheckPriorityMint = async (defaultAccount, userBalance) => {
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      setHasMintedYet(false);
      setErrorModalValue(true);
      console.log("already minted");
    }
    return (!hasmintedYet)
  };

  detectEthereumProvider().then((provider) => {
    provider.on("accountsChanged", accountChangeHandler);
    provider.on("chainChanged", chainChangedHandler);
  });


  return (
    <div >
      <h1>
        {!hasMintedYet &&
          !loadingComp &&
          errorModalValue && (
            <ErrorModal
              text="Already minted!!"
              body="You can mint only once"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
      </h1>
      <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
          <span onClick={mintingProcess}>
        <Button buttonText="Priority Mint" isButtonActive = {ButtonEnalbled()}/>
        </span>
    </div>    );
};

export default PriorityButton;
