import React from "react";
import Button from "./Button/Button";
import { useState } from "react";
import { ethers } from "ethers";

const PriorityButton = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setdefaultAccount] = useState(null);
  const [userBalance, setuserBalance] = useState(null);

  const ConnectWalletHandler = () => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          accountChangeHandler(result[0]);
        });
    } else {
      setErrorMessage("Install Metamask");
    }
    console.log("hello");
  };
  const accountChangeHandler = (newAccount) => {
    setdefaultAccount(newAccount);
    getUserBalance(newAccount);
  };
  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setuserBalance(ethers.utils.formatEther(balance));
      });
  };
  const chainChangedHandler = () => {
    window.location.reload();
  };
  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div>
      {/* <h1>balance : {userBalance}</h1> wallet balance */}
      {/* <h1>account : {defaultAccount}</h1> wallet address */}
      <div onClick={ConnectWalletHandler}>
        <Button buttonText="Special Users" />
      </div>
    </div>
  );
};

export default PriorityButton;
