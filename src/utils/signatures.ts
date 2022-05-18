import { defaultAbiCoder } from '@ethersproject/abi'
import { TypedDataSigner } from '@ethersproject/abstract-signer'
import { Contract } from '@ethersproject/contracts'
import { NaaSExchange } from 'config/types'
import { AtomicOrder } from './atomicMatch'

export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000'
export const NULL_SIG = defaultAbiCoder.encode(['uint8', 'bytes32', 'bytes32'], [27, ZERO_BYTES32, ZERO_BYTES32])

const OrderType = {
  Order: [
    { name: 'registry', type: 'address' },
    { name: 'maker', type: 'address' },
    { name: 'staticTarget', type: 'address' },
    { name: 'staticSelector', type: 'bytes4' },
    { name: 'staticExtradata', type: 'bytes' },
    { name: 'maximumFill', type: 'uint256' },
    { name: 'listingTime', type: 'uint256' },
    { name: 'expirationTime', type: 'uint256' },
    { name: 'salt', type: 'uint256' },
  ],
}

export const signOrder = async (signer: TypedDataSigner, exchange: NaaSExchange, data: AtomicOrder) => {
  return sign(signer, exchange, 'PSI NaaS Wyvern Exchange', data, OrderType, '3.1')
}

export const sign = async (
  signer: TypedDataSigner,
  verifyingContract: Contract,
  key: string,
  data: any,
  types: any,
  version = '1',
) => {
  const newData = { ...data }
  delete newData.signatures

  const { chainId } = await verifyingContract.provider.getNetwork()
  const domain = {
    name: key,
    chainId,
    version,
    verifyingContract: verifyingContract.address,
  }

  return signer._signTypedData(domain, types, newData)
}
