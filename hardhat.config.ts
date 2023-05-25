import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";

const config:HardhatUserConfig = {
  // networks: {
  //   sepolia: {
  //     url: "https://eth-sepolia.g.alchemy.com/v2/bVZVBu2Q-j4ndsWUmWIQ8q-yG6I4kuPB", // Replace with the Sepolia network RPC URL
  //     accounts: {
  //       mnemonic: "electric slide bar trip desert total hire illness mango craft blue glare", // Replace with the mnemonic for your accounts
  //     },
  //   },
  // },
  paths: {
  sources: "./contract",
  artifacts: "./contract/artifacts",
  cache: "./contract/cache"
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;