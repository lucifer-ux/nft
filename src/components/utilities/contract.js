import { ethers } from 'ethers';
export const checkCorrectNetwork = async () => {
    if (window.ethereum.networkVersion !== parseInt(process.env.REACT_APP_CHAIN_ID)) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID)) }],
        });
      } catch (err) {
        if (err.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Rinkeby Mainnet",
                chainId: ethers.utils.hexValue(parseInt(process.env.REACT_APP_CHAIN_ID)),
                nativeCurrency: { name: "ETH", decimals: 18, symbol: "ETH" },
                rpcUrls: ["https://rinkeby.infura.io/v3/"],
              },
            ],
          });
        }
      }
    }
  };

  export const ConnectWalletHandler = async () => {
    if (window.ethereum) {
      let addresses = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      let userBalance = await accountChangeHandler(addresses[0]);
      return [addresses[0], userBalance];
    }
  };

  export const accountChangeHandler = async (newAccount) => {
    let userBalance = await getUserBalance(newAccount);
    return userBalance;
  };
  export const getUserBalance = async (address) => {
    return await window.ethereum.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });
  };
  export const chainChangedHandler = () => {
    window.location.reload();
  };