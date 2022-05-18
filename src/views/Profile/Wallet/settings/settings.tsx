import React, { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
// import { Button } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import { useActiveWeb3React } from 'hooks/web3'
import Text from 'components/Text/Text'
import LinkExternal from 'components/Link/LinkExternal'
import Flex from 'components/Box/Flex'
import CopyToClipboard from 'components/WalletModal/CopyToClipboard'
import placeholder from '../../../../images/img-placeholder.png'
import '../../../Create/Create.css'
import {Button} from '../../../../components/Button/index'

const GeneralSettings: React.FC = () => {
  const { account } = useActiveWeb3React()

  const [profilePicture, setProfilePicture] = useState('')

  const onProfilePictureChange = (imageList: ImageListType) => {
    setProfilePicture(imageList[0].data_url)
  }

  return (
    <div>
      <div className="content container-fluid px-3 px-lg-4">
        {!isEmpty(account) ? (
          <div className="mt-4 pb-4">
            <p className="h3 text-white">General Settings</p>
            <p className="h6 text-color mt-4 mb-3">My Wallet Address</p>
            <form>
              <Text
                fontSize="20px"
                bold
                style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '8px' }}
                className="text-white"
              >
                {account}
              </Text>
              <Flex mb="32px">
                <LinkExternal small href={`https://bscscan.com/address/${account}`}>
                  View on BscScan
                </LinkExternal>
                <CopyToClipboard toCopy={account}>Copy Address</CopyToClipboard>
              </Flex>

              <div>
                <p className="h5 text-white" id="logo-image-font">
                  Profile Image
                </p>
                <ImageUploading value={[]} multiple onChange={onProfilePictureChange} dataURLKey="data_url">
                  {({ onImageUpload }) => (
                    <div>
                      {!isEmpty(profilePicture) ? (
                        <div
                          onClick={onImageUpload}
                          onKeyPress={onImageUpload}
                          role="button"
                          tabIndex={0}
                          style={{ cursor: 'pointer' }}
                        >
                          <img alt="..." src={profilePicture} id="image-bg-circle" />
                        </div>
                      ) : (
                        <div
                          id="image-bg-circle"
                          className="mt-3"
                          onClick={onImageUpload}
                          onKeyPress={onImageUpload}
                          role="button"
                          tabIndex={-1}
                          style={{ cursor: 'pointer' }}
                        >
                          <img alt="..." src={placeholder} id="circular-image" />
                        </div>
                      )}
                    </div>
                  )}
                </ImageUploading>
              </div>

              <div className="form-row mt-3">
                <div className="form-group col-md-5">
                  <label htmlFor="inputusername" className="h5 text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control create-form text-white"
                    id="inputusername"
                    placeholder="Enter Your Username"
                  />
                </div>
                <div className="form-group col-md-5">
                  <label htmlFor="inputemail" className="h5 text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control create-form text-white"
                    id="inputemail"
                    placeholder="Enter Your Email"
                  />
                </div>
              </div>

              <div className="form-row mt-3">
                <div className="form-group col-md-10">
                  <label htmlFor="textareabio" className="h5 text-white">
                    Bio
                  </label>
                  <textarea rows={5} className="form-control text-white create-textarea px-3 py-2" placeholder="Enter Your Bio...." id="textareabio" style={{ height: '100px' }} />
                </div>
              </div>
              <div className="form-row mt-2">
                <div className="d-flex col-10 justify-content-center">
                  {/* <Button id="create-save-btn" className='px-5'>Save</Button> */}
                  <Button>Save</Button>
                </div>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default GeneralSettings
