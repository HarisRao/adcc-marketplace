import { BigNumberish } from "@ethersproject/bignumber";

export interface MintDataUser {
  account: string
  value: BigNumberish
}

export interface MintData {
  minter: string,
  id: BigNumberish,
  uri: string,
  supply: BigNumberish,
  collectionId: BigNumberish,
  collectionUri: string,
  creators: MintDataUser[],
  royalties: MintDataUser[],
  signatures: string[],
}