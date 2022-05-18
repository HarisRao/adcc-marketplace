import { AzureFunction, ContextBindingData, HttpRequest } from '@azure/functions'
import {
  TypedContext,
  funcSuccess,
  func500Error,
  validateJWTWalletSign,
} from '@passive-income/psi-api'
import { isEmpty } from 'lodash'
import { initSequelize } from '../src/storage'
import MarketplaceUser from '../src/models/MarketplaceUser.model'

interface BindingData extends ContextBindingData {
  action?: string
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    const action = context?.bindingData?.action?.toUpperCase()
    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (req.method === 'POST' && action === "GETORDERNONCE") await getOrderNonce(context, req)
  } catch (error) {
    func500Error(context, error)
  }
}

const getOrderNonce = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const validationResult = await validateJWTWalletSign(context, req) // check if wallet is signed in
  const user: string = (<any>req)?.user?.payload?.publicAddress?.toLowerCase()
  if (isEmpty(user)) return validationResult

  let mpUser = await MarketplaceUser.findByPk(user)
  if (!mpUser) {
    mpUser = await MarketplaceUser.create({
      publicAddress: user,
      latestOrderNonce: 1
    })
  } else {
    mpUser = await mpUser.update({ latestOrderNonce: mpUser.latestOrderNonce + 1 })
  }
  return funcSuccess(context, mpUser ? mpUser.latestOrderNonce : null)
}

export default httpTrigger
