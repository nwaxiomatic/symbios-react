import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Portfolio from './components/Portfolio'

import GoogleFontLoader from 'react-google-font-loader'

// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min.js'

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
      <GoogleFontLoader
        fonts={[
          {
            font: 'Space Mono',
          },
        ]}
      />
      <Switch>
        <PropsRoute exact path="/" title="Home" component={Portfolio} />
      </Switch>
      <div className="bg-grad"/>
    </BrowserRouter>
  )
}

export default App;
