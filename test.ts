// Simple test script to verify the CLI functionality

import { EthService } from './src/ethService';

async function testCli() {
  console.log('Testing Ethereum Balance CLI...');

  // Using a known contract address for testing
  const testAddresses = [
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Compound Token Contract
    '0x000000000000000000000000000000000000dEaD', // Burn address (will have balance)
  ];

  const ethService = new EthService(); // Using default RPC

  console.log('\nTesting single address balance query:');
  try {
    for (const addr of testAddresses) {
      const balance = await ethService.getBalance(addr);
      const balanceEth = ethService.formatEther(balance);

      console.log(`Address: ${addr}`);
      console.log(`Balance: ${balance} Wei (${balanceEth} ETH)`);
      console.log('---');
    }

    const currentBlock = await ethService.getCurrentBlock();
    console.log(`Current Block: ${currentBlock}`);

  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testCli();
}

export { testCli };