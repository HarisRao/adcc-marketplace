import React from "react";
// import {Button} from 'reactstrap'
import {Button} from '../Button/index'


const ADCCAgent:React.FC=()=>{
    return(
        <div className="container-fluid adcc-agent-bg py-5">
            <div className="container">
                <div className="row">
                    <div className="col-sm-7 col-lg-5">
                        <p className="text-white mb-3 h2">Become a ADCC MKT agent and earn from the sales of artists</p>
                        <small className="d-block text-white">We are reinventing the NFT marketplace by enabling agents to help artist with the NFT creation and sales process.</small>
                        {/* <Button className="mt-3 pointer agent-btn">CREATE AGENT ACCOUNT</Button> */}
                        <Button className="mt-3" variant="tertiary">CREATE AGENT ACCOUNT</Button>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default ADCCAgent