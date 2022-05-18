import { Sequelize } from 'sequelize'
import fs from 'fs'
import appRoot from 'app-root-path'
import { initUserModel, storageSettings } from '@passive-income/psi-api'
import { initMarketplaceUserModel } from './marketplaceUsers.table'
import { initMarketplaceCollectionModel } from './marketplaceCollections.table'
import { initMarketplaceOrderModel } from './marketplaceOrders.table'

let sequelize: Sequelize | null = null
// eslint-disable-next-line import/prefer-default-export
export const initSequelize = async (): Promise<Sequelize> => {
  if (sequelize !== null) return sequelize

  let {certificate} = storageSettings
  if (certificate.endsWith(".pem")) certificate = fs.readFileSync(`${appRoot.path}/ssl/${certificate}`, 'utf8')
  else {
    // DIRTY code to make it possible to set certificate in f.e. single line json
    certificate = certificate.replace("-----BEGIN CERTIFICATE-----", "").replace("-----END CERTIFICATE-----", "").split(" ").join("\n")
    certificate = `-----BEGIN CERTIFICATE-----${certificate}-----END CERTIFICATE-----`
  }

  sequelize = new Sequelize({
    database: storageSettings.database,
    username: storageSettings.username,
    password: storageSettings.password,
    host: storageSettings.host,
    port: 3306,
    logging: false,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: true,
        ca: certificate,
      },
    },
    pool: {
      max: 15,
      min: 5,
      idle: 5000,
      evict: 15000,
      acquire: 30000
    },
  })

  initUserModel(sequelize)
  initMarketplaceUserModel(sequelize)
  initMarketplaceCollectionModel(sequelize)
  initMarketplaceOrderModel(sequelize)

  // const table = await sequelize.query('SHOW Tables')
  // console.log('table', table)

  // Create new tables
  await sequelize.sync()

  return sequelize
}
