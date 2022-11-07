require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 module.exports = {
  solidity: {
    compilers: [{
      version: "0.7.8"
    },
    {
      version: "0.8.8"
    }]
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_URL, 
        blockNumber: 15912869,
      }
    },
    goerli: {
      url: process.env.GOERLI_URL,
      accounts:{
        mnemonic: process.env.MNEMONIC
      },
    },
    mumbai: {
      url: process.env.MUMBAI_URL,
      accounts:{
        mnemonic: process.env.MNEMONIC
      },
    },
    polygonMainnet: {
      url: process.env.POLYGON_MAINNET_URL,
      accounts:{
        mnemonic: process.env.MNEMONIC
      },
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    token: "ETH",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
};
