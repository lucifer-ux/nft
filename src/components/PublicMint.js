import React from "react";
import Button from "./Button/Button";
import { useState } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import { useEffect } from 'react';
import booleanCheckValues from "./resources/booleanCheckValues";
import createWriteContract from "./createWriteContract";

const PublicMint = () => {
  const [boolValue, setBoolValue] = useState(false)

  useEffect (() =>{
    contractRead.isPublicMintLive()
    .then((res)=>{
      setBoolValue(res)
    })
    } ,[])

const ButtonEnalbled = () =>{
  return boolValue
}

const checkCorrectNetwork = async () => {
  if (window.ethereum.networkVersion !== 4) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexValue(4) }]
      });
    } catch (err) {
      if (err.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainName: 'Rinkeby Mainnet',
              chainId: ethers.utils.hexValue(4),
              nativeCurrency: { name: 'ETH', decimals: 18, symbol: 'ETH' },
              rpcUrls: ['https://rinkeby.infura.io/v3/']
            }
          ]
        });
      }
    }
  }
}
const mintContract  = async (contractBalance) =>{
  const nftContract = createWriteContract()
  let nftTx = await nftContract.becomeAChad({value: contractBalance._hex + 1})
				console.log('Mining....', nftTx.hash)
        console.log("nftTx"+":"+ nftTx ) 
				let tx = await nftTx.wait()
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()
				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)
}

const mintingProcess = async () =>{
  let returnArray = await ConnectWalletHandler();
  let walletAddress = returnArray[0]
  let walletBalance = returnArray[1]
  checkCorrectNetwork();
  let contractBalance = CheckPublicMint(walletAddress,walletBalance);
  if(booleanCheckValues.hasMintedYetValue && booleanCheckValues.walletBalanceCheck){
    await mintContract(contractBalance);
  }

}

const CheckPublicMint = (defaultAccount,userBalance) => {
  let contractBalance = contractRead.publicMintPrice()
  .then(resolve =>{
    console.log(resolve)
    console.log(userBalance)
    return resolve
  })
  
  let hasmintedYet = contractRead.hasMinted(defaultAccount)
  .then((res) => {
  return res
  })

  if(hasmintedYet){
    booleanCheckValues.hasMintedYetValue = false
    console.log("booleanCheckValueshasMintedYetValue")
  }
  if (userBalance <= contractBalance._hex)
  {
    booleanCheckValues.walletBalanceCheck = false
  }
  return contractBalance
}

  const ConnectWalletHandler = () => {
    if (window.ethereum) {
      return (window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          let userBalance = accountChangeHandler(result[0]);
          return [result[0],userBalance];
        }))
    } 
  };

  const accountChangeHandler = (newAccount) => {
    let userBalance = getUserBalance(newAccount);
    return userBalance
  };
  const getUserBalance = (address) => {
   return( window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        return balance
      }))
  };
  const chainChangedHandler = () => {
    window.location.reload();
  };
  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  return (
    <div>
      {/* <h1>balance : {userBalance}</h1> wallet balance
      <h1>account : {defaultAccount}</h1> wallet address */}
      <div onClick={mintingProcess}> 
      <h1>
      {!booleanCheckValues.hasMintedYetValue && ("aleready minted")}
      </h1>
      <h1>
        {!booleanCheckValues.walletBalanceCheck && ("low balance")}
      </h1>
        <Button buttonText="direct Mint"  />

      </div>
    </div>
  );
};

export default PublicMint;
