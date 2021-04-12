import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ABC } from "../typechain";
import { ContractTransaction } from "ethers";

let deployer: SignerWithAddress,
  Artist2: SignerWithAddress,
  Artist1: SignerWithAddress;

async function main() {
  [deployer, Artist2, Artist1] = await ethers.getSigners();

  const abi = [
    'function totalSupply() external view returns (uint256)',
    'function tokenURI(uint256 tokenId) external view returns (string memory)',
    'function burn(uint256 tokenId) public',
  ]

  const c: ABC = new ethers.Contract('<CONTRACT_ADDRESS>', abi, Artist1) as ABC;

  let count = await (await c.totalSupply()).toNumber();
  console.log(`totalSupply before burn: ${count}`);
  for (let i = 0; i < count; i++) {
    const product = await c.tokenURI(i);
    console.log(`product: ${product}`);
  }

  //burn 2nd token, owned by Artist1
  let receipt: ContractTransaction = await c.burn(ethers.BigNumber.from(1));

  count = await (await c.totalSupply()).toNumber();
  console.log(`totalSupply after burn: ${count}`);

  // checks each slot for a token until all are found
  for (let i = 0, tokenCnt = 0; tokenCnt < count; i++) {
    let product;
    try {
      product = await c.tokenURI(i);
      tokenCnt++;
    } catch (e) {
      console.log(`no token at id: ${i}`);
      continue;
    }
    console.log(`product: ${product}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
