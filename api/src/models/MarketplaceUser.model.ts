import { Model } from 'sequelize'

export default class MarketplaceUser extends Model {
  public publicAddress!: string

  public latestOrderNonce!: number
}
