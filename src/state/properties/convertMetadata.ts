import {
  Order,
  Property,
  PropertyCollection,
  PropertyInformation,
  TokenMetadata,
  MetadataProperty,
} from 'state/types'

export const convertOrder = (order: Order) => {
  const metadata: TokenMetadata = JSON.parse(order.mintData)
  const collectionId = parseInt(order.subCollectionId)
  const tokenId = parseInt(order.tokenId)
  return convertMetadata(collectionId, tokenId, metadata)
}

export const convertMetadata = (collectionId: number, tokenId: number, metadata: TokenMetadata) => {
  const information: PropertyInformation = {
    name: metadata.name,
    description: metadata.description,
    image: metadata.image,
    bannerImages: metadata?.properties?.banner_images as string[],
    propertyType: (metadata?.properties?.property_type as MetadataProperty)?.value as string,
    location: (metadata?.properties?.location as MetadataProperty)?.value as string,
    bedrooms: (metadata?.properties?.bedrooms as MetadataProperty)?.value as number,
    bathrooms: (metadata?.properties?.bathrooms as MetadataProperty)?.value as number,
    size: (metadata?.properties?.size as MetadataProperty)?.value as string,
    area: (metadata?.properties?.area as MetadataProperty)?.value as string,
  }

  const property: Property = {
    ...information,
    id: tokenId,
    collectionId,
    price: (metadata?.properties?.price as MetadataProperty)?.value as string,
  }

  const collection: PropertyCollection = {
    ...information,
    id: collectionId,
    totalPrice: (metadata?.properties?.price as MetadataProperty)?.value as string,
    properties: {
      [tokenId]: { ...property, id: tokenId, collectionId },
    },
  }

  return collection
}
