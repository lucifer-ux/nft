import React, { useEffect, useState } from "react";
import "./RedirectForm.css";
import { contractRead } from "../resources/ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../createWriteContract";
import ErrorModal from "../ErrorModal/ErrorModal";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../utilities/contract"

function RedirectForm({ formElements }) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true);
  const [tokenIdCheck, setTokenIdCheck] = useState(true);
  const [referalCodeCheck, setReferalCodeCheck] = useState(true);
  
  useEffect(() => {}, [loadingComp]);
  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
    setTokenIdCheck(Number.isInteger(parseInt(formData.tokenId)));
    setReferalCodeCheck(/^0x[a-f0-9]{130}$/.test(formData.referalCode));
  };

  const CheckReferralMintForm = async (defaultAccount, userBalance) => {
    let minReferralMintPrice = await contractRead.minReferralMintPrice();
    console.log("minReferralPrice: " + minReferralMintPrice);

    console.log(minReferralMintPrice);
    let hasmintedYetValue = await contractRead.hasMinted(defaultAccount);
    let isTokenPrivileged = await contractRead.isTokenPrivileged(parseInt(formData.tokenId))
    let MintingPriceLessThanMinReferralMintPrice = ethers.utils.parseEther(formData.mintingPrice).lt(minReferralMintPrice)
    let BalanceLessThanMintingPrice = ethers.BigNumber.from(userBalance).lte(ethers.utils.parseEther(formData.mintingPrice))

    if (hasmintedYetValue) {

      console.log("already minted");
      setHasMintedYet(false)
      alert("already minted");
    }
    if (MintingPriceLessThanMinReferralMintPrice) {
      console.log("low minting price");
      alert("low minting price")
      setWalletBalanceCheck(false);
    }
    if(!isTokenPrivileged){
      console.log("token  ID not privileged")
      alert("token  ID not privileged")
    }

    if(BalanceLessThanMintingPrice){
      console.log("low balance")
      alert("low balance")
    }

    return (!hasmintedYetValue) && (!MintingPriceLessThanMinReferralMintPrice) && isTokenPrivileged && (!BalanceLessThanMintingPrice);


  };

  const mintingProcess = async () => {
    setLoadingComp(true);
    console.log(formData);
    if (!(await isFormInValid())) {
      let returnArray = await ConnectWalletHandler();
      let walletAddress = returnArray[0];
      console.log("walletAddress: " + walletAddress);
      let walletBalance = returnArray[1];
      console.log("walletBalance: " + walletBalance);
      checkCorrectNetwork();
      let checkReturnValue = await CheckReferralMintForm(
        walletAddress,
        walletBalance
      );
      if (
       checkReturnValue
      ) {
        await mintContract();
      }
    } else {
      console.log("error bro");
    }
    setLoadingComp(false);
  };

  const mintContract = async () => {
    const nftContract = createWriteContract();
    try {
      let nftTx = await nftContract.becomeAR2EChad(parseInt(formData.tokenId),
      ethers.utils.parseEther(formData.mintingPrice),
      formData.referalCode,
      {
        value: ethers.utils.parseEther(formData.mintingPrice).add(1),
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
    setErrorModalValue(true);
  };

  window.ethereum.on("accountsChanged", accountChangeHandler);
  window.ethereum.on("chainChanged", chainChangedHandler);

  const isFormInValid = async () => {
    let returnValue = false;
    let key = "key";
    formElements.forEach((formElement) => {
      if (
        formData[formElement.key] === undefined ||
        formData[formElement.key] === ""
      ) {
        alert(formElement.label + " is Missing");
        returnValue = true;
      }
    });
    if (!Number.isInteger(parseInt(formData.tokenId))) {
      alert("tokenId should be Integer");
      returnValue = true;
    }
    if(Number.isNaN(parseFloat(formData.mintingPrice))) {
      
      alert("minting Price should be in float")
      returnValue = true;
    }

    return returnValue;
  };

  return (
    <div className="login-container">
      <form className="form-login">
        {formElements.map((formElement) => {
          return (
            <div>
              <label className="login__label">{formElement.label}</label>
              <input
                className="login__input"
                value={formData[formElement.key]}
                onChange={(e) => {
                  handleChange(e.target.value, formElement.key);
                }}
              />
              <p
                className={
                  formElement.key === "tokenId" && !tokenIdCheck 
                    ? "visible"
                    : "gone"
                }
              >
                Wrong Credential
              </p>
              <p
                className={
                  formElement.key === "referalCode" && !referalCodeCheck && formData["referalCode"] != ""
                    ? "visible"
                    : "gone"
                }
              >
                Wrong Credential
              </p>
            </div>
          );
        })}
        <h1>
          {!hasMintedYet && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Aleready minted!!"
              body="You can mint only once"
              buttonText="Go back"
              setErrorModalValue={setErrorModalValue}
            />
          )}
        </h1>
        <h1>
          {!walletBalanceCheck && !loadingComp && errorModalValue && (
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
            body={transState}
            buttonText="Ok"
            setErrorModalValue={setErrorModalValue}
            link=""
          />
        )}

        <button
          className="login__submit"
          onClick={(e) => {
            e.preventDefault();
            mintingProcess();
          }}
        >
          submit
        </button>
      </form>
    </div>
  );
}
export default RedirectForm;
