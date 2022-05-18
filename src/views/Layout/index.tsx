import React, { lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import { routes } from 'routes'
import Navbar from 'components/Navbar'
import Footer from 'components/Footer'

const NotFound = lazy(() => import('../NotFound'))

const Layout: React.FC = () => {
  const allRoutes = routes.map((prop) => {
    return <Route path={prop.path} component={prop.component} exact={prop.exact} />
  })

  return (
    <div className="wrapper">
      <div className="main-panel">
        <Navbar routes={routes} />
        <Switch>
          {allRoutes}
          <Route component={NotFound} />
        </Switch>
        <Footer />
      </div>
    </div>
  )
}

export default Layout
