import { defaultAbiCoder } from '@ethersproject/abi'
import { BigNumberish } from '@ethersproject/bignumber'
import { NaaSExchange } from 'config/types'

export interface AtomicOrder {
  registry: string
  maker: string
  staticTarget: string
  staticSelector: string
  staticExtradata: string
  maximumFill: BigNumberish
  listingTime: BigNumberish
  expirationTime: BigNumberish
  salt: BigNumberish
}

export interface AtomicCall {
  target: string
  howToCall: number
  data: string
}

export const atomicMatch = (
  exchange: NaaSExchange,
  order: AtomicOrder,
  sig: string,
  call: AtomicCall,
  counterorder: AtomicOrder,
  countersig: string,
  countercall: AtomicCall,
  metadata: string,
  msgValue?: BigNumberish,
) =>
  exchange.atomicMatch_(
    [
      order.registry,
      order.maker,
      order.staticTarget,
      order.maximumFill,
      order.listingTime,
      order.expirationTime,
      order.salt,
      call.target,
      counterorder.registry,
      counterorder.maker,
      counterorder.staticTarget,
      counterorder.maximumFill,
      counterorder.listingTime,
      counterorder.expirationTime,
      counterorder.salt,
      countercall.target,
    ],
    [order.staticSelector, counterorder.staticSelector],
    order.staticExtradata,
    call.data,
    counterorder.staticExtradata,
    countercall.data,
    [call.howToCall, countercall.howToCall],
    metadata,
    defaultAbiCoder.encode(['bytes', 'bytes'], [sig, countersig]),
    { value: msgValue },
  )

export const cancelOrder = async (exchange: NaaSExchange, order: AtomicOrder) => {
  const hashedOrder = await exchange.hashOrder_(
    order.registry,
    order.maker,
    order.staticTarget,
    order.staticSelector,
    order.staticExtradata,
    order.maximumFill,
    order.listingTime,
    order.expirationTime,
    order.salt,
  )
  return exchange.setOrderFill_(hashedOrder, order.maximumFill)
}
