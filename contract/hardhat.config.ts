import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import '@openzeppelin/hardhat-upgrades';
import "solidity-coverage";
import "hardhat-spdx-license-identifier";
import "hardhat-tracer";
import "hardhat-docgen";
import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers';
import './tasks';
import './tasks/subtaskDef';

require("hardhat-log-remover");
dotenv.config({path: "./.env"});

const HARDHAT_NETWORK_MNEMONIC = process.env.HARDHAT_NETWORK_MNEMONIC;
const DEFAULT_HARDHAT_NETWORK_BALANCE = "10000000000000000000000";
const defaultHdAccountsConfigParams = {
    initialIndex: 0,
    count: 1000,
    path: "m/44'/60'/0'/0",
};

const defaultHardhatNetworkHdAccountsConfigParams = {
    ...defaultHdAccountsConfigParams,
    mnemonic: HARDHAT_NETWORK_MNEMONIC,
    accountsBalance: DEFAULT_HARDHAT_NETWORK_BALANCE,
};


// You have to export an object to set up your config
// This object can have the following optional entries:
// defaultNetwork, networks, solc, and paths.
// Go to https://buidler.dev/config/ to learn more
module.exports = {
    // This is a sample solc configuration that specifies which version of solc to use
    solidity: {
        compilers:[
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            },
            {
                version: "0.5.16",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200
                    }
                }
            }
        ],
    },
    networks: {
        hardhat: {
            accounts: defaultHardhatNetworkHdAccountsConfigParams
        },
        kovan: {
            url: process.env.NETWORKS_KOVAN_URL,
            chainId: 42,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        ropsten: {
            url: process.env.NETWORKS_ROPSTEN_URL,
            chainId: 3
        },
        rinkeby: {
            url: process.env.NETWORKS_RINKEBY,
            chainId: 4,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        mainnet: {
            url: process.env.NETWORKS_MAINNET_URL,
            chainId: 1
        },
        bsc_testnet: {
            url: process.env.NETWORKS_BSC_TESTNET_URL,
            chainId: 97,
        },
        bsc_mainnet: {
            url: process.env.NETWORKS_BSC_MAINNET_URL,
            chainId: 56,
        },
        fx_devnet: {
            url: process.env.NETWORKS_FX_LOCALNET_URL,
            chainId: 221,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        sokol: {
            url: process.env.NETWORKS_SOKOL_URL,
            chainId: 77,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        fx_testnet: {
            url: process.env.NETWORKS_FX_TESTNET_URL,
            chainId: 90001,
        },
        fx_proxy: {
            url: process.env.NETWORKS_FX_PROXY_URL,
            chainId: 90001,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        matic_testnet: {
            url: process.env.NETWORKS_PLG_TESTNET_URL,
            chainId: 80001,
            accounts: [process.env.MATIC_ACCOUNT]
        },
        matic_mainnet: {
            url: process.env.NETWORKS_PLG_MAINNET_URL,
            chainId: 137,
        },
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
        runOnCompile: true
    },
    gasReporter: {
        enabled: process.env.GAS_REPORTER != undefined,
        currency: 'eur',

    },
    mocha: {
        timeout: 2000000,
    },
    paths: {
      tests: './test/'
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        // apiKey: chain
        apiKey: {
            kovan: process.env.APIKEY_ETHERSCAN,
            rinkeby: process.env.APIKEY_ETHERSCAN,
            polygon: process.env.APIKEY_POLYGON,
            polygonMumbai: process.env.APIKEY_POLYGON,
            fxTestnet: "fxtestnet-apikey",
            fxDevnet: "fxlocal-apikey",
            sokol: "sokol-apikey"
        }
    },
    spdxLicenseIdentifier: {
        overwrite: true,
        runOnCompile: true,
    },
    docgen: {
        path: './docs/contracts',
        clear: true,
        runOnCompile: false,
        except: ['^contracts/interfaces', '^contracts/proxy', '^contracts/test']
    },
};

// CHAIN=matic_testnet hh verify <ADDRESS> --network matic_testnet
// GAS_REPORTER=1 hh test ...