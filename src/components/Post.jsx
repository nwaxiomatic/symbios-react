import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'

class PostPreview extends Component {

  componentDidMount() {
   
  }

  render(){
    const { content, data } = this.props
    const { title, image, video, audio } = data
    return (
      <div 
        className="postPreview"
      >
        {title}
        {video ?
          <ReactPlayer 
            url={video.youtube ? 
              "https://www.youtube.com/watch?v=" + video.id :
              "https://www.vimeo.com/" + video.id
            }
            loop={true} 
            controls={false}
            // config={{
            //   vimeo: {
            //     playerOptions:{controls:false}
            //   }
            // }}
          /> : ''
        }
      </div>
    )
  }

}
export default PostPreview 
