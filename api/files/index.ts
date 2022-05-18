import { AzureFunction, ContextBindingData, HttpRequest } from '@azure/functions'
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
import { getOwnedTokens } from '../src/nfts'

interface BindingData extends ContextBindingData {
  action?: string
  files?: string
}

const httpTrigger: AzureFunction = async function httpTrigger(
  context: TypedContext<BindingData>,
  req: HttpRequest,
): Promise<void> {
  try {
    await initSequelize()

    const action = context?.bindingData?.action?.toUpperCase()
    if (req.method === 'OPTIONS') funcSuccess(context)
    else if (action === "METADATA" && (req.method === 'GET' || req.method === 'POST')) await getMetadata(context, req)
    else func404NotFound(context)
  } catch (error) {
    func500Error(context, error)
  }
}

const getFilesArray = (context: TypedContext<BindingData>, req: HttpRequest) => {
  const files: string | string[] = req?.body?.files ?? context?.bindingData?.files
  if (isEmpty(files)) return []
  if (typeof(files) !== "string") return files
  return files.split(",").map(file => file.trim())
}

const getMetadata = async (context: TypedContext<BindingData>, req: HttpRequest) => {
  const files = getFilesArray(context, req)
  if (isEmpty(files)) return funcValidationError(context, "No files to fetch")
  return funcSuccess(context, files)
}

export default httpTrigger
