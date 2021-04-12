import { ethers, upgrades } from "hardhat";
import chai from "chai";
import { ABC__factory, ABC } from "../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

const { expect } = chai;

let abcFactory: ABC__factory;
let abc: ABC;
let deployer: SignerWithAddress;
let other: SignerWithAddress;

const name = 'MinterAutoIDToken';
const symbol = 'ABC';
const baseURI = 'my.app/';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
const MINTER_ROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("MINTER_ROLE"));

describe("ABC", () => {

    beforeEach(async () => {
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

        it('deployer has the default admin role', async () => {
            expect(await abc.getRoleMemberCount(DEFAULT_ADMIN_ROLE)).to.equal(1);
            expect(await abc.getRoleMember(DEFAULT_ADMIN_ROLE, 0)).to.equal(deployer.address);
        });

        it('deployer has the minter role', async () => {
            expect(await abc.getRoleMemberCount(MINTER_ROLE)).to.equal(1);
            expect(await abc.getRoleMember(MINTER_ROLE, 0)).to.equal(deployer.address);
        });

        it('minter role admin is the default admin', async () => {
            expect(await abc.getRoleAdmin(MINTER_ROLE)).to.equal(DEFAULT_ADMIN_ROLE);
        });
    });

    describe("minting", async () => {
        it('deployer can mint tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);

            await expect(abc.connect(deployer).mint(other.address))
                .to.emit(abc, 'Transfer')
                .withArgs(ZERO_ADDRESS, other.address, tokenId);

            expect(await abc.balanceOf(other.address)).to.equal(1);
            expect(await abc.ownerOf(tokenId)).to.equal(other.address);

            expect(await abc.tokenURI(tokenId)).to.equal(baseURI + tokenId);
        });

        it('other accounts cannot mint tokens', async () => {
            await expect(abc.connect(other).mint(other.address))
                .to.be.revertedWith('ERC721PresetMinterPauserAutoId: must have minter role to mint');
        });
    });

    describe("pausing", async () => {
        it('deployer can pause', async () => {
            await expect(abc.connect(deployer).pause())
                .to.emit(abc, 'Paused')
                .withArgs(deployer.address);
            expect(await abc.paused()).to.equal(true);
        });

        it('deployer can unpause', async () => {
            await abc.connect(deployer).pause();
            await expect(abc.connect(deployer).unpause())
                .to.emit(abc, 'Unpaused')
                .withArgs(deployer.address);
            expect(await abc.paused()).to.equal(false);
        });

        it('cannot mint while paused', async () => {
            await abc.connect(deployer).pause();
            await expect(abc.connect(deployer).mint(other.address))
                .to.be.revertedWith('ERC721Pausable: token transfer while paused');
        });

        it('other accounts cannot pause', async () => {
            await expect(abc.connect(other).pause())
                .to.be.revertedWith('ERC721PresetMinterPauserAutoId: must have pauser role to pause');
        });
        it('other accounts cannot unpause', async () => {
            await abc.connect(deployer).pause();
            await expect(abc.connect(other).unpause())
                .to.be.revertedWith('ERC721PresetMinterPauserAutoId: must have pauser role to unpause');
        });
    });

    describe("burning", async () => {
        it('holders can burn their tokens', async () => {
            const tokenId = ethers.BigNumber.from(0);

            await abc.connect(deployer).mint(other.address);

            await expect(abc.connect(other).burn(tokenId))
                .to.emit(abc, 'Transfer')
                .withArgs(other.address, ZERO_ADDRESS, tokenId);
            expect(await abc.balanceOf(other.address)).to.equal(0);
            expect(await abc.totalSupply()).to.equal(0);
        });
    });
});


