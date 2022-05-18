const tokens = {
  bnb: {
    name: 'Binance Coin',
    symbol: 'BNB',
    address: {
      56: '0x',
      97: '0x',
    },
    decimals: 18,
    projectLink: 'https://www.binance.com/',
    imageLink: 'https://psidex.passive-income.io/images/coins/bnb.png',
  },
  wbnb: {
    name: 'Wrapped BNB',
    symbol: 'wBNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://www.binance.com/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c.png',
  },
  psi: {
    name: 'Passive Income',
    symbol: 'PSI',
    address: {
      56: '0x6e70194F3A2D1D0a917C2575B7e33cF710718a17',
      97: '0x6C31B672AB6B4D455608b33A11311cd1C9BdBA1C',
    },
    decimals: 9,
    projectLink: 'https://passive-income.io/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x6e70194F3A2D1D0a917C2575B7e33cF710718a17.png',
  },
  psiv1: {
    name: 'Passive Income v1',
    symbol: 'PSI',
    address: {
      56: '0x9A5d9c681Db43D9863e9279c800A39449B7e1d6f',
      97: '0x066Bd99080eC62FE0E28bA687A53aC00794c17b6',
    },
    decimals: 9,
    projectLink: 'https://passive-income.io/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x9A5d9c681Db43D9863e9279c800A39449B7e1d6f.png',
  },
  inc: {
    name: 'Income',
    symbol: 'INC',
    address: {
      56: '0xDc3890618bd71d3eF3eC18BB14a510c0dA528947',
      97: '0x75d8b48342149ff7F7f1786e6f8B839Ca669e4cf',
    },
    decimals: 18,
    projectLink: 'https://psidex.passive-income.io/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0xDc3890618bd71d3eF3eC18BB14a510c0dA528947.png',
  },
  ort: {
    name: 'OMNI Real Estate Token',
    symbol: 'ORT',
    address: {
      56: '0x1d64327C74d6519afeF54E58730aD6fc797f05Ba',
      97: '0x5Ed78a73d29696f8B591ea30Ce73E93CcE9514eE',
    },
    decimals: 18,
    projectLink: 'https://omni-psi.com/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x1d64327C74d6519afeF54E58730aD6fc797f05Ba.png',
  },
  busd: {
    name: 'Binance USD',
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0x8301f2213c0eed49a7e28ae4c3e91722919b8b47',
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0xe9e7cea3dedca5984780bafc599bd69add087d56.png',
  },
  eth: {
    name: 'Ethereum',
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x2170ed0880ac9a755fd29b2688956bd959f933f8.png',
  },
  btc: {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c.png',
  },
  usdc: {
    name: 'USD Coin',
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '',
    },
    decimals: 18,
    projectLink: 'https://www.centre.io/usdc',
    imageLink: 'https://psidex.passive-income.io/images/coins/0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d.png',
  },
  usdt: {
    name: 'Tether',
    symbol: 'USDT',
    address: {
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      56: '0x55d398326f99059ff775485246999027b3197955',
    },
    decimals: 18,
    projectLink: 'https://tether.to/',
    imageLink: 'https://psidex.passive-income.io/images/coins/0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5.png',
  },
}

export type TokenConfig = typeof tokens.ort

export default tokens