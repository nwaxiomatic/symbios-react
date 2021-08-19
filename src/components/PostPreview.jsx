import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { Col, Spinner } from 'react-bootstrap';

import { getFlickrImg } from 'FlickrAPI.js'
import { getSoundCloudImg, scIF, scURL } from 'SoundCloudAPI.js'
import { getVimeoImg, viF } from 'VimeoAPI.js'
import { getYTImg } from 'YouTubeAPI.js'
import { getBCImg } from 'BandcampAPI.js'

import BandcampPlayer from 'react-bandcamp'

import buildUrl from 'build-url'

import 'static/styles/teaser.scss'

// var SC = require('static/scripts/sc.js')

class SquareImg extends Component {

  render(){
    const { img, data } = this.props
    if(img)
      return (
        <div 
          className="teaser-square"
          style={{ 
            backgroundImage: 'url(\"' + img.src + '\")',
            backgroundSize: 'cover',
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div 
            className="description"
          >
            {data.blurb}
          </div>
        </div>
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
    const { title, image, video, audio, sound, bandcamp } = data

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
    else if(!img && bandcamp){
      getBCImg(
        bandcamp, (img) => this.imgLoaded(img)
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
    const { title, image, video, sound, bandcamp } = data
    return (
      <Col 
        xs={12}
        sm={6}
        md={4}
        lg={3}
        xl={2}
        className="post-teaser"
      >
        <div className="teaser-square-container">
            <SquareImg 
              data={data}
              img={img}
            />
        </div>
        <div className="post-title">
          {title}
        </div>
        {img ? '' : 
          sound ? 
          <iframe 
            ref={this.iRef} 
            src={scIF + '?url=' + scURL + '123'}
            style={{'display':'block', 'visibility':'hidden'}}
          /> : ''
          // bandcamp ?
          // <iframe 
          //   ref={this.iRef} 
          //   src={bandcamp.url}
          //   style={{'display':'block', 'visibility':'hidden'}}
          // /> : ''
          // <BandcampPlayer album={bandcamp.id} /> : ''
        }
      </Col>
    )
  }

}
export default PostPreview 
