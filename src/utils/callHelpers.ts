import { Dispatch } from 'react'
import { BigNumberish, constants, Contract, ContractTransaction, ContractReceipt } from 'ethers'
import { isNil, isObject } from 'lodash'
import { IERC1155, ERC20, ERC721, IERC777 } from 'config/types'
import { toastError } from 'state/toasts'

export const handleTransactionCall = async (call: () => Promise<ContractTransaction>, dispatch?: Dispatch<any>) => {
  try {
    const transaction = await call();
    return handleTransaction(transaction, dispatch)
  } catch(err: any) {
    const message = err?.data?.message ?? err?.message ?? "Check your console for more information"
    dispatch(toastError('Error processing transaction', message))
    return false
  }
}

export const handleTransaction = async (transaction: ContractTransaction, dispatch?: Dispatch<any>) => {
  const receipt = await transaction.wait()
  if (dispatch) handleReceipt(receipt, dispatch)
  return receipt.status > 0
}

export const handleReceipt = (receipt: ContractReceipt, dispatch: Dispatch<any>) => {
  if (receipt.status === 0) {
    dispatch(toastError('Error processing transaction', 'Check your console for more information'))
    console.error('Error processing transaction', receipt)
  }
  return receipt.status > 0
}

export const approve = async (contract: ERC20, spender: string | Contract, amount?: BigNumberish) => {
  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender
  const finalAmount = !isNil(amount) ? amount : constants.MaxUint256
  return contract.approve(spenderAddress, finalAmount)
}

export const approveERC721 = async (contract: ERC721, spender: string | Contract) => {
  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender
  return contract.setApprovalForAll(spenderAddress, true)
}

export const approveERC777 = async (contract: IERC777, spender: string | Contract) => {
  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender
  return contract.authorizeOperator(spenderAddress)
}

export const approveERC1155 = async (contract: IERC1155, spender: string | Contract) => {
  const spenderAddress = isObject(spender) ? (spender as Contract).options.address : spender
  return contract.setApprovalForAll(spenderAddress, true)
}