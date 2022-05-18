import React from 'react'
import '../../App.scss'
import './packs.css'
import Packcard from 'components/packcards/packcards'
import ADCCAgent from 'components/ADCC_Agent/ADCCAgent'
import packets from '../../images/packets.jpg'
import bg from '../../images/packs-bg.jpg'

const packsitems=[1,2,3,4,5,6,7,8,9,10]

const Packs:React.FC=()=>{
    return(
        <div>
            <div className='containerfluid px-3 px-sm-4 pt-3 main-bg'>
                <p className="text-white pack-heading mb-0">PACKS</p>
                <div className='row mt-4 mx-0 pb-4'>
                    <div className='col-lg-8 px-0 px-lg-2 mb-3 mb-lg-0 d-flex align-items-center' style={{position:'relative'}}>
                        <img src={bg} alt="..." className='w-100' />
                        <div className='text-white build-cards-text'>BUILD THE<br/>2022 CARDS</div>
                    </div>
                    <div className='col-lg-4 px-0 px-lg-3'>
                        <div className='bg-red p-3 d-flex justify-content-between align-items-center main-packs-time-div '>
                            <div>
                                <p className='mb-0 h6 text-white'>NEXT DROP</p>
                                <p className='text-white mb-0 packs-time-font'>12:00 PM PST, TUE, DEC 21</p>
                            </div>
                            <div>
                                <i className="fal fa-alarm-clock packs-alarm-icon"/>
                            </div>
                        </div>
                        <img src={packets} alt="..." className='w-100' />
                    </div>
                </div>

                <div className='d-flex justify-content-between align-items-center mt-5 pb-3'>
                    <p className="text-white featured-pack-heading mb-0">FEATURED PACKS</p>
                    <p className="text-white view-heading mb-0">VIEW ALL</p>
                </div>

                <div className='row'>
                    {packsitems.map(()=>{
                        return(
                            <div className='col-sm-6 px-sm-1 px-md-2 col-md-4 col-lg-3 mb-4'>
                                <Packcard/>
                            </div>
                        )
                    })}
                </div>
            </div>
            <p className='bg-footer mb-0 py-2'/>
            <ADCCAgent/>
        </div>
    )
}
export default Packs