import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { Col, Spinner } from 'react-bootstrap';

import { getFlickrImg } from 'FlickrAPI.js'
import { getSoundCloudImg, scIF, scURL } from 'SoundCloudAPI.js'
import { getVimeoImg, viF } from 'VimeoAPI.js'
import { getYTImg } from 'YouTubeAPI.js'

import buildUrl from 'build-url'

// var SC = require('static/scripts/sc.js')

class SquareImg extends Component {

  render(){
    const { img } = this.props
    if(img)
      return (
        <div 
          className="postPrevTile"
          style={{ 
            backgroundImage: 'url(\"' + img.src + '\")',
            backgroundSize: 'cover',
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat'
          }}
        />
      )
      else
        return <Spinner animation="border" />
  }
}

class PostPreview extends Component {

  state = {
    img: null
  }

  constructor(props) {
    super(props)

    this.iRef = React.createRef()
  }

  componentDidMount() {
    const { content, data, img, SC, Vimeo } = this.props
    const { title, image, video, audio, sound } = data

    if(!img && image){
      getFlickrImg(image, "Medium", (img) => this.imgLoaded(img))
    }
    else if(!img && sound){
      getSoundCloudImg(
        SC, this.iRef.current, sound, (img) => this.imgLoaded(img)
      )
    }
    else if(!img && video && !video.youtube){
      getVimeoImg(
        video, (img) => this.imgLoaded(img)
      )
    }
    else if(!img && video && video.youtube){
      getYTImg(
        video, (img) => this.imgLoaded(img)
      )
    }
    else if(img){
      this.setState({img: img})
    }
  }

  imgLoaded = (img) => {
    const { saveImage } = this.props
    // console.log(img)
    this.setState({img:img}, ()=>{
      // console.log(img)
      saveImage(img)
    })
  }

  render(){
    const { img } = this.state
    const { content, data } = this.props
    const { title, image, video, sound } = data
    return (
      <Col 
        xs={12}
        sm={6}
        md={4}
      >
        <div className="postPrevTileContainer">
            <SquareImg 
              img={img}
            />
        </div>
        <div className="postPrevTitle">
          {title}
        </div>
        {img ? '' : 
          sound ? 
          <iframe 
            ref={this.iRef} 
            src={scIF + '?url=' + scURL + '123'}
            style={{'display':'block', 'visibility':'hidden'}}
          /> : ''
          // video && !video.youtube ?
          // <iframe 
          //   ref={this.iRef} 
          //   src={viF + video.id}
          //   style={{'display':'block', 'visibility':'hidden'}}
          // /> : ''
        }
      </Col>
    )
  }

}
export default PostPreview 
