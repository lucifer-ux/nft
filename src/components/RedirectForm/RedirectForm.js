import React, { useEffect, useState } from "react";
import "./RedirectForm.css";
import { contractRead } from "../resources/ReadContract";
import { ethers } from "ethers";
import createWriteContract from "../createWriteContract";
import ErrorModal from "../ErrorModal/ErrorModal";

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

  const CheckReferralMint = async (defaultAccount, userBalance) => {
    let contractBalance = await contractRead.minReferralMintPrice();
    console.log(contractBalance);
    let hasmintedYetVal = await contractRead.hasMinted(defaultAccount);

    if (hasmintedYetVal) {
      setHasMintedYet(false);
      console.log("already minted");
    }
    if (userBalance > contractBalance._hex) {
      console.log(userBalance <= contractBalance._hex);
      setWalletBalanceCheck(false);
      console.log("low balance");
    }
    return contractBalance;
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
    console.log(formData);
    if (!(await isFormInValid())) {
      let returnArray = await ConnectWalletHandler();
      let walletAddress = returnArray[0];
      console.log("walletAddress: " + walletAddress);
      let walletBalance = returnArray[1];
      console.log("walletBalance: " + walletBalance);
      checkCorrectNetwork();
      let contractBalance = await CheckReferralMint(
        walletAddress,
        walletBalance
      );
      console.log("publicMintPrice: " + contractBalance);
      if (hasMintedYet && walletBalanceCheck) {
        await mintContract(contractBalance);
      }
    } else {
      console.log("error bro");
    }
    setLoadingComp(false);
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
    setErrorModalValue(true);
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
    let key = "key";
    formElements.forEach((formElement) => {
      if (
        formData[formElement.key] === undefined ||
        formData[formElement.key] === ""
      ) {
        // regex, tokein id integer, mintPrice should be float value, referal code regex check
        alert(formElement.label + " is Missing");
        returnValue = true;
      }
    });
    // const test = /^0x[a-f0-9]{130}$/.test(formData.referalCode);
    // if (!test) {
    //   alert("invalid referal code");
    //   returnValue = true;
    // }
    if (!Number.isInteger(parseInt(formData.tokenId))) {
      alert("tokenId should be Integer");
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
