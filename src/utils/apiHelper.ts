import { MARKETPLACE_API_URL } from "config/constants/misc"
import { Collection, Order } from "state/types"

// Marketplace

/**
 * @param accessToken login accessToken
 * @param chainId current connected chain id
 * @param tokenAddress NFT token address
 * @param collectionId optional sub collection id, 0 is default for the whole collection
 * @param amount amount of id's to increment
 * @returns number of the new latest id
 */
export const incrementId = async (accessToken: string, chainId: number, tokenAddress: string, collectionId = 0, amount = 1): Promise<number> => {
  let apiUrl = `${MARKETPLACE_API_URL}/collections/${chainId}/${tokenAddress}`
  if (collectionId > 0) apiUrl += `/${collectionId}`
  if (amount > 0) apiUrl += `?increment=${amount}`

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    }
  })
  if (!response.ok) throw new Error(await response.text())
  const collection: Collection = await response.json()
  return collection.currentId
}

/**
 * @param accessToken login accessToken
 * @returns number of the latest user order nonce
 */
export const getOrderNonce = async (accessToken: string): Promise<number> => {
  const response = await fetch(`${MARKETPLACE_API_URL}/users/getOrderNonce`, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

/**
 * @param accessToken login accessToken
 * @returns signature for an order
 */
 export const getOrderSignature = async (accessToken: string, orderId: number): Promise<string> => {
  const response = await fetch(`${MARKETPLACE_API_URL}/order-signature/${orderId}`, {
    method: "GET",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    }
  })
  if (!response.ok) throw new Error(await response.text())
  return response.text()
}

/**
 * @param accessToken login accessToken
 * @param order to add
 * @returns added order
 */
export const addOrder = async (accessToken: string, order: Partial<Order>): Promise<Order> => {
  const response = await fetch(`${MARKETPLACE_API_URL}/orders`, {
    method: "POST",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(order)
  })
  console.log(response)
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

/**
 * @param accessToken login accessToken
 * @param order to fullfill
 */
 export const fulFillOrder = async (accessToken: string, chainId: number, orderId: number) => {
  const response = await fetch(`${MARKETPLACE_API_URL}/orders/${chainId}/${orderId}`, {
    method: "PUT",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ fulFilled: true })
  })
  if (!response.ok) throw new Error(await response.text())
}

/**
 * @param accessToken login accessToken
 * @param order to delete
 */
 export const deleteOrder = async (accessToken: string, chainId: number, orderId: number) => {
  const response = await fetch(`${MARKETPLACE_API_URL}/orders/${chainId}/${orderId}`, {
    method: "DELETE",
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Func-Authorization': `Bearer ${accessToken}`,
    }
  })
  if (!response.ok) throw new Error(await response.text())
}