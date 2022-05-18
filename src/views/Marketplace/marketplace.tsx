import React from 'react'
import NftCard from 'components/nftcard/nftcard'
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Marketplacenftdrops from './marketplacenftdrops'
import artgallerybanner from '../../images/art-gallery-banner.jpg'
import '../../App.scss'
import './marketplace.css'
import Marketplaceslider from './marketplaceslider';


const nftitems=[1,2,3,4,5,6,7,8,9,10]

const Marketplace:React.FC=()=>{
    return(
        <div className='container-fluid px-0 bg-footer '>
            <div style={{position:'relative'}}>
                <img src={artgallerybanner} alt="..." className='w-100' />
                <div className='artgallery-banner-text'>
                    <p className='text-white text-sm-right mb-0 mb-sm-1 h1 line-height-32'>ART<br/>GALLERY</p>
                    <p className='text-color line-height-18 text-sm-right mb-0 pl-ms-5 ml-sm-5 font-size-14'>An exclusive series featuring the photos for the fighters in all ADCC history</p>
                    <hr className='footer-hr mt-1 mb-1 mt-sm-3 mb-sm-2' />
                    <p className='mb-0 red-color text-sm-right h3'>NFT</p>
                    <p className='text-color line-height text-sm-right mb-0 pl-sm-5 ml-sm-5 font-size-14'>Multimedia posters containing photos and videos of moments.</p>
                </div>
            </div>

            <p className='bg-red mb-0 py-2'/>

            <Marketplaceslider/>
            
            <p className='bg-red mb-0 py-2'/>


            <div className='mt-5 mb-3 px-3 px-sm-4'>
                <div className='row'>
                    {nftitems.map(()=>{
                        return(
                            <div className='col-sm-6 px-sm-1 px-md-2 col-md-4 col-lg-3 mb-4'>
                                <NftCard/>
                            </div>
                        )
                    })}
                    
                </div>

                <div className='d-sm-flex justify-content-between align-items-center mb-4 pagination-main-div'>
                    <div className='text-color text-center mb-2 mb-sm-0 text-sm-left font-weight-600'>10 from 189</div>
                    <Pagination  aria-label="Page navigation example">
                        <PaginationItem>
                            <PaginationLink href="#" ><i className="fas fa-angle-double-left pagination-arrow"/></PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink href="#"><i className="fas fa-angle-double-right pagination-arrow"/></PaginationLink>
                        </PaginationItem>
                    </Pagination>
                </div>



            </div>

            <Marketplacenftdrops/>


        </div>
    )
}
export default Marketplace