import Loader from 'components/LoaderCircle'
import useAuth from 'hooks/useAuth'
import { useActiveWeb3React } from 'hooks/web3'
import React from 'react'
import { useLogin } from 'state/hooks'
import { useWalletModal } from '../WalletModal'

const Authenticate: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { connect, disconnect } = useAuth()

  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(connect, disconnect, account)
  const { isLoggedIn, isLoggingIn, user, login } = useLogin()

  let displayName = user?.username
  if (!displayName) {
    displayName = account ? `${account.substring(0, 4)}...${account.substring(account.length - 4)}` : null
  }

  return (
    <div className="authentication">
      {isLoggingIn ? (
        <Loader />
      ) : (
        <>
          {account ? (
            <>
              {isLoggedIn ? (
                <button
                  type="submit"
                  className="px-4 py-2 text-white pointer ml-lg-0 mt-2 mt-lg-0 connect-btn-color"
                  onClick={() => {
                    onPresentAccountModal()
                  }}
                >
                  {displayName}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 text-white pointer py-2 ml-lg-0 mt-2 mt-lg-0 connect-btn-color"
                  onClick={() => {
                    login()
                  }}
                >
                  Login
                </button>
              )}
            </>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 text-white ml-lg-0 mt-2 mt-lg-0 connect-btn-color"
              onClick={() => {
                onPresentConnectModal()
              }}
            >
              Connect Wallet
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default Authenticate
