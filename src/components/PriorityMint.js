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

const PriorityButton = (props) => {
  const [boolValue, setBoolValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [errorModalValue, setErrorModalValue] = useState(false);

  useEffect(() => {
    contractRead.isReferralMintLive().then((res) => {
      setBoolValue(res);
    });
  }, [loadingComp ]);
  const Navigate = useNavigate()
  const ButtonEnalbled = () => {
    return boolValue;
  };
  const checkCorrectNetwork = async () => {
    if (window.ethereum.networkVersion !== 4) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(4) }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Rinkeby Mainnet",
                chainId: ethers.utils.hexValue(4),
                nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
                rpcUrls: ["https://rinkeby.infura.io/v3/"],
              },
            ],
          });
        }
      }
    }
  };

  const mintingProcess = async () => {
    setLoadingComp(true);
    let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let contractBalance =  await CheckPriorityMint(walletAddress, walletBalance);
    console.log("minPriorityMintPrice:"+ contractBalance._hex);
    if( booleanCheckValuesForPriorityMint.walletBalanceCheck && booleanCheckValuesForPriorityMint.hasMintedYetValue ) {
      Navigate('/formPriority')
      props.setState(true)
    }
      
   
    setLoadingComp(false);
  };

  const CheckPriorityMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.minReferralMintPrice();
    console.log(contractBalance)
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      booleanCheckValuesForPriorityMint.hasMintedYetValue = false;
      setErrorModalValue(true);
      console.log("already minted");
    }
    if (ethers.BigNumber.from(userBalance).lte(contractBalance)) {
      console.log(userBalance <= contractBalance)
      console.log(ethers.BigNumber.from(userBalance))
      console.log(contractBalance._hex)
      booleanCheckValuesForPriorityMint.walletBalanceCheck = false;
      setErrorModalValue(true);
      console.log("low balance");
    }
    return contractBalance
  };

  const ConnectWalletHandler = async () => {
    if (window.ethereum) {
      let addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let userBalance = await accountChangeHandler(addresses[0]);
      return [addresses[0], userBalance];
    }
  };

  const accountChangeHandler = async (newAccount) => {
    let userBalance = await getUserBalance(newAccount);
    return userBalance;
  };

  const getUserBalance = async (address) => {
    return await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
  };

  const chainChangedHandler = () => {
    window.location.reload();
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
      <h1>
        {!booleanCheckValuesForPriorityMint.walletBalanceCheck &&
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
      <CircleLoader color="#2C71C3" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
          <span onClick={mintingProcess}>
        <Button buttonText="Priority Mint"/>
        </span>
    </div>    );
};

export default PriorityButton;
