import {task, types} from "hardhat/config";
import {
    ACCOUNT_ADDR_FLAG,
    AMOUNT_FLAG,
    CONTRACT_ADDR_FLAG,
    CONTRACT_NAME,
    DEPLOY_PRIVATE_KEY,
    DISABLE_CONFIRM_FLAG,
    DRIVER_PATH,
    IS_LEDGER,
    KEY_STORE_FILE_PATH,
    NAME_FLAG,
    OWNER_ADDR_FLAG,
    RECEIVER_FLAG,
    RPOMPT_CHECK_TRANSACTION_DATA,
    SPENDER_ADDR_FLAG,
    SUB_CHECK_PRIVATEKEY,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_TRASACTION,
    SUB_GEN_CONTRACT_ADDR,
    SUB_SEND_TRANSACTION,
    SYMBOL_FLAG,
    TOKEN_ADDR_FLAG
} from "../taskName";
import assert from "assert";
import chalk from "chalk";


interface ERC20 {
  approve(spender: any, amount: any): any;
  transfer(recipient: any, amount: any): any;
  transferFrom(sender: any, recipient: any, amount: any): any;
  balanceOf(account: any): any;
  name(): any;
  symbol(): any;
  decimals(): any;
  decimals(): any;
  totalSupply(): any;
  allowance(owner: any, spender: any): any;
  increaseAllowance(spender: any, addedValue: any): any;
  decreaseAllowance(spender: any, subtractedValue: any): any;
  mint(to: any, amount: any): any;
  burn(from: any, amount: any): any;
  pause(): any;
  unpause(): any
}

const ERC20_ABI_PATH = '../../abis/erc20.json'
const MODULE_PREFIX = 'erc-20'

task('erc20-deploy', 'deploy an erc20')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
  .addParam(NAME_FLAG, 'name', undefined, types.string, true)
  .addParam(SYMBOL_FLAG, 'symbol ', undefined, types.string, true)
  .setAction(async (taskArgs, {run, artifacts, ethers, network}) => {
    const {name, symbol} = taskArgs

    let cname = (network.config.chainId == 97 || network.config.chainId == 56) ?
      CONTRACT_NAME.TestBEP20Token : CONTRACT_NAME.TestERC20;

    console.log(chalk.blue.bold(`Start delploy ${cname}...`))

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const contractAddr = await run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address} )

    const {bytecode, abi} = await artifacts.readArtifact(cname);
    const data_param = new ethers.utils.Interface(abi)
      .encodeDeploy([name, symbol])

    const data = bytecode + data_param.substring(2)

    const transaction = await run(SUB_CREATE_TRASACTION, {data, from: wallet.address})

    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy erc20 token )`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, { transaction, wallet })
    console.log(`Execuete succefully at - ${hash}`)
    console.log(`${cname} - ${contractAddr}`)

    return {hash, contractAddr}
  })

task('erc20-deploy-burn-token', 'deploy an erc20 which is burn token')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
  .setAction(async (taskArgs, {run, artifacts, ethers, network}) => {

    // let cname = (network.config.chainId == 97 || network.config.chainId == 56) ?
    //   CONTRACT_NAME.TestBEP20Token : CONTRACT_NAME.TestERC20;

    let cname = CONTRACT_NAME.BurnToken;

    console.log(chalk.blue.bold(`Start delploy ${cname}...`))

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const contractAddr = await run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address} )

    const {bytecode} = await artifacts.readArtifact(cname);

    const transaction = await run(SUB_CREATE_TRASACTION, {data: bytecode, from: wallet.address})

    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy burnable token token )`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, { transaction, wallet })
    console.log(`Execuete succefully at - ${hash}`)
    console.log(`${cname} - ${contractAddr}`)

    return {hash, contractAddr}
  })

task('erc20-deploy-six-token', 'deploy an erc20 which has six decimal')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.boolean, true)
  .addParam(NAME_FLAG, 'name', undefined, types.string, false)
  .addParam(SYMBOL_FLAG, 'symbol ', undefined, types.string, false)
  .setAction(async (taskArgs, {run, artifacts, ethers, network}) => {
    const {name, symbol} = taskArgs
    let cname = CONTRACT_NAME.TestSixDecimalERC20;
    // let cname = (network.config.chainId == 97 || network.config.chainId == 56) ?
    //   CONTRACT_NAME.TestBEP20Token : CONTRACT_NAME.TestERC20;

    console.log(chalk.blue.bold(`Start delploy ${cname}...`))

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const contractAddr = await run(SUB_GEN_CONTRACT_ADDR, {account: wallet.address} )

    const {bytecode, abi} = await artifacts.readArtifact(cname);
    const data_param = new ethers.utils.Interface(abi)
      .encodeDeploy([name, symbol])

    const data = bytecode + data_param.substring(2)

    const transaction = await run(SUB_CREATE_TRASACTION, {data, from: wallet.address})

    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message: `${RPOMPT_CHECK_TRANSACTION_DATA}(deploy erc20 token )`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, { transaction, wallet })
    console.log(`Execuete succefully at - ${hash}`)
    console.log(`${cname} - ${contractAddr}`)

    return {hash, contractAddr}
  })

task(`${MODULE_PREFIX}-get-balance`, 'get erc20 balance')
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(ACCOUNT_ADDR_FLAG, 'account address', undefined, types.string, false)
  .setAction(async (taskArgs, {ethers, run }) => {
    const {contractAddr, accountAddr} = taskArgs

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY)
    const {abi} = await import(ERC20_ABI_PATH);

    // @ts-ignore
    const instance = await ethers.getContractAt(abi, contractAddr, wallet) as ERC20;
    const balance = await instance.balanceOf(accountAddr)
    console.log(`
      account: ${accountAddr}
      balance of ${contractAddr} : ${balance.toString()} 
    `)

  })

task(`${MODULE_PREFIX}-allownce`, 'query allowance')
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(OWNER_ADDR_FLAG, 'owner address', undefined, types.string, false)
  .addParam(SPENDER_ADDR_FLAG, 'spender address', undefined, types.string, false)
  .setAction(async (taskArgs, {run, ethers}) => {
    const {ownerAddr, spenderAddr, contractAddr} = taskArgs

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY)
    const {abi} = await import(ERC20_ABI_PATH)
    // @ts-ignore
    const instance = await ethers.getContractAt(abi, contractAddr, wallet) as ERC20;
    const balance = await instance.allowance(ownerAddr, spenderAddr)
    console.log(`
      ${ownerAddr} approve to ${spenderAddr}: ${balance.toString()}
    `)

  })


task(`${MODULE_PREFIX}-transfer`, 'transfer erc20 ')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(AMOUNT_FLAG, 'amount ', undefined, types.string, false)
  .addParam(RECEIVER_FLAG, 'receiver', undefined, types.string)
  .setAction(async (taskArgs, {run, ethers}) => {
    const {contractAddr, amount, receiver} = taskArgs

    const _amount = ethers.utils.parseEther(amount)

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const {abi} = await import(ERC20_ABI_PATH)
    const data = new ethers.utils.Interface(abi)
      .encodeFunctionData('transfer', [receiver, _amount.toString()])

    const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message: `${RPOMPT_CHECK_TRANSACTION_DATA}(call transfer)`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully - ${hash}`)

    return {hash}

  })


task(`${MODULE_PREFIX}-approve`, 'erc20 approve')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(SPENDER_ADDR_FLAG, 'spender', undefined, types.string, false)
  .addParam(AMOUNT_FLAG, 'amount ', undefined, types.string, true)
  .setAction(async (taskArgs, env) => {
    const {contractAddr, spenderAddr, amount} = taskArgs

    const _amount = amount ? amount : env.ethers.BigNumber.from('0x' + 'f'.repeat(64));

    const {wallet} = await env.run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const {abi} = await import(ERC20_ABI_PATH)
    const data = new env.ethers.utils.Interface(abi).encodeFunctionData('approve', [spenderAddr, _amount.toString()])

    const transaction = await env.run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await env.run(SUB_CONFIRM_TRANSACTION, {
      message:  `${RPOMPT_CHECK_TRANSACTION_DATA}(call approve())`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await env.run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully at - ${hash}`)

  })


task(`${MODULE_PREFIX}-returnAnyToken`, 'call returnAnyToken')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(AMOUNT_FLAG, 'amount ', undefined, types.string, true)
  .addParam(TOKEN_ADDR_FLAG, 'token address  ', undefined, types.string, true)
  .addParam(RECEIVER_FLAG, 'to  address  ', undefined, types.string, true)
  .setAction(async (taskArgs, {run, ethers, artifacts}) => {
    const {contractAddr, amount, tokenAddr, receiver} = taskArgs

    assert(amount > 0, "Invalid amount");
    const _amount = ethers.utils.parseEther(amount.toString())

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const {abi} = await import(ERC20_ABI_PATH)
    const data = new ethers.utils.Interface(abi)
      .encodeFunctionData('returnAnyToken', [tokenAddr, _amount.toString(), receiver.toString()])

    const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message:  `${RPOMPT_CHECK_TRANSACTION_DATA}(call returnAnyToken())`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully at - ${hash}`)
  })

task(`${MODULE_PREFIX}-recoverToken`, 'call recoverToken')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .addParam(AMOUNT_FLAG, 'amount ', undefined, types.string, true)
  .addParam(TOKEN_ADDR_FLAG, 'token address  ', undefined, types.string, true)
  .addParam(RECEIVER_FLAG, 'to  address  ', undefined, types.string, true)
  .setAction(async (taskArgs, {run, ethers}) => {
    const {contractAddr, amount, tokenAddr, receiver} = taskArgs

    assert(amount > 0, "Invalid amount");
    const _amount = ethers.utils.parseEther(amount.toString())

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)
    const {abi} = await import(ERC20_ABI_PATH)
    const data = new ethers.utils.Interface(abi)
      .encodeFunctionData('recoverToken', [tokenAddr, _amount.toString(), receiver.toString()])

    const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message:  `${RPOMPT_CHECK_TRANSACTION_DATA}(call recoverToken())`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully at - ${hash}`)
  })


task(`${MODULE_PREFIX}-pause`, 'pause contract')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .setAction(async (taskArgs, {ethers, run, artifacts}) => {
    const {contractAddr} = taskArgs

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)

    const {abi} = await import(ERC20_ABI_PATH)
    const data = new ethers.utils.Interface(abi).encodeFunctionData('pause')
    const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message:  `${RPOMPT_CHECK_TRANSACTION_DATA}(call pause())`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully at - ${hash}`)
  })

task(`${MODULE_PREFIX}-unpause`, 'unpause contract')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
  .addParam(CONTRACT_ADDR_FLAG, 'contract address', undefined, types.string, false)
  .setAction(async (taskArgs, {ethers, run, artifacts}) => {
    const {contractAddr} = taskArgs

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs)

    const {abi} = await import(ERC20_ABI_PATH)
    const data = new ethers.utils.Interface(abi).encodeFunctionData('unpause')
    const transaction = await run(SUB_CREATE_TRASACTION, {data, to: contractAddr, from: wallet.address})
    const {answer} = await run(SUB_CONFIRM_TRANSACTION, {
      message:  `${RPOMPT_CHECK_TRANSACTION_DATA}(call unpause())`,
      disableConfirm: taskArgs.disableConfirm
    })
    if(!answer) return

    const {hash} = await run(SUB_SEND_TRANSACTION, {transaction, wallet})
    console.log(`Execute successfully at - ${hash}`)
  })