import { ethers, upgrades } from "hardhat";
import chai from "chai";
import { ABC__factory, ABC } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { expect } = chai;

let abcFactory: ABC__factory;
let abc: ABC;
let owner: SignerWithAddress;
let other: SignerWithAddress;

const name = 'ERC721';
const symbol = 'ABC';
const baseURI = 'my.app/';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

const firstTokenId = ethers.BigNumber.from('5042');
const secondTokenId = ethers.BigNumber.from('79217');
const nonExistentTokenId = ethers.BigNumber.from('13');

describe("ABC", () => {
    beforeEach(async () => {
        [owner, other] = await ethers.getSigners();
        abcFactory = (await ethers.getContractFactory(
            'ABC',
            owner
        )) as ABC__factory;

        abc = (await upgrades.deployProxy(
            abcFactory,
            [name, symbol],
            { initializer: 'initialize' }
        )) as ABC;

        await abc.deployed();
        expect(abc.address).to.properAddress;
    });

    describe("deployment", async () => {
        it('token has correct name', async () => {
            expect(await abc.name()).to.equal(name);
        });

        it('token has correct symbol', async () => {
            expect(await abc.symbol()).to.equal(symbol);
        });
        describe("token URI", async () => {
            beforeEach(async () => {
                await abc._safeMint(owner, firstTokenId);
            });
            const baseURI = 'https://api.com/v1/';
            const sampleUri = 'mock://mytoken';
            it('reverts when queried for non existent token id', async () => {
                await expect(abc.tokenURI(nonExistentTokenId))
                    .to.be.revertedWith('RC721Metadata: URI query for nonexistent token');
            });
        });
    });
});


