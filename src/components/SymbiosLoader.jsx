import React, { Component } from 'react'
import { ReactComponent as SymbiosSVG } from 'static/svg/symbios.svg'
import 'static/styles/symbios-loader.scss'


class SymbiosLoader extends Component {

  state = {
    loaded: false
  }

  animLength = 1
  firstTime = 0

  constructor(props){
    super(props)
    this.animLength = parseFloat(
      getComputedStyle(document.body).animationDuration
    )
    this.firstTime = this.props.getTime()
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loaded:true})
    }, 1000)
  }

  animDelay = (animLength, offset = 0, getTimeAgain = false) => {
    const { getTime } = this.props
    const theTime = getTimeAgain ? getTime() : this.firstTime;
    let animDelayStr = ''
    let animSec = animLength.map((item) => {
      // console.log(item)
      return ((-theTime + offset)%item).toString() + 's'
    })
  // console.log(animSec.join(', '))
    return { 
      animationDelay: animSec.join(', ')
    }
  }

  render(){
    const { animDelay, animLength } = this
    const { loaded } = this.state
    return(
      <div 
        className="cover"
        style={animDelay([animLength])}
      >
        <SymbiosSVG 
          className={"luminosity symbios-svg svg-drop hidden-neu " + (loaded ? "shown-neu" : "")}
          style={animDelay([animLength], 0)}
        />
        <SymbiosSVG 
          className={"saturation symbios-svg svg-drop hidden-neu " + (loaded ? "shown-neu" : "")}
          style={animDelay([animLength], 0)}
        />
         <SymbiosSVG 
          className="symbios-svg"
          style={animDelay([animLength], 0)}
        />
      </div>
    )
  }

}
export default SymbiosLoader 
