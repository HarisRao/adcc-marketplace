import ERC20Abi from 'config/abi/ERC20.json'
import ERC721EnumerableAbi from 'config/abi/ERC721Enumerable.json'
import { first, toFinite } from 'lodash'
import { Token, TokenType } from 'state/types'
import { toBigNumber, toBool } from 'utils/converters'
import { Call, nestedMulticall } from 'utils/multicall'

export const fetchTokens = async (
  tokenAddresses: string[],
  account?: string,
  spender?: string,
): Promise<Token[]> => {
  if (!tokenAddresses) return []

  const nestedCalls: Call[][] = tokenAddresses.map((tokenAddress) => {
    const calls: Call[] = []
    calls.push({ address: tokenAddress, name: 'name' })
    calls.push({ address: tokenAddress, name: 'symbol' })
    calls.push({ address: tokenAddress, name: 'decimals' })
    calls.push({ address: tokenAddress, name: 'totalSupply' })

    if (account) {
      calls.push({ address: tokenAddress, name: 'balanceOf', params: [account] })
      if (spender) calls.push({ address: tokenAddress, name: 'allowance', params: [account, spender] })
    }
    return calls
  })

  const tokensData = await nestedMulticall(ERC20Abi, nestedCalls)

  return tokensData?.reduce((result: Token[], tokenData: any[], idx: number) => {
    const token: Token = {
      type: TokenType.ERC20,
      address: tokenAddresses[idx].toLowerCase(),
      name: tokenData[0],
      symbol: tokenData[1],
      decimals: toFinite(tokenData[2]),
      totalSupply: toBigNumber(tokenData[3]),
    }
    if (account) token.accountBalance = toBigNumber(tokenData[4])
    if (account && spender) token.approvals = { ...token.approvals, [spender]: toBigNumber(tokenData[5]) }
    else token.approvals = {}
    return [...result, token]
  }, [])
}

export const fetchToken = async (tokenAddress: string, account?: string, spender?: string): Promise<Token> => {
  const tokens = await fetchTokens([tokenAddress], account, spender)
  return first(tokens)
}

export const fetchERC721Tokens = async (
  tokenAddresses: string[],
  account?: string,
  spender?: string,
): Promise<Token[]> => {
  if (!tokenAddresses) return []

  const nestedCalls: Call[][] = tokenAddresses.map((tokenAddress) => {
    const calls: Call[] = []
    calls.push({ address: tokenAddress, name: 'name' })
    calls.push({ address: tokenAddress, name: 'symbol' })
    calls.push({ address: tokenAddress, name: 'totalSupply' })

    if (account) {
      calls.push({ address: tokenAddress, name: 'balanceOf', params: [account] })
      if (spender) calls.push({ address: tokenAddress, name: 'isApprovedForAll', params: [account, spender] })
    }
    return calls
  })

  const tokensData = await nestedMulticall(ERC721EnumerableAbi, nestedCalls)

  return tokensData?.reduce((result: Token[], tokenData: any[], idx: number) => {
    const token: Token = {
      type: TokenType.ERC721,
      address: tokenAddresses[idx].toLowerCase(),
      name: tokenData[0],
      symbol: tokenData[1],
      totalSupply: toBigNumber(tokenData[2]),
    }
    if (account) token.accountBalance = toBigNumber(tokenData[3])
    if (account && spender) token.approvalForAll = { ...token.approvalForAll, [spender]: toBool(tokenData[4]) }
    else token.approvalForAll = {}
    return [...result, token]
  }, [])
}

export const fetchERC721Token = async (tokenAddress: string, account?: string, spender?: string): Promise<Token> => {
  const tokens = await fetchERC721Tokens([tokenAddress], account, spender)
  return first(tokens)
}

export const fetchERC1155Tokens = async (
  tokenAddresses: string[],
  account?: string,
  spender?: string,
): Promise<Token[]> => {
  if (!tokenAddresses) return []

  const nestedCalls: Call[][] = tokenAddresses.map((tokenAddress) => {
    const calls: Call[] = []
    calls.push({ address: tokenAddress, name: 'name' })

    if (account && spender) calls.push({ address: tokenAddress, name: 'isApprovedForAll', params: [account, spender] })
    return calls
  })

  const tokensData = await nestedMulticall(ERC721EnumerableAbi, nestedCalls)

  return tokensData?.reduce((result: Token[], tokenData: any[], idx: number) => {
    const token: Token = {
      type: TokenType.ERC1155,
      address: tokenAddresses[idx].toLowerCase(),
      name: tokenData[0],
    }
    if (account && spender) token.approvalForAll = { ...token.approvalForAll, [spender]: toBool(tokenData[1]) }
    else token.approvalForAll = {}
    return [...result, token]
  }, [])
}

export const fetchERC1155Token = async (tokenAddress: string, account?: string, spender?: string): Promise<Token> => {
  const tokens = await fetchERC1155Tokens([tokenAddress], account, spender)
  return first(tokens)
}