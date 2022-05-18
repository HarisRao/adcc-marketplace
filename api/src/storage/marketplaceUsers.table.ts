/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import { DefaultTypes } from '@passive-income/psi-api'
import MarketplaceUser from '../models/MarketplaceUser.model'

export const initMarketplaceUserModel = (sequelize: Sequelize) => {
  MarketplaceUser.init(
    {
      publicAddress: DefaultTypes.string(false, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      latestOrderNonce: DefaultTypes.int(true),
    },
    {
      modelName: 'MarketplaceUser',
      tableName: 'MarketplaceUsers',
      sequelize,
      timestamps: true,
    },
  )
}
