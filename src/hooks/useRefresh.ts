import { useContext } from 'react'
import { RefreshContext } from 'contexts/RefreshContext'

const useRefresh = () => {
  const { fast, slow, block } = useContext(RefreshContext)
  return { fastRefresh: fast, slowRefresh: slow, blockRefresh: block }
}

export default useRefresh
