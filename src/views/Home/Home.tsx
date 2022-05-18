import React from 'react'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
// import { Button } from 'reactstrap';
import ADCCAgent from 'components/ADCC_Agent/ADCCAgent'
import ADCCArtist from 'components/ADCC_Artist/ADCC_Artist';
import Newsletter from 'components/newsletter/newsletter'
import Homedirectlydropsection from './Homedirectlydropssections';
import './Home.css'
import adcchomebanner from '../../images/adcchomebanner.jpg'
import Halloffame from './halloffamesection';
import {Button} from '../../components/Button/index'

const bannerimages = [
  {
    img:adcchomebanner,
    name:'ANDRE GALVO',
    desc:'2011 WEIGHT & OPEN CLASS | 2013, 2015, 2017, 2019 SUPERFIGHT'
  },
  {
    img:adcchomebanner,
    name:'ANDRE GALVO',
    desc:'2011 WEIGHT & OPEN CLASS | 2013, 2015, 2017, 2019 SUPERFIGHT'
  },
  {
    img:adcchomebanner,
    name:'ANDRE GALVO',
    desc:'2011 WEIGHT & OPEN CLASS | 2013, 2015, 2017, 2019 SUPERFIGHT'
  },
]


const Home: React.FC = () => {
  return (
    <div className='container-fluid px-0 main-bg'>
      <Carousel showThumbs={false} showArrows={false}>
        {bannerimages.map((item)=>{
          return(
            <div>
              <img className='banner-image' alt="..." src={item.img} />
              <div className='banner-text'>
                <p className="mb-1 h1">{item.name}</p>
                <p className='mb-1 banner-desc'>{item.desc}</p>
                {/* <Button outline className='my-2 btn-see-more-banner'>SEE MORE</Button> */}
                <Button variant='secondary'>SEE MORE</Button>
              </div>
            </div>
          )
        })}
      </Carousel>
      
      
      <div className='px-3 px-md-0 py-5 bg-footer'>
        <p className='red-color mb-2 text-center h2'>The most needed NFT Marketplace</p>
        <p className='text-center mb-0 text-color'>ADCC NFT MARKETPLACE is an innovative NFT market that brings together talented creators, agents, and promoters.</p>
        <p className='text-center text-color'>Create your own collections, upload your work and earn!</p>
      </div>

      <Halloffame/>

      <p className='bg-red mb-0 py-2'/>
      <Newsletter/>
      <ADCCAgent/>
      <ADCCArtist/>
      <Homedirectlydropsection/>

    </div>
  )
}

export default Home
