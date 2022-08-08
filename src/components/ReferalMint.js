import React from "react";
import Button from "./Button/Button";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import { useNavigate } from "react-router-dom";
import CircleLoader from "react-spinners/CircleLoader";
import "../App.css"
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"
const ReferralButton = (props) => {
  const [boolValue, setBoolValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true);
  
  useEffect(() => {
    contractRead.isReferralMintLive().then((res) => {
      setBoolValue(res);
    });
  }, [loadingComp ]);

   const Navigate = useNavigate()
  const ButtonEnalbled = () => {
    return boolValue;
  };

  const initializeStates = async () => {
    setErrorModalValue(false)
    setHasMintedYet(true)
    setWalletBalanceCheck(true)
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
    let {checkReturnValue, contractBalance} =  await CheckReferralMint(walletAddress, walletBalance);
    console.log("minReferralMintPrice:"+ contractBalance._hex);
    if( checkReturnValue ) {
      props.setState(true)
      Navigate('/form')}
    setLoadingComp(false);
  };

  const CheckReferralMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.minReferralMintPrice();
    console.log(contractBalance)
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      setHasMintedYet(false);
      setErrorModalValue(true);
      console.log("already minted");
    }
    if (ethers.BigNumber.from(userBalance).lte(contractBalance)) {
      console.log(userBalance <= contractBalance)
      console.log(ethers.BigNumber.from(userBalance))
      console.log(contractBalance._hex)
      setWalletBalanceCheck(false);
      setErrorModalValue(true);
      console.log("low balance");
    }
    let checkReturnValue = (!hasmintedYet) && (!ethers.BigNumber.from(userBalance).lte(contractBalance));
    return { checkReturnValue, contractBalance};
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  // token id , minting price, referral code
  return (
    <div >
      {/* <h1>balance : {userBalance}</h1> wallet balance
      <h1>account : {defaultAccount}</h1> wallet address */}
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
      <h1>
        {!walletBalanceCheck &&
          !loadingComp &&
          errorModalValue && (
            <ErrorModal
              text="Low Wallet Balance!!"
              body="You dont have what it takes to become a chad"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
      </h1>
            <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
          <span onClick={mintingProcess}>
        <Button buttonText="Referral Mint" isButtonActive = {() => ButtonEnalbled}/>
        </span>
    </div>  
    );
};

export default ReferralButton;
