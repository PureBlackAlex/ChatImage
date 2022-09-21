import {subtask, types} from "hardhat/config";
import {
    CNAME_FLAG,
    DEFAULT_DRIVE_PATH,
    GET_CONTRACT_ARTIFACTS,
    GET_CONTRACT_FACTORY,
    SUB_ADD_BRIDGE_TOKEN,
    SUB_BC_ADDR_TO_BSC,
    SUB_CHECK_APPROVE,
    SUB_CHECK_BRIDGE_TOKEN,
    SUB_CHECK_ETH_BALANCE,
    SUB_CHECK_OWNER,
    SUB_CHECK_PRIVATEKEY,
    SUB_CHECK_TRANSACTION_STATUS,
    SUB_CONFIRM_TRANSACTION,
    SUB_CREATE_LEDER_WALLET,
    SUB_CREATE_TRASACTION,
    SUB_DEPLOY_CONTRACT,
    SUB_DEPLOY_CONTRACT_NEW,
    SUB_ENCODE_ABI,
    SUB_FIX_SIGNATURE,
    SUB_FORMAT_TRANSACTION,
    SUB_FX_ADDR_TO_HEX,
    SUB_GEN_CONTRACT_ADDR,
    SUB_GEN_WALLET,
    SUB_GET_ETH_BALANCE,
    SUB_GET_ETH_NODE_URL,
    SUB_GET_INIT_DATA,
    SUB_GET_OWNER,
    SUB_GET_PRIVATE_FROM_KEY_STORE,
    SUB_GET_PROVIDER,
    SUB_GET_SINGNED_TX,
    SUB_GET_UNSIGNED_TX,
    SUB_LOG_EXECUTE_TXT,
    SUB_LOG_INFO,
    SUB_SEND_TRAN_BY_LEDGER,
    SUB_SEND_TRAN_BY_NORMAL_APPROACH,
    SUB_SEND_TRANSACTION,
    SUB_SIGN_WITH_LEDGER,
    SUB_TRANSFER,
} from "./taskName";
import {ethers, Wallet} from "ethers";
import path from "path";
import {HardhatError} from "hardhat/internal/core/errors";
import {ERRORS} from "hardhat/internal/core/errors-list";
import {bech32} from "bech32";
// import {LedgerSigner} from "@ethersproject/hardware-wallets";
import AppEth from "@ledgerhq/hw-app-eth";
import Transport from "@ledgerhq/hw-transport-node-hid";
import {UnsignedTransaction} from "@ethersproject/transactions";

const { decryptKeyStore } = require("../index");
const { getContractAddress } = require("@ethersproject/address");
const chalk = require("chalk");
const inquirer = require("inquirer");
const prompt = inquirer.createPromptModule();

let global = {
  keystorePrivate: "",
  keyStoreFilePath: "",
};

subtask(GET_CONTRACT_ARTIFACTS, "get contract json from artifacts file")
  .addParam(CNAME_FLAG, "contract name", undefined, types.string, false)
  .setAction(async ({ cname }, env) => {
    return await env.artifacts.readArtifact(cname);
  });

subtask(GET_CONTRACT_FACTORY, "create contract factory").setAction(
  async (taskArgs, hre) => {
    const { cname } = taskArgs;
    return await hre.ethers.getContractFactory(cname); // equal to ContractFactory
  }
);

subtask(SUB_DEPLOY_CONTRACT, "deploy contract by contract's factory").setAction(
  async (taskArgs) => {
    const { factory, cname } = taskArgs;

    console.log(`Start deploy ${cname}...`);
    const contractIns = await factory.deploy();
    await contractIns.deployed();
    console.log(`${cname} - `, contractIns.address);
    return contractIns;
  }
);

subtask(
  SUB_GET_PRIVATE_FROM_KEY_STORE,
  "get private key from key store"
).setAction(async (taskArgs) => {
  console.log(`Sart get account from keystore...`);
  const { keystorefilepath } = taskArgs;
  const _keyStoreFilePath = path.join(__dirname, keystorefilepath);
  return await decryptKeyStore({
    file: _keyStoreFilePath,
  });
});

subtask(
  SUB_GET_ETH_NODE_URL,
  "get eth node url form hardhat.network"
).setAction(async (taskArgs, env) => {
  // @ts-ignore
  return env.network.config.url;
});

subtask(SUB_GEN_WALLET, "generate wallet account").setAction(
  async (taskArgs, env) => {
    const { _privateKey } = taskArgs;
    const nodeUrl = await env.run(SUB_GET_ETH_NODE_URL);
    const provider = await new ethers.providers.JsonRpcProvider(nodeUrl);
    let wallet = new ethers.Wallet(_privateKey, provider);
    return { provider, wallet };
  }
);

subtask(SUB_GET_PROVIDER, "get provider").setAction(async (taskArgs, env) => {
  const nodeUrl = await env.run(SUB_GET_ETH_NODE_URL);
  const provider = await new ethers.providers.JsonRpcProvider(nodeUrl);
  return { provider };
});

subtask(SUB_GET_SINGNED_TX, "get signed tx").setAction(async (taskArgs) => {
  const { tx, sig } = taskArgs;
  return ethers.utils.serializeTransaction(tx, sig);
});

subtask(SUB_FIX_SIGNATURE, "fix signature").setAction(async (taskArgs) => {
  const { signature } = taskArgs;
  return {
    v: parseInt(signature.v, 16),
    r: "0x" + signature.r,
    s: "0x" + signature.s,
  };
});

subtask(SUB_GET_UNSIGNED_TX, "get unsigned_tx").setAction(
  async (taskArgs, env) => {
    const { transaction } = taskArgs;

    const tx: any = await env.ethers.utils.resolveProperties(transaction);
    const unsigned_tx = env.ethers.utils.serializeTransaction(tx).substring(2);
    return { unsigned_tx, tx };
  }
);

subtask(SUB_SIGN_WITH_LEDGER, "sign transcation using ledger").setAction(
  async (taskArgs) => {
    const { driverPath, unsigned_tx, wallet } = taskArgs;
    return await wallet.signTransaction(driverPath, unsigned_tx);
  }
);

subtask(SUB_CREATE_TRASACTION, "create transaction").setAction(
  async (taskArgs, env) => {
    const { to, from, data, value, gasPrice, nonce, gasLimit } = taskArgs;
    const { provider } = await env.run(SUB_GET_PROVIDER);

    let transaction = {
      chainId: (await provider.getNetwork()).chainId,
      to: to,
      nonce: nonce ? nonce : await provider.getTransactionCount(from),
      // gasLimit: gasLimit ? gasLimit : env.ethers.BigNumber.from('300000'),
      gasPrice: gasPrice
        ? env.ethers.BigNumber.from(gasPrice)
        : await provider.getGasPrice(),
      data: data ? data : "0x",
      value: value ? value : "0x0",
      from: from,
    };

    if (!to) delete transaction.to;
    // @ts-ignore
    transaction["gasLimit"] = gasLimit
      ? env.ethers.BigNumber.from(gasLimit.toString())
      : await provider.estimateGas(transaction);
    // transaction['gasLimit'] = ethers.BigNumber.from('6000000')
    await env.run(SUB_FORMAT_TRANSACTION, {
      transaction: { ...transaction, to },
    });
    delete transaction.from;
    return transaction;
  }
);

subtask(SUB_SEND_TRAN_BY_LEDGER, "send transaction by ledger").setAction(
  async (taskArgs, env) => {
    const { transaction, wallet } = taskArgs;

    transaction.chainId = transaction.chainId
      ? transaction.chainId
      : (await wallet.provider.getNetwork()).chainId;

    const nodeUrl = await env.run(SUB_GET_ETH_NODE_URL);
    const provider = await new ethers.providers.JsonRpcProvider(nodeUrl);

    console.log(`Please sign through the ledger...`);
    // const signedTx = await wallet.signTransaction(transaction);
    const tx = (await ethers.utils.resolveProperties(
      transaction
    )) as UnsignedTransaction;
    const unsigned_tx = ethers.utils.serializeTransaction(tx).substring(2);
    const signature = await wallet.appEth.signTransaction(
      wallet.path,
      unsigned_tx
    );
    const sig = {
      v: parseInt(signature.v, 16),
      r: "0x" + signature.r,
      s: "0x" + signature.s,
    };

    const signed_tx = ethers.utils.serializeTransaction(tx, sig);
    console.log(`Start sendTransaction...`);
    // return await provider.sendTransaction(signedTx);
    return await provider.sendTransaction(signed_tx);
  }
);

subtask(
  SUB_SEND_TRAN_BY_NORMAL_APPROACH,
  "send transaction by normal approach"
).setAction(async (taskArgs, env) => {
  const { wallet, transaction } = taskArgs;
  await wallet.signTransaction(transaction);
  return wallet.sendTransaction(transaction);
});

subtask(SUB_CREATE_LEDER_WALLET, "create ledger wallet").setAction(
  async (taskArgs, env) => {
    const { driverPath } = taskArgs;
    const nodeUrl = await env.run(SUB_GET_ETH_NODE_URL);
    const provider = await new ethers.providers.JsonRpcProvider(nodeUrl);

    const _path = driverPath ? driverPath : DEFAULT_DRIVE_PATH;

    // @ts-ignore
    // const wallet = new LedgerSigner(provider, 'hid', _path);
    // return {wallet}

    const transport = await Transport.create();
    const appEth = new AppEth(transport);

    return {
      wallet: {
        provider: provider,
        ...(await appEth.getAddress(_path)),
        path: _path,
        transport: transport,
        appEth: appEth,
      },
    };
  }
);

subtask(
  SUB_CHECK_PRIVATEKEY,
  "check the method of getting private key "
).setAction(async (taskArgs, env) => {
  const { keystorefilepath, deployPrivateKey, isLedger, driverPath } = taskArgs;
  let _privateKey: string;

  if (!keystorefilepath && deployPrivateKey && !isLedger) {
    _privateKey = deployPrivateKey;
    const { wallet } = await env.run(SUB_GEN_WALLET, {
      ...taskArgs,
      _privateKey,
    });
    return { wallet };
  } else if (keystorefilepath && !deployPrivateKey && !isLedger) {
    if (
      !global.keyStoreFilePath ||
      global.keyStoreFilePath != keystorefilepath
    ) {
      _privateKey = await env.run(SUB_GET_PRIVATE_FROM_KEY_STORE, taskArgs);
      global.keystorePrivate = _privateKey;
      global.keyStoreFilePath = keystorefilepath;
    }
    const { wallet } = await env.run(SUB_GEN_WALLET, {
      ...taskArgs,
      _privateKey: global.keystorePrivate,
    });
    return { wallet };
  } else if (!keystorefilepath && !deployPrivateKey && isLedger) {
    const { wallet } = await env.run(SUB_CREATE_LEDER_WALLET, { driverPath });
    // wallet['address'] = await wallet.getAddress()
    return { wallet };
  } else if (
    (keystorefilepath && deployPrivateKey) ||
    (keystorefilepath && isLedger) ||
    (deployPrivateKey && isLedger) ||
    (keystorefilepath && deployPrivateKey && isLedger)
  ) {
    throw new Error(`Too many operation, choose one of wallet approach !`);
  } else {
      let _path = `m/44'/60'/0'/0/0`
      let wfm = Wallet.fromMnemonic(process.env.HARDHAT_NETWORK_MNEMONIC as string, _path)

      const { wallet } = await env.run(SUB_GEN_WALLET, {
          ...taskArgs,
          _privateKey: wfm.privateKey,
      });

      return { wallet };
  }
});

subtask(SUB_TRANSFER, "transfer erc20").setAction(async (taskArgs, hre) => {
  const { amount, deployPrivateKey, ethnodeurl, fxTokenAddr, receiver } =
    taskArgs;

  const { abi: abi1 } = await hre.run(GET_CONTRACT_ARTIFACTS, taskArgs);
  const provider = await new ethers.providers.JsonRpcProvider(ethnodeurl);
  let wallet = new ethers.Wallet(deployPrivateKey, provider);

  const scaleAmout = hre.ethers.utils.parseEther(amount);

  const instance = new ethers.Contract(fxTokenAddr, abi1, wallet);

  const { hash } = await instance.transfer(receiver, scaleAmout);
  console.log(`Transfer succefully - ${hash}`);
});

subtask(SUB_CHECK_APPROVE, "check allowance balance").setAction(
  async (taskArgs) => {
    const { instance, owner, spender } = taskArgs;
    const allowance = await instance.allowance(owner, spender);
    if (allowance.toString() === "0") {
      console.log(`from ${owner} to ${spender}:`);
      console.log(
        `Authorized amount is insufficient : ${allowance.toString()}`
      );
      return false;
    } else {
      return true;
    }
  }
);

subtask(SUB_ADD_BRIDGE_TOKEN, "call addBridgeToken").setAction(
  async (taskArgs, env) => {
    const { cname, contractAddr, privateKey, bridgeTokenAddr } = taskArgs;
    // @ts-ignore
    const provider = new env.ethers.providers.JsonRpcProvider(
      env.network.config["url"]
    );
    const { abi } = await env.artifacts.readArtifact(cname);
    const wallet = new env.ethers.Wallet(privateKey, provider);
    const contractInst = await env.ethers.getContractAt(
      abi,
      contractAddr,
      wallet
    );

    console.log(`Start addBridgeToken...`);
    const { hash } = await contractInst.addBridgeToken(bridgeTokenAddr);
    console.log(`AddBridgeToken successfully at- ${hash}`);
  }
);

subtask(SUB_ENCODE_ABI, "encode abi").setAction(async (taskArgs, env) => {
  const { cname, functionName } = taskArgs;

  const { gravityId, vote_power, ethAddresses, powers } = await env.run(
    SUB_GET_INIT_DATA,
    taskArgs
  );

  const { abi } = await env.artifacts.readArtifact(cname);
  return new env.ethers.utils.Interface(abi).encodeFunctionData(functionName, [
    gravityId,
    vote_power,
    ethAddresses,
    powers,
  ]);
});

subtask(SUB_GET_OWNER, "get contract owner").setAction(
  async (taskArgs, env) => {
    const { cname, contractAddr, abi } = taskArgs;

    let instance: any;
    if (cname && !abi) {
      instance = await env.ethers.getContractAt(cname, contractAddr);
    } else if (!cname && abi) {
      instance = await env.ethers.getContractAt(abi, contractAddr);
    } else {
      throw new HardhatError(ERRORS.ARGUMENTS.UNRECOGNIZED_COMMAND_LINE_ARG);
    }

    return await instance.owner();
  }
);

subtask(
  SUB_CHECK_OWNER,
  "check contract owner is the same as the param owner"
).setAction(async (taskArgs, env) => {
  const { cname, contractAddr, checkedAddress, abi } = taskArgs;

  const token_owner = await env.run(SUB_GET_OWNER, {
    cname,
    abi,
    contractAddr,
  });

  if (checkedAddress !== token_owner) {
    console.log(`
                ${checkedAddress} is not the contract owner!
                ${contractAddr} owner is ${token_owner} now!
            `);
    return false;
  } else {
    return true;
  }
});

subtask(SUB_GET_ETH_BALANCE, "get eth balance").setAction(async (taskArgs) => {
  const { wallet } = taskArgs;
  return await wallet.getBalance();
});

subtask(SUB_CHECK_ETH_BALANCE, "check eth balance").setAction(
  async (taskArgs, env) => {
    const { wallet } = taskArgs;
    const eth_balance = env.run(SUB_GET_ETH_BALANCE, { wallet });
    if (eth_balance.toString() === "0") {
      console.log(`${wallet.address} eth balance is insufficient`);
      return false;
    } else {
      return eth_balance.toString();
    }
  }
);

subtask(SUB_FX_ADDR_TO_HEX, "fx address to hex").setAction(async (taskArgs) => {
  const { fxAddr } = taskArgs;

  const fxAddrBtc = bech32.fromWords(bech32.decode(fxAddr).words);
  const fxAddrBtcHex = Buffer.from(fxAddrBtc).toString("hex");
  return ("0x" + "0".repeat(24) + fxAddrBtcHex).toString();
});

subtask(SUB_BC_ADDR_TO_BSC, "bc address to hex").setAction(async (taskArgs) => {
  const { bcAddr } = taskArgs;

  const bcAddrBtc = bech32.fromWords(bech32.decode(bcAddr).words);
  return `0x${Buffer.from(bcAddrBtc).toString("hex")}`;
});

subtask(
  SUB_SEND_TRANSACTION,
  "verify should send transaction through which type"
).setAction(async (taskArgs, env) => {
  const { wallet, transaction } = taskArgs;

  // ledger special for bnb
  if (wallet?.path && wallet?.transport && wallet?.appEth) {
    return await env.run(SUB_SEND_TRAN_BY_LEDGER, { transaction, wallet });

    // keystore | privateKey | default account from hardhat.config.ts
  } else {
    return await env.run(SUB_SEND_TRAN_BY_NORMAL_APPROACH, {
      transaction,
      wallet,
    });
  }
});

subtask(SUB_GEN_CONTRACT_ADDR, "generate contract address").setAction(
  async (taskArgs, env) => {
    const { account } = taskArgs;

    const { provider } = await env.run(SUB_GET_PROVIDER);
    const nonce = await provider.getTransactionCount(account);
    return getContractAddress({
      from: account,
      nonce: nonce,
    });
  }
);

subtask(SUB_DEPLOY_CONTRACT_NEW, "deploy contract new ").setAction(
  async (taskArgs, env) => {
    const { cname, contractAddr, wallet, data, gasLimit } = taskArgs;

    const transaction = await env.run(SUB_CREATE_TRASACTION, {
      data,
      from: wallet.address,
      gasLimit,
    });

    console.log(`Start delploy ${cname}...`);
    const { hash } = await env.run(SUB_SEND_TRANSACTION, {
      transaction,
      wallet,
    });
    console.log(`Execuete succefully at - ${hash}`);
    console.log(`${cname} - ${contractAddr}`);
  }
);

subtask(SUB_FORMAT_TRANSACTION, "formate transaction").setAction(
  async (taskArgs, env) => {
    const { transaction } = taskArgs;
    console.log(
      chalk.green(`
    {
        chainId: ${transaction?.chainId}
        nonce: ${transaction?.nonce}
        gasLimit:: ${transaction?.gasLimit?.toString()}
        gasPrice: ${transaction?.gasPrice?.toString()}
        data: ${transaction?.data}
        value: ${transaction.value}
        from: ${transaction.from}
        to: ${transaction.to}
    }`)
    );
  }
);

subtask(SUB_CHECK_TRANSACTION_STATUS, "check transatcion status").setAction(
  async (taskArgs, env) => {
    const { transactionHash } = taskArgs;
    if (!transactionHash) return;

    const nodeUrl = await env.run(SUB_GET_ETH_NODE_URL);
    const provider = await new ethers.providers.JsonRpcProvider(nodeUrl);

    return new Promise((resolve, reject) => {
      let timer = setInterval(async () => {
        // const {status} = await provider.getTransactionReceipt(transactionHash) as any
        const res = (await provider.getTransactionReceipt(
          transactionHash
        )) as any;

        if (res && res.status === 1) {
          clearTimeout(timer);
          return resolve(true);
        }
      }, 1000);
    });
  }
);

subtask(SUB_CONFIRM_TRANSACTION, "comfirm transaction").setAction(
  async (taskArgs, env) => {
    const { message, disableConfirm = "false" } = taskArgs;
    let _answer;
    if (disableConfirm === "false") {
      const { answer } = await prompt({
        type: "confirm",
        name: "answer",
        message: message,
      });
      _answer = answer;
    } else {
      _answer = true;
    }

    return { answer: _answer };
  }
);

subtask(SUB_CHECK_BRIDGE_TOKEN, "check bridge token").setAction(
  async (taskArgs, env) => {
    const { proxyAddr, bridgeTokenAddr } = taskArgs;
    const instance = await env.ethers.getContractAt("FxBridgeLogic", proxyAddr);
    const isExit = await instance.checkAssetStatus(bridgeTokenAddr);
    return { isExit };
  }
);

subtask(SUB_LOG_EXECUTE_TXT).setAction(async (taskArgs, { run }) => {
  const { logerTxt } = taskArgs;
  await run(SUB_LOG_INFO, { logerTxt: `Execuete succefully at ${logerTxt}` });
});
