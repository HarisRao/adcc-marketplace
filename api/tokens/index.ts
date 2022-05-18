import { AzureFunction, ContextBindingData, HttpRequest } from '@azure/functions'
import {
  TypedContext,
  funcSuccess,
  funcValidationError,
  func404NotFound,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import { isArray, isEmpty, isUndefined } from 'lodash'
import { isAddress } from '@ethersproject/address'
import { initSequelize } from '../src/storage'
import { getOwnedTokens } from '../src/nfts'

interface BindingData extends ContextBindingData {
  action?: string
  chainId?: string
  address1?: string
  address2?: string
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    const action = context?.bindingData?.action?.toUpperCase()
    if (req.method === 'OPTIONS') funcSuccess(context)
    else if ((req.method === 'GET' || req.method === 'POST') && action === "GETOWNEDTOKENS") await ownedTokens(context, req)
    else func404NotFound(context)
  } catch (error) {
    func500Error(context, error)
  }
}

const getIds = (context: TypedContext<BindingData>, req: HttpRequest) => {
  const chainId = parseInt(context?.bindingData?.chainId ?? '-1')
  if (chainId > 0) {
    let userAddress = ""
    let tokenAddress = ""

    const address1 = context?.bindingData?.address1?.toLowerCase()
    if (!isUndefined(address1)) {
      if (address1?.startsWith("user-")) userAddress = address1.substring(5)
      else if (address1?.startsWith("token-")) tokenAddress = address1.substring(6)
      else return { error: 'Parameter address1 is not valid' }
    }

    const address2 = context?.bindingData?.address2?.toLowerCase()
    if (!isUndefined(address2)) {
      if (address2?.startsWith("user-")) userAddress = address2.substring(5)
      else if (address2?.startsWith("token-")) tokenAddress = address2.substring(6)
      else return { error: 'Parameter address2 is not valid' }
    }
  
    if (!isEmpty(userAddress) && !isAddress(userAddress)) return { error: 'Parameter address1 is not a valid address' }
    if (!isEmpty(tokenAddress)&& !isAddress(tokenAddress)) return { error: 'Parameter tokenAddress is not a valid address' }

    const tokenIds = req?.body?.tokenIds && isArray(req.body.tokenIds) ? req.body.tokenIds as string[] : undefined

    return { chainId, userAddress, tokenAddress, tokenIds }
  }

  return {}
}

const ownedTokens = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const { chainId, userAddress, tokenAddress, tokenIds, error } = getIds(context, req)
  if (error) return funcValidationError(context, error)
  if (isUndefined(chainId)) return funcValidationError(context, "chainId is mandatory")
  if (isUndefined(userAddress)) return funcValidationError(context, "userAddress is mandatory")
  if (isUndefined(tokenAddress)) return funcValidationError(context, "tokenAddress is mandatory")
  const tokens = await getOwnedTokens(chainId, tokenAddress, userAddress, tokenIds)
  return funcSuccess(context, tokens)
}

export default httpTrigger
