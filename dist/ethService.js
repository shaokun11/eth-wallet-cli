"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthService = void 0;
const ethers_1 = require("ethers");
class EthService {
    constructor(rpcUrl) {
        const finalRpcUrl = rpcUrl || process.env.ETHEREUM_RPC_URL || 'http://localhost:8545/';
        this.provider = new ethers_1.ethers.JsonRpcProvider(finalRpcUrl);
    }
    async getBalance(address) {
        if (!ethers_1.ethers.isAddress(address)) {
            throw new Error(`Invalid Ethereum address: ${address}`);
        }
        try {
            const balance = await this.provider.getBalance(address);
            return balance;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get balance for ${address}: ${error.message}`);
            }
            throw new Error(`Failed to get balance for ${address}: Unknown error occurred`);
        }
    }
    formatEther(wei, decimals = 18) {
        return ethers_1.ethers.formatUnits(wei, decimals);
    }
    parseEther(ether, decimals = 18) {
        return ethers_1.ethers.parseUnits(ether, decimals);
    }
    async getCurrentBlock() {
        try {
            return await this.provider.getBlockNumber();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get current block: ${error.message}`);
            }
            throw new Error('Failed to get current block: Unknown error occurred');
        }
    }
    async getTransactionCount(address) {
        if (!ethers_1.ethers.isAddress(address)) {
            throw new Error(`Invalid Ethereum address: ${address}`);
        }
        try {
            return await this.provider.getTransactionCount(address);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to get transaction count for ${address}: ${error.message}`);
            }
            throw new Error(`Failed to get transaction count for ${address}: Unknown error occurred`);
        }
    }
    createWallet() {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        if (!wallet.mnemonic) {
            throw new Error('Could not generate mnemonic for the wallet');
        }
        return {
            address: wallet.address,
            privateKey: wallet.privateKey,
            mnemonic: wallet.mnemonic.phrase
        };
    }
    async encryptWallet(password) {
        const wallet = ethers_1.ethers.Wallet.createRandom();
        if (!wallet.mnemonic) {
            throw new Error('Could not generate mnemonic for the wallet');
        }
        return await wallet.encrypt(password);
    }
}
exports.EthService = EthService;
//# sourceMappingURL=ethService.js.map