import React, { Component } from 'react'
import { ReactComponent as SymbiosSVG } from 'static/svg/symbios.svg'
import { ReactComponent as SymbiosSpin } from 'static/svg/symbios-spin.svg'
import 'static/styles/header.scss'


class Header extends Component {

  state = {
    loaded: false
  }

  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.firstTime = this.props.getTime()
     this.animDelay = this.props.animDelay.bind(this)
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({loaded:true})
    // }, 500)
  }

  render(){
    const { animDelay } = this
    const {menuClick, animLength } = this.props
    const { loaded } = this.state
    return(
      <div 
        className="header"
        style={animDelay([animLength], 14)}
      >

      <button onClick={menuClick}> FILTER </button>

       <SymbiosSVG 
          className="symbios-svg-header"
          style={animDelay([animLength])}
        />
      </div>
    )
  }

}
export default Header 
