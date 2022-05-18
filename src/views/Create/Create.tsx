import React, { useEffect, useMemo, useState } from 'react'
import { Form, InputGroup  } from 'react-bootstrap'
import { isEmpty, isNil } from 'lodash'
import { BigNumber } from '@ethersproject/bignumber'
import { useActiveWeb3React } from 'hooks/web3'
import { useNaaSProxyApproval } from 'hooks/useProxy'
import { PropertyCreationInformation, PropertyUser } from 'state/types'
import { useListNewProperty, useToken } from 'state/hooks'
import validate, { validateSingle } from 'utils/validate'
import { formatBN } from 'utils/formatters'
import Loader from 'components/Loader'
import tokens from 'config/constants/tokens'

import './Create.css'
import ImageUploader from './components/ImageUploader'
import bnb from '../../images/bitcoin.png'
import Creators from './components/Creators'
import {Button} from '../../components/Button/index'

const Create: React.FC = () => {
  // const { account } = useActiveWeb3React()
  // const { token, isLoadingToken } = useToken(tokens.busd)

  // const [price, setPrice] = useState<BigNumber>()
  // const [property, setProperty] = useState<Partial<PropertyCreationInformation>>({
  //   amountToMint: 1,
  //   totalSupply: 1,
  //   creators: [{ address: account, value: 100 }],
  // })

  // useEffect(() => {
  //   if (account && property) {
  //     if (property.creators?.length) property.creators[0].address = account
  //     // default 1% fee on page load
  //     if (!property.royalties) property.royalties = [{ address: account, value: 1 }]
  //   }
  // }, [account, property])

  // const [submitClicked, setSubmitClicked] = useState(false)

  // const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  // const changeValue = (value: string, name: string, type: string, mandatory = true, extra?: any) => {
  //   const { newValue, newErrors } = validate(property, validationErrors, value, name, type, mandatory, extra)
  //   setValidationErrors(newErrors)
  //   setProperty(newValue)
  // }
  // const changePrice = (value: string) => {
  //   const { value: newValue, error } = validateSingle<BigNumber>(value, 'BigNumber', true, token?.decimals)
  //   setValidationErrors({ ...validationErrors, price: error })
  //   setPrice(newValue)
  // }

  // const mandatoryErrors = useMemo(() => {
  //   const _errors: { [key: string]: string } = {}
  //   if (isEmpty(property.name)) _errors.name = 'This field is required'
  //   if (isEmpty(property.location)) _errors.location = 'This field is required'
  //   if (isEmpty(property.description)) _errors.description = 'This field is required'
  //   if (isNil(property.amountToMint) || property.amountToMint <= 0) _errors.amountToMint = 'This field is required'
  //   if (isNil(price) || price.lte(0)) _errors.price = 'This field is required'
  //   return _errors
  // }, [property, price])

  // const errors: { [key: string]: string } = useMemo(() => {
  //   const filteredErrors = Object.fromEntries(Object.entries(validationErrors).filter(([, v]) => !isEmpty(v)))
  //   const _errors = { ...(submitClicked ? mandatoryErrors : {}), ...filteredErrors }

  //   if (property.creators?.length && property.creators.reduce((total, user) => total + user.value, 0) !== 100)
  //     _errors.creators = 'Total percentage of creators must be 100%'
  //   if (property.creators?.length && property.creators[0].address !== account)
  //     _errors.creators = 'First creator must be the connected wallet'
  //   if (property.royalties && property.royalties.reduce((total, user) => total + user.value, 0) > 100)
  //     _errors.royalties = 'Total percentage of royalties cannot be more then 100%'

  //   return _errors
  // }, [validationErrors, submitClicked, mandatoryErrors, property, account])

  // const valid = useMemo(() => isEmpty(errors) && isEmpty(mandatoryErrors), [errors, mandatoryErrors])

  // const { registered, register, registring, approve, approving, approved } = useNaaSProxyApproval()
  // const { listProperty, listing } = useListNewProperty()

  // const onSubmitText = !registered ? 'Register proxy' : !approved ? `Approve proxy` : 'List property'
  // const onSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  //   event.preventDefault()
  //   if (!submitClicked) setSubmitClicked(true)
  //   if (valid) {
  //     if (!registered) await register()
  //     else if (!approved) await approve()
  //     else {
  //       if (!property.totalSupply) property.totalSupply = 1 // default NFT
  //       property.creators = property.creators.map(c => ({ ...c, value: c.value * 100 }))
  //       await listProperty(property, token, price)
  //     }
  //   }
  // }

  // const onPropertyImageChange = (file: File) => setProperty({ ...property, uploadImage: file })
  // const onBannerImageChange = (file: File) => setProperty({ ...property, uploadBannerImages: [file] })

  // const onCreatorsChange = (creators: PropertyUser[]) => setProperty({ ...property, creators })
  // const onCreatorsError = (key: string, error: string) => setValidationErrors({ ...validationErrors, [key]: error })

  // const loading = isLoadingToken || registring || approving || listing

  return (
    <div className='container-fluid p-0 m-0 main-bg'>
      
      {/* <Loader loading={loading} /> */}

      <div className="container mb-2">
        <p className="h1 pt-3 text-white">
          Create
        </p>
        <p className="h6 text-color">
          Create your NFT
        </p>
      </div>

      <hr className='footer-hr' />

      <div className="container">
        <div className="h5 text-white" style={{ fontSize: '22px'}}>
          Featured Image
        </div>
        <p className="font-size-14 text-color">
          (optional) This image will be used for featuring your collection on the homepage, category pages, or other
          areas. Image size 600 x 400 recommended.
        </p>
        <ImageUploader inputId="input-file" alt="profile" />
      </div>

      <div className="container">
        <div className="form-row">
          <div className="form-group col-md-6">
            <Form.Label className="h5 text-white">Name</Form.Label>
            <Form.Control
              className="form-control create-form text-white"
              type="text"
              placeholder="Name of your nft"
            />
          </div>   
        </div>
      </div>

      <div className="container">
        <div className="form-row">
          <div className="form-group col-md-6">
            <Form.Label className="h5 text-white">Amount to mint</Form.Label>
            <Form.Control
              type="number"
              className="form-control create-form text-white"
              placeholder="Total Supply"
              disabled
            />
          </div>
          <div className="form-group col-md-6">
            <Form.Label className="h5 text-white">
              Total Supply <small>(1 for a regular NFT)</small>
            </Form.Label>
            <Form.Control
              type="number"
              className="form-control create-form text-white"
              placeholder="Total Supply"
              disabled
            />
          </div>
        </div>
      </div>
 
      {/* <Creators
        users={property.creators}
        errors={validationErrors}
        onChange={onCreatorsChange}
        onError={onCreatorsError}
      /> */}

      <Creators/>

      <div className="container">
        <div className="row mt-3 mb-3">
          <div className="col-12">
            <Form.Label className="h5 text-white">Description</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: '100px' }}
              className="form-control create-textarea text-white py-1 px-2 textarea"
              placeholder="NFT description (max. 1000 characters)"
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-row">
          <div className="form-group col-md-6">
            <Form.Label className="h5 text-white">Price</Form.Label>
            <InputGroup >
              <Form.Control
                type="number"
                className="form-control create-prepend-form text-white"
                placeholder="Enter the price"
              />
              <InputGroup.Text className="create-append-form text-white">BTC</InputGroup.Text>
            </InputGroup >
          </div>
        </div>

        <div className="form-group">
          <div className="row mb-3" style={{ marginLeft:'-10px' }}>
            <div className="col-12 col-md-5 col-lg-3">
              <div className="payment-token mt-3" style={{ cursor: 'pointer' }}>
                <span
                  style={{
                    backgroundColor: '#171717',
                    padding: '15px',
                    borderRadius: '13px',
                  }}
                >
                  <img
                    src={bnb}
                    alt="..."
                    className="payment-token-bnb"
                  />
                </span>
                <div style={{ padding: '10px', textAlign: 'center', width: '155px' }}>
                  <span className="CreateCoin text-white">BTC</span>
                  <br style={{ lineHeight: '0px' }} />
                  <span className="text-white h5 fw-normal">bitcoin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="form-row mt-4 pb-4">
          <div className="d-flex col-10 mt-2 pb-2 justify-content-start">
            {/* <Button id="create-save-btn" className='px-4 py-1 pointer'>
              Create
            </Button> */}
            <Button style={{fontSize:'20px'}}>
              Create
            </Button>
          </div>
        </div>
      </div> 

    </div>
  )
}

export default Create
