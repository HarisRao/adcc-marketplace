import { ZERO_ADDRESS } from 'config/constants/misc'
import { TokenConfig } from 'config/constants/tokens'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toastError } from 'state/actions'
import { getNaaSAddress } from 'utils/addressHelpers'
import { handleTransaction } from 'utils/callHelpers'
import { useApproval1155, useApproval721, useTokenApproval } from './useApproval'
import { useProxyRegistryContract } from './useContract'
import { useActiveWeb3React } from './web3'

export const useTokenProxyApproval = (tokenConfig: TokenConfig) => {
  const { proxy, registered, register, registring } = useProxy()
  const { token, isLoadingToken, approve, approving, approvedAmount } = useTokenApproval(tokenConfig, proxy)
  return { token, isLoadingToken, registered, register, registring, approve, approving, approvedAmount}
}

export const useERC721ProxyApproval = (tokenAddress: string) => {
  const { proxy, registered, register, registring } = useProxy()
  const { token, isLoadingToken, approve, approving, approved } = useApproval721(tokenAddress, proxy)
  return { token, isLoadingToken, registered, register, registring, approve, approving, approved}
}

export const useERC1155ProxyApproval = (tokenAddress: string) => {
  const { proxy, registered, register, registring } = useProxy()
  const { token, isLoadingToken, approve, approving, approved } = useApproval1155(tokenAddress, proxy)
  return { token, isLoadingToken, registered, register, registring, approve, approving, approved}
}

export const useNaaSProxyApproval = () => {
  return useERC1155ProxyApproval(getNaaSAddress())
}

export const useProxy = () => {
  const { account } = useActiveWeb3React()
  const dispatch = useDispatch()
  const proxyRegistry = useProxyRegistryContract()
  const [registring, setRegistring] = useState(false)
  const [ proxy, setProxy ] = useState<string>()

  useEffect(() => {
    const getProxy = async() => setProxy(await proxyRegistry.proxies(account))
    if (account && proxyRegistry) getProxy()
  }, [account, proxyRegistry])

  const register = useCallback(async () => {
    if (dispatch && proxyRegistry) {
      try {
        setRegistring(true)
        const transaction = await proxyRegistry.registerProxy()
        const result = await handleTransaction(transaction)
        if (result) setProxy(await proxyRegistry.proxies(account))
        return result
      } catch (error: any) {
        console.error(error)
        dispatch(toastError('Error registring proxy', error?.message))
      } finally {
        setRegistring(false)
      }
    }
    return false
  }, [dispatch, proxyRegistry, account])
  
  const registered = proxy !== ZERO_ADDRESS
  return { proxy: registered ? proxy : undefined, registered, register, registring }
}
