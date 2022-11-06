const { ethers } = require("hardhat");

async function main() {

  let royaltyAddress = "0x7beDA3197383B1AE4a36c0791bBaD34273975051";

  const Euthenian_Sentinel = await ethers.getContractFactory("Euthenian_Sentinel");
  const euthenian_sentinel = await Euthenian_Sentinel.deploy(
    "Euthenian_Sentinel",
    "$ETSNL",
    "AddressToIspf", 
    royaltyAddress
  );

  console.log("Contract deployed to:", euthenian_sentinel.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
