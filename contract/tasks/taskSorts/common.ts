import {task, types} from "hardhat/config";
import chalk from "chalk";
import {bech32} from "bech32";

import {
    AMOUNT_FLAG,
    CNAME_FLAG,
    DEFAULT_DRIVE_PATH,
    DEPLOY_PRIVATE_KEY,
    DISABLE_CONFIRM_FLAG,
    DRIVER_PATH,
    ETH_ADDR_FLAG,
    FUNC_NAME_FLAG,
    FX_CORE_ADDR_FLAG,
    FX_NODE_URL_FLAG,
    IS_GET_INIT_DATA_FLAG,
    IS_LEDGER,
    KEY_STORE_FILE_PATH,
    MNEMONIC_FLAG,
    PREFIX_FLAG,
    RECEIVER_FLAG,
    RPOMPT_CHECK_TRANSACTION_DATA,
    SUB_CHECK_PRIVATEKEY,
    SUB_CHECK_TRANSACTION_STATUS,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_LEDER_WALLET,
    SUB_CREATE_TRASACTION,
    SUB_ENCODE_ABI,
    SUB_GET_INIT_DATA,
    SUB_SEND_TRANSACTION,
    TARGET_NAME_FLAG,
    TRANSACTION_HASH
} from "../taskName";

const bip32 = require('bip32')
const bip39 = require('bip39')


const PREFIX = 'com';

task('send-eth', 'send eth')
    .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
    .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
    .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .addParam(IS_LEDGER, 'choose ledger to sendtransaction', undefined, types.string, true)
    .addParam(RECEIVER_FLAG, 'receiver', undefined, types.string, false)
    .addParam(AMOUNT_FLAG, 'amount ', undefined, types.string, false)
    .setAction(async (taskArgs, env) => {
        const {receiver, amount} = taskArgs
        console.log(chalk.blue.bold(`Start send ${amount} eth to ${receiver}`))

        const {wallet} = await env.run(SUB_CHECK_PRIVATEKEY, taskArgs)

        const transaction = await env.run(SUB_CREATE_TRASACTION, {
            to: receiver,
            value: env.ethers.utils.parseEther(amount),
            from: wallet.address
        })

        const {answer} = await env.run(SUB_CONFIRM_TRANSACTION, {
            message: `${RPOMPT_CHECK_TRANSACTION_DATA}(send eth)`,
            disableConfirm: taskArgs.disableConfirm
        })
        if(!answer) return

        const {hash} = await env.run(SUB_SEND_TRANSACTION, {transaction, wallet})
        console.log(`Execute successfully:  ${hash}`)
    })


task(`${PREFIX}-get-init-data`, 'get fx node gravityId、vote_power、ethAddresses、powers')
    .addParam(FX_NODE_URL_FLAG, 'fx node url', undefined, types.string, false)
    .setAction(async (taskArgs, env) => {
        await env.run(SUB_GET_INIT_DATA, taskArgs)
    })

task(`${PREFIX}-encode-abi`, 'encode abi')
    .addParam(CNAME_FLAG, 'contract name', undefined, types.string, false)
    .addParam(FUNC_NAME_FLAG, 'contract\'s function name ' , undefined, types.string, false)
    .addParam(IS_GET_INIT_DATA_FLAG, 'if ture will  get init data automatically by subtask' , undefined, types.string, false)
    .setAction(async (taskArgs, env) => {
        const bytes =await env.run(SUB_ENCODE_ABI, taskArgs)
        console.log(bytes);
    })

task(`${PREFIX}-check-transaction-status`, 'check transaction status')
    .addParam(TRANSACTION_HASH, 'transaction hash ', undefined, types.string, false)
    .setAction(async (taskArgs, env) => {
        return await env.run(SUB_CHECK_TRANSACTION_STATUS, taskArgs);
    })

task(`${PREFIX}-get-ledger-account`, 'get ledger account')
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .setAction(async (taskArgs, env) => {
        const {wallet} = await env.run(SUB_CREATE_LEDER_WALLET, taskArgs)
        console.log(wallet.address);
    })

/**
 *  hh get-private-key-by-mnemonic --driver-path "44'/60'/0'/0/0" --mnemonic "..."
 */
task(`${PREFIX}-get-private-key-by-mnemonic`, 'get private key by mnemonic ')
    .addParam(MNEMONIC_FLAG, 'mnemonic', undefined, types.string, false)
    .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
    .setAction(async (taskArgs, env) =>  {
        const {mnemonic, driverPath} = taskArgs

        // @ts-ignore
        await bip39.mnemonicToSeed(mnemonic).then(seed => {
            const _seed: any = seed;
            // generate the root of the node tree
            const root = bip32.fromSeed(_seed);

            // 路径分层
            const _driverPath = driverPath ? driverPath : DEFAULT_DRIVE_PATH
            const path = `m/${_driverPath}`
            const node = root.derivePath(path);

            // 获取私钥
            const privateKeyBuffer = node.privateKey;
            const privateKey = privateKeyBuffer.toString("hex");

            console.log(`
               mnemonic: ${mnemonic}
               path: ${path}
               privateKey: ${privateKey}
            `);
        });

    })

/**
 * hh from-eth-addr-to-fxcore-addr --eth-addr '0x30097c45158B1377830E7F6369705ACD33f00d05' --prefix 'fx'
 *
 */
task(`${PREFIX}-from-eth-addr-to-fxcore-addr`, 'from eth address to fxcore address')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to send transaction', undefined, types.string, true)
  .addParam(PREFIX_FLAG, 'fxcore prefix', undefined, types.string, false)
  .addParam(ETH_ADDR_FLAG, 'fxcore prefix', undefined, types.string, true)
  .setAction(async (taskArgs, {ethers, run}, runSuper) => {
    const {prefix, ethAddr} = taskArgs

    const {wallet} = await run(SUB_CHECK_PRIVATEKEY, taskArgs);

    let _ethAddress = ''
    if(ethAddr) {
      if (!ethers.utils.isAddress(ethAddr)) throw new Error('Invalid eth address')
      _ethAddress = ethAddr
    } else {
      _ethAddress = wallet.address
    }

    const bytes = Buffer.from(_ethAddress.substring(2), 'hex')
    const fxcoreAddress = bech32.encode(prefix, bech32.toWords(bytes))
    console.log(`
      ethAddr: ${_ethAddress}
      prefix: ${prefix}
      fxcore address: ${fxcoreAddress}
    `)

    return fxcoreAddress
  })

/**
 *  hh from-fxcore-addr-to-eth-addr --fx-core-addr 'fx1xqyhc3g43vfh0qcw0a3kjuz6e5elqrg9fnfqel'
 */
task(`${PREFIX}-from-fxcore-addr-to-eth-addr`, 'from fxcore address to eth address')
  .addParam(DISABLE_CONFIRM_FLAG, 'disable confirm', 'false', types.string, true)
  .addParam(DEPLOY_PRIVATE_KEY, '[optional] depoloy private key', undefined, types.string, true)
  .addParam(KEY_STORE_FILE_PATH, 'key Store File Path', undefined, types.string, true)
  .addParam(DRIVER_PATH, 'driver path ', undefined, types.string, true)
  .addParam(IS_LEDGER, 'choose ledger to send transaction', undefined, types.string, true)
  .addParam(FX_CORE_ADDR_FLAG, 'fxcore address', undefined, types.string, true)
  .addParam(PREFIX_FLAG, 'fxcore prefix', undefined, types.string, true)
  .setAction(async (taskArgs, {ethers, run}, runSuper) => {
    const {fxCoreAddr} = taskArgs

    let _ethAddress = ''
    if(fxCoreAddr) {
      _ethAddress = fxCoreAddr
    } else {
      _ethAddress = await run('from-eth-addr-to-fxcore-addr', taskArgs)
    }

    const fxAddrBtc = bech32.fromWords(bech32.decode(_ethAddress).words);
    const ethAddress = Buffer.from(fxAddrBtc).toString('hex')

    if(fxCoreAddr) {
      console.log(`
      ethAddr: ${ethAddress}
      fxcore address: ${_ethAddress}
    `)
    }
  })


task(`${PREFIX}-formatBytes32String`, '')
  .addParam(TARGET_NAME_FLAG, "target name", undefined, types.string, false)
  .setAction(async (taskArgs, {ethers}) => {
      console.log(taskArgs);
      const {targetName} = taskArgs
      const res = ethers.utils.formatBytes32String(targetName)
      console.log(res);
      return res
  })