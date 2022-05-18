import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import MarketplacesliderCard from 'components/Marketplaceslidercard/Marketplaceslidercard';

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1441 },
        items: 1
      },
      desktop: {
        breakpoint: { max: 1440, min: 1076 },
        items: 1,
      },
      tablet: {
        breakpoint: { max: 1075, min: 993 },
        items: 1
      },
      tablet1: {
          breakpoint: { max: 992, min: 768 },
          items: 1
        },
      mobile: {
        breakpoint: { max: 767, min: 0 },
        items: 1
      }
  };

const items=[1,2,3,4,5,6,7,8,9,10]

const Marketplaceslider:React.FC=()=>{
    return(
        <div className='container-fluid py-5 pl-2 pl-sm-4 pr-0 art-gallery-slider-div'>
          <div className='my-5 hall-of-fame-slider' style={{position:'relative',overflow:'hidden'}}>
             <Carousel
              swipeable
              draggable
              // showDots
              responsive={responsive}
              autoPlaySpeed={3000}
              keyBoardControl
              arrows={false}
              autoPlay
              infinite
              // renderDotsOutside
            >
              {items.map(()=>{
                return(
                  <MarketplacesliderCard/>
                )
              })}
            </Carousel>;
          </div>
        </div>
    )
}
export default Marketplaceslider