import React, { Component } from 'react'
import { FaBeer } from 'react-icons/fa'
import 'static/styles/tag-select-simple.scss'


class TagSelector extends Component {

  prevTagList = null

  tagStyles = {}

  constructor(props){
    super(props)
    const { 
      tags, animDelay, tagType, getTime, tagList, animLength
    } = this.props
    
    this.animDelay = animDelay.bind(this)
    this.firstTime = getTime()
    this.prevTagList = tags[tagType]

    Object.keys(this.prevTagList).map((tag, idx) => {
      this.tagStyles[tag] = this.animDelay([animLength])
    })
  }

  // componentDidMount() {
  //   const { getTime } = this.props
    
  // }

  componentDidUpdate() {
    const { tags, tagType } = this.props
    this.prevTagList = this.props.tags[tagType]
  }

  render(){
    const { tags, tagSelect, tagType, getTime } = this.props
    const { animDelay, prevTagList } = this
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
          style={animDelay([animLength])}
        />
        <div 
          className='tagSelectInnerTitle'
          style={animDelay([animLength])}
        >
          <div
            className='tagSelectInnerTitleText'
            style={animDelay([animLength])}
          >
            {/*<FaBeer />*/}
          </div>
        </div>
        <div 
          className='tagSelectCircle cBottom'
          style={animDelay([animLength])}
        />
        <div 
          className='tagSelectCircle cTop'
          style={animDelay([animLength])}
        />
        <div 
          className='tagSelectOuter'
          style={animDelay([animLength])}
        />
        <div className='tagKnob'>
            {Object.keys(tagList).map((tag, idx) => {
              const setBack = prevTagList[tag] && !tagList[tag]
              if(setBack){
                this.tagStyles[tag] = animDelay([animLength], setBack)
              }
              // console.log(tag)
              // console.log(prevTagList[tag])
              // console.log(tagList[tag])
              // console.log(transX)
              // console.log(Math.round(sinCos[0] * 50))
              return (
                // tag == 'NONE' ? 'NONE' :
                <div 
                  className='tagItem'
                  key={tag}
                  style={{
                    ...animDelay([animLength])
                  }}
                >
                  <button 
                    onClick={() => tagSelect(tag, tagType)}
                    className={"tagItemButton" + (tagList[tag] ? ' tagSelected' : '')}
                    style={this.tagStyles[tag]}
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
