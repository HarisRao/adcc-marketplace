import { AzureFunction, ContextBindingData, HttpRequest } from '@azure/functions'
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
import { isEmpty, isUndefined } from 'lodash'
import { isAddress } from '@ethersproject/address'
import { initSequelize } from '../src/storage'
import MarketplaceCollection from '../src/models/MarketplaceCollection.model'
import { rpcUrls, ERC165 } from '../src/config'
import ERC165Abi from '../src/config/abi/ERC165.json'

interface BindingData extends ContextBindingData {
  chainId?: string
  tokenAddress?: string
  collectionId?: string
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'GET') await get(context, req)
    else if (req.method === 'POST') await createOrUpdate(context, req)
    else if (req.method === 'PUT') await update(context, req)
  } catch (error) {
    func500Error(context, error)
  }
}

const getIds = (context: TypedContext<BindingData>, req: HttpRequest) => {
  const chainId = parseInt(context?.bindingData?.chainId ?? '-1')
  if (chainId > 0) {
    const tokenAddress = context?.bindingData?.tokenAddress?.toLowerCase()
    if (!isUndefined(tokenAddress)) {
      if (!isAddress(tokenAddress)) return { error: 'Parameter tokenAddress is not an valid address' }

      const collectiondId = (context?.bindingData?.collectionId ?? 0).toString().toLowerCase()
      const incrementCount = req?.query?.increment?.toString()
      const increment = !incrementCount ? 0 : parseInt(incrementCount)
      return { chainId, tokenAddress, collectiondId, increment }
    }
    return { chainId }
  }

  return {}
}

const getCollections = (chainId?: number, tokenAddress?: string, collectiondId?: string) => {
  return MarketplaceCollection.findAndCountAll({
    where: {
      chainId,
      ...(tokenAddress ? { contractAddress: tokenAddress.toLowerCase() } : undefined),
      ...(collectiondId ? { subCollectionId: collectiondId.toLowerCase() } : undefined),
    },
    order: [
      ['updatedAt', 'DESC'],
      ['createdAt', 'DESC'],
    ],
    limit: 50,
  })
}

const get = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { chainId, tokenAddress, collectiondId, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)

  const { count, rows } = await getCollections(chainId, tokenAddress, collectiondId)
  return funcSuccess(context, {
    count,
    data: rows ? rows.map((r) => r.toJSON()) : [],
  })
}

const createOrUpdate = async (context: TypedContext<BindingData>, req: HttpRequest, onlyUpdate = false) => {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const user: string = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
  if (isEmpty(user)) return validationResult

  const { chainId, tokenAddress, collectiondId, increment, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)

  if (isUndefined(chainId) || isUndefined(tokenAddress) || isUndefined(collectiondId))
    return funcValidationError(context, 'Invalid url')

  const { count, rows } = await getCollections(chainId, tokenAddress, collectiondId)
  if (count === 0 && onlyUpdate) return funcValidationError(context, 'Collection not found')

  if (count === 0) {
    const rpcUrl = rpcUrls[chainId]
    if (isEmpty(rpcUrl)) return funcValidationError(context, 'Chain not supported')

    const provider = new JsonRpcProvider(rpcUrl, chainId)
    const erc165Contract = new Contract(tokenAddress, ERC165Abi, provider) as ERC165
    // ERC721 = 0x80ac58cd, ERC721Metadata = 0x5b5e139f ERC721Enumerable = 0x780e9d63
    // ERC1155 = 0xd9b67a26, ERC1155Metadata = 0x0e89341c
    if (
      !(await erc165Contract.supportsInterface('0x80ac58cd')) &&
      !(await erc165Contract.supportsInterface('0xd9b67a26'))
    ) {
      return funcValidationError(context, 'Contract is not a valid NFT contract')
    }
    // TODO, validate user = contract deployer

    const collection = await MarketplaceCollection.create({
      chainId,
      contractAddress: tokenAddress,
      subCollectionId: collectiondId,
      owner: user,
      description: req?.body?.description,
      currentId: increment,
    })
    return funcSuccess(context, collection ? collection.toJSON() : null)
  }

  let collection = rows[0]
  collection = await collection.update({
    description: isUndefined(req?.body?.description) ? collection.description : req?.body?.description,
    currentId: (collection.currentId ?? 0) + (increment ?? 0),
  })
  return funcSuccess(context, collection ? collection.toJSON() : null)
}

const update = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  return createOrUpdate(context, req, true)
}

export default httpTrigger
