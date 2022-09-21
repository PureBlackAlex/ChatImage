# ChatImage Contract
ChatImage is a web3 project

## This is a hardhat project. 
    This project Using hardhar Frames and typescript

###How to use
    1. yarn
    2. npx hardhat compile
    3. npx hardhat test
    4. npx hardhat typechain
    5. npx hardhat   


## How to deploy contract

npx hardhat chatimage-deploy 
--deploy-private-key "private" 
--network goerli

verify contract

npx hardhat verify  --network goerli <address>

Hpw to mint
npx hardhat chatimage-safemint 
--account-addr  0x13fD08256caB0dEE4Bf0b587374aDc4538EAd2dd 
--contract-addr 0x59Ea28F3B2AE6F7356094ed32BF73DA135cfda4E 
--deploy-private-key  <private>
--nfturl ipfs/QmSrDs5bekxZK8e38xRZ3iWYqZ7vo3XVouzZ7T3hyHtRkD
--network goerli



# Goerli contract address and hash

Execuete succefully at - 0x4fb254e4f9ae2e933b1ce4015233ad8e6115f95fec0ea98a6d3e221a1752b28d
ChatImage - 0x59Ea28F3B2AE6F7356094ed32BF73DA135cfda4E

# How Abi Path

/contract/artifacts/contracts/ChatImage.sol/ChatImage.json