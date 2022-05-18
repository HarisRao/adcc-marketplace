import React from 'react'
import Nftimg from '../../images/nft-img.jpg'
import Nftowner from '../../images/nft-owner.jpeg'


const NftCard:React.FC=()=>{
    return(
        <div className="card bg-transparent nft-card ">
            <div className='d-flex justify-content-center align-items-center'>
                <img className="card-img-top nft-card-img " src={Nftimg} alt="..." />
            </div>
            <div className="card-body pt-3 pb-1 pl-1 pr-1 ">
                <p className='text-white h5 mb-0 nft-name'>Walking On Air Walking On Air Walking On Air</p>
                <div className='mt-3' style={{position:'relative'}}>
                    <img src={Nftowner} className="nft-owner-img" alt="..." />
                    <span className='text-white ml-2 owner-name'>@ name</span>
                    <i className="fal fa-badge-check text-white bg-info verify-icon"/>
                </div>
                <hr className='footer-hr mb-2'  />
                <p className="text-color font-size-14 mb-0">Reserve price</p>
                <div className='d-flex justify-content-between align-items-center'>
                    <p className='mb-0 text-white h5 mt-1'>4.89 ETH</p>
                    <i className="far fa-heart text-white pointer like-icon"/>
                </div>
            </div>
        </div>
    )
}
export default NftCard