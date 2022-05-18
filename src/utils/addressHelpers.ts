import addresses from 'config/constants/contracts'
import { TokenConfig } from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
  const mainNetChainId = 56
  const chainId = process.env.REACT_APP_CHAIN_ID
  if (!address) return null
  return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getTokenAddress = (tokenConfig: TokenConfig) => {
  return getAddress(tokenConfig.address)
}
export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall)
}
export const getNaaSAddress = () => {
  return getAddress(addresses.naas)
}
export const getProxyRegistryAddress = () => {
  return getAddress(addresses.proxyRegistry)
}
export const getCreatorsRegistryAddress = () => {
  return getAddress(addresses.creatorsRegistry)
}
export const getRoyaltiesRegistryAddress = () => {
  return getAddress(addresses.royaltiesRegistry)
}
export const getAtomicizerAddress = () => {
  return getAddress(addresses.atomicizer)
}
export const getNaasStaticAddress = () => {
  return getAddress(addresses.naasStatic)
}
export const getExchangeAddress = () => {

  return getAddress(addresses.exchange)
}
export const getStakingAddress = () => {
  return getAddress(addresses.staking)
}