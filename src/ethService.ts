import { ethers } from 'ethers';

export class EthService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl?: string) {
    // Use provided RPC URL, environment variable, or default to localhost
    const finalRpcUrl = rpcUrl || process.env.ETHEREUM_RPC_URL || 'http://localhost:8545/';
    this.provider = new ethers.JsonRpcProvider(finalRpcUrl);
  }

  /**
   * Get the balance of an Ethereum address in Wei
   * @param address The Ethereum address to query
   * @returns The balance in Wei as a BigInt
   */
  async getBalance(address: string): Promise<bigint> {
    // Validate the address format
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`);
    }

    try {
      const balance = await this.provider.getBalance(address);
      return balance;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get balance for ${address}: ${error.message}`);
      }
      throw new Error(`Failed to get balance for ${address}: Unknown error occurred`);
    }
  }

  /**
   * Convert Wei to Ether
   * @param wei The balance in Wei
   * @param decimals Number of decimals (default 18 for ETH)
   * @returns The balance as a string in human-readable format
   */
  formatEther(wei: bigint, decimals: number = 18): string {
    // Using ethers.formatUnits for more precise conversion
    return ethers.formatUnits(wei, decimals);
  }

  /**
   * Convert Ether string to Wei
   * @param ether The amount in Ether
   * @param decimals Number of decimals (default 18 for ETH)
   * @returns The amount in Wei as a BigInt
   */
  parseEther(ether: string, decimals: number = 18): bigint {
    return ethers.parseUnits(ether, decimals);
  }

  /**
   * Get the current block number
   * @returns Current block number
   */
  async getCurrentBlock(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get current block: ${error.message}`);
      }
      throw new Error('Failed to get current block: Unknown error occurred');
    }
  }

  /**
   * Get transaction count for an address
   * @param address The Ethereum address to query
   * @returns Transaction count
   */
  async getTransactionCount(address: string): Promise<number> {
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid Ethereum address: ${address}`);
    }

    try {
      return await this.provider.getTransactionCount(address);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get transaction count for ${address}: ${error.message}`);
      }
      throw new Error(`Failed to get transaction count for ${address}: Unknown error occurred`);
    }
  }

  /**
   * Create a new Ethereum wallet and return its details
   * @returns Object containing wallet details
   */
  createWallet(): {
    address: string;
    privateKey: string;
    mnemonic: string;
  } {
    const wallet = ethers.Wallet.createRandom();

    // Wallet.mnemonic is nullable, but for a randomly created wallet it should exist
    if (!wallet.mnemonic) {
      throw new Error('Could not generate mnemonic for the wallet');
    }

    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic.phrase
    };
  }

  /**
   * Encrypt a wallet to a JSON keystore
   * @param password Password to encrypt the wallet
   * @returns Promise resolving to encrypted keystore JSON string
   */
  async encryptWallet(password: string): Promise<string> {
    const wallet = ethers.Wallet.createRandom();
    if (!wallet.mnemonic) {
      throw new Error('Could not generate mnemonic for the wallet');
    }
    return await wallet.encrypt(password);
  }
}