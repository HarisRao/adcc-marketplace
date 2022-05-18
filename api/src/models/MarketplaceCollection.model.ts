import { Model } from 'sequelize'

export default class MarketplaceCollection extends Model {
  public chainId!: number

  public contractAddress!: string

  public subCollectionId!: string

  public owner?: string

  public description?: string

  public currentId?: number
}
