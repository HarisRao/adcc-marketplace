import tokens from "./tokens"

export const MARKETPLACE_API_URL = process.env.REACT_APP_MARKETPLACE_API_URL ?? `${window.location.origin}/api`
export const MARKETPLACE_URL = process.env.REACT_APP_MARKETPLACE_URL ?? `${window.location.origin}`
export const PSI_API_URL = process.env.REACT_APP_PSI_API_URL
export const ApplicationName = "Omni Marketplace"

export const NetworkContextName = 'NETWORK'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const PASSBASE_API_KEY = process.env.REACT_APP_PASSBASE_API_KEY

export const MARKETPLACE_TOKENS = [
  tokens.busd,
  tokens.usdc,
  tokens.btc,
  tokens.eth,
  tokens.bnb,
]