import { ethers, upgrades } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ABC__factory, ABC } from "../typechain";
import { ContractTransaction } from "ethers";

let abc: ABC;
let abcFactory: ABC__factory;
let deployer: SignerWithAddress;
let other: SignerWithAddress;

const name = 'ABC';
const symbol = 'ABC';
const baseURI = 'https://abc.iwahi.com/';
const tokenId = ethers.BigNumber.from(1);

const sampleProduct = {
  title: 'Artist1 Art',
  artist: 'artist1',
  image: 'assets/art1.jpg',
  artist_photo: 'assets/artist1.jpg',
  price: 'Ξ 0.5'
};

async function main() {
  [deployer, other] = await ethers.getSigners();
  abcFactory = (await ethers.getContractFactory(
    'ABC',
    deployer
  )) as ABC__factory;
  abc = (await upgrades.deployProxy(
    abcFactory,
    [name, symbol, baseURI],
    { initializer: 'initialize' }
  )) as ABC;

  console.log("ABC deployed to:", abc.address);

  const receipt: ContractTransaction = await abc.connect(deployer)
    .mint(other.address);
  console.log("ABC minted:", receipt);
  const tId = await abc.tokenURI(receipt.value);
  console.log("token id:", tId);
  await abc._setTokenURI(tId, sampleProduct);
  const product = await abc.tokenURI(tId);
  console.log("product:", product);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
