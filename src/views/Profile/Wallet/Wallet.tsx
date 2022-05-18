import React, { useState } from 'react'
import Loader from 'components/Loader'
import { useActiveWeb3React } from 'hooks/web3'
import WalletTabs from './WalletTabs'
import user from '../../../images/user.png'
import Verification from './settings/KycVerification'

const Wallet: React.FC = () => {
  const { account } = useActiveWeb3React()
  // const { properties, isLoading } = useUserProperties()
  // const { orders, isLoadingOrders } = useMarketplaceOrders(true)

  // const [handlingProperty, setHandlingProperty] = useState(false)
  // const onHandlingProperty = (value: boolean) => setHandlingProperty(value)

  return (
    <div className='container-fluid px-0 pt-5 main-bg'>
      <div className='row mx-0 px-2 px-sm-4 mb-4'>
      {/* <Loader loading={isLoading || isLoadingOrders || handlingProperty} /> */}
        <div className='col-md-8 profile-section-on-small-screen d-flex justify-content-center justify-content-md-start mb-4 mb-md-0'>
          <img src={user} alt="" width="100" height="100" className="" />
          <div className='pl-3 pl-md-5'>
            <div className='text-color mb-2'>
              Wallet Address<br/>
              <span  className="font-weight-600 text-white wallet-address-font">{account}</span>
            </div>
            <Verification/>
          </div>
        </div>
        <div className="col-md-4 d-md-flex justify-content-center align-items-center">
          <div className='text-white text-center h5 text-color'>
            Owned Nfts<br/>
            <span className='pt-2'>8</span>
          </div>
        </div>
      </div>
      <hr className='footer-hr my-1' />



      <WalletTabs />


    </div>
  )
}

export default Wallet
