import React, { useEffect, useState } from 'react';
import "./RedirectForm.css"
import { contractRead } from "../resources/ReadContract";
import { ethers } from "ethers";
import booleanCheckValuesForReferralMint from "../resources/booleanCheckValuesForReferralMint";
import createWriteContract from "../createWriteContract";




 function RedirectForm({formElements}) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  useEffect (() =>{
  
  }, [])

  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  }

  const CheckReferralMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.minReferralMintPrice();
    console.log(contractBalance)
    let hasmintedYet = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYet) {
      booleanCheckValuesForReferralMint.hasMintedYetValue = false;
      console.log("already minted");
    }
    if (userBalance > contractBalance._hex) {

      console.log(userBalance <= contractBalance._hex)
      booleanCheckValuesForReferralMint.walletBalanceCheck = false;
      console.log("low balance");
    }
    return contractBalance
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
    if(!( await isFormInValid()))
    {let returnArray = await ConnectWalletHandler();
    let walletAddress = returnArray[0];
    console.log("walletAddress: " + walletAddress);
    let walletBalance = returnArray[1];
    console.log("walletBalance: " + walletBalance);
    checkCorrectNetwork();
    let contractBalance = await CheckReferralMint(walletAddress, walletBalance);
    console.log("publicMintPrice: " + contractBalance);
    if (
      (booleanCheckValuesForReferralMint.hasMintedYetValue) &&
      (booleanCheckValuesForReferralMint.walletBalanceCheck) 
    ) {
      await mintContract(contractBalance);
    }}
    else {console.log("error bro")}
  };


  const mintContract = async (contractBalance) => {
    const nftContract = createWriteContract();
    try {
      let nftTx = await nftContract.becomeAChad({
        value: contractBalance._hex + 1,
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

  const isFormInValid = async () => {
    let returnValue = false;
    formElements.forEach(formElement => {
      if (formData[formElement.key] === undefined || formData[formElement.key] === "" ) {// regex, tokein id integer, mintPrice should be float value, referal code regex check
        alert(formElement.label + " is Missing");
        returnValue = true
      }
    })
    return returnValue
  }

  return (
    <div className="login-container">
      <form className='form-login'>
        {formElements.map(formElement => {
        return <div>
          <label className='login__label'>{formElement.label}</label>
          <input className='login__input' value={formData[formElement.key]}
            onChange={(e) => { 
            handleChange(e.target.value, formElement.key) }}/>
            </div>
      })}
        <button className='login__submit' onClick={(e) => { e.preventDefault();mintingProcess()}}>submit</button>
      </form>
    </div>
  );

}
export default RedirectForm