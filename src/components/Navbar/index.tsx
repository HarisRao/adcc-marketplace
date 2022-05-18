import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Collapse,
  NavbarBrand,
  Navbar as BootstrapNavbar,
  Nav,
  Dropdown
} from 'react-bootstrap'
import { isEmpty } from 'lodash'
import { IRoute } from 'routes'
import { useActiveWeb3React } from 'hooks/web3'
import Authenticate from 'components/Authenticate'
import icon from '../../images/adcc-logo-nft.png'

interface Props {
  routes: IRoute[]
}

const Navbar: React.FC<Props> = ({ routes }) => {
  const { account } = useActiveWeb3React()

  const [dropDownOpen, setDropDownOpen] = useState(false)
  const toggleDropDown = () => {
    setDropDownOpen(!dropDownOpen)
  }

  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <BootstrapNavbar id="navigation" className="navbar-dark px-3 py-3 px-sm-4  py-sm-4" expand="lg">
      <BootstrapNavbar.Brand href="/" style={{ padding: 0 }}>
        <div className="logo-box-area">
          <img
            src={icon}
            alt=""
            className="header-top-logo"
            style={{ width: '200px' }}
          />
        </div>
      </BootstrapNavbar.Brand>

      <BootstrapNavbar.Toggle color="white" onClick={toggleMenu} />

      <BootstrapNavbar.Collapse className="mobile-collapse-show">

          <div className='mt-3 mb-1 mb-lg-0 mt-lg-0' style={{position:'relative'}}>
            <input className="form-control text-color w-100 navbar-search" type="search" placeholder="Search by collectible " aria-label="Search"/>
            <i className="fal fa-search search-icon"/>
          </div>

        <Nav className="m-auto">
          {routes.map((prop) => {
            if (prop.redirect || !prop.name) return null
            return (
              <NavLink
                exact={prop.exact}
                to={prop.path}
                className="nav-item nav-font nav-link text-color"
                activeClassName="item"
              >
                {prop.name}
              </NavLink>
            )
          })}
        </Nav>


        <Authenticate />


      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  )
}

export default Navbar
