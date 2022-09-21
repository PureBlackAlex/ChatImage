/**
 * sub task name
 **/
export const GET_CONTRACT_FACTORY: string  = 'get_contract_factory'
export const GET_CONTRACT_ARTIFACTS: string  = 'get_contract_artifacts'
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
export const KEY_STORE_FILE_PATH: string = 'keystorefilepath'
export const DEPLOY_PRIVATE_KEY: string = 'deployPrivateKey'
export const IS_LEDGER: string = 'isLedger'
export const DRIVER_PATH: string = 'driverPath'
export const DISABLE_CONFIRM_FLAG: string = 'disableConfirm'
export const ACCOUNT_ADDR_FLAG: string = 'accountAddr'
export const CONTRACT_ADDR_FLAG: string = 'contractAddr'


// c98
export  const  COIN98_DEPLOY :string = 'coin98-deploy'

//chatimage
export const  CHATIMAGE_DEPLOY :string = 'chatimage-deploy'
export const  CHATIMAGE_SAFEMINT :string = 'chatimage-safemint'
export const  NFTURL :string = 'nfturl'
/**
 * constant variable
 */

export const CONTRACT_NAME =  {
    'ChatImage': 'ChatImage',
    'Coin98': 'Coin98',
}

export const DEFAULT_DRIVE_PATH = "44'/60'/0'/0/0" // ledger live
export const RPOMPT_CHECK_TRANSACTION_DATA = 'Do you want continue?'
