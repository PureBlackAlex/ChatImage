import {task, types} from "hardhat/config";
import {
    CONTRACT_NAME,
    DEPLOY_PRIVATE_KEY,
    DISABLE_CONFIRM_FLAG,
    DRIVER_PATH,
    IS_LEDGER,
    KEY_STORE_FILE_PATH,
    LOGIC_ADDR_FLAG,
    LOGIC_CONTRACT_ADDR_FLAG,
    PROXY_INIT_BYTE_FLAG,
    RPOMPT_CHECK_TRANSACTION_DATA,
    SUB_CHECK_PRIVATEKEY,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_TRASACTION,
    SUB_GEN_CONTRACT_ADDR,
    SUB_SEND_TRANSACTION
} from "../taskName";
import chalk from "chalk";

const PREFIX = "uups"
task(`${PREFIX}-deploy-proxy`, 'deploy uups proxy')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(LOGIC_CONTRACT_ADDR_FLAG, 'logic contract address', undefined, types.string, false)
  .addParam(PROXY_INIT_BYTE_FLAG, '[optional] logic init function calldata  ', undefined, types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to send transaction', undefined, types.string, true)
  .setAction(async (taskArgs, env) => {
    const {logicContractAddr, proxyInitData} = taskArgs;
    const cname = 'ERC1967Proxy';

    console.log(chalk.blue.bold(`Start delploy ${cname}...`))

    const {wallet} = await env.run(SUB_CHECK_PRIVATEKEY, taskArgs)

    const contractAddr = await env.run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address})
    const {abi, bytecode} = await env.artifacts.readArtifact(cname)
    const initData = proxyInitData ? proxyInitData : '0x';
    const data_param = new env.ethers.utils.Interface(abi)
      .encodeDeploy([logicContractAddr, initData])

    const data = bytecode + data_param.substring(2)

    const transaction = await env.run(SUB_CREATE_TRASACTION, {data, from: wallet.address})
    const {answer} = await env.run(SUB_CONFIRM_TRANSACTION, {
      message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy uups proxy)`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await env.run(SUB_SEND_TRANSACTION, { transaction, wallet })
    console.log(`Execuete succefully at - ${hash}`)
    console.log(`${cname} - ${contractAddr}`)

    return {hash, contractAddr}
  })


task(`${PREFIX}-getBytecode`, 'get uups create contract bytecode + constructor params ')
  .addParam(LOGIC_ADDR_FLAG, 'logic address', undefined, types.string, false)
  .setAction(async (taskArgs, {ethers, artifacts}) => {
      const {logicAddr} = taskArgs
      const {abi, bytecode} = await artifacts.readArtifact(CONTRACT_NAME.ERC1967Proxy)
      const data_param = new ethers.utils.Interface(abi).encodeDeploy([logicAddr, '0x'])
      const res = bytecode + data_param.substring(2);
      console.log(res)
      return res
  })