import React, { Component } from 'react'
import { ReactComponent as SymbiosSpin } from 'static/svg/symbios-spin.svg'
import 'static/styles/symbios-loader.scss'
import 'static/styles/symbios-spinner.scss'


class SymbiosSpinner extends Component {

  render(){
    const { animDelay, animLength } = this
    const { loaded } = this.state
    return(
      <div 
        className="cover"
        style={animDelay([animLength], 14)}
      >
        <SymbiosSpin 
          className="symbios-svg hidden-refl"
          style={animDelay([animLength])}
        />
        <SymbiosSpin 
          className="symbios-svg hidden-shad"
          style={animDelay([animLength])}
        />
        <SymbiosSpin 
          className="symbios-svg"
          style={animDelay([animLength])}
        />
      </div>
    )
  }

}
export default SymbiosSpinner 
