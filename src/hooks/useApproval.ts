import { BigNumber } from '@ethersproject/bignumber'
import { ContractTransaction } from '@ethersproject/contracts'
import { TokenConfig } from 'config/constants/tokens'
import { BigNumberish, constants } from 'ethers'
import { useCallback, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getToken, toastError } from 'state/actions'
import { useToken } from 'state/hooks'
import { TokenType } from 'state/types'
import { getTokenAddress } from 'utils/addressHelpers'
import { approve, approveERC721, approveERC777, approveERC1155, handleTransaction } from 'utils/callHelpers'
import { useERCContract } from './useContract'
import { useActiveWeb3React } from './web3'

const useTypedApproval = (tokenAddress: string, type: TokenType, spender: string) => {
  const dispatch = useDispatch()
  const { account, chainId } = useActiveWeb3React()
  const tokenContract = useERCContract(tokenAddress, type)
  const [approving, setApproving] = useState(false)
  const { token, isLoadingToken } = useToken(tokenAddress, type, spender)

  const handleApprove = useCallback(async (ammount?:BigNumberish) => {
    if (dispatch && account && spender && tokenContract) {
      try {
        setApproving(true)

        let transaction: ContractTransaction
        if (type === TokenType.ERC721) transaction = await approveERC721(tokenContract as any, spender)
        else if (type === TokenType.ERC777) transaction = await approveERC777(tokenContract as any, spender)
        else if (type === TokenType.ERC1155) transaction = await approveERC1155(tokenContract as any, spender)
        else transaction = await approve(tokenContract as any, spender,ammount)

        const success = await handleTransaction(transaction)
        if (success) dispatch(getToken(chainId, tokenAddress, type, account, spender, true))
        return success
      } catch (error: any) {
        dispatch(toastError('Error approving tokens', error?.message))
      } finally {
        setApproving(false)
      }
    }
    return false
  }, [dispatch, tokenAddress, type, account, chainId, spender, tokenContract])

  return { token, isLoadingToken, approve: handleApprove, approving }
}

export const useTokenApproval = (token: TokenConfig, spender: string) => {
  const tokenAddress = getTokenAddress(token)
  return useApproval(tokenAddress, spender)
}

export const useApproval = (tokenAddress: string, spender: string) => {
  const tokenType = tokenAddress?.toLowerCase() !== "0x" ? TokenType.ERC20 : TokenType.ETH
  const {
    token,
    isLoadingToken,
    approve: handleApprove,
    approving,
  } = useTypedApproval(tokenAddress, tokenType, spender)

  const approvedAmount = useMemo(() => {
    if (tokenType === TokenType.ETH) return constants.MaxUint256
    return spender && token?.approvals ? token?.approvals[spender] : BigNumber.from(0)
  }, [token?.approvals, spender, tokenType])
  
  return { token, isLoadingToken, approve: handleApprove, approving, approvedAmount }
}

export const useApproval721 = (tokenAddress: string, spender: string) => {
  const {
    token,
    isLoadingToken,
    approve: handleApprove,
    approving,
  } = useTypedApproval(tokenAddress, TokenType.ERC721, spender)
  const approved = useMemo(() => token?.approvalForAll[spender], [token?.approvalForAll, spender])
  return { token, isLoadingToken, approve: handleApprove, approving, approved }
}

export const useApproval777 = (tokenAddress: string, spender: string) => {
  const {
    token,
    isLoadingToken,
    approve: handleApprove,
    approving,
  } = useTypedApproval(tokenAddress, TokenType.ERC777, spender)
  const approvedAmount = useMemo(() => token?.approvals[spender], [token?.approvals, spender])
  return { token, isLoadingToken, approve: handleApprove, approving, approvedAmount }
}

export const useApproval1155 = (tokenAddress: string, spender: string) => {
  const {
    token,
    isLoadingToken,
    approve: handleApprove,
    approving,
  } = useTypedApproval(tokenAddress, TokenType.ERC1155, spender)
  const approved = useMemo(() => token?.approvalForAll[spender], [token?.approvalForAll, spender])
  return { token, isLoadingToken, approve: handleApprove, approving, approved }
}
