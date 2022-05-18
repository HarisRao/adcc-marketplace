import { toastError } from 'state/toasts'
import { AppDispatch, RootState } from '../store'
import { itemsLoadStart, itemsLoadSucceeded, itemsLoadFailed } from '.'
import { getOrders, getOrder } from './getOrders'

// Thunks

export const getMarketplaceOrders =
  (chainId?: number, fromUserOnly?: boolean, collectionIds?: string[], tokenIds?: string[]) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const finalChainId = chainId && chainId > 0 ? chainId : parseInt(process.env.REACT_APP_CHAIN_ID)
      const accessToken = getState().user?.accessToken
      dispatch(itemsLoadStart())
      const orders = await getOrders(finalChainId, accessToken, fromUserOnly, collectionIds, tokenIds)
      dispatch(itemsLoadSucceeded(orders))
    } catch (error: any) {
      dispatch(toastError('Error retrieving marketplace orders', error?.message))
      dispatch(itemsLoadFailed(error?.message))
    }
  }

export const getMarketplaceOrder =
  (chainId: number, orderId: number) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const finalChainId = chainId && chainId > 0 ? chainId : parseInt(process.env.REACT_APP_CHAIN_ID)
      const accessToken = getState().user?.accessToken
      dispatch(itemsLoadStart())
      const order = await getOrder(finalChainId, orderId, accessToken)
      dispatch(itemsLoadSucceeded([order]))
    } catch (error: any) {
      console.error('toast')
      dispatch(toastError('Error retrieving marketplace order', error?.message))
      dispatch(itemsLoadFailed(error?.message))
    }
  }
