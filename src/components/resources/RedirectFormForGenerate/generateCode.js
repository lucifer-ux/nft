import { ethers } from "ethers"

const SIGNING_DOMAIN_NAME = "DreamDateWorld"
const SIGNING_DOMAIN_VERSION = "1"

class SignHelper {

    constructor(contractAddress, chainId, signingAddress) {
        this.contractAddress = contractAddress
        this.chainId = chainId
        this.signingAddress = signingAddress
    }

    async createSignature(wallet, mintPriceInETH, tokenId) {
        var mintPrice = ethers.utils.parseEther(mintPriceInETH.toString())
        const obj = { wallet, mintPrice, tokenId }
        const domain = await this._signingDomain()
        const types = {
            DDWReferralStruct : [
                {name: "wallet", type: "address"},
                {name: "mintPrice", type: "uint256"},
                {name: "tokenId", type: "uint256"}
            ]
        }

        const signature = await this.signingAddress._signTypedData(domain, types, obj)
        return { ...obj, signature}
    }

    async _signingDomain() {
        if (this._domain != null) {
            return this._domain
        }
        const chainId = await this.chainId
        this._domain = {
            name: SIGNING_DOMAIN_NAME,
            version: SIGNING_DOMAIN_VERSION,
            verifyingContract: this.contractAddress,
            chainId,
        }
        return this._domain
    }
}

async function getSign(contractAddress, chainId, wallet, mintPriceInETH, tokenId) {
    var signer = new ethers.Wallet(process.env.REACT_APP_REFERRAL_PRIVATE_KEY);
    var signHelper = new SignHelper(contractAddress, chainId, signer)
    var voucher = signHelper.createSignature(wallet, mintPriceInETH, tokenId)
    return voucher
}


export const generateReferralCode = async (referralWallet, mintPriceInETH, PrivilegedtokenId) => {
    return await getSign(process.env.REACT_APP_CONTRACT_ADDRESS, parseInt(process.env.REACT_APP_CHAIN_ID), referralWallet, mintPriceInETH, PrivilegedtokenId)
} 