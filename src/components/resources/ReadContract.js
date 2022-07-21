import abi from "./abi"
import { ethers } from "ethers";

const providers = new ethers.providers.getDefaultProvider('rinkeby')
const contractRead = new ethers.Contract( "0xa92519004d38eD74A96E841f17bc7e6B3E372B11" , abi , providers )

export {contractRead, providers}