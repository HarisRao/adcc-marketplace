import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Token, TokensState } from '../types'

const initialState: TokensState = {
  data: {},
  isLoading: false,
}

export const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    tokenLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    tokensLoadSucceeded: (state, action: PayloadAction<{ chainId: number, tokens: Token[] }>) => {
      if (!action.payload) return state
      let chainData = state.data[action.payload?.chainId] ?? {}
      chainData = action.payload?.tokens?.reduce((data, val) => ({ ...data, [val.address.toLowerCase()]: val }), chainData)
      return {
        ...state,
        isLoading: false,
        data: { ...state.data, [action.payload?.chainId]: chainData }
      }
    },
    tokenLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
  },
})

// Actions
export const { tokenLoadStart, tokensLoadSucceeded, tokenLoadFailed } =
  tokensSlice.actions

export default tokensSlice.reducer
