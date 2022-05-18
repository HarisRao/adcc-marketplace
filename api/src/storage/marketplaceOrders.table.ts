/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import { DefaultTypes } from '@passive-income/psi-api'
import MarketplaceOrder from '../models/MarketplaceOrder.model'

export const initMarketplaceOrderModel = (sequelize: Sequelize) => {
  MarketplaceOrder.init(
    {
      id: DefaultTypes.uint(false, {
        primaryKey: true,
        autoIncrement: true,
        validate: { isLowercase: true },
      }),
      chainId: DefaultTypes.uint(),
      contractAddress: DefaultTypes.string(false, { validate: { isLowercase: true } }),
      subCollectionId: DefaultTypes.string(true, { validate: { isLowercase: true } }),
      tokenId: DefaultTypes.string(false, { validate: { isLowercase: true } }),
      user: DefaultTypes.string(false, { validate: { isLowercase: true } }),
      isBid: DefaultTypes.bool(),
      isAuction: DefaultTypes.bool(),
      isLazyMint: DefaultTypes.bool(),
      price: DefaultTypes.string(),
      counterAssets: DefaultTypes.text(),
      data: DefaultTypes.text(),
      signature: DefaultTypes.text(),
      assetData: DefaultTypes.text(),
      mintData: DefaultTypes.text(true),
      isDeleted: DefaultTypes.bool(true),
      isFulFilled: DefaultTypes.bool(true),
    },
    {
      modelName: 'MarketplaceOrder',
      tableName: 'MarketplaceOrders',
      sequelize,
      timestamps: true,
    },
  )
}
