import { AzureFunction, ContextBindingData, HttpRequest } from '@azure/functions'
import {
  TypedContext,
  funcSuccess,
  funcValidationError,
  func404NotFound,
  func500Error,
  validateJWTWalletSign,
  getUser,
} from '@passive-income/psi-api'
import { isNull } from 'lodash'
import CryptoJS from 'crypto-js'
import { initSequelize } from '../src/storage'
import MarketplaceOrder from '../src/models/MarketplaceOrder.model'

interface BindingData extends ContextBindingData {
  orderId?: number
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'GET') await get(context, req)
  } catch (error) {
    func500Error(context, error)
  }
}

const get = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  try {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const userId: number = (<any>req)?.user?.payload?.id
  const account: string = (<any>req)?.user?.payload?.publicAddress
  const user = userId || userId === 0 ? await getUser(userId) : null
  if (!account || isNull(user)) return validationResult
  if (!user.kyced) return funcValidationError(context, 'You are not kyced')

  const orderId = parseInt(context?.bindingData?.orderId?.toString() ?? '-1')
  if (orderId < 0) return funcValidationError(context, 'Order id is not valid')

  const order = await MarketplaceOrder.findByPk(orderId)
  const signature = order && !order.isDeleted ? order.signature : null
  const encryptedSignature = signature ? CryptoJS.AES.encrypt(signature, account?.toLowerCase()) : null
  return encryptedSignature ? funcSuccess(context, encryptedSignature?.toString()) : func404NotFound(context)
  } catch(err) {
    console.error(err)
  }
}

export default httpTrigger
