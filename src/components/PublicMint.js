import React from "react";
import Button from "./Button/Button";
import { useState } from "react";
import { ethers } from "ethers";
import { contractRead } from "./resources/ReadContract";
import { useEffect } from 'react';
import booleanCheckValues from "./resources/booleanCheckValues";
import createWriteContract from "./createWriteContract";
const PublicMint = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setdefaultAccount] = useState(null);
  const [userBalance, setuserBalance] = useState(null);
  const [contractBalance, setContractBalance] = useState(null);
  const [boolValue, setBoolValue] = useState(false)
  const [hasmintedYet, setHasMintedYet] = useState(null)
  useEffect (() =>{
    contractRead.isPublicMintLive()
    .then((res)=>{
      setBoolValue(res)
    })
    } ,[])

const ButtonEnalbled = () =>{
  return boolValue
}
const mintContract = () =>{
  const nftContract = createWriteContract()
  
  let nftTx = nftContract.becomeAChad({value: contractBalance._hex + 1})
				console.log('Mining....', nftTx.hash)
				// setMiningStatus(0)

				let tx = nftTx.wait()
				// setLoadingState(1)
				console.log('Mined!', tx)
				let event = tx.events[0]
				let value = event.args[2]
				let tokenId = value.toNumber()
				console.log(
					`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTx.hash}`
				)
				// getMintedNFT(tokenId)
}

const mintingProcess = () =>{
  ConnectWalletHandler();
  CheckPublicMint();
  mintContract();
}

const CheckPublicMint = () => {
  contractRead.publicMintPrice()
  .then(resolve =>{
    setContractBalance(resolve);
    console.log(resolve)
    console.log(userBalance)
  })
  
  contractRead.hasMinted(defaultAccount)
  .then((res) => {
  setHasMintedYet(res)
  })

  console.log("hasmintedYet")
  console.log(hasmintedYet)
  if(hasmintedYet){
    booleanCheckValues.hasMintedYetValue = false
    console.log("booleanCheckValueshasMintedYetValue")
  }
  if (userBalance <= contractBalance._hex)
  {
    booleanCheckValues.walletBalanceCheck = false
  }
  
}

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

  };

  const accountChangeHandler = (newAccount) => {
    setdefaultAccount(newAccount);
    getUserBalance(newAccount);
  };
  const getUserBalance = (address) => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [address, "latest"] })
      .then((balance) => {
        setuserBalance(balance);
      });
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
