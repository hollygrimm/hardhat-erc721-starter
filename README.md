# ABC-ERC721

## Quick start

```sh
git clone https://github.com/????
cd ABC-ERC721
npm i
# list hardhat tasks:
npx hardhat
```
# install hardhat-shorthand
```sh
npm i -g hardhat-shorthand
hardhat-completion install
hh == npx hardhat
```
Clean, compile and test:
```sh
hh clean
hh compile
hh test

npm hardhat coverage
```
## Local test deployment and upgrade

```sh
hh node
```
On a new terminal, go to the repository's root folder and run this to
deploy your contract:

```sh
hh run --network localhost scripts/deploy-abc.ts
```

Then, copy the contract address from the console output from above and replace
<CONTRACT_ADDRESS> in scripts/sample-burn.ts and run:

```sh
hh run --network localhost scripts/sample-burn.ts
```
## Ropsten Testnet, Etherscan
Get ether on Ropsten:
https://faucet.ropsten.be//

Create free accounts on:
https://infura.io
https://etherscan.io

Create .env from .env.sample (listed in .gitignore) supplying the following values:
```sh
ROPSTEN_PRIVATE_KEY=
INFURA_API_KEY=
ETHERSCAN_API_KEY=
```

```sh
hh run --network ropsten scripts/deploy-abc.ts
```
To verify via etherscan, use the address from the .openzeppelin/ropsten.json generated from above:
```sh
hh verify --network ropsten <ADDRESS_FROM_.openzeppelin/ropsten.json>
```
