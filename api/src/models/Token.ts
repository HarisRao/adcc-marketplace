/* eslint-disable camelcase */
import { BigNumberish } from "@ethersproject/bignumber";

export enum TokenType {
  UNKOWN = "UNKOWN",
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC777 = "ERC777",
  ERC1155 = "ERC1155",
}

export interface Token {
  address: string
  name: string
  symbol?: string // ERC1155 does not have a symbol in most cases
  decimals?: number
  totalSupply?: BigNumberish
  type: TokenType
  accountBalance?: BigNumberish
  approvals?: { [spender: string]: BigNumberish }
  approvalForAll?: { [spender: string]: boolean }

  ownersNfts?: Record<string, string[]>
  nfts?: Record<string, NFT>
}

export interface NFT {
  tokenId: string
  owner: string
  amount?: BigNumberish
  uri?: string
  metadata?: TokenMetadata
}

export interface TokenMetadata {
  name: string
  description?: string
  image?: string
  image_data?: string // Raw SVG image data
  external_url?: string
  background_color?: string
  animation_url?: string
  youtube_url?: string
  attributes?: MetadataAttribute[]
  properties?: Record<string, string | number | string[] | number [] | MetadataProperty>
}

export interface CachedTokenMetadata {
  originUrl: string
  lastSynced: number
  metadata?: TokenMetadata
}

export interface MetadataAttribute {
  display_type?: string, 
  trait_type?: string, 
  value: string | number | string[] | number []
}

export interface MetadataProperty {
  name: string,
  value: string | number | string[] | number [],
  display_value?: string | number | string[] | number [],
  class?: string,
  css?: any,
  [key: string]: any
}