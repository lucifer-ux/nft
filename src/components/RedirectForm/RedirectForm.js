import React, { useEffect, useState } from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import "./RedirectForm.css";
import { contractRead } from "../resources/ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../createWriteContract";
import CircleLoader from "react-spinners/CircleLoader";
import ErrorModal from "../ErrorModal/ErrorModal";
import {checkCorrectNetwork, ConnectWalletHandler, accountChangeHandler, chainChangedHandler} from "../utilities/contract"

function RedirectForm({ formElements }) {
  const [formData, setFormData] = useState({});
  const [transState, setTransState] = useState(null);
  const [errorModalValue, setErrorModalValue] = useState(false);
  const [loadingComp, setLoadingComp] = useState(false);
  const [hasMintedYet, setHasMintedYet] = useState(true);
  const [walletBalanceCheck, setWalletBalanceCheck] = useState(true);
  const [tokenIdCheck, setTokenIdCheck] = useState(null);
  const [mintingPriceCheck, setMintingPriceCheck] = useState(null);
  const [referalCodeCheck, setReferalCodeCheck] = useState(null);
  const [linkFailure, setLinkFailure] = useState(false)

  useEffect(() => {}, [loadingComp]);
  const handleChange = (value, key) => {
    setFormData({ ...formData, ...{ [key]: value } });
  };

  const CheckReferralMintForm = async (defaultAccount, userBalance) => {
    let minReferralMintPrice = await contractRead.minReferralMintPrice();
    console.log("minReferralPrice: " + minReferralMintPrice);

    console.log(minReferralMintPrice);
    let hasmintedYetValue = await contractRead.hasMinted(defaultAccount);
    let isTokenPrivileged = await contractRead.isTokenPrivileged(parseInt(formData.tokenId))
    let MintingPriceLessThanMinReferralMintPrice = ethers.utils.parseEther(formData.mintingPrice).lte(minReferralMintPrice)
    let BalanceLessThanMintingPrice = ethers.BigNumber.from(userBalance).lte(ethers.utils.parseEther(formData.mintingPrice))

    if (hasmintedYetValue) {

      console.log("already minted");
      setHasMintedYet(false)
      setErrorModalValue(true);
    }
    if (MintingPriceLessThanMinReferralMintPrice) {
      console.log(`low minting price, should be strictly greater than ${ethers.utils.formatEther(minReferralMintPrice)}`);
      setMintingPriceCheck(`low minting price, should be strictly greater than ${ethers.utils.formatEther(minReferralMintPrice)}`);
    }
    if(!isTokenPrivileged){
      console.log("token  ID not privileged")
      setTokenIdCheck("token  ID not privileged")
    }

    if(BalanceLessThanMintingPrice){
      console.log("low balance")
      setWalletBalanceCheck(false);
      setErrorModalValue(true);
    }

    return (!hasmintedYetValue) && (!MintingPriceLessThanMinReferralMintPrice) && isTokenPrivileged && (!BalanceLessThanMintingPrice);


  };

  const initializeStates = async () => {
    setErrorModalValue(false)
    setTransState(null)
    setHasMintedYet(true)
    setWalletBalanceCheck(true)
    setTokenIdCheck(null)
    setMintingPriceCheck(null)
    setReferalCodeCheck(null)
    setLinkFailure(false)
  }

  const mintingProcess = async () => {
    await initializeStates();
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
    console.log("minting Price Set", mintingPriceCheck)
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
      setTransState(
        `https://etherscan.io/tx/${nftTx.hash}`
      );
    } catch (error) {
      setLinkFailure(true)
      console.log("Error minting", error);
      if(error.code === 4001)
      setTransState(error.message);
      else
      setTransState(error.reason)
    }
    setErrorModalValue(true);
  };

  detectEthereumProvider().then((provider) => {
    provider.on("accountsChanged", accountChangeHandler);
    provider.on("chainChanged", chainChangedHandler);
  });

  const isFormInValid = async () => {
    let returnValue = false;
    let key = "key";
    formElements.forEach((formElement) => {
      if (
        formData[formElement.key] === undefined ||
        formData[formElement.key] === ""
      ) {
        if(formElement.key === "tokenId")
        {setTokenIdCheck(formElement.label + " is Missing");
        }
        if(formElement.key === "mintingPrice")
        {setMintingPriceCheck(formElement.label + " is Missing")}

        if(formElement.key === "referalCode"){
          setReferalCodeCheck(formElement.label + " is Missing")
        }
        returnValue = true;
      }
    });
    if (returnValue)
     return returnValue;
    if (!Number.isInteger(parseInt(formData.tokenId))) {
      setTokenIdCheck(Number.isInteger(parseInt(formData.tokenId))?null:"tokenId should be Integer");

      returnValue = true;
    }
    if(!/^0x[a-f0-9]{130}$/.test(formData.referalCode)) {
      setReferalCodeCheck(/^0x[a-f0-9]{130}$/.test(formData.referalCode)?null:"Invalid Referral code Format");
      returnValue = true
    }
    if(Number.isNaN(parseFloat(formData.mintingPrice))) {
      setMintingPriceCheck(!Number.isNaN(parseFloat(formData.mintingPrice))?null:"minting Price should be in float");
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
                  formElement.key === "tokenId" && tokenIdCheck!==null 
                    ? "visible"
                    : "gone"
                }
              >
                {tokenIdCheck}
              </p>
              <p
                className={
                  formElement.key === "referalCode" && referalCodeCheck!==null
                    ? "visible"
                    : "gone"
                }
              >
                {referalCodeCheck}
              </p>
              <p
                className={
                  formElement.key === "mintingPrice" && mintingPriceCheck!==null
                    ? "visible"
                    : "gone"
                }
              >
                {mintingPriceCheck}
              </p>
            </div>
          );
        })}
        <h1>
          {!hasMintedYet && !loadingComp && errorModalValue && (
            <ErrorModal
              text="Already minted!!"
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
              body = {linkFailure ? transState : "click below link to see transaction"}
              buttonText={linkFailure ? "Go back" : "status"}
              setErrorModalValue={setErrorModalValue}
              link = {linkFailure ? "#" : transState}
              linkFailure = {linkFailure}
            />
          )}
        <CircleLoader color="#CCD5E0" loading = {loadingComp} speedMultiplier = "3" id = "loader"/>
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
