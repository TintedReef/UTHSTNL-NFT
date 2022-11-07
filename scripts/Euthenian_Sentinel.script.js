const { ethers } = require("hardhat");

async function main() {

  let royaltyAddress = "0x6b54c177feAc40D6c5DE2042D33d30Ac5153d75a";

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
