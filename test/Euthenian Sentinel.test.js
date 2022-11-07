const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Euthenian_Sentinel", function () {
    let Euthenian_Sentinel, euthenian_sentinel, owner, user1, user2;

    before( async () => {

        [owner, user1, user2] = await ethers.getSigners();

        Euthenian_Sentinel = await ethers.getContractFactory("Euthenian_Sentinel");
        euthenian_sentinel = await Euthenian_Sentinel.deploy(
            "Euthenian Sentinel",
            "$ETSNL",
            "ipfs://example/", 
            owner.address
        );
    });

    describe("Public functions", async ()=> {
        it("Error: If minting is still not allowed, you should not buy", async () => {

            await expect(euthenian_sentinel.connect(user1).mint(2, 
                { value: ethers.utils.parseEther("0.2") }
            )).to.be.revertedWith("Error: Mint Function are inactive");
        });
    
        it("Error: If do not pay the correct amount, you should not coin", async () => {
        
            await euthenian_sentinel.connect(owner).setPermitMint(true);
    
            await expect(euthenian_sentinel.connect(user1).mint(2, 
                { value: ethers.utils.parseEther("0.1") }
            )).to.be.revertedWith("Error: No enough money for buy");
        });
    
        it("If pay the right thing you must coin", async ()=> {
    
            await euthenian_sentinel.connect(user1).mint(2, { value: ethers.utils.parseEther("2") });
    
            expect(await euthenian_sentinel.connect(user1).balanceOf(user1.address)).to.equal(2);
            expect(await euthenian_sentinel.connect(user1).tokenSupply()).to.equal(2);
            expect(await ethers.provider.getBalance(euthenian_sentinel.address)).to.equal(ethers.utils.parseEther("0.2"));
        });
    
        it("Error: If the burning function is not activated, you should not burn nft", async ()=> {
    
            await expect(euthenian_sentinel.connect(user1).burn(1)).to.be.revertedWith(
                "Error: Burn Function are inactive"
            );
        });
    
        it("If the burn function is activated, you must burn nft if you are the owner of the nft", async ()=> {
    
            await euthenian_sentinel.connect(owner).setPermitBurn(true);
            await expect(euthenian_sentinel.connect(owner).burn(1)).to.be.revertedWith(
                "Error: caller is not token owner nor approved"
            );
            await expect(euthenian_sentinel.connect(owner).burn(2)).to.be.revertedWith(
                "ERC721: operator query for nonexistent token"
            );
    
            await euthenian_sentinel.connect(user1).burn(1);
            expect(await euthenian_sentinel.connect(user1).balanceOf(user1.address)).to.equal(1);
            expect(await euthenian_sentinel.connect(user1).tokenSupply()).to.equal(1);
        });
    });

    describe("Only Owner", async ()=> {
        it("Error: only the owner can modify variables", async ()=> {
            await expect(euthenian_sentinel.connect(user1).setRoyaltyFeesInPercentage(
                5
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).setRoyaltyAddress(
                user2.address
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).setBaseUri(
                "AddressToIspf_2"
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).setPriceBuyToken(
                ethers.utils.parseEther("5")
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).setPermitBurn(
                false
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).setPermitMint(
                false
            )).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(euthenian_sentinel.connect(user1).withdrawMoney()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("The owner should modify the variables", async ()=> {
            await euthenian_sentinel.connect(owner).setRoyaltyFeesInPercentage(5);
            await euthenian_sentinel.connect(owner).setRoyaltyAddress(user2.address);
            await euthenian_sentinel.connect(owner).setBaseUri("AddressToIspf_2");
            await euthenian_sentinel.connect(owner).setPriceBuyToken(ethers.utils.parseEther("0.2"));
            await euthenian_sentinel.connect(owner).setPermitBurn(false);
            await euthenian_sentinel.connect(owner).setPermitMint(false);
            await euthenian_sentinel.connect(owner).withdrawMoney();

            expect(await euthenian_sentinel.connect(owner).royaltyFeesInPercentage()).to.equal(5);
            expect(await euthenian_sentinel.connect(owner).royaltyAddress()).to.equal(user2.address);
            expect(await euthenian_sentinel.connect(owner).baseURI()).to.equal("AddressToIspf_2");
            expect(await euthenian_sentinel.connect(owner).priceBuyToken()).to.equal(ethers.utils.parseEther("0.2"));
            expect(await euthenian_sentinel.connect(owner).permitBurn()).to.equal(false);
            expect(await euthenian_sentinel.connect(owner).permitMint()).to.equal(false);
            expect(await euthenian_sentinel.connect(owner).maxTokenSupply()).to.equal(4000);
            expect(await ethers.provider.getBalance(euthenian_sentinel.address)).to.equal(0);
        });
    });

    describe("Extra features", async ()=> {
        it("The view functions should return the correct data", async ()=> {
            let [_royaltyAddress, _royaltyAmount] = await euthenian_sentinel.connect(owner).royaltyInfo(
                ethers.utils.parseEther("1")
            );

            expect(_royaltyAddress).to.equal(user2.address);
            expect(_royaltyAmount).to.equal(ethers.utils.parseEther("0.05"));
            expect(await euthenian_sentinel.connect(owner).nftIdCounter()).to.equal(1);
        });

        it("Error: User cannot mint more than the maximum supplement", async ()=> {
            await euthenian_sentinel.connect(owner).setPermitBurn(true);
            await euthenian_sentinel.connect(owner).setPermitMint(true);

            await expect(euthenian_sentinel.connect(user1).mint(4000, 
                { value: ethers.utils.parseEther("500") }
            )).to.be.revertedWith("Error: No can mint more token");
        });

        it("Error: Only the owner can increase the launch stage", async ()=> {
            await expect(euthenian_sentinel.connect(user1).updateRelease()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            );
        });

        it("The owner should increase the launch stage", async ()=> {
            await euthenian_sentinel.connect(owner).updateRelease();
            await euthenian_sentinel.connect(owner).updateRelease();

            expect(await euthenian_sentinel.connect(owner).maxTokenSupply()).to.equal(10000);
        });

        it("Error: If you are in the second stage of release, you can not increase the maximum supplement", async ()=> {
            await expect(euthenian_sentinel.connect(owner).updateRelease()).to.be.revertedWith(
                "Error: The contract is already in the second stage of launch"
            );
        });

        it("If the supplement drops below 5,000, it resets to 6,000", async ()=> {
            await euthenian_sentinel.connect(user1).mint(1000, 
                { value: ethers.utils.parseEther("1000") }
            );
            await euthenian_sentinel.connect(user1).mint(1000, 
                { value: ethers.utils.parseEther("1000") }
            );
            await euthenian_sentinel.connect(user1).mint(1000, 
                { value: ethers.utils.parseEther("1000") }
            );
            await euthenian_sentinel.connect(user1).mint(1000, 
                { value: ethers.utils.parseEther("1000") }
            );
            await euthenian_sentinel.connect(user1).mint(1000, 
                { value: ethers.utils.parseEther("1000") }
            );

            expect(await euthenian_sentinel.connect(owner).tokenSupply()).to.equal(5001);

            await euthenian_sentinel.connect(user1).burn(0);

            expect(await euthenian_sentinel.connect(owner).nftIdCounter()).to.equal(6001);
            expect(await euthenian_sentinel.connect(owner).tokenSupply()).to.equal(6000);
            expect(await euthenian_sentinel.connect(owner).balanceOf(owner.address)).to.equal(1000);
        });
    });
});