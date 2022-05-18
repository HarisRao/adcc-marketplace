import React, { lazy } from 'react'
import { Tab, Row, Col, Nav } from 'react-bootstrap'
import NftCard from 'components/nftcard/nftcard'
import GeneralSettings from './settings/settings'


const nftitems=[1,2,3,4,5,6,7,8,9,10]

const tabs = [
  { name: 'Owned NFTs', key: 'owned-nfts' },
  { name: 'Favorites', key: 'favorites' },
  { name: 'General Settings', key: 'settings' },
]

const WalletTabs: React.FC = () => {
  return (
    <div className="container-fluid px-2 px-sm-3">
      <Tab.Container defaultActiveKey="owned-nfts">
        <Row style={{ margin: '0px', minHeight: '300px' }}>
          <Col lg={2} className="px-lg-0 mt-lg-3 mt-3">
            <Nav variant="tabs" className="flex-md-column border-0">
              {tabs.map((tab) => (
                <Nav.Item className="mt-2 ">
                  <Nav.Link eventKey={tab.key} className="wallet-tabs">{tab.name}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col lg={10} className="px-sm-0">
            <Tab.Content>
              <Tab.Pane eventKey="owned-nfts">
                <div className='row ml-lg-2 ml-0 mr-0 mt-4'>
                  {nftitems.map(()=>{
                    return(
                      <div className="col-sm-6 col-lg-4 px-0 px-sm-2 mb-4">
                        <NftCard/>
                      </div>
                    )
                  })}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="favorites">
                <div className='row ml-lg-2 ml-0 mr-0 mt-4'>
                  {nftitems.map(()=>{
                    return(
                      <div className="col-sm-6 col-lg-4 px-0 px-sm-2 mb-4">
                        <NftCard/>
                      </div>
                    )
                  })}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="settings">
                <GeneralSettings />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  )
}

export default WalletTabs
