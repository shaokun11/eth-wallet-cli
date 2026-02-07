#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ethService_1 = require("./ethService");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
const program = new commander_1.Command();
program
    .name('ethcli')
    .description('CLI tool for querying Ethereum balances and managing wallets')
    .version('1.0.0');
program
    .command('balance')
    .alias('bal')
    .description('Query ETH balance for an address')
    .argument('<address>', 'Ethereum address to query')
    .option('-r, --rpc <url>', 'RPC endpoint URL (environment variable ETHEREUM_RPC_URL is used if not provided)', 'http://localhost:8545/')
    .option('-h, --human-readable', 'Display balance in human readable format (ETH)', false)
    .option('-d, --decimals <number>', 'Number of decimals for human readable format', '18')
    .action(async (address, options) => {
    try {
        const ethService = new ethService_1.EthService(options.rpc);
        const balanceWei = await ethService.getBalance(address);
        if (options.humanReadable) {
            const balanceEth = ethService.formatEther(balanceWei, parseInt(options.decimals));
            console.log(`${balanceEth} ETH`);
        }
        else {
            console.log(`${balanceWei} Wei`);
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
program
    .command('balances')
    .alias('bals')
    .description('Query ETH balance for multiple addresses')
    .argument('<addresses...>', 'Ethereum addresses to query')
    .option('-r, --rpc <url>', 'RPC endpoint URL (environment variable ETHEREUM_RPC_URL is used if not provided)', 'http://localhost:8545/')
    .option('-h, --human-readable', 'Display balance in human readable format (ETH)', false)
    .action(async (addresses, options) => {
    try {
        const ethService = new ethService_1.EthService(options.rpc);
        for (const address of addresses) {
            try {
                const balanceWei = await ethService.getBalance(address);
                if (options.humanReadable) {
                    const balanceEth = ethService.formatEther(balanceWei);
                    console.log(`${address}: ${balanceEth} ETH`);
                }
                else {
                    console.log(`${address}: ${balanceWei} Wei`);
                }
            }
            catch (error) {
                console.error(`${address}: Error - ${error.message}`);
            }
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
program
    .command('create-wallet')
    .alias('wallet')
    .description('Create a new Ethereum wallet')
    .option('-o, --output <path>', 'Output file path for the wallet (default: wallet/wallet_*.json)')
    .option('-p, --password <password>', 'Password to encrypt the wallet (optional, wallet will be stored unencrypted if not provided)')
    .action(async (options) => {
    try {
        const ethService = new ethService_1.EthService();
        const walletFolder = path.join(process.cwd(), 'wallet');
        if (!fs.existsSync(walletFolder)) {
            fs.mkdirSync(walletFolder, { recursive: true });
        }
        if (options.password) {
            console.log('Creating encrypted wallet...');
            const keystoreJson = await ethService.encryptWallet(options.password);
            let outputPath = options.output;
            if (!outputPath) {
                const randomSuffix = (0, crypto_1.randomBytes)(4).toString('hex');
                outputPath = path.join(walletFolder, `wallet_${randomSuffix}.json`);
            }
            fs.writeFileSync(outputPath, keystoreJson);
            console.log(`Encrypted wallet saved to: ${outputPath}`);
            console.log(`Address: ${JSON.parse(keystoreJson).address}`);
        }
        else {
            console.log('Creating unencrypted wallet...');
            const walletDetails = ethService.createWallet();
            let outputPath = options.output;
            if (!outputPath) {
                const randomSuffix = (0, crypto_1.randomBytes)(4).toString('hex');
                outputPath = path.join(walletFolder, `wallet_${randomSuffix}.json`);
            }
            const walletData = {
                address: walletDetails.address,
                privateKey: walletDetails.privateKey,
                mnemonic: walletDetails.mnemonic,
                createdAt: new Date().toISOString()
            };
            fs.writeFileSync(outputPath, JSON.stringify(walletData, null, 2));
            console.log(`Wallet saved to: ${outputPath}`);
            console.log(`Address: ${walletDetails.address}`);
            console.log(`Private Key: ${walletDetails.privateKey}`);
            console.log(`Mnemonic: ${walletDetails.mnemonic}`);
            console.log('\n⚠️  WARNING: Private key and mnemonic are saved in the file. Keep it secure!');
        }
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
});
program.parse();
//# sourceMappingURL=index.js.map