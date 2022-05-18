import React from 'react'
// import {Button} from 'reactstrap'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import HallOfFameCard from 'components/halloffamecard/halloffamecard';
import {Button} from '../../components/Button/index'

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

const items=[1,2,3.4,5,6,7,8,9,10]

const Halloffame:React.FC=()=>{
    return(
        <div className='container-fluid pl-3 py-5 pl-sm-4 pr-0 hall-of-fame-bg'>
            <div className='row mx-0'>
                <div className='col-lg-3 d-flex flex-column justify-content-end pb-lg-5'>
                    <p className='text-white mb-0 text-sm-right hall-of-fame-header'>HALL OF FAME</p>
                    <p className='text-color mb-1 text-sm-right font-size-14'>An exclusive series featuring the 15 most important fighters in all ADCC history</p>
                    <p className='red-color h2 text-sm-right'>NFT</p>
                    <hr className='my-1 footer-hr ml-sm-5'/>
                    <p className='text-color mb-1 text-sm-right font-size-14'>15 multimedia containing photos and videos of important moments.</p>
                    <div className='d-flex justify-content-sm-end mt-3'>
                      {/* <Button className='hall-of-fame-seemore-btn px-3'>SEE MORE</Button> */}
                      <Button>SEE MORE</Button>

                    </div>
                </div>
                <div className='col-lg-9 mt-5 hall-of-fame-slider' style={{overflow:'hidden'}}>
                   <Carousel
                      swipeable
                      draggable
                      showDots={false}
                      responsive={responsive}
                      autoPlaySpeed={3000}
                      keyBoardControl
                      arrows={false}
                      autoPlay
                      infinite
                    >
                      {items.map((index)=>{
                        return(
                          <HallOfFameCard/>
                        )
                      })}
                    </Carousel>;
                </div>
            </div>

        </div>
    )
}
export default Halloffame