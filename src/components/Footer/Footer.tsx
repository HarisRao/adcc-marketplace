import React from 'react'
import { Link } from 'react-scroll'
import { NavLink } from 'react-router-dom'
import adcclogo from '../../images/adcc-logo-nft.png'

const Footer: React.FC = () => (
    <div className='container-fluid px-2 px-sm-4 pt-3 pb-3 pt-sm-5 pb-sm-3 bg-footer'>
            <div className='container pt-3 pt-sm-0 text-center text-sm-start'>
              <div className='row'>
                  <div className='col-sm-6 mb-3 mb-lg-0 col-lg-3'>
                      <img src={adcclogo} className="nav-logo pointer mb-4" alt="..." />
                      <p className='text-white footer-creative-font'>The New Creative Economy.</p>
                  </div>
                  <div className='col-sm-6 mb-3 mb-lg-0 col-lg-3'>
                      <span className='red-color footer-ul-header'>ADCC NFT</span>
                      <ul className='pl-0 mt-4'>
                          <li className='text-color mb-2 footer-li'>How it works</li>
                          <li className='text-color mb-2 footer-li'>Support</li>
                          <li className='text-color footer-li'>Became an agent</li>
                      </ul>
                  </div>
                  <div className='col-sm-6 mb-3 mb-lg-0 col-lg-3'>
                      <span className='text-white h6 footer-ul-header'>Community</span>
                      <ul className='pl-0 mt-4'>
                          <li className='text-color mb-2 footer-li'>Swapp Token</li>
                          <li className='text-color footer-li'>Documentation</li>
                      </ul>
                  </div>
                  <div className='col-sm-6 mb-3 mb-lg-0 col-lg-3'>
                      <span className='text-white h6 footer-ul-header'>Join Newsletter</span>
                      <ul className='pl-0 mt-4'>
                          <li className='text-white mb-4 footer-li'>Get the latest Swapp Nft updates</li>
                          <li className='text-color footer-li' style={{position:'relative'}}>
                            <input className="form-control text-color w-100 footer-search px-3 py-2" type="email" placeholder="Enter your email" aria-label="Search"/>
                            <i className="text-color footer-email-icon fas fa-arrow-circle-right" />
                          </li>
                      </ul>
                  </div>
              </div>
              <hr className="footer-hr" />
              <div className='d-sm-flex justify-content-between mt-4'>
                <p className="mb-0 text-color copyright-footer-font">Copyright © 2022 ADCC NFT MKT.All rights reserved</p>
                <div className='mt-3 mt-sm-0'>
                  <i className="pointer footer-icon-font fab fa-telegram-plane text-color" />
                  <i className="pointer footer-icon-font text-color pl-3 fab fa-twitter"/>
                  <i className="pointer footer-icon-font text-color pl-3 fab fa-instagram"/>
                  <i className="pointer footer-icon-font text-color pl-3 fab fa-discord"/>
                  <i className="pointer footer-icon-font text-color pl-3 fab fa-facebook-square"/>
                </div>
              </div>
            </div>
        </div>
)

export default Footer
