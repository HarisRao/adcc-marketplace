import React from 'react'
// import {Button} from 'reactstrap'
import gear from '../../images/gear.png'
import {Button} from '../Button/index'

const ADCCArtist:React.FC=()=>{
    return(
        <div className='container-fluid bg-footer px-3 px-md-0 py-5'>
            <div className='row mx-0'>
                <div className='col-lg-6 offset-lg-3'>
                    <p className='text-white text-center mb-2 h2'>Become a Creator in the ADCC Ecosystem</p>
                    <p className='text-white text-center font-size-14'>The first 100 creators on the platform will get priveleged whitelist access to NFT artist drops.</p>
                    <div className='d-flex justify-content-center mt-4 mb-3'>
                        {/* <Button className='artist-btn pointer font-weight-bold'>CREATE ARTIST ACCOUNT</Button> */}
                        <Button>CREATE ARTIST ACCOUNT</Button>
                    </div>
                    <div className='d-flex justify-content-center mb-3 mb-lg-5'><img src={gear} className="w-50" alt="...." /></div>
                </div>
            </div>

        </div>
    )
}
export default ADCCArtist