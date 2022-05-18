import { lazy } from 'react'

const Home = lazy(() => import('./views/Home'))
const Packs = lazy(() => import('./views/Packs'))
const Marketplace = lazy(() => import('./views/Marketplace'))
const Create = lazy(() => import('./views/Create'))
const Profile = lazy(() => import('./views/Profile'))
const PrivacyPolicy = lazy(() => import('./views/PrivacyPolicy'))
const TermsAndCondition = lazy(() => import('./views/TermsAndCondition'))
const FAQ = lazy(() => import('./views/FAQ'))



export interface IRoute {
  path: string
  name?: string
  component: (props: any) => JSX.Element
  exact?: boolean
  redirect?: boolean
}

export const routes: IRoute[] = [
  // {
  //   path: '/',
  //   component: Home,
  //   exact: true,
  // },
  // {
  //   path: '/packs',
  //   component: Packs,
  //   exact: true,
  // },
  // {
  //   path: '/artgallery',
  //   component: Artgallery,
  //   exact: true,
  // },


  {
    path: '/',
    name: 'Explore',
    component:Home,
    exact: true
  },
  
  {
    path: '/marketplace',
    name: 'Marketplace',
    component: Marketplace,
    exact: true
  },
  {
    path: '/following',
    name: 'Following',
    component: Packs,
    exact: true
  },
  { 
    path:'/create',
    name:'Create',
    component: Create,
    exact: true
  },


  {
    path: '/profile',
    name: 'Wallet',
    component: Profile,
    exact: true
  }

  // {
  //   path: '/marketplace/:orderId',
  //   component: MarketPlaceDetails,
  //   exact: false
  // },
  // {
  //   path: '/create',
  //   component: Create,
  //   exact: true
  // },
  // {
  //   path: '/profile',
  //   name: 'WALLET',
  //   component: Profile,
  //   exact: true
  // },
  // {
  //   path: '/staking',
  //   name: 'STAKING',
  //   component: Staking,
  //   exact: true
  // },
  // {
  //   path: '/FAQ',
  //   name: 'FAQ',
  //   component: FAQ,
  //   exact: true
  // },

  // {
  //   path: '/privacypolicy',
  //   component: PrivacyPolicy,
  //   exact: true
  // },
  // {
  //   path: '/termsandcondition',
  //   component: TermsAndCondition,
  //   exact: true
  // },
  // {
  //   path: '/marketplace',
  //   component: MarketPlace,
  //   exact: true
  // }
]
