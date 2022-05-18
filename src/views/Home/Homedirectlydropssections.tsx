import React from 'react'
import camada from '../../images/camada.png'

const Homedirectlydropsection:React.FC=()=>{
    return(
        <div className='container-fluid directly-drop-section px-3 px-sm-4 py-5' style={{position:'relative'}}>
            <div  className='row mt-md-5'>
                <div className='col-sm-9 col-lg-7' style={{zIndex:'1'}}>
                    <p className='text-lg-right red-color mb-3 h2'>Create NFT Drops Directly on ADCC MKT</p>
                    <p className='text-white pl-lg-5 ml-lg-4 text-lg-right font-size-14'>Our platform allow artists to create NFT  drops directly on the platform without having to create a website, code smart contracts, and get in to the technical details of launching NFTs.</p>
                </div>
            </div>
            <img src={camada} alt="..." className='camada-img'/>
        </div>
    )
}
export default Homedirectlydropsection