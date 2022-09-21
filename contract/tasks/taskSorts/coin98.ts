import {task, types} from "hardhat/config";
import {
    COIN98_DEPLOY,
    CONTRACT_NAME,
    DEPLOY_PRIVATE_KEY,
    DISABLE_CONFIRM_FLAG,
    DRIVER_PATH,
    IS_LEDGER,
    KEY_STORE_FILE_PATH,
    RPOMPT_CHECK_TRANSACTION_DATA,
    SUB_CHECK_PRIVATEKEY,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_TRASACTION,
    SUB_GEN_CONTRACT_ADDR,
    SUB_SEND_TRANSACTION
} from "../taskName";
import chalk from "chalk";

task(COIN98_DEPLOY, 'deploy coin98 contract')
    .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
    .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
    .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
    .setAction(async (taskArgs, env) => {
        const {wallet} = await env.run(SUB_CHECK_PRIVATEKEY, taskArgs)
        const cname = CONTRACT_NAME.Coin98;

        console.log(chalk.blue.bold(`Start delploy ${cname}...`))
        const contractAddr = await env.run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address})
        const {bytecode: data} = await env.artifacts.readArtifact(cname)
        const transaction = await env.run(SUB_CREATE_TRASACTION, {data, from: wallet.address})
        const {answer} = await env.run(SUB_CONFIRM_TRANSACTION, {
            message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy coin98 contract)`,
            disableConfirm: taskArgs.disableConfirm
        })
        if (!answer) return
        const {hash} = await env.run(SUB_SEND_TRANSACTION, {transaction, wallet})
        console.log(`Execuete succefully at - ${hash}`)
        console.log(`${cname} - ${contractAddr}`)
        return {hash, contractAddr}
    })
