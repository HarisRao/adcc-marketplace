export const { MoralisServerUrl, MoralisAppId, MoralisApiSecret, BlobStorageConnectionString } = process.env

export enum SupportedChainId {
  BSCMAINNET = 56,
  BSCTESTNET = 97,
}

export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = Object.values(SupportedChainId) as SupportedChainId[]

export const rpcUrls: { readonly [chainId: number]: string } = SUPPORTED_CHAIN_IDS.reduce((val, chainId) => {
  return { ...val, [chainId]: process.env[`RPC_URL_${chainId}`] }
}, {})
