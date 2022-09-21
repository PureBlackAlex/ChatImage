import {task, types} from "hardhat/config";
import {NUM_FLAG} from "../taskName";

const PREFIX = 'evm';
task(`${PREFIX}-getWallets`, 'get evm build in account')
  .addParam(NUM_FLAG, 'account of accounts', '10', types.string, true)
  .setAction(async (taskArgs, {ethers: {Wallet}}) => {
    const {num} = taskArgs
    for(let i = 0; i < num; i++) {
      const _path = `m/44'/60'/0'/0/${i}`
      const walletMnemonic = Wallet.fromMnemonic(process.env.HARDHAT_NETWORK_MNEMONIC as string, _path)
      console.log(`
        Account #${i}: ${walletMnemonic.address}
        publicKey #${i}: ${walletMnemonic.publicKey}
        privateKey #${i}: ${walletMnemonic.privateKey}
      `);
    }
  })