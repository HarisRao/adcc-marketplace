import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { isEmptyObject } from 'jquery'
import { isEmpty, isUndefined, merge } from 'lodash'
import { PropertyCollection, PropertiesState, Order, Token } from '../types'
import { convertMetadata, convertOrder } from './convertMetadata'

const initialState: PropertiesState = {
  data: {},
  collections: {},
  isLoading: false,
}

export const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    propertiesForTokens: (state, action: PayloadAction<Token[]>) => {
      const orderInfo: { [key: string]: PropertyCollection } = {}
      action?.payload?.forEach(async (token) => {
        Object.values(token?.nfts ?? {}).forEach((nft) => {
          if (nft.metadata) {
            const collectionId = parseInt(nft.tokenId.split('0000')[0])
            const tokenIdNumber = parseInt(nft.tokenId)
            if (isUndefined(state.data[tokenIdNumber])) {
              orderInfo[collectionId] = convertMetadata(collectionId, tokenIdNumber, nft.metadata)
            }
          }
        })
      })
      setCollectionToCurrentState(state, orderInfo)
    },
    propertiesForOrders: (state, action: PayloadAction<Order[]>) => {
      const orderInfo: { [key: string]: PropertyCollection } = {}
      action?.payload?.forEach(async (order) => {
        if (!isEmpty(order.mintData)) {
          if (isUndefined(state.data[parseInt(order.tokenId)])) {
            orderInfo[parseInt(order.subCollectionId)] = convertOrder(order)
          }
        } else {
          // todo, create based on metadata?
        }
      })
      setCollectionToCurrentState(state, orderInfo)
    },
  },
})

const setCollectionToCurrentState = (state: PropertiesState, orderInfo: { [key: string]: PropertyCollection }) => {
  if (!orderInfo || isEmptyObject(orderInfo)) return
  // eslint-disable-next-line no-param-reassign
  state.data = Object.values(orderInfo).reduce((props, value) => ({ ...props, ...value.properties }), state.data)
  // eslint-disable-next-line no-param-reassign
  state.collections = merge(state.collections, orderInfo)
}

// Actions
export const { propertiesForTokens, propertiesForOrders } =
  propertiesSlice.actions

export default propertiesSlice.reducer
