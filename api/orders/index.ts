import { AzureFunction, Context, ContextBindingData, HttpRequest } from '@azure/functions'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import {
  TypedContext,
  funcSuccess,
  funcValidationError,
  func404NotFound,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import { isEmpty, isArray, isUndefined } from 'lodash'
import { isAddress } from '@ethersproject/address'
import { col, Op } from 'sequelize'
import { initSequelize } from '../src/storage'
import MarketplaceOrder from '../src/models/MarketplaceOrder.model'
import { rpcUrls, ERC165, ERC721Enumerable, ERC1155 } from '../src/config'
import ERC165Abi from '../src/config/abi/ERC165.json'
import ERC721Abi from '../src/config/abi/ERC721Enumerable.json'
import ERC1155Abi from '../src/config/abi/ERC1155.json'

interface BindingData extends ContextBindingData {
  chainId?: string
  tokenAddress?: string
  fromUserOnly?: boolean | string
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'GET') await get(context, req)
    else if (req.method === 'POST') await create(context, req)
    else if (req.method === 'PUT') await update(context, req)
    else if (req.method === 'DELETE') await deleteOrder(context, req)
  } catch (error) {
    func500Error(context, error)
  }
}

const getIds = (context: TypedContext<BindingData>, req: HttpRequest) => {
  const chainId = parseInt(context?.bindingData?.chainId ?? '-1')
  if (chainId > 0) {
    const tokenAddress = context?.bindingData?.tokenAddress?.toString().toLowerCase()
    if (!isUndefined(tokenAddress)) {
      if (!tokenAddress.startsWith('0x') && !Number.isNaN(parseInt(tokenAddress))) return { id: parseInt(tokenAddress) }
      if (!isAddress(tokenAddress)) return { error: 'Parameter tokenAddress is not an valid address' }

      const uoStr = context?.bindingData?.fromUserOnly?.toString()
      const fromUserOnly = uoStr?.toLowerCase() === "true" || uoStr?.toLowerCase() === "1"
      const collectionIds = req?.body?.collectionIds && isArray(req?.body?.collectionIds)
        ? (req.body.collectionIds as string[]).map((id) => id?.toString()?.toLowerCase())
        : undefined
      const tokenIds = req?.body?.tokenIds && isArray(req?.body?.tokenIds)
        ? (req.body.tokenIds as string[]).map((id) => id?.toString()?.toLowerCase())
        : undefined
      return { chainId, tokenAddress, fromUserOnly, collectionIds, tokenIds }
    }
    return { chainId }
  }

  return {}
}

const get = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { id, chainId, tokenAddress, fromUserOnly, collectionIds, tokenIds, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)

  return getOrders(context, req, id, chainId, tokenAddress, fromUserOnly, collectionIds, tokenIds)
}

const create = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { id, chainId, tokenAddress, fromUserOnly, collectionIds, tokenIds, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)
  if (chainId && (!isUndefined(id) || (tokenAddress && tokenAddress.toUpperCase() !== "ADD") || collectionIds || tokenIds))
    return getOrders(context, req, id, chainId, tokenAddress, fromUserOnly, collectionIds, tokenIds)

  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const user: string = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
  if (isEmpty(user)) return validationResult

  const body = req?.body as Partial<MarketplaceOrder>
  if (isUndefined(body?.chainId)) return funcValidationError(context, 'Post parameter chainId not set')
  if (isUndefined(body?.contractAddress) || !isAddress(body?.contractAddress))
    return funcValidationError(context, 'Post parameter contractAddress not set or is not an valid address')
  if (isUndefined(body?.tokenId)) return funcValidationError(context, 'Post parameter id not set')
  if (isUndefined(body?.subCollectionId)) return funcValidationError(context, 'Post parameter subCollectionId not set')
  if (isUndefined(body?.user) || !isAddress(body?.user))
    return funcValidationError(context, 'Post parameter user not set or is not an valid address')
  if (body.user.toLowerCase() !== user)
    return funcValidationError(context, 'Post parameter user not not equal to logged in user')
  if (isUndefined(body?.price)) return funcValidationError(context, 'Post parameter price not set')
  if (isUndefined(body?.counterAssets)) return funcValidationError(context, 'Post parameter counterAssets not set')
  if (isUndefined(body?.data)) return funcValidationError(context, 'Post parameter data not set')
  if (isUndefined(body?.signature)) return funcValidationError(context, 'Post parameter signature not set')
  if (isUndefined(body?.assetData)) return funcValidationError(context, 'Post parameter assetData not set')

  const rpcUrl = rpcUrls[body.chainId]
  if (isEmpty(rpcUrl)) return funcValidationError(context, 'Chain not supported')

  const provider = new JsonRpcProvider(rpcUrl, body.chainId)
  const erc165Contract = new Contract(body.contractAddress, ERC165Abi, provider) as ERC165

  // ERC721 = 0x80ac58cd, ERC721Metadata = 0x5b5e139f ERC721Enumerable = 0x780e9d63
  // ERC1155 = 0xd9b67a26, ERC1155Metadata = 0x0e89341c
  if (!body?.isLazyMint && (await erc165Contract.supportsInterface('0x80ac58cd'))) {
    const erc721 = new Contract(body.contractAddress, ERC721Abi, provider) as ERC721Enumerable
    const owner = await erc721.ownerOf(body?.tokenId)
    if (user !== owner?.toLowerCase()) return funcValidationError(context, 'Token is not yours')
  } else if (!body?.isLazyMint && (await erc165Contract.supportsInterface('0xd9b67a26'))) {
    const erc1155 = new Contract(body.contractAddress, ERC1155Abi, provider) as ERC1155
    const balance = await erc1155.balanceOf(user, body?.tokenId)
    if (balance.lte(0)) return funcValidationError(context, 'Token is not yours')
  }

  const order = await MarketplaceOrder.create({
    ...body,
    contractAddress: body?.contractAddress?.toLowerCase(),
    tokenId: body?.tokenId?.toLowerCase(),
    subCollectionId: body?.subCollectionId?.toLowerCase(),
    user: body?.user?.toLowerCase(),
  })
  return funcSuccess(context, order ? orderToJson(order) : null)
}

const getOrders = async (
  context: Context,
  req: HttpRequest,
  id?: number,
  chainId?: number,
  tokenAddress?: string,
  fromUserOnly?: boolean,
  collectionIds?: string[],
  tokenIds?: string[],
) => {
  let user: string | undefined
  if (fromUserOnly) {
    const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
    user = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
    if (isEmpty(user)) return validationResult
  }

  if (!isUndefined(id)) {
    const order = await MarketplaceOrder.findByPk(id)
    return order && !order.isDeleted ? funcSuccess(context, orderToJson(order)) : func404NotFound(context)
  }

  const { count, rows } = await MarketplaceOrder.findAndCountAll({
    where: {
      chainId,
      isDeleted: { [Op.or]: [false, null] },
      isFulFilled: { [Op.or]: [false, null] },
      ...(tokenAddress ? { contractAddress: tokenAddress.toLowerCase() } : undefined),
      ...(collectionIds ? { subCollectionId: { [Op.in]: collectionIds } } : undefined),
      ...(tokenIds ? { tokenId: { [Op.in]: tokenIds } } : undefined),
      ...(user ? { user } : undefined),
    },
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    limit: 50,
  })
  return funcSuccess(context, {
    count,
    data: rows ? rows.map(r => orderToJson(r)) : [],
  })
}

const update = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { id, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)

  if (isUndefined(req?.body?.fulFilled)) return funcValidationError(context, 'Post parameter fulfilled not set')

  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const user: string = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
  if (isEmpty(user)) return validationResult

  const order = !isUndefined(id) ? await MarketplaceOrder.findByPk(id) : null
  if (!order || order.isDeleted) return func404NotFound(context)

  // TODO: check if order is really fulfilled

  const resOrder = await order.update({ isFulFilled: true })
  return resOrder ? funcSuccess(context) : func500Error(context)
}

const deleteOrder = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { id, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)

  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const user: string = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
  if (isEmpty(user)) return validationResult

  const order = !isUndefined(id) ? await MarketplaceOrder.findByPk(id) : null
  if (!order || order.isDeleted || order.user?.toLowerCase() !== user) return func404NotFound(context)

  const resOrder = await order.update({ isDeleted: true })
  return resOrder ? funcSuccess(context) : func500Error(context)
}

const orderToJson = (order: MarketplaceOrder) => {
  if (!order) return null
  const returnOrder: any = order.toJSON()
  delete returnOrder.signature
  return returnOrder
}

export default httpTrigger
