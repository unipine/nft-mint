# NFT Minting Application

This repository contains smart contracts, frontend and backend that randomly generates a wallet address per user and mint NFTs.

- [Quick Start](#quick-start)
- [Overview](#overview)
  - [Smart Contract](#smart-contract)
  - [Frontend](#frontend)
  - [Backend](#backend)

## Quick start

The first things you need to do are cloning this repository and installing its dependencies:

```sh
git clone https://github.com/unipine/nft-mint.git
cd nft-mint
npm install
```

Once installed, let's run Hardhat's testing network:

```sh
npx hardhat node
```

Then, on a new terminal, go to the repository's root folder and run this to deploy your contract:

```sh
npm run deploy
```

Then, we can run the backend with:

```sh
cd backend
yarn
yarn dev
```

Finally, we can run the frontend with:

```sh
cd frontend
yarn
yarn start
```

Backend URL [http://localhost:1337/](http://localhost:1337/) to see your backend. You will need to have [Metamask](https://metamask.io) installed and listening to `localhost 8545`.

## Overview

### Smart Contract

This [NFT contract](https://github.com/unipine/nft-mint/blob/main/contracts/TestNFT.sol) developed by [hardhat](https://hardhat.org/tutorial/boilerplate-project) according to ERC-721 Standard.

Provides two functions for storing CID or text to the Smart Contract.

- [safeMintImage](https://github.com/unipine/nft-mint/blob/3d377fef5ee842a7d2128f46878bd5f92f453dec/contracts/TestNFT.sol#L21-L25)
  This function stores CID (or text) to Solidity mapping.
- [safeMintText](https://github.com/unipine/nft-mint/blob/3d377fef5ee842a7d2128f46878bd5f92f453dec/contracts/TestNFT.sol#L27-L31)
  This function stores CID (or text) to Solidity slots according to [Solidity string storage layout](https://docs.soliditylang.org/en/v0.8.13/internals/layout_in_storage.html#bytes-and-string).

Gas reports for both functions:
| | safeMintImage | safeMintText |
| ------- | -------------- | ------------ |
| Gas Fee | 878336 | 923556 |

### Frontend

This [frontend](https://github.com/unipine/nft-mint/tree/main/frontend) was developed with [React.js](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/). Provides user interfaces allowing users to register, login to the app and generate wallet and mint NFTs.

### Backend

This [backend](https://github.com/unipine/nft-mint/tree/main/backend) was developed with [Express.js](https://expressjs.com/) and [TypeScript](https://www.typescriptlang.org/). Generates wallet addresses randomly and mint NFTs to users using Admin (Owner of the contract) wallet. Uploads images to IPFS using [NFT.Storage](https://nft.storage/) and stores texts directly to the contract.

Endpoints:

<details>
<summary>/auth/register</summary>
<pre>
- Feature: Register user
- Request Type: POST
- Form-data: 
  {
    email: Email,
    password: String
  }
- Response: 
  {
    token: String,
    user: {
      email: String,
      createdAt: Date,
    }
  }
</pre>
</details>

<details>
<summary>/auth/loginWithEmail</summary>
<pre>
- Feature: Login with credential
- Request Type: POST
- Form-data: 
  {
    email: Email,
    password: String
  }
- Response: 
  {
    token: String,
    user: {
      email: String,
      createdAt: Date,
    }
  }
</pre>
</details>

<details>
<summary>/wallet</summary>
<pre>
- Feature: Generate wallet address
- Request Type: POST
- Authorization required
- Response: 
  {
    publicKey: String,
    privateKey: String,
    createdAt: Date,
  }
</pre>
</details>

<details>
<summary>/wallet</summary>
<pre>
- Feature: Get wallet address
- Request Type: GET
- Authorization required
- Response: 
  {
    publicKey: String,
    privateKey: String,
    createdAt: Date,
  }
</pre>
</details>

<details>
<summary>/nftmint</summary>
<pre>
- Feature: Mint NFT to user with admin wallet
- Request Type: POST
- Authorization required
- Form-data: 
  {
    name: String,
    description: String,
    file: File
  }
- Response: 
  {
    data: Object | String,
    type: "text" | "image",
    nftId: Number,
  }
</pre>
</details>

<details>
<summary>/nftmint</summary>
<pre>
- Feature: Get all minted NFTs
- Request Type: GET
- Response: 
  [
    {
      data: Object | String,
      type: "text" | "image",
      nftId: Number,
    }
  ]
</pre>
</details>

<details>
<summary>/nftmint/:nftId</summary>
<pre>
- Feature: Get NFT data by nftId
- Request Type: GET
- Response: 
  {
    data: Object | String,
  }
</pre>
</details>

## References

- Contract Address
  [0xcc2c0117bC4CE5Cd261a44331eCcd278Ab2EF66d](https://goerli.etherscan.io/address/0xcc2c0117bC4CE5Cd261a44331eCcd278Ab2EF66d)
