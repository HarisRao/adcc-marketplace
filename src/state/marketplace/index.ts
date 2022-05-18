import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { cloneDeep, omit } from 'lodash'
import { MarketplaceState, Order } from '../types'

const initialState: MarketplaceState = {
  data: {},
  collectionData: {},
  isLoading: false,
}

export const propertiesSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    removeOrder: (state, action: PayloadAction<number>) => {
      const { data, collectionData } = state
      const order = state.data[action.payload]
      delete collectionData[order.subCollectionId]
      delete data[order.id]
    },
    itemsLoadStart: (state) => {
      return { ...state, isLoading: true }
    },
    itemsLoadSucceeded: (state, action: PayloadAction<Order[]>) => {
      if (!action.payload) return state
      const orders = action.payload?.map((order) => convertOrderObject(order)) ?? []
      return {
        ...state,
        isLoading: false,
        data: orders.reduce((data, val) => ({ ...data, [val.id]: val }), state.data),
        collectionData: orders.reduce(
          (data, val) => ({ ...data, [val.subCollectionId]: { ...data[val.subCollectionId], [val.id]: val } }),
          state.collectionData,
        ),
      }
    },
    itemsLoadFailed: (state, action: PayloadAction<string>) => {
      return { ...state, isLoading: false, loadingError: action.payload }
    },
  },
})

const convertOrderObject = (order: Order) => {
  const returnOrder = cloneDeep(order)
  returnOrder.dataObject = JSON.parse(returnOrder.data)
  returnOrder.assetDataObject = JSON.parse(returnOrder.assetData)
  returnOrder.mintDataObject = JSON.parse(returnOrder.mintData)
  returnOrder.counterAssetsObject = JSON.parse(returnOrder.counterAssets)
  return returnOrder
}

// Actions
export const { removeOrder, itemsLoadStart, itemsLoadSucceeded, itemsLoadFailed } = propertiesSlice.actions

export default propertiesSlice.reducer
