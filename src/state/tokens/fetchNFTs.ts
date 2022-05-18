import { MARKETPLACE_API_URL } from 'config/constants/misc'
import { isUndefined } from 'lodash'
import { Token } from 'state/types'

const fetchNFTs = async (chainId: number, tokenAddress?: string, userAddress?: string, tokenIds?: string[]): Promise<Record<string, Token>> => {
  let apiUri = `${MARKETPLACE_API_URL}/tokens/GetOwnedTokens/${chainId}`
  if (tokenAddress) apiUri += `/token-${tokenAddress}`
  if (userAddress) apiUri += `/user-${userAddress}`

  const response = await fetch(apiUri, {
    method: isUndefined(tokenIds) ? 'GET' : 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: isUndefined(tokenIds) ? undefined : JSON.stringify({ tokenIds })
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

export default fetchNFTs