import { Web3Provider } from '@ethersproject/providers'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

// Addresses
import {
  getNaaSAddress,
  getExchangeAddress,
  getCreatorsRegistryAddress,
  getProxyRegistryAddress,
  getRoyaltiesRegistryAddress,
  getNaasStaticAddress,
  getAtomicizerAddress,
  getTokenAddress,
  getStakingAddress
} from 'utils/addressHelpers'

// ABI
import ERC20Abi from 'config/abi/ERC20.json'
import ERC721EnumerableAbi from 'config/abi/ERC721Enumerable.json'
import IERC777Abi from 'config/abi/IERC777.json'
import IERC1155Abi from 'config/abi/IERC1155.json'
import NaaSAbi from 'config/abi/NaaS.json'
import NaaSExchangeAbi from 'config/abi/NaaSExchange.json'
import NaaSStaticAbi from 'config/abi/NaaSStatic.json'
import NaaSAtomicizerAbi from 'config/abi/NaaSAtomicizer.json'
import CreatorsRegistryAbi from 'config/abi/CreatorsRegistry.json'
import PSIProxyRegistryAbi from 'config/abi/PSIProxyRegistry.json'
import RoyaltiesRegistryAbi from 'config/abi/RoyaltiesRegistry.json'
import StakingPoolAbi from 'config/abi/StakingPool.json'

// Types
import {
  ERC20,
  ERC721Enumerable,
  IERC777,
  IERC1155,
  NaaS,
  NaaSExchange,
  NaaSStatic,
  NaaSAtomicizer,
  CreatorsRegistry,
  PSIProxyRegistry,
  RoyaltiesRegistry,
  StakingPool,
} from 'config/types'
import { TokenConfig } from 'config/constants/tokens'

const getContract = (address: string, abi: ContractInterface, signerOrProvider?: Web3Provider | Signer) => {
  return new Contract(address, abi, signerOrProvider)
  // const _web3 = web3 ?? web3NoAccount
  // return new _web3.eth.Contract(abi as unknown as AbiItem, address) as unknown as BaseContract
}

export const getTokenContract = (token: TokenConfig, signerOrProvider?: Web3Provider | Signer) => {
  const address = getTokenAddress(token)
  return getERC20Contract(address, signerOrProvider)
}
export const getERC20Contract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, ERC20Abi, signerOrProvider) as ERC20
}
export const getERC721Contract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, ERC721EnumerableAbi, signerOrProvider) as ERC721Enumerable
}

export const getERC777Contract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, IERC777Abi, signerOrProvider) as IERC777
}
export const getERC1155Contract = (address: string, signerOrProvider?: Web3Provider | Signer) => {
  return getContract(address, IERC1155Abi, signerOrProvider) as IERC1155
}

export const getNaaSContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getNaaSAddress(), NaaSAbi, signerOrProvider) as NaaS
}
export const getExchangeContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getExchangeAddress(), NaaSExchangeAbi, signerOrProvider) as NaaSExchange
}
export const getNaaSStaticContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getNaasStaticAddress(), NaaSStaticAbi, signerOrProvider) as NaaSStatic
}
export const getAtomicizerContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getAtomicizerAddress(), NaaSAtomicizerAbi, signerOrProvider) as NaaSAtomicizer
}
export const getProxyRegistryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getProxyRegistryAddress(), PSIProxyRegistryAbi, signerOrProvider) as PSIProxyRegistry
}
export const getCreatorsRegistryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getCreatorsRegistryAddress(), CreatorsRegistryAbi, signerOrProvider) as CreatorsRegistry
}
export const getRoyaltiesRegistryContract = (signerOrProvider?: Web3Provider | Signer) => {
  return getContract(getRoyaltiesRegistryAddress(), RoyaltiesRegistryAbi, signerOrProvider) as RoyaltiesRegistry
}
export const getStakingContract = (signerOrProvider?: Web3Provider | Signer) => {
  console.log("getting contract", signerOrProvider)
  return getContract(getStakingAddress(), StakingPoolAbi as any, signerOrProvider) as StakingPool
}
