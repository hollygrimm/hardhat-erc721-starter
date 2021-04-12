import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ABC__factory, ABC } from "../typechain";
import { ContractTransaction } from "ethers";

let abc: ABC;
let abcFactory: ABC__factory;
let deployer: SignerWithAddress,
  Artist2: SignerWithAddress,
  Artist1: SignerWithAddress,
  Beadwork: SignerWithAddress,
  Araphahoe: SignerWithAddress;

const name = 'ABC ERC721 minter';
const symbol = 'ABC';

const baseURI = 'https://eth.iwahi.com/abc/';

interface TokenPrototype {
  id: number;
  owner: SignerWithAddress;
}

async function main() {
  [deployer, Artist2, Artist1, Beadwork, Araphahoe] = await ethers.getSigners();
  abcFactory = (await ethers.getContractFactory(
    'ABC',
    deployer
  )) as ABC__factory;
  abc = (await upgrades.deployProxy(
    abcFactory,
    [name, symbol, baseURI],
    { initializer: 'initialize' }
  )) as ABC;

  console.log("deployed ABC to:", abc);

  const tokens: Array<TokenPrototype> = [
    {
      id: 0,
      owner: Artist2,
    },
    {
      id: 1,
      owner: Artist1,
    },
    {
      id: 2,
      owner: Beadwork,
    },
    {
      id: 3,
      owner: Araphahoe,
    },
  ];

  for (const token of tokens) {
    let receipt: ContractTransaction = await abc.connect(deployer)
      .mint(token.owner.address);
    console.log(`ABC minted id: ${token.id}`);
  };

  let count = await (await abc.totalSupply()).toNumber();
  console.log(`totalSupply for abc contract ${abc.address} : ${count}`);

  for (let i = 0; i < count; i++) {
    const product = await abc.tokenURI(i);
    console.log(`product: ${product}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
