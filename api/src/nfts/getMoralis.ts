import Moralis from 'moralis/node'
import { MoralisAppId, MoralisServerUrl, MoralisApiSecret } from '../config'

const getMoralis = async () => {
  if (!Moralis.isInitialized) {
    const serverUrl = MoralisServerUrl
    const appId = MoralisAppId
    const moralisSecret = MoralisApiSecret
    await Moralis.start({ serverUrl, appId, moralisSecret })
  }
  return Moralis
}

export default getMoralis