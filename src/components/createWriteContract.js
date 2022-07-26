import { ethers } from "ethers";
import abi from './resources/abi'
    const createWriteContract = () => {
		try {
			const { ethereum } = window

			if (ethereum) {
				const provider = new ethers.providers.Web3Provider(ethereum);
				const signer = provider.getSigner()
				const nftContract = new ethers.Contract(
					process.env.REACT_APP_CONTRACT_ADDRESS,
					abi,
					signer
				)
                return nftContract
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			console.log('Error minting character', error)
			// setTxError(error.message)
		}
    }
	


export default createWriteContract