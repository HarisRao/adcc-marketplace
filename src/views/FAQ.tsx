import React from 'react'
import styled from 'styled-components'
import { Container, Accordion } from 'react-bootstrap'
// import backgroundImg from '../images/2.jpg'

// const BGContainer = styled.div`
//   background: url('${backgroundImg}') no-repeat !important;
//   background-size: cover !important;
// `

const BGContainer = styled.div`
`

const TermsAndCondition: React.FC = () => (
  <BGContainer className="py-5">
    <Container>
      <h2 className="mb-4 text-white">Frequently Asked Questions</h2>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Can I unlock my tokens before the staking period ends?</Accordion.Header>
          <Accordion.Body>
            No. Once your tokens have been locked in the staking program, you will be unable to unstake them until the
            end of the locking period specified.
          </Accordion.Body>
        </Accordion.Item>
        {/* <Accordion.Item eventKey="1">
          <Accordion.Header>
            Is it possible to add tokens to an already staked amount in order to reach a higher tier?
          </Accordion.Header>
          <Accordion.Body>
            No. The amount of tokens staked in a single interaction will determine your staking tier. If you stake 60k
            tokens you will have gold tier and if you then stake another 75k tokens you will have gold tier on the 2nd
            batch as well, even though your total staked amount would push you into the diamond tier.
            <br />
            <br />
            Your highest amount staked in a single transaction determines your tier level for the entire wallet. To
            reach Gold tier, you must stake 60,000 tokens in one transaction. To reach Diamond tier, you must stake
            100,000 tokens in one transaction.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>
            Can I stake above the minimum amount of tokens required for a tier while still obtaining the same APY on the
            full amount of tokens?
          </Accordion.Header>
          <Accordion.Body>
            Yes this is possible at all tiers. For example, if you stake 120k tokens you will receive the APY of diamond
            tier on all 120k tokens and not just the 100k tokens required to hit the diamond tier.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3">
          <Accordion.Header>
            What happens if I can not access my wallet anymore and would like to unstake?
          </Accordion.Header>
          <Accordion.Body>
            Due to the decentralized nature of our platform, this will not be possible and we do not have access to your
            tokens or the ability to unstake them on your behalf. You are entirely responsible for your own wallet and
            we regrettably will be unable to help in any instances of lost wallets.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="4">
          <Accordion.Header>What is the maximum amount of ORT tokens I can stake per instance?</Accordion.Header>
          <Accordion.Body>
            There is no limit to the amount you can stake in a single instance. The APY return is calculated on your
            staking tier .
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="5">
          <Accordion.Header>
            When will we receive our OMNI debit card as part of the luxury staking program?
          </Accordion.Header>
          <Accordion.Body>
            The debit cards are a future feature of the staking program and more details will be announced following the
            first property sale.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="6">
          <Accordion.Header>How are commission rewards distributed and how often?</Accordion.Header>
          <Accordion.Body>
            The paid commission rewards are distributed once per month in the form of an airdrop directly to your
            wallet.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="7">
          <Accordion.Header>How do cashbacks work?</Accordion.Header>
          <Accordion.Body>
            The cashback percentage is based on the commission that you pay when purchasing a F-NFT. These cashbacks
            will be distributed once per month via airdrop.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="8">
          <Accordion.Header>How does the free night stay work as part of the luxury staking program?</Accordion.Header>
          <Accordion.Body>
            You can get free nights upon a booking as described in the staking tiers table. For example, a gold tier
            member staking for 12 months will be eligible for a free night as part of a 7 day booking. Alternatively,
            you can request the value of your free nights in ORT tokens as an alternative reward.
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="9">
          <Accordion.Header>
            What happens when I have two seperate staking instances that would give me more benefits when combined? Will
            my staking amounts be aggregated and summed up?
          </Accordion.Header>
          <Accordion.Body>
            With multiple staking instances, you will get the benefits of the highest tier you stake for. The APY
            however is calculated per staking instance.
            <br />
            <br />
            If you stake 60k in the first week, that batch will receive the APY of gold tier for the entire staking
            period. If you later stake an additional batch of 100k tokens, the 100k tokens will be eligible for the APY
            of the diamond tier. The original 60k tokens will continue to receive the APY of the gold tier that they
            were originally staked at.
            <br />
            <br />
            To receive the APY returns of a certain tier, you must stake the minimum amount required by that tier in a
            single transaction, you cannot “add on” to your previous staked amounts.
          </Accordion.Body>
        </Accordion.Item> */}
      </Accordion>
    </Container>
  </BGContainer>
)

export default TermsAndCondition
