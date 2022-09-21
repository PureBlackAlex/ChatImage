import {task, types} from "hardhat/config";
import {
    ACCOUNT_ADDR_FLAG,
    CHATIMAGE_DEPLOY,
    CHATIMAGE_SAFEMINT,
    CONTRACT_ADDR_FLAG,
    CONTRACT_NAME,
    DEPLOY_PRIVATE_KEY,
    DISABLE_CONFIRM_FLAG,
    DRIVER_PATH,
    IS_LEDGER,
    KEY_STORE_FILE_PATH,
    NFTURL,
    RPOMPT_CHECK_TRANSACTION_DATA,
    SUB_CHECK_PRIVATEKEY,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_TRASACTION,
    SUB_GEN_CONTRACT_ADDR,
    SUB_SEND_TRANSACTION
} from "../taskName";
import chalk from "chalk";

const CHATIMAGE_ABI_PATH = '../../artifacts/contracts/ChatImage.sol/ChatImage.json'
task(CHATIMAGE_DEPLOY, 'deploy chatimage contract')
    .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
    .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
    .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
    .setAction(async (taskArgs, env) => {
        const {wallet} = await env.run(SUB_CHECK_PRIVATEKEY, taskArgs)
        const cname = CONTRACT_NAME.ChatImage;

        console.log(chalk.blue.bold(`Start delploy ${cname}...`))
        const contractAddr = await env.run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address})
        const {bytecode: data} = await env.artifacts.readArtifact(cname)
        const transaction = await env.run(SUB_CREATE_TRASACTION, {data, from: wallet.address})
        const {answer} = await env.run(SUB_CONFIRM_TRANSACTION, {
            message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy ChatImage contract)`,
            disableConfirm: taskArgs.disableConfirm
        })
        if (!answer) return
        const {hash} = await env.run(SUB_SEND_TRANSACTION, {transaction, wallet})
        console.log(`Execuete succefully at - ${hash}`)
        console.log(`${cname} - ${contractAddr}`)
        return {hash, contractAddr}
    })


task(CHATIMAGE_SAFEMINT, 'mint NFT in chatimage contract OnlyOwner')
    .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
    .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
    .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
    .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
    .addParam(ACCOUNT_ADDR_FLAG, 'accountAddr', undefined, types.string, false)
    .addParam(NFTURL,'nfturl',undefined,types.string,false)
    .setAction(async(taskArgs,{run,ethers}) => {
        const {contractAddr,accountAddr,nfturl} = taskArgs
        const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
        const {abi} = await import(CHATIMAGE_ABI_PATH)
        const data = new ethers.utils.Interface(abi)
            .encodeFunctionData('safeMint', [accountAddr,nfturl.toString()])
        const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
        const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
            message: `${RPOMPT_CHECK_TRANSACTION_DATA}(eurstoken setDelegate levelV2)`,
            disableConfirm: taskArgs.disableConfirm
        })
        if(!answer) return
        const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
        console.log(`Execute successfully - ${hash}`)
        return {hash}
    })
// ipfs/QmSrDs5bekxZK8e38xRZ3iWYqZ7vo3XVouzZ7T3hyHtRkD
// npx hardhat chatimage-safemint
// --account-addr  0x13fD08256caB0dEE4Bf0b587374aDc4538EAd2dd
// --contract-addr 0x59Ea28F3B2AE6F7356094ed32BF73DA135cfda4E
// --deploy-private-key <>
// --nfturl ipfs/QmSrDs5bekxZK8e38xRZ3iWYqZ7vo3XVouzZ7T3hyHtRkD
// --network goerli