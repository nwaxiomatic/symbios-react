import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Portfolio from './components/Portfolio'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

function App() {
  return (
    <BrowserRouter 
      // history={browserHistory}
      // basename={'symbios-react'}
    >
      <Switch>
        <PropsRoute exact path="/" title="Home" component={Portfolio} />
      </Switch>
    </BrowserRouter>
  )
}

export default App;
