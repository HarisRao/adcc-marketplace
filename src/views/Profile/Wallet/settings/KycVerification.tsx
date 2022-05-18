import React from 'react'
import VerifyButton from '@passbase/button/react'
import { PASSBASE_API_KEY } from 'config/constants/misc'
import { useUserKYC } from 'state/hooks'
import { isUndefined } from 'lodash'

const KycVerification: React.FC = () => {
  const { onStart, onSubmit, onError, account, kyced, kycStatus } = useUserKYC()

  return (
    <div className="content KYC-box">
      <div className="row">
        <div className="col-md-12">
          <div>
            {account ? (
              <>
                {kyced ? (
                  <h5 className='font-weight-600 text-white wallet-address-font'>
                    Kyc Verified
                    <i className="fa fa-check ps-1 kyc-check" aria-hidden="true" />
                  </h5>
                ) : !isUndefined(kycStatus) && kycStatus?.toLowerCase() !== "declined" ? (
                  <h5 className='font-weight-600 text-white wallet-address-font'>
                    Kyc status: {kycStatus}
                  </h5>
                ) : (
                  <div>
                    <VerifyButton
                      apiKey={PASSBASE_API_KEY}
                      onStart={onStart}
                      onSubmitted={onSubmit}
                      onError={onError}
                      prefillAttributes={{
                        email: '',
                      }}
                      theme={{
                        darkMode: false,
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <h3 className='text-white'>Please Log In wallet</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default KycVerification
