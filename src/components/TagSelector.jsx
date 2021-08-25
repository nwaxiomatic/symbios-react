import React, { Component } from 'react'
import { FaBeer } from 'react-icons/fa'
import 'static/styles/tag-select.scss'


class TagSelector extends Component {

  componentDidMount() {
    const { getTime } = this.props
    const animLength = parseFloat(
      getComputedStyle(document.body).animationDuration
    )
    this.animDelay = { 
      animationDelay: ((-getTime())%animLength).toString() + 's'
    }
  }

  sinCos = (idx, numItems) => {
    return [
      Math.sin(2 * Math.PI * idx / numItems),
      Math.cos(2 * Math.PI * idx / numItems)
    ]
  }

  render(){
    const { tags, tagSelect, tagType, getTime } = this.props
    const { animDelay } = this
    const tagList = tags[tagType]
    const numItems = Object.keys(tagList).length

    const animLength = parseFloat(
      getComputedStyle(document.body).animationDuration
    )
    const animDelayNew = { 
      animationDelay: ((-getTime())%animLength).toString() + 's'
    }

    return (
      <div 
        className='tagSelector'
      >
        <div 
          className='tagSelectInner'
          style={animDelay}
        />
        <div 
          className='tagSelectInnerTitle'
          style={animDelay}
        >
          <div
            className='tagSelectInnerTitleText'
            style={animDelay}
          >
            <FaBeer />
          </div>
        </div>
        <div 
          className='tagSelectCircle cBottom'
          style={animDelay}
        />
        <div 
          className='tagSelectCircle cTop'
          style={animDelay}
        />
        <div 
          className='tagSelectOuter'
          style={animDelay}
        />
        <div className='tagKnob'>
            {Object.keys(tagList).map((tag, idx) => {
              const sinCos = this.sinCos(idx, numItems)
              const transX = sinCos[0] < 0 ? 100 : 
                Math.abs(sinCos[0]) < .02 ? 50 : 0
              // console.log(transX)
              // console.log(Math.round(sinCos[0] * 50))
              return (
                // tag == 'NONE' ? 'NONE' :
                <div 
                  className='tagItem'
                  key={tag}
                  style={{
                    left: Math.round((sinCos[0] + 1) * 50).toString() + '%',
                    top: Math.round((sinCos[1] + 1) * 50).toString() + '%',
                    transform: 'translate(-' + 
                      transX.toString() + 
                    '%, ' + Math.round((sinCos[1] - 1) * 50).toString() + '%)',
                    ...animDelay
                  }}
                >
                  <button 
                    onClick={() => tagSelect(tag, tagType)}
                    className={tagList[tag] ? 'tagSelected' : ''}
                    style={animDelay}
                  >
                    {tag}
                  </button>
                </div>
              )
             })}
        </div>
      </div>
    )
  }

}
export default TagSelector 
