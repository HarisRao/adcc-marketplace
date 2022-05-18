import { TokenConfig } from 'config/constants/tokens'
import { isEmpty } from 'lodash'
import { useMemo } from 'react'
import { TokenType } from 'state/types'

import {
  getERC20Contract,
  getERC721Contract,
  getERC777Contract,
  getERC1155Contract,
  getNaaSContract,
  getExchangeContract,
  getProxyRegistryContract,
  getCreatorsRegistryContract,
  getRoyaltiesRegistryContract,
  getNaaSStaticContract,
  getAtomicizerContract,
  getTokenContract,
  getStakingContract
} from 'utils/contractHelpers'
import { useActiveWeb3React } from './web3'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useSigner = () => {
  const { library, account } = useActiveWeb3React()
  const signer = useMemo(() => library.getSigner(account), [library, account])
  return signer ?? library
}

export const useTokenContract = (token: TokenConfig) => {
  const signer = useSigner()
  return useMemo(() => getTokenContract(token, signer), [token, signer])
}

export const useERCContract = (address: string, tokenType = TokenType.ERC20) => {
  const signer = useSigner()
  return useMemo(() => {
    if (isEmpty(address)) return null
    switch (tokenType) {
      case TokenType.ERC721:
        return getERC721Contract(address, signer)
      case TokenType.ERC777:
        return getERC777Contract(address, signer)
      case TokenType.ERC1155:
        return getERC1155Contract(address, signer)
      case TokenType.ERC20:
        return getERC20Contract(address, signer)
      default:
        return null
    }
  }, [address, tokenType, signer])
}

export const useNaaSContract = () => {
  const signer = useSigner()
  return useMemo(() => getNaaSContract(signer), [signer])
}
export const useExchangeContract = () => {
  const signer = useSigner()
  return useMemo(() => getExchangeContract(signer), [signer])
}
export const useNaaSStaticContract = () => {
  const signer = useSigner()
  return useMemo(() => getNaaSStaticContract(signer), [signer])
}
export const useAtomicizerContract = () => {
  const signer = useSigner()
  return useMemo(() => getAtomicizerContract(signer), [signer])
}
export const useProxyRegistryContract = () => {
  const signer = useSigner()
  return useMemo(() => getProxyRegistryContract(signer), [signer])
}
export const useCreatorsRegistryContract = () => {
  const signer = useSigner()
  return useMemo(() => getCreatorsRegistryContract(signer), [signer])
}
export const useRoyaltiesRegistryContract = () => {
  const signer = useSigner()
  return useMemo(() => getRoyaltiesRegistryContract(signer), [signer])
}
export const useStakingContract = () => {
  const signer = useSigner()
  return useMemo(() => getStakingContract(signer), [signer])
}