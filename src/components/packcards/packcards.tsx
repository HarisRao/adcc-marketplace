import React from 'react'
import packscard from '../../images/packs-card.jpg'

const Packcard:React.FC=()=>{
    return(
        <div className="card bg-transparent" style={{border:'none'}}>
          <img className="card-img-top" src={packscard} alt="..."/>
          <div className="card-body">
            <p className="text-white h5 mb-0 text-center">STARTER PACK</p>
            <p className='font-size-14 text-center mb-3 text-color'>Release 1</p>
            <p className='font-size-14 text-center h3 mb-0 text-white'>USD $89.00</p>
          </div>
        </div>
    )
}
export default Packcard