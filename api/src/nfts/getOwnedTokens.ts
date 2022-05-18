import fetch from 'cross-fetch'
import { utils } from 'ethers'
import { isUndefined, isEmpty } from 'lodash'
import { TokenType, Token, TokenMetadata, CachedTokenMetadata, NFT } from '../models/Token'
import { getMetadataFromBlob, uploadMetadataToBlob } from '../storage/blobStorage'
import getMoralis from './getMoralis'

const getOwnedTokens = async (
  chainId: number,
  tokenAddress: string,
  owner: string,
  tokenIds?: string[],
): Promise<Record<string, Token>> => {
  try {
    const nfts = await getNFTs(chainId, tokenAddress, owner)
    if (nfts?.result) {
      let tokens: Record<string, Token> = {}
      tokens = nfts.result.reduce((val, result) => {
        if (!isUndefined(tokenIds) && !tokenIds.some((id) => id?.toLowerCase() === result.token_id?.toLowerCase()))
          return val

        const token = result.token_address.toLowerCase()
        const ownerOf = result.owner_of.toLowerCase()
        const retVal = { ...val }
        if (!retVal[token]) {
          retVal[token] = {
            name: result.name,
            symbol: result.symbol,
            address: result.token_address,
            type: getContractType(result.contract_type),
          }
        }

        if (result.token_id) {
          retVal[token].ownersNfts = {
            [ownerOf]: [...((retVal[token].ownersNfts ?? {})[ownerOf] ?? []), result.token_id?.toLowerCase()],
          }
          retVal[token].nfts = {
            ...retVal[token].nfts,
            [result?.token_id?.toLowerCase()]: {
              owner: result.owner_of,
              tokenId: result.token_id,
              amount: result.amount,
              uri: getTokenUri(result.token_uri),
            },
          }
        }
        return retVal
      }, tokens)

      await Promise.all(Object.values(tokens).map((token) => ensureMetadata(token)))

      return tokens
    }
  } catch (err) {
    console.error(err)
  }
  return {}
}

const getNFTs = async (chainId: number, tokenAddress: string, owner: string) => {
  const Moralis = await getMoralis()
  const web3Client = Moralis.Web3API

  if (tokenAddress && owner) {
    return web3Client.account.getNFTsForContract({
      chain: `0x${chainId.toString(16)}` as any,
      address: utils.getAddress(owner),
      token_address: utils.getAddress(tokenAddress),
      order: 'token_id.DESC',
    })
  }
  if (tokenAddress) {
    return web3Client.token.getNFTOwners({
      chain: `0x${chainId.toString(16)}` as any,
      address: utils.getAddress(tokenAddress),
      order: 'token_id.DESC',
    })
  }
  if (owner) {
    return web3Client.account.getNFTs({
      chain: `0x${chainId.toString(16)}` as any,
      address: utils.getAddress(owner),
      order: 'token_id.DESC',
    })
  }
  throw new Error('tokenAddress or owner has to be supplied')
}

const getContractType = (contractType: string) => {
  if (contractType?.toLowerCase() === 'erc1155') return TokenType.ERC1155
  if (contractType?.toLowerCase() === 'erc721') return TokenType.ERC721
  return TokenType.UNKOWN
}

const getTokenUri = (uri?: string) => {
  if (isUndefined(uri)) return uri
  const ipfsIdx = uri?.toLowerCase().indexOf('ipfs://')
  if (ipfsIdx !== -1) return uri.substring(ipfsIdx)
  return uri
}

const ensureMetadata = async (token: Token) => {
  if (isEmpty(token.address)) return
  const allMetadata = await loadCachedMetadata(token.address.toLowerCase())

  let changed = false
  const promises = Object.values(token?.nfts ?? {}).map(async (tokenId) => {
    if (!tokenId.uri) return

    try {
      let cachedData: CachedTokenMetadata | undefined = allMetadata[tokenId.tokenId.toLowerCase()]
      if (!cachedData || tokenId.uri.toLowerCase() !== cachedData.originUrl.toLowerCase()) {
        cachedData = {
          metadata: await loadMetadata(tokenId.uri),
          lastSynced: new Date().getTime(),
          originUrl: tokenId.uri.toLowerCase(),
        }

        allMetadata[tokenId.tokenId.toLowerCase()] = cachedData
        changed = true
      }

      // eslint-disable-next-line no-param-reassign
      tokenId.metadata = cachedData?.metadata
    } catch (err) {
      console.error(err)
    }
  })
  await Promise.all(promises)

  if (changed) await uploadMetadataToBlob(token.address.toLowerCase(), JSON.stringify(allMetadata))
}

const loadCachedMetadata = async (address: string) => {
  try {
    const metadataString = await getMetadataFromBlob(address)
    if (metadataString) return JSON.parse(metadataString) as Record<string, CachedTokenMetadata>
  } catch (err) {
    console.error(err)
  }
  return {}
}

const loadMetadata = async (uri: string): Promise<TokenMetadata | undefined> => {
  try {
    let finalUri = uri
    if (uri?.toLowerCase().startsWith('ipfs://')) finalUri = `https://ipfs.infura.io/ipfs/${uri.substring(7)}`
    else if (uri?.toLowerCase().startsWith('ipfs:/')) finalUri = `https://ipfs.infura.io/ipfs/${uri.substring(6)}`
    const response = await fetch(finalUri)
    if (!response.ok) {
      console.error(`${response.status} = ${response.statusText}`)
    } else {
      return await response.json()
    }
  } catch (err) {
    console.error(err)
  }
  return undefined
}

export default getOwnedTokens
