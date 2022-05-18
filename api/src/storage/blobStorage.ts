import { BlobServiceClient } from '@azure/storage-blob'
import { isUndefined } from 'lodash'
import { BlobStorageConnectionString } from '../config'

export const blobServiceClient = () => {
  if (isUndefined(BlobStorageConnectionString)) throw new Error('BlobStorageConnectionString is not configured')
  return BlobServiceClient.fromConnectionString(BlobStorageConnectionString)
}

export const getContainerClient = async (name: string) => {
  const containerClient = blobServiceClient().getContainerClient(name)
  const response = await containerClient.createIfNotExists()
  if (!response.succeeded && response.errorCode !== 'ContainerAlreadyExists')
    throw new Error(`${response.requestId} - ${response.errorCode}`)
  return containerClient
}

export const getMetadataFromBlob = async (address: string) => {
  const containerClient = await getContainerClient('metadata')
  const blockBlobClient = containerClient.getBlockBlobClient(`${address.toLowerCase()}.json`)
  const exists = await blockBlobClient.exists()
  if (exists) {
    const response = await blockBlobClient.download()
    if (response.readableStreamBody) {
      return (await streamToBuffer(response.readableStreamBody)).toString()
    }
  }
  return null
}

const streamToBuffer = async (readableStream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}

export const uploadMetadataToBlob = async (address: string, contents: string) => {
  const containerClient = await getContainerClient('metadata')
  const blockBlobClient = containerClient.getBlockBlobClient(`${address.toLowerCase()}.json`)
  await blockBlobClient.upload(contents, contents.length)
}

// export const getMetadataForToken = async (address: string) => {
//   const containerClient = await getContainerClient("metadata")
//   const batchClient = containerClient.getBlobBatchClient()
//   const batch = batchClient.createBatch()

//   files.map((file) => {
//     batch.u
//     containerClient.getBlockBlobClient(file.toLowerCase());
//     const uploadBlobResponse = await blockBlobClient.upload(file, file.length);
//   })
//   const blockBlobClient = containerClient.getBlockBlobClient(blobName);
// }
