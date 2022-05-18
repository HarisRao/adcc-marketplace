import React from 'react'
// import {Button} from 'reactstrap'
import {Button} from '../Button/index'
import uniswap from '../../images/uniswap.png'
import zerion from '../../images/zerion.png'
import cmc from '../../images/cmc.png'
import pancake from '../../images/pancakeswap.png'
import certik from '../../images/certik.png'


const exchanges=[uniswap,zerion,cmc,pancake,certik]


const NewsLetter: React.FC = () => (
  <div className='container-fluid bg-footer py-5'>
    <div className='row px-sm-0 px-2'>
      <div className='col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3'>
        <p className='text-white text-center h2'>Never miss a drop</p>
        <p className='text-center text-white font-weight-600'>Subscribe for the latest news, drops & collectibles.</p>
          <form>
            <div className='d-flex justify-content-between my-3'>
              <input type="email" className="form-control bg-transparent newsletter-input" placeholder="Email"/>
              <Button className='ml-3'>SUBSCRIBE</Button>
              {/* <Button className='ml-3 newsletter-btn px-3'>SUBSCRIBE</Button> */}
            </div>
          </form>
        <p className='text-center text-white font-size-14 mb-0'>You may subscribe our newsletter to get special offers and occasional surveys delivered to your inbox.</p>
        <p className='text-center text-white font-size-14'>Unsubscribe at any time by clicking on the link in the email.</p>
      </div>
    </div>
    <div className='container mt-4'>
      <ul className='d-flex justify-content-between exchange-ul'>
        {exchanges.map((img)=>{
          return(
            <li className='px-3'>
              <img className='exchange-logo' src={img} alt="..." />
            </li>
          )
        })}
      </ul>

    </div>

  </div>
)

export default NewsLetter
