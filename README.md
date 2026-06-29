# 3videnZ EVM Blockchains Explorer

Interact with smart contracts on any EVM chain. 3videnZ Explorer provides an intuitive frontend for contracts from most popular EVM networks, currently supporting:

- **Verified contracts**. Fetches contract ABIs and source code directly using [Etherscan's API v2 endpoints](https://docs.etherscan.io/etherscan-v2/getting-started/v2-quickstart).
- **Unverified contracts**. Two different options are available:
  - Decompile using [`heimdall-rs`](https://github.com/Jon-Becker/heimdall-rs) (experimental).
  - Provide the ABI and the contract address.
- **Proxy contracts**. Autodetects most popular proxy patterns, and allows to read and write as proxy.

3videnZ Explorer is built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2).

### Features included:

- **Customize your chains.** We provide a default list of chains (Mainnets + Testnets), but you can add or remove networks from a large selection using the "Other Chains" option in the network dropdown.
- **Add custom chains.** If you can't find a network using the "Other Chains" option, you can manually add custom chains by entering the network details.
- **Use it on localhost!** Run 3videnZ Explorer on chain ID 31337 (localhost) to debug your local contracts.
- **ENS resolution on address inputs.** Automatically resolves ENS names (Mainnet).
- **Shareable URLs with dynamic unfurling.** Share a 3videnZ Explorer URL, and it will unfurl with the contract name, network icon and address.
- **Transaction results display.** View detailed transaction results directly in the interface after executing contract calls, making debugging and monitoring easier.

---

> Forked from [abi-ninja](https://github.com/BuidlGuidl/abi-ninja) by BuidlGuidl — MIT License

# Development Quick Start

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

1. Clone this repo & install dependencies

```
git clone https://github.com/3videnz/evm-explorer.git
cd evm-explorer
yarn install
```

2. Start the frontend

```
yarn start
```

Visit your local instance at: `http://localhost:3000`.

# Testing

3videnZ Explorer uses Cypress for end-to-end testing. The test suite covers user flows and ensures the application works correctly across different networks and contract types.

## Running Tests

1. Ensure your development server is running:

```
yarn start
```

2. In a new terminal window, run the Cypress tests:

```
yarn cypress:open
```

3. For headless testing:

```
yarn cypress:run
```

## Test Coverage

- Loading and interacting with verified contracts on various networks
- Handling unverified contracts and manual ABI input
- Detecting and interacting with proxy contracts
- Network switching and custom network addition

## Contributing

We welcome contributions! Please see [CONTRIBUTING.MD](CONTRIBUTING.md) for guidelines.
