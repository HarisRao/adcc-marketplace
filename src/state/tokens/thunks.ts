import { toastError } from 'state/toasts'
import { isNil, isUndefined } from 'lodash'
import { AppDispatch, RootState } from '../store'
import { Token, TokenType } from '../types'
import { tokenLoadStart, tokensLoadSucceeded, tokenLoadFailed } from '.'
import {
  fetchToken,
  fetchTokens,
  fetchERC721Token,
  fetchERC721Tokens,
  fetchERC1155Token,
  fetchERC1155Tokens,
} from './fetchTokens'
import fetchNFTs from './fetchNFTs'

// Thunks

export const getToken =
  (chainId: number, tokenAddress: string, type = TokenType.ERC20, account?: string, spender?: string, refresh = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentToken = getState()?.tokens?.data[tokenAddress?.toLowerCase()]
    const approvals = currentToken?.approvals ?? currentToken?.approvalForAll
    if (currentToken && !refresh && !(spender && (!approvals || isUndefined(approvals[spender])))) return

    try {
      dispatch(tokenLoadStart())
      const token: Token =
        type === TokenType.ERC721
          ? await fetchERC721Token(tokenAddress, account, spender)
          : type === TokenType.ERC1155
          ? await fetchERC1155Token(tokenAddress, account, spender)
          : await fetchToken(tokenAddress, account, spender)

          dispatch(tokensLoadSucceeded({ chainId, tokens: [token] }))
    } catch (error: any) {
      dispatch(toastError('Error retrieving token data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }

export const getTokens =
  (chainId: number, tokenAddresses: string[], type = TokenType.ERC20, account?: string, spender?: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const tokensToGet = tokenAddresses?.filter((t) => isNil(getState()?.tokens?.data[t?.toLowerCase()]))
    if (!tokensToGet) return

    try {
      dispatch(tokenLoadStart())

      const tokens: Token[] =
        // eslint-disable-next-line no-nested-ternary
        type === TokenType.ERC721
          ? await fetchERC721Tokens(tokensToGet, account, spender)
          : type === TokenType.ERC1155
          ? await fetchERC1155Tokens(tokensToGet, account, spender)
          : await fetchTokens(tokensToGet, account, spender)

      dispatch(tokensLoadSucceeded({ chainId, tokens }))
    } catch (error: any) {
      dispatch(toastError('Error retrieving tokens data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }

export const getNFTs =
  (chainId: number, tokenAddress?: string, userAddress?: string, tokenIds?: string[], refresh = false) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    const currentToken = (getState()?.tokens?.data[chainId] || {})[tokenAddress?.toLowerCase()]
    const currentIds = tokenIds ? tokenIds.map(id => currentToken?.nfts[id]) : []
    if (currentToken && (!tokenIds || currentIds.length === tokenIds.length) && !refresh) return

    try {
      dispatch(tokenLoadStart())

      const tokens = await fetchNFTs(chainId, tokenAddress, userAddress, tokenIds)

      dispatch(tokensLoadSucceeded({ chainId, tokens: Object.values(tokens) }))
    } catch (error: any) {
      dispatch(toastError('Error retrieving tokens data', error?.message))
      dispatch(tokenLoadFailed(error?.message))
    }
  }
