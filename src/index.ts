#!/usr/bin/env node

import { Command } from 'commander';
import { EthService } from './ethService';
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

const program = new Command();

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
      const ethService = new EthService(options.rpc);
      const balanceWei = await ethService.getBalance(address);

      if (options.humanReadable) {
        const balanceEth = ethService.formatEther(balanceWei, parseInt(options.decimals));
        console.log(`${balanceEth} ETH`);
      } else {
        console.log(`${balanceWei} Wei`);
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
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
      const ethService = new EthService(options.rpc);

      for (const address of addresses) {
        try {
          const balanceWei = await ethService.getBalance(address);

          if (options.humanReadable) {
            const balanceEth = ethService.formatEther(balanceWei);
            console.log(`${address}: ${balanceEth} ETH`);
          } else {
            console.log(`${address}: ${balanceWei} Wei`);
          }
        } catch (error) {
          console.error(`${address}: Error - ${(error as Error).message}`);
        }
      }
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
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
      const ethService = new EthService();

      // Ensure wallet folder exists
      const walletFolder = path.join(process.cwd(), 'wallet');
      if (!fs.existsSync(walletFolder)) {
        fs.mkdirSync(walletFolder, { recursive: true });
      }

      if (options.password) {
        // Create encrypted wallet
        console.log('Creating encrypted wallet...');
        const keystoreJson = await ethService.encryptWallet(options.password);

        let outputPath = options.output;
        if (!outputPath) {
          // Generate a random filename if none provided
          const randomSuffix = randomBytes(4).toString('hex');
          outputPath = path.join(walletFolder, `wallet_${randomSuffix}.json`);
        }

        fs.writeFileSync(outputPath, keystoreJson);
        console.log(`Encrypted wallet saved to: ${outputPath}`);
        console.log(`Address: ${JSON.parse(keystoreJson).address}`);
      } else {
        // Create unencrypted wallet
        console.log('Creating unencrypted wallet...');
        const walletDetails = ethService.createWallet();

        let outputPath = options.output;
        if (!outputPath) {
          // Generate a random filename if none provided
          const randomSuffix = randomBytes(4).toString('hex');
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
    } catch (error) {
      console.error(`Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

program.parse();