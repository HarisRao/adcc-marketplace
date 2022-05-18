import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumberish } from '@ethersproject/bignumber'
import { id } from '@ethersproject/hash'
import { MintData } from 'config/types/MintData'
import { isUndefined } from 'lodash'

export const ETH_ASSET_CLASS = id('ETH').substring(0, 10)
export const ERC20_ASSET_CLASS = id('ERC20').substring(0, 10)
export const ERC721_ASSET_CLASS = id('ERC721').substring(0, 10)
export const ERC1155_ASSET_CLASS = id('ERC1155').substring(0, 10)
export const ERC1155_LAZY_ASSET_CLASS = id('ERC1155_LAZY').substring(0, 10)

export enum AssetClass {
  ETH,
  ERC20,
  ERC721,
  ERC1155,
  ERC1155_LAZY, // uses lazy mint from NaaS contract
}

export interface AssetData {
  assetClass: string
  data: string
  value: BigNumberish
}

export const getAssetClass = (assetClass: AssetClass) => {
  switch (assetClass) {
    case AssetClass.ETH:
      return ETH_ASSET_CLASS
    case AssetClass.ERC20:
      return ERC20_ASSET_CLASS
    case AssetClass.ERC721:
      return ERC721_ASSET_CLASS
    case AssetClass.ERC1155:
      return ERC1155_ASSET_CLASS
    case AssetClass.ERC1155_LAZY:
      return ERC1155_LAZY_ASSET_CLASS
    default:
      throw new Error('AssetClass not supported')
  }
}

export const getETHAssetData = (price: BigNumberish): AssetData => {
  return { assetClass: ETH_ASSET_CLASS, data: '0x', value: price }
}
export const getERC20AssetData = (tokenAddress: string, price: BigNumberish): AssetData => {
  const data = defaultAbiCoder.encode(['address'], [tokenAddress])
  return { assetClass: ERC20_ASSET_CLASS, data, value: price }
}
export const getERC721AssetData = (tokenAddress: string, _id: BigNumberish): AssetData => {
  const data = defaultAbiCoder.encode(['address', 'uint256'], [tokenAddress, _id])
  return { assetClass: ERC721_ASSET_CLASS, data, value: 1 }
}
export const getERC1155AssetData = (tokenAddress: string, _id: BigNumberish, amount?: BigNumberish): AssetData => {
  const data = defaultAbiCoder.encode(['address', 'uint256'], [tokenAddress, _id])
  return { assetClass: ERC1155_ASSET_CLASS, data, value: !isUndefined(amount) ? amount : 1 }
}
export const getERC1155MintAssetData = (tokenAddress: string, mintData: MintData, amount?: BigNumberish): AssetData => {
  const part = 'tuple(address account,uint256 value)[]'
  const mintType = `tuple(address minter,uint256 id,string uri,uint256 supply,uint256 collectionId,string collectionUri,${part} creators,${part} royalties,bytes[] signatures)`
  const data = defaultAbiCoder.encode(['address', mintType], [tokenAddress, mintData])
  return { assetClass: ERC1155_LAZY_ASSET_CLASS, data, value: !isUndefined(amount) ? amount : 1 }
}
