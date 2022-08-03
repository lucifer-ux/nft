import React from "react";
import Button from "./Button/Button";
import { useState } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import { useEffect } from "react";
import booleanCheckValues from "./resources/booleanCheckValuesPublicMint";
import createWriteContract from "./createWriteContract";
import ErrorModal from "./ErrorModal/ErrorModal";
import CircleLoader from "react-spinners/CircleLoader";
import "../App.css"
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "./utilities/contract"
const PublicMint = () => {
  const [boolValue, setBoolValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [transState, setTransState] = useState(null);
  const [errorModalValue, setErrorModalValue] = useState(false);

  useEffect(() => {
    contractRead.isPublicMintLive().then((res) => {
      setBoolValue(res);
    });
  }, [loadingComp]);

  const ButtonEnalbled = () => {
    return boolValue;
  };

  const mintContract = async (contractBalance) => {
    const nftContract = createWriteContract();
    try {
      let nftTx = await nftContract.becomeAChad({
        value: contractBalance.add(1),
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

  const mintingProcess = async () => {
    setLoadingComp(true);
    let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let contractBalance = await CheckPublicMint(walletAddress, walletBalance);
    console.log("publicMintPrice: " + contractBalance);
    if (
      booleanCheckValues.hasMintedYetValue &&
      booleanCheckValues.walletBalanceCheck
    ) {
      await mintContract(contractBalance);
    }
    setLoadingComp(false);
  };
 

  const CheckPublicMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.publicMintPrice();

    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      booleanCheckValues.hasMintedYetValue = false;
      setErrorModalValue(true);
      console.log("already minted");
    }
    if (ethers.BigNumber.from(userBalance).lte(contractBalance)) {
      booleanCheckValues.walletBalanceCheck = false;
      setErrorModalValue(true);
      console.log("low balance");
    }
    return contractBalance;
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div >
      {/* <h1>balance : {userBalance}</h1> wallet balance
      <h1>account : {defaultAccount}</h1> wallet address */}
      <h1>
        {!booleanCheckValues.hasMintedYetValue &&
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
      <h1>
        {!booleanCheckValues.walletBalanceCheck &&
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
              body = {transState}
              buttonText="Ok"
              setErrorModalValue={setErrorModalValue}
              link = ""
            />
          )}
            <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
      <div onClick={mintingProcess}>
        <Button  buttonText="Public Mint" />
      </div>
    </div>
  );
};

export default PublicMint;
