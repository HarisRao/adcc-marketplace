import React from 'react'
import { useLogin } from 'state/hooks'
import Wallet from './Wallet'

const Profile: React.FC = () => {
  const { isLoggedIn } = useLogin()
  return (
    <div className="content main-bg">
      {/* {!isLoggedIn ? (
        <div className="d-flex align-items-center justify-content-center"  style={{ minHeight: '300px' }}>
          <h2 className="text-center text-white">Please login to view this content</h2>
        </div>
      ) : (
        <div className="col-md-12">
          <Wallet />
        </div>
      )} */}
      
        <div>
          <Wallet />
        </div>
    </div>
  )
}

export default Profile
