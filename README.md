# Ethereum Balance CLI

A simple command-line tool to query Ethereum balances for addresses and manage wallets.

## Installation

### From Git Repository (Global Installation)

First, clone the repository:

```bash
git clone https://github.com/shaokun11/eth-wallet-cli.git
cd eth-wallet-cli
```

Then install dependencies and build the project:

```bash
npm install
npm run build
```

Finally, install globally:

```bash
npm install -g .
```

This will make the `ethcli` command available globally on your system.

### From Git (Direct Installation)

Alternatively, you can install directly from the git repository:

```bash
npm install -g git+https://github.com/shaokun11/eth-wallet-cli.git
```

### Local Installation

First, install the required dependencies:

```bash
npm install
```

Then build the project:

```bash
npm run build
```

## Usage

### Query a single address balance

```bash
# Query balance in Wei (default)
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e

# Query balance in human-readable ETH format
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --human-readable

# Use a custom RPC endpoint (you can also set ETHEREUM_RPC_URL environment variable)
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --rpc https://mainnet.infura.io/v3/YOUR_PROJECT_ID --human-readable
```

### Query multiple addresses balance

```bash
# Query multiple addresses
npx ethcli balances 0x742d35Cc6634C0532925a3b844Bc454e4438f44e 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B --human-readable
```

### Create a new Ethereum wallet

```bash
# Create an unencrypted wallet (saves to a random wallet_*.json file in current directory)
npx ethcli create-wallet

# Create an unencrypted wallet with a specific output file
npx ethcli create-wallet --output mywallet.json

# Create an encrypted wallet (password protected)
npx ethcli create-wallet --password "your-password" --output encrypted_wallet.json
```

### Development

To run without building:

```bash
npm run dev balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --human-readable
```

## Commands

- `balance <address>` - Query the balance of a single address
- `balances <addresses...>` - Query balances of multiple addresses
- `create-wallet` - Create a new Ethereum wallet

## Options

### Balance Commands
- `-r, --rpc <url>` - Specify a custom RPC endpoint URL (defaults to http://localhost:8545/, can be set via ETHEREUM_RPC_URL environment variable)
- `-h, --human-readable` - Display balance in ETH format instead of Wei
- `-d, --decimals <number>` - Specify number of decimals for human readable format (default: 18)

### Wallet Command
- `-o, --output <path>` - Output file path for the wallet (default: wallet_*.json in current directory)
- `-p, --password <password>` - Password to encrypt the wallet (optional, wallet will be stored unencrypted if not provided)

## Examples

```bash
# Get balance of a single address in ETH
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --human-readable

# Get balances of multiple addresses
npx ethcli balances 0x742d35Cc6634C0532925a3b844Bc454e4438f44e 0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B --human-readable

# Use a custom RPC endpoint
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --rpc https://eth-mainnet.alchemyapi.io/v2/YOUR_API_KEY --human-readable

# Use RPC endpoint from environment variable
export ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/YOUR_PROJECT_ID"
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --human-readable

# Query using default local node (http://localhost:8545/)
npx ethcli balance 0x742d35Cc6634C0532925a3b844Bc454e4438f44e --human-readable

# Create a new wallet
npx ethcli create-wallet

# Create an encrypted wallet
npx ethcli create-wallet --password "strong-password" --output my_wallet.json
```

## Environment Variables

- `ETHEREUM_RPC_URL`: Alternative to passing the RPC URL as a command-line argument. If provided, it will be used as the default RPC endpoint for balance queries.

## Publishing

To publish this package to npm registry:

```bash
npm login
npm publish
```

After publishing, users can install globally with:

```bash
npm install -g eth-balance-cli
```