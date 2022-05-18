import { useCallback, useEffect, useMemo, useState } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import moment from 'moment'
import { createSelector } from 'reselect'
import { cloneDeep, isEmpty, isObject, isUndefined } from 'lodash'
import Web3 from 'web3'
import { BigNumberish, Contract } from 'ethers'
import { useActiveWeb3React } from 'hooks/web3'
import { useCancelExchangeOrder, useCreateNewOrder, useCreateOrder, useTakeOrder } from 'hooks/useExchange'
import { addOrder, deleteOrder, fulFillOrder, incrementId } from 'utils/apiHelper'
import { getNaaSAddress, getTokenAddress } from 'utils/addressHelpers'
import { addPropertyToIPFS } from 'utils/ipfs'
import configTokens, { TokenConfig } from 'config/constants/tokens'
import { AppDispatch, RootState } from './store'
import { Toast } from '../components/Toast'
import {
  push as pushToast,
  remove as removeToast,
  clear as clearToast,
  propertiesForTokens,
  propertiesForOrders,
} from './actions'
import { loadLoggedInUser, loginWallet, updateUser } from './user/thunks'
import { Order, Property, PropertyCreationInformation, Token, TokenType, User } from './types'
import { toastError, toastInfo, toastSuccess, toastWarning } from './toasts'
import { getNFTs, getToken, getTokens } from './tokens/thunks'
import { getMarketplaceOrder, getMarketplaceOrders } from './marketplace/thunks'
import { removeOrder } from './marketplace'
import { userUnload } from './user'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// Toasts

export const useToast = () => {
  const dispatch = useAppDispatch()
  const helpers = useMemo(() => {
    return {
      toastError,
      toastInfo,
      toastSuccess,
      toastWarning,
      push: (toast: Toast) => dispatch(pushToast(toast)),
      remove: (id: string) => dispatch(removeToast(id)),
      clear: () => dispatch(clearToast()),
    }
  }, [dispatch])

  return helpers
}

// User

export const useCheckLoginLogout = () => {
  const { account, library, active } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { data, isLoggedIn } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (account && data?.publicAddress && account.toLowerCase() !== data.publicAddress.toLowerCase()) {
      dispatch(userUnload())
    }

    if (!isLoggedIn && active && account && library) {
      dispatch(loginWallet(library, account, true))
    }
  }, [account, data, isLoggedIn, active, library, dispatch])
}

export const useLogin = () => {
  const { account, library } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const login = useCallback(() => {
    if (account && library) {
      dispatch(loginWallet(library, account))
    }
  }, [account, library, dispatch])

  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account, login }
}

export const useLoggedInUser = () => {
  const { account } = useActiveWeb3React()
  const { data, isLoggedIn, isLoading, accessToken } = useAppSelector((state) => state.user)
  return { isLoggedIn, isLoggingIn: isLoading, accessToken, user: data, account }
}

export const useUpdateUser = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const handleUpdateUser = useCallback(
    (user: Partial<User>) => {
      if (account) dispatch(updateUser(user))
    },
    [dispatch, account],
  )
  return handleUpdateUser
}

export const useUserKYC = () => {
  const dispatch = useAppDispatch()
  const { account } = useActiveWeb3React()
  const { isLoggedIn, data } = useAppSelector((state) => state.user)

  const [triggered, setTriggered] = useState(false)
  useEffect(() => {
    if (!triggered && data && (!data.lastRefreshed || moment(data.lastRefreshed) < moment().subtract('1 hours'))) {
      setTriggered(true)
      dispatch(loadLoggedInUser())
    }
  }, [dispatch, data, triggered])

  const onStart = useCallback(() => {
      if (!account) dispatch(toastError('Verification error', 'Your wallet is not connected'))
      if (!isLoggedIn) dispatch(toastError('Verification error', 'You are not logged in'))
      return account && isLoggedIn
  }, [dispatch, account, isLoggedIn])

  const onSubmit = useCallback((kycKey: string) => {
    if (account) dispatch(updateUser({ kycKey }))
  }, [dispatch, account])

  const onError = useCallback((errorCode) => {
      dispatch(toastError('Verification error', errorCode))
  }, [dispatch])

  return { onStart, onSubmit, onError, account, kyced: data?.kyced, kycStatus: data?.kycStatus }
}

// Tokens

const tokenSelector = createSelector(
  (state: RootState) => state.tokens,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, address: string) => address,
  (tokenState, chainId, address) => ({
    token: (tokenState.data[chainId] ?? {})[address?.toLowerCase()],
    isLoadingToken: tokenState.isLoading,
  }),
)

export const useToken = (
  addressOrConfig: string | TokenConfig,
  type = TokenType.ERC20,
  spender?: string | Contract,
) => {
  const address = isObject(addressOrConfig) ? getTokenAddress(addressOrConfig) : addressOrConfig
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const { token, isLoadingToken } = useAppSelector((state) => tokenSelector(state, chainId, address))

  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender

  useEffect(() => {
    if (
      account &&
      address &&
      Web3.utils.isAddress(address) &&
      (!spenderAddress || Web3.utils.isAddress(spenderAddress))
    ) {
      dispatch(getToken(chainId, address, type, account, spenderAddress))
    }
  }, [dispatch, address, type, account, chainId, spenderAddress])
  return { token, isLoadingToken }
}

const tokensSelector = createSelector(
  (state: RootState) => state.tokens,
  (_: RootState, chainId: number) => chainId,
  (tokenState, chainId) => ({
    tokens: tokenState.data[chainId],
    isLoadingTokens: tokenState.isLoading,
  }),
)

export const useTokens = (addresses: string[], type = TokenType.ERC20) => {
  const { account, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { tokens, isLoadingTokens } = useAppSelector((state) => tokensSelector(state, chainId))

  useEffect(() => {
    if (addresses) {
      dispatch(getTokens(chainId, addresses, type, account))
    }
  }, [dispatch, addresses, type, account, chainId])

  return { tokens, isLoadingTokens }
}

export const useUserPropertyTokens = (tokenIds?: string[]) => {
  return useUserNFTs(getNaaSAddress(), tokenIds)
}

export const useUserNFTs = (tokenAddress?: string, tokenIds?: string[]) => {
  const { account } = useActiveWeb3React()
  return useNFTs(tokenAddress, account, tokenIds)
}

export const usePropertyTokens = (userAddress?: string, tokenIds?: string[]) => {
  return useNFTs(getNaaSAddress(), userAddress, tokenIds)
}

const nftSelector = createSelector(
  (state: RootState) => state.tokens,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, tokenAddress: string) => tokenAddress,
  (_: RootState, __: number, ___: string, userAddress: string) => userAddress,
  (_: RootState, __: number, ___: string, ____: string, tokenIds: string[]) => tokenIds,
  (tokenState, chainId, tokenAddress, userAddress, tokenIds) => {
    const chainTokens = chainId ? tokenState.data[chainId] ?? {} : {}
    let tokens = tokenAddress ? [chainTokens[tokenAddress.toLowerCase()]] : Object.values(chainTokens)
    if (userAddress) {
      tokens = tokens
        .map((token) => {
          const nftIds = token?.ownersNfts ? token?.ownersNfts[userAddress.toLowerCase()] : undefined
          const nfts = Object.fromEntries(
            Object.entries(token?.nfts ?? {}).filter((o) =>
              nftIds.some((id) => id?.toLowerCase() === o[0].toLowerCase()),
            ),
          )
          return { ...token, ownersNfts: nftIds ? { [userAddress.toLowerCase()]: nftIds } : undefined, nfts }
        })
        .filter((token) => !isEmpty(token?.nfts))
    }
    if (!isUndefined(tokenIds)) {
      tokens = tokens
        .map((token) => ({
          ...token,
          nfts: Object.fromEntries(
            Object.entries(token?.nfts ?? {}).filter((o) =>
              tokenIds.some((id) => id?.toLowerCase() === o[0].toLowerCase()),
            ),
          ),
        }))
        .filter((token) => !isEmpty(token?.nfts))
    }
    return { tokens, isLoadingTokens: tokenState.isLoading }
  },
)

export const useNFTs = (tokenAddress?: string, userAddress?: string, tokenIds?: string[]) => {
  const { chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()

  const { tokens, isLoadingTokens } = useAppSelector((state) =>
    nftSelector(state, chainId, tokenAddress, userAddress, tokenIds),
  )

  useEffect(() => {
    if (chainId) {
      dispatch(getNFTs(chainId, tokenAddress, userAddress, tokenIds))
    }
  }, [dispatch, chainId, tokenAddress, userAddress, tokenIds])

  return { tokens, isLoadingTokens }
}

// Token configs

export const useTokenConfigs = (tokens: Token[]) => {
  return useMemo(() => {
    if (!tokens) return {}
    const values: { [symbol: string]: TokenConfig } = {}
    return Object.values(configTokens).reduce((val, configToken) => {
      const addresses = Object.values(configToken.address)
      const token = tokens.find((ca) => addresses.some((a) => ca.address.toLowerCase() === a.toLowerCase()))
      return token ? { ...val, [token.symbol]: configToken } : val
    }, values)
  }, [tokens])
}

export const useOrdersTokenConfigs = (orders: Order[]) => {
  const tokens = useMemo(
    () =>
      Object.values(
        orders.reduce((tokenObj, order) => {
          if (!order.counterAssetsObject) return tokenObj
          return {
            ...tokenObj,
            ...Object.fromEntries(order.counterAssetsObject.map((t) => [t?.address?.toLowerCase(), t])),
          }
        }, {} as { [key: string]: Token }),
      ),
    [orders],
  )
  return useTokenConfigs(tokens)
}

// Marketplace

const marketplaceOrderSelector = createSelector(
  (state: RootState) => state.marketplace,
  (_: RootState, orderId: string) => orderId,
  (marketplaceState, orderId) => ({
    order: marketplaceState.data[orderId],
    isLoadingOrder: marketplaceState.isLoading,
  }),
)

export const useMarketplaceOrder = (orderId: string) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { order, isLoadingOrder } = useAppSelector((state) => marketplaceOrderSelector(state, orderId))

  useEffect(() => {
    if (orderId) {
      dispatch(getMarketplaceOrder(chainId, parseInt(orderId)))
    }
  }, [dispatch, chainId, orderId])

  return { order, isLoadingOrder }
}

const marketplaceOrdersSelector = createSelector(
  (state: RootState) => state.marketplace,
  (_: RootState, user?: string) => user,
  (marketplaceState, user) => ({
    orders: !user
      ? marketplaceState.data
      : Object.fromEntries(
          Object.entries(marketplaceState.data ?? {}).filter((o) => user.toLowerCase() === o[1].user?.toLowerCase()),
        ),
    isLoadingOrders: marketplaceState.isLoading,
  }),
)

export const useMarketplaceOrders = (fromUserOnly?: boolean) => {
  const dispatch = useAppDispatch()
  const { chainId, account } = useActiveWeb3React()
  const { orders, isLoadingOrders } = useAppSelector((state) =>
    marketplaceOrdersSelector(state, fromUserOnly ? account ?? 'usermandatory' : null),
  )

  useEffect(() => {
    if (dispatch) {
      dispatch(getMarketplaceOrders(chainId, fromUserOnly))
    }
  }, [dispatch, chainId, fromUserOnly])

  return { orders, isLoadingOrders }
}

const orderTokenSelector = createSelector(
  (state: RootState) => state.marketplace,
  (_: RootState, chainId: number) => chainId,
  (_: RootState, __: number, tokenIds: string[]) => tokenIds,
  (mpState, chainId, tokenIds) => ({
    orders: Object.values(mpState.data ?? {}).filter(
      (o) => o.chainId === chainId && tokenIds?.some((id) => id?.toLowerCase() === o.tokenId.toLowerCase()),
    ),
    isLoadingOrders: mpState.isLoading,
  }),
)

export const useMarketplaceOrdersForUserTokens = (tokens: Token[]) => {
  const { account } = useActiveWeb3React()
  const tokenIds = useMemo(() => tokens?.map((t) => t.ownersNfts[account?.toLowerCase()]).flat(), [tokens, account])
  return useMarketplaceOrdersForTokenIds(tokenIds)
}
export const useMarketplaceOrdersForTokens = (tokens: Token[]) => {
  const tokenIds = useMemo(() => tokens?.map((t) => Object.keys(t.nfts ?? {})).flat(), [tokens])
  return useMarketplaceOrdersForTokenIds(tokenIds)
}
export const useMarketplaceOrdersForTokenIds = (tokenIds: string[]) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { orders, isLoadingOrders } = useAppSelector((state) => orderTokenSelector(state, chainId, tokenIds))

  useEffect(() => {
    if (dispatch && chainId && !isEmpty(tokenIds)) {
      dispatch(getMarketplaceOrders(chainId, false, undefined, tokenIds))
    }
  }, [dispatch, chainId, tokenIds])

  return { orders, isLoadingOrders }
}

export const useListNewProperty = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { chainId } = useActiveWeb3React()
  const { account, accessToken } = useLoggedInUser()
  const { createOrder } = useCreateNewOrder()

  const [listing, setListing] = useState(false)
  const listProperty = useCallback(
    async (
      property: Partial<PropertyCreationInformation>,
      counterAsset: Token,
      price: BigNumberish,
      maximumFill?: any,
    ) => {
      if (dispatch && chainId && account && accessToken && createOrder) {
        setListing(true)
        try {
          const tokenAddress = getNaaSAddress()
          // each property is a new collection
          const collectionId = await incrementId(accessToken, chainId, tokenAddress)
          const tokenId = await incrementId(accessToken, chainId, tokenAddress, collectionId, property.amountToMint)

          const finProperty = cloneDeep(property)
          finProperty.id = parseInt(`${collectionId}0000${tokenId}`)
          finProperty.royalties = [{ address: account, value: 500 }]

          const { ipfsUrl, metadata } = await addPropertyToIPFS(finProperty, price)
          finProperty.metadataUri = ipfsUrl

          const { signature, atomicOrder, assetData } = await createOrder(finProperty, counterAsset, price, maximumFill)

          const order: Partial<Order> = {
            chainId,
            contractAddress: tokenAddress,
            subCollectionId: collectionId.toString(),
            tokenId: finProperty.id.toString(),
            user: account,
            isBid: false,
            isAuction: false,
            isLazyMint: true,
            price: price.toString(),
            counterAssets: getSimpleAssetsString([counterAsset]),
            data: JSON.stringify(atomicOrder),
            signature,
            assetData: JSON.stringify(assetData),
            mintData: JSON.stringify(metadata),
          }

          const addedOrder = await addOrder(accessToken, order)
          console.log(addedOrder)
          history.push(`/marketplace/${addedOrder?.id}`)
        } catch (err) {
          console.error(err)
          dispatch(toastError('Listing property failed', 'Check your console for more information'))
        } finally {
          setListing(false)
        }
      }
    },
    [dispatch, history, chainId, account, accessToken, createOrder],
  )

  return { listProperty, listing }
}

export const useListProperty = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { chainId } = useActiveWeb3React()
  const { account, accessToken } = useLoggedInUser()
  const { createOrder } = useCreateOrder()

  const [listing, setListing] = useState(false)
  const listProperty = useCallback(
    async (property: Property, counterAsset: Token, price: BigNumberish, maximumFill?: any) => {
      if (dispatch && chainId && account && accessToken && createOrder) {
        setListing(true)
        try {
          const tokenAddress = getNaaSAddress()

          const { signature, atomicOrder, assetData } = await createOrder(
            tokenAddress,
            property.id,
            counterAsset,
            price,
            maximumFill,
          )

          const order: Partial<Order> = {
            chainId,
            contractAddress: tokenAddress,
            subCollectionId: property.collectionId.toString(),
            tokenId: property.id.toString(),
            user: account,
            isBid: false,
            isAuction: false,
            isLazyMint: true,
            price: price.toString(),
            counterAssets: getSimpleAssetsString([counterAsset]),
            data: JSON.stringify(atomicOrder),
            signature,
            assetData: JSON.stringify(assetData),
          }

          const addedOrder = await addOrder(accessToken, order)
          history.push(`/marketplace/${addedOrder.id}`)
        } catch (err) {
          console.error(err)
          dispatch(toastError('Listing property failed', 'Check your console for more information'))
        } finally {
          setListing(false)
        }
      }
    },
    [dispatch, history, chainId, account, accessToken, createOrder],
  )

  return { listProperty, listing }
}

const getSimpleAssetsString = (assets: Token[]) => {
  return JSON.stringify(
    assets.map((asset) => ({
      address: asset.address,
      name: asset.name,
      symbol: asset.symbol,
      decimals: asset.decimals,
    })),
  )
}

export const useTakeProperty = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const { takeOrder } = useTakeOrder()

  const [buying, setBuying] = useState(false)
  const takeProperty = useCallback(
    async (order: Order, token: Token, price: BigNumberish) => {
      if (dispatch && accessToken && chainId && takeOrder) {
        setBuying(true)
        try {
          const success = await takeOrder(order, token, price)
          if (success) {
            await fulFillOrder(accessToken, chainId, order.id)
            dispatch(removeOrder(order.id))
          }
        } catch (err) {
          console.error(err)
          dispatch(toastError('Buying property failed', 'Check your console for more information'))
        } finally {
          setBuying(false)
        }
      }
    },
    [dispatch, accessToken, chainId, takeOrder],
  )

  return { takeProperty, buying }
}

export const useCancelOrder = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { chainId } = useActiveWeb3React()
  const { accessToken } = useLoggedInUser()
  const { cancelExchangeOrder } = useCancelExchangeOrder()

  const [cancelling, setCancelling] = useState(false)
  const cancelOrder = useCallback(
    async (order: Order, returnPath?: string) => {
      if (dispatch && accessToken && chainId && cancelExchangeOrder) {
        setCancelling(true)
        try {
          const success = await cancelExchangeOrder(order?.dataObject)
          if (success) {
            await deleteOrder(accessToken, chainId, order.id)
            dispatch(removeOrder(order.id))
            if (returnPath && history) history.push(returnPath)
          }
        } catch (err) {
          console.error(err)
          dispatch(toastError('Cancelling order failed', 'Check your console for more information'))
        } finally {
          setCancelling(false)
        }
      }
    },
    [dispatch, accessToken, history, chainId, cancelExchangeOrder],
  )

  return { cancelling, cancelOrder }
}

// Properties

export const useUserProperties = () => {
  const { tokens, isLoadingTokens } = useUserPropertyTokens()
  const { properties, isLoadingProperties } = _usePropertiesForTokens(tokens)
  return { tokens, properties, isLoading: isLoadingTokens || isLoadingProperties }
}

const propertiesTokenSelector = createSelector(
  (state: RootState) => state.properties,
  (_: RootState, allTokenIds: number[]) => allTokenIds,
  (propertyState, allTokenIds) => ({
    properties: Object.values(propertyState.collections ?? {}).filter((p) =>
      allTokenIds.some((id) => p.properties && !isUndefined(p.properties[id])),
    ),
    isLoadingProperties: propertyState.isLoading,
  }),
)

const _usePropertiesForTokens = (tokens: Token[]) => {
  const dispatch = useAppDispatch()
  const allTokenIds = useMemo(
    () =>
      tokens.reduce(
        (tokenIds, token) => [...tokenIds, ...Object.keys(token?.nfts ?? {}).map((id) => parseInt(id))],
        [] as number[],
      ),
    [tokens],
  )

  const { properties, isLoadingProperties } = useAppSelector((state) => propertiesTokenSelector(state, allTokenIds))

  useEffect(() => {
    if (dispatch && !isEmpty(tokens)) {
      dispatch(propertiesForTokens(tokens))
    }
  }, [dispatch, tokens])

  return { properties, isLoadingProperties }
}

export const useMarketplaceProperty = (orderId: string) => {
  const { order, isLoadingOrder } = useMarketplaceOrder(orderId)
  const orderArray = useMemo(() => (order ? [order] : undefined), [order])
  const { properties, isLoadingProperties } = usePropertiesForOrders(orderArray)
  return { order, property: properties ? properties[0] : undefined, isLoading: isLoadingOrder || isLoadingProperties }
}

export const useMarketplaceProperties = () => {
  const { orders, isLoadingOrders } = useMarketplaceOrders()
  const orderArray = useMemo(() => {
    return Object.values(orders ?? {}).sort((a, b) => b.createdAtDate.unix() - a.createdAtDate.unix())
  }, [orders])
  const { properties, isLoadingProperties } = usePropertiesForOrders(orderArray)
  return { orders: orderArray, properties, isLoading: isLoadingOrders || isLoadingProperties }
}

export const usePropertiesForOrders = (orders: Order[]) => {
  const dispatch = useAppDispatch()

  const tokenIds = useMemo(() => orders?.filter((o) => o.tokenId).map((o) => o.tokenId), [orders])
  const { tokens, isLoadingTokens } = useNFTs(getNaaSAddress(), undefined, tokenIds)

  const { properties, isLoadingProperties } = useAppSelector((state) => propertiesOrderSelector(state, orders))

  useEffect(() => {
    if (dispatch && orders) {
      dispatch(propertiesForOrders(orders))
    }
    if (dispatch && tokens) {
      dispatch(propertiesForTokens(tokens))
    }
  }, [dispatch, orders, tokens])

  return { properties, isLoadingProperties: isLoadingProperties || isLoadingTokens }
}

const propertiesOrderSelector = createSelector(
  (state: RootState) => state.properties,
  (_: RootState, orders: Order[]) => orders,
  (propertyState, orders) => ({
    properties: orders
      ?.map((o) => propertyState.collections[parseInt(o.subCollectionId)])
      .filter((p) => !isUndefined(p)),
    isLoadingProperties: propertyState.isLoading,
  }),
)
