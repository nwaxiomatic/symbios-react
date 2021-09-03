import React, { Component } from 'react'
import { ReactComponent as SymbiosSVG } from 'static/svg/symbios.svg'
import { ReactComponent as SymbiosSpin } from 'static/svg/symbios-spin.svg'
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
    // setTimeout(() => {
    //   this.setState({loaded:true})
    // }, 500)
  }

  animDelay = (animLength, offsets = null, getTimeAgain = false) => {
    const { getTime } = this.props
    const theTime = getTimeAgain ? getTime() : this.firstTime;
    let animDelayStr = ''
    let animSec = animLength.map((item, idx) => {
      // console.log(item)
      let offset = offsets ? offsets[idx] ? offsets[idx] : 0 : 0
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
        style={animDelay([animLength], 14)}
      >
        
        <SymbiosSVG 
          className="symbios-svg hidden-refl"
          style={animDelay([animLength])}
        />
        <SymbiosSVG 
          className="symbios-svg hidden-shad"
          style={animDelay([animLength])}
        />
        <SymbiosSVG 
          className="symbios-svg"
          style={animDelay([animLength])}
        />

       {/* <div className="symbios-load-spin">
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
        </div>*/}
      </div>
    )
  }

}
export default SymbiosLoader 
