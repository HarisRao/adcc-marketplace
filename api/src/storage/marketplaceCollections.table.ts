/* eslint-disable import/prefer-default-export */
import { Sequelize } from 'sequelize'
import { DefaultTypes } from '@passive-income/psi-api'
import MarketplaceCollection from '../models/MarketplaceCollection.model'

export const initMarketplaceCollectionModel = (sequelize: Sequelize) => {
  MarketplaceCollection.init(
    {
      chainId: DefaultTypes.uint(false, { primaryKey: true }),
      contractAddress: DefaultTypes.string(false, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      subCollectionId: DefaultTypes.string(false, {
        primaryKey: true,
        validate: { isLowercase: true },
      }),
      owner: DefaultTypes.string(false, { validate: { isLowercase: true } }),
      description: DefaultTypes.text(true),
      currentId: DefaultTypes.uint(true)
    },
    {
      modelName: 'MarketplaceCollection',
      tableName: 'MarketplaceCollections',
      sequelize,
      timestamps: true,
    },
  )
}
