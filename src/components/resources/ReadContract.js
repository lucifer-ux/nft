import abi from "./abi"
import { ethers } from "ethers";
const providers = new ethers.providers.getDefaultProvider(process.env.REACT_APP_CHAIN_NAME)
const contractRead = new ethers.Contract( process.env.REACT_APP_CONTRACT_ADDRESS , abi , providers )

export {contractRead, providers}