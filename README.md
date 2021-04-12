# hardhat-erc721-starter

## Quick start

```sh
cd hardhat-erc721-starter
npm i
# list hardhat tasks:
npx hardhat
```
### Install hardhat-shorthand
Allows you to use the shorthand "hh" == npx hardhat
```sh
npm i -g hardhat-shorthand
hardhat-completion install
```

### Set up Rinkeby Test Network and Infura Key
Get ether on Rinkeby:
https://faucet.rinkeby.io/

Create free accounts on:
https://infura.io
https://etherscan.io

Create .env from .env.sample (listed in .gitignore) supplying the following values:
```sh
RINKEBY_PRIVATE_KEY=
INFURA_API_KEY=
ETHERSCAN_API_KEY=
```

### Clean, compile and test:
```sh
hh clean
hh compile
hh test

npm hardhat coverage
```

### Local test deployment and upgrade

```sh
hh node
```
On a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
hh run --network localhost scripts/deploy.ts
```

## Rinkeby Testnet, Etherscan
```sh
hh run --network rinkeby scripts/deploy.ts
```
To verify via etherscan, use the address from the .openzeppelin/rinkeby.json generated from above:
```sh
hh verify --network rinkeby <ADDRESS_FROM_.openzeppelin/rinkeby.json>
```
