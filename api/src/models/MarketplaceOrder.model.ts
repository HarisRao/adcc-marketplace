import { Model } from 'sequelize'

export default class MarketplaceOrder extends Model {
  public id!: number

  public chainId!: number

  public contractAddress!: string

  public subCollectionId!: string

  public tokenId!: string

  public user!: string

  public isBid?: boolean

  public isAuction?: boolean

  public isLazyMint?: boolean

  public price!: string

  public counterAssets!: string

  public data!: string

  public signature?: string

  public assetData?: string

  public mintData?: string

  public isDeleted?: boolean

  public isFulFilled?: boolean

  public createdAt?: Date

  public updatedAt?: Date
}
