/**
 * sub task name
 **/
export const GET_CONTRACT_FACTORY: string  = 'get_contract_factory'
export const GET_CONTRACT_ARTIFACTS: string  = 'get_contract_artifacts'
export const SUB_DEPLOY_CONTRACT_WITHOUT_PARAM: string  = 'deploy_contract'
export const SUB_APPROVE: string  = 'sub:approve'
export const SUB_CHECK_APPROVE: string  = 'sub:check_approve'
export const SUB_TRANSFER: string  = 'sub:transfer'
export const SUB_ADD_BRIDGE_TOKEN: string  = 'sub:add-bridge-token'
export const SUB_GET_PRIVATE_FROM_KEY_STORE: string  = 'sub:get-private-key-from-key-store'
export const SUB_GET_INIT_DATA: string  = 'sub:get-init-data'
export const SUB_ENCODE_ABI: string  = 'sub:encode-abi'
export const SUB_GEN_WALLET: string  = 'sub:generate-wallet'
export const SUB_DEPLOY_CONTRACT: string  = 'sub:deploy-contract'
export const SUB_GET_ETH_NODE_URL: string  = 'sub:get-eth-node-url'
export const SUB_CHECK_PRIVATEKEY: string  = 'sub:check-privatekey'
export const SUB_GET_OWNER: string  = 'sub:get-owner'
export const SUB_CHECK_OWNER: string  = 'sub:check-owner'
export const SUB_GET_ETH_BALANCE: string  = 'sub:get-eth-balance'
export const SUB_CHECK_ETH_BALANCE: string  = 'sub:check-eth-balance'
export const SUB_FX_ADDR_TO_HEX: string  = 'sub:fx-addr-to-hex'
export const SUB_GET_PROVIDER: string  = 'sub:get-provider'
export const SUB_GET_SINGNED_TX: string  = 'sub:get-signed-tx'
export const SUB_FIX_SIGNATURE: string  = 'sub:fx-signature'
export const SUB_GET_UNSIGNED_TX: string  = 'sub:get-unsigned-tx'
export const SUB_SIGN_WITH_LEDGER: string  = 'sub:sign-with-ledger'
export const SUB_CREATE_TRASACTION: string  = 'sub:create-transaction'
export const SUB_CREATE_LEDER_WALLET: string  = 'sub:create-ledger-wallet'
export const SUB_SEND_TRAN_BY_LEDGER: string  = 'sub:send-transaction-by-ledger'
export const SUB_SEND_TRAN_BY_NORMAL_APPROACH: string  = 'sub:send-transaction-by-normal-approach'
export const SUB_SEND_TRANSACTION: string  = 'sub:send-transaction'
export const SUB_GEN_CONTRACT_ADDR: string  = 'sub:generate-contract-address'
export const SUB_DEPLOY_CONTRACT_NEW: string  = 'sub:deploy-contract-new'
export const SUB_FORMAT_TRANSACTION: string  = 'sub:format-transaction'
export const SUB_CHECK_TRANSACTION_STATUS: string  = 'sub:check-transaction-status'
export const SUB_CONFIRM_TRANSACTION: string  = 'sub:confirm-transaction'
export const SUB_CHECK_BRIDGE_TOKEN: string  = 'sub:check-bridge-token'
export const SUB_BC_ADDR_TO_BSC: string  = 'sub:bc-addr-to-bsc'
export const SUB_LOG_EXECUTE_TXT: string  = 'sub:sub-log-execute-txt'
export const SUB_LOG_INFO: string  = 'sub:sub-log-info'

/**
 * flag name
 * warning: Param names must be camelCase
 **/
export const CNAME_FLAG: string  = 'cname' // contract name
export const RECEIVER_FLAG: string = 'receiver'
export const OWNER_ADDR_FLAG: string = 'ownerAddr'
export const AMOUNT_FLAG: string = 'amount'
export const KEY_STORE_FILE_PATH: string = 'keystorefilepath'
export const FX_NODE_URL_FLAG: string = 'fxNodeUrl'
export const FUNC_NAME_FLAG: string = 'functionName'
export const IS_GET_INIT_DATA_FLAG: string = 'isGetInitData'
export const DEPLOY_PRIVATE_KEY: string = 'deployPrivateKey'
export const IS_LEDGER: string = 'isLedger'
export const DRIVER_PATH: string = 'driverPath'
export const TRANSACTION_HASH: string = 'transactionHash'
export const DISABLE_CONFIRM_FLAG: string = 'disableConfirm'
export const TOKEN_ADDR_FLAG:string = 'tokenAddr'
export const MNEMONIC_FLAG: string = 'mnemonic'
export const ACCOUNT_ADDR_FLAG: string = 'accountAddr'
export const CONTRACT_ADDR_FLAG: string = 'contractAddr'
export const SPENDER_ADDR_FLAG: string = 'spenderAddr'
export const NAME_FLAG: string = 'name'
export const SYMBOL_FLAG: string = 'symbol'
export const ETH_ADDR_FLAG: string = 'ethAddr'
export const FX_CORE_ADDR_FLAG: string = 'fxCoreAddr'
export const DATA_FLAG = 'data'
export const ID_FLAG = 'id'
export const CALLER_FLAG = 'caller'
export const EVM_TYPE_FLAG = 'evmType'
export const SINGER_FLAG = 'singer'
export const NEW_ADDR_FLAG = 'newAddr'
export const PROXY_ADDR_FLAG = 'proxyAddr'
export const ADMIN_ADDR_FLAG = 'adminAddr'
export const CHIP_ADDR_FLAG = 'chipAddr'
export const ORACLE_ADDR_FLAG = 'orcaleAddr'
export const UNDERLYING_NAME_FLAG = 'underlyingName'
export const INDEX_FLAG = 'index'
export const TARGET_NAME_FLAG = 'targetName'
export const LOGIC_ADDR_FLAG = 'logicAddr'
export const TARGET_BYT32_FLAG = 'targetByte32'
export const UUPS_BYTECODE_FLAG = 'uupsBytecode'
export const BET_NAME = 'betName'
export const COUNTER_FLAG = 'counter'
export const START_PRICE_FLAG = 'startPrice'
export const DATELINE_FLAG = 'dateline'
export const END_TIME_FLAG = 'endTime'
export const PRICE_FALG = 'price'



// uups
export const LOGIC_CONTRACT_ADDR_FLAG: string = 'logicContractAddr'
export const PROXY_INIT_BYTE_FLAG: string = 'proxyInitData'

// evm
export const NUM_FLAG: string = 'num'

// evm
export const PREFIX_FLAG: string = 'prefix'


/**
 * constant variable
 */

export const CONTRACT_NAME =  {
    'ERC1967Proxy': 'ERC1967Proxy',
    'TestERC20': 'TestERC20',
    'TestBEP20Token': 'TestBEP20Token',
    'BurnToken': 'BurnToken',
    'TestSixDecimalERC20': 'TestSixDecimalERC20',
    'Bet': 'Bet',
    'Oracle': 'Oracle',
    'BetManager': 'BetManager',
}

export const DEFAULT_DRIVE_PATH = "44'/60'/0'/0/0" // ledger live
export const RPOMPT_CHECK_TRANSACTION_DATA = 'Do you want continue?'
