import React from 'react'
import hallcardimg from '../../images/hall-cards.jpg'



const HallOfFameCard:React.FC=()=>{
    return(
        <div className='mx-2 hall-div'>
            <div className="card bg-transparent" style={{border:'none'}}>
                <div className='d-flex justify-content-center'>
                    <img className="card-img-top hall-of-fame-card-img"  style={{borderRadius:'10px'}} src={hallcardimg} alt="..."/>
                </div>
                <div className="card-body pr-1 pl-0 pl-sm-0 pt-3 pb-4">
                    <p className='text-white pr-1 pl-1 pl-sm-0 text-sm-right mb-1'>KYRA GRACIE</p>
                    <p className="text-color pr-1 pl-1 pl-sm-0 font-size-14 text-sm-right mb-0" style={{lineHeight:'18px'}}>Kyra Gracie was born on the 29th of May, 1985.She was the grandaughter of Robson Gracie, who is the second son of BJJ founder Carlos Gracie (senior).Kyra Gracie was born on the 29th of May, 1985.Kyra Gracie was born on the 29th of May, 1985.</p>
                </div>
            </div>

        </div>
    )
}
export default HallOfFameCard