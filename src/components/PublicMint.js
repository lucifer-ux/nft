import React from "react";
import Button from "./Button/Button";
import { useState } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import { useEffect } from "react";
import createWriteContract from "./createWriteContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import CircleLoader from "react-spinners/CircleLoader";
import "../App.css"
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"
const PublicMint = () => {
  const [boolValue, setBoolValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [transState, setTransState] = useState(null);
  const [linkFailure, setLinkFailure] = useState(false)
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true)
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true)

  useEffect(() => {
    contractRead.isPublicMintLive().then((res) => {
      setBoolValue(res);
    });
  }, [loadingComp]);

  const mintContract = async (contractBalance) => {
    const nftContract = createWriteContract();
    try {
      let nftTx = await nftContract.becomeAChad({
        value: contractBalance.add(1),
      });
      console.log("Mining....", nftTx.hash);
      setTransState(
        `https://rinkeby.etherscan.io/tx/${nftTx.hash}`
      );
    } catch (error) {
      setLinkFailure(true)
      console.log("Error minting", error, error.code);
      if(error.code === 4001)
      setTransState(error.message);
      else
      setTransState(error.reason)
    }
    setErrorModalValue(true)
  };

  const initializeStates = async () => {
    setErrorModalValue(false)
    setTransState(null)
    setHasMintedYet(true)
    setWalletBalanceCheck(true)
    setLinkFailure(false)
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
    let {checkReturnValue, contractBalance} = await CheckPublicMint(walletAddress, walletBalance);
    console.log("publicMintPrice: " + contractBalance);
    if (
      checkReturnValue
    ) {
      await mintContract(contractBalance);
    }
    setLoadingComp(false);
  };
 

  const CheckPublicMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.publicMintPrice();

    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      setHasMintedYet(false);
      setErrorModalValue(true);
      console.log("already minted");
    }
    if (ethers.BigNumber.from(userBalance).lte(contractBalance)) {
      setWalletBalanceCheck(false);
      setErrorModalValue(true);
      console.log("low balance");
    }
    let checkReturnValue = (!hasmintedYet) && (!ethers.BigNumber.from(userBalance).lte(contractBalance));
    console.log( "linkFailure",linkFailure)
    return { checkReturnValue, contractBalance};
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);
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
      {transState != null && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Transaction Status!!"
              body = {linkFailure ? "error" : "click below link to see transaction"}
              buttonText={linkFailure ? "Go back" : "status"}
              setErrorModalValue={setErrorModalValue}
              link = {linkFailure ? "#" : transState}
              linkFailure = {linkFailure}
            />
          )}
            <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
      <div onClick={mintingProcess}>
        <Button  buttonText="Public Mint" isButtonActive = {boolValue}/>
      </div>
    </div>
  );
};

export default PublicMint;
