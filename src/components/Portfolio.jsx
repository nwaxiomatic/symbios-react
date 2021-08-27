import React, { Component } from 'react'
// import ReactMarkdown from 'react-markdown'
import PostPreview from 'components/PostPreview'
import TagSelector from 'components/TagSelector'
import SymbiosLoader from 'components/SymbiosLoader'

import { Container, Row, Col } from 'react-bootstrap'
import InfiniteScrollFix from 'components/InfiniteScrollFix'

import 'static/styles/main.scss'
import 'static/styles/neumorph.scss'
import 'static/styles/teaser.scss'

import * as matter from 'gray-matter'

import { getSC } from 'SoundCloudAPI'
import { getVimeo } from 'VimeoAPI'

// import * as twglr from 'twgl'
// const twgl = twglr.twgl


function findCommonElements(arr1, arr2) {
  // console.log(arr1)
    return arr1.some(item => arr2.includes(item))
}


// Process .md files
const mdFilesRaw = require.context(
  '!!raw-loader!static/md/posts', 
  true,
  /\.md$/ 
)
const mdFiles = mdFilesRaw.keys().map( 
  path => ( {
    ...matter(mdFilesRaw(path).default),
    ...{filename: path.replace(/^.*[\\\/]/, '')}
  })
)
mdFiles.sort((a, b) => b.filename.localeCompare(a.filename))

// Get Tags
let tagsLists = {}
let tags = {}
let tagFilters = {}
mdFiles.forEach( 
  file => {
    Object.keys(file.data.tags).forEach(tagType => {
      file.data.tags[tagType] = file.data.tags[tagType].split(",").map(
        tag => tag.trim().toLowerCase()
      )
      tagsLists[tagType] != undefined ? 
        tagsLists[tagType].push(...file.data.tags[tagType]) :
        tagsLists[tagType] = [...file.data.tags[tagType], 'NONE']
    })
  }
)
Object.keys(tagsLists).forEach(tagType => {
  tagsLists[tagType] = [...new Set(tagsLists[tagType])]
  tags[tagType] = tagsLists[tagType].reduce((o, key) => ({ ...o, [key]: false}), {})
  tagFilters[tagType] = []
})


class Portfolio extends Component {

  allPosts = mdFiles
  tagFilters = {}
  minPosts = 8

  APIs = {}

  SC = null
  Vimeo = null
  YT = null
  BC = null

  TIME = 0

  state = {
    posts: [],
    tags: tags,
    numPosts: 0
  }

  constructor(props) {
    super(props)
    this.iRef = React.createRef()
  }

  componentDidMount() {
    getSC((SC) => {
      this.SC = SC
      getVimeo((Vimeo) => {
        this.Vimeo = Vimeo
        let posts = this.filterPosts()
        this.setState({
          posts:posts,
          numPosts: Math.min(this.minPosts, posts.length)
        })
      })
    })
    requestAnimationFrame(this.setTime)
    document.body.classList.add("bg-rainbow");
  }

  setTime = (time) => {
    if(this.checkIfMounted()){
      this.TIME = time/1000
      // console.log(this.TIME)
      requestAnimationFrame(this.setTime)
    }
  }

  getTime = () => {
    return this.TIME
  }

  saveImage = (idx, img) => {
    let { allPosts } = this
    allPosts[idx].img = img
  }

  postPreview = (file, idx) => {
    let { SC, Vimeo, getTime } = this
    return <PostPreview 
      key={ file.data.title.toString() }
      content={file.content}
      data={file.data}
      img={file.img}
      saveImage={(img)=>{this.saveImage(idx, img)}}
      SC={SC}
      Vimeo={Vimeo}
      getTime={getTime}
    />
  }

  filterPosts = () => {
    let { allPosts, tagFilters } = this
    const { tags } = this.state

    Object.keys(tagFilters).forEach(tagType => {
      if(tagFilters[tagType].length == 0){
        tagFilters[tagType] = Object.keys(tags[tagType])
      }
    })
    return allPosts.map( (file, idx) => {
      file.postPreview = this.postPreview(file, idx)
      return file
    }).filter((post) => 
      Object.keys(tagFilters).every(tagType => {
        let postTags = post.data.tags[tagType] ? post.data.tags[tagType] : ['NONE']
        return findCommonElements(postTags, tagFilters[tagType])
      })
    )
  }

  tagSelect = (tag, tagType) => {
    let { tags } = this.state
    let newTags = JSON.parse(JSON.stringify(tags))
    newTags[tagType][tag] = !newTags[tagType][tag]
    this.tagFilters[tagType] = this.selectedTags(newTags[tagType])
    let posts = this.filterPosts()
    let newState = {
      posts: posts,
      tags: newTags,
      numPosts: Math.min(this.minPosts, posts.length)
    }
    this.setState(newState)    
  }

  selectedTags = (tags) => {
    return Object.keys(tags).filter(tag=>tags[tag]==true)
  }

  addMorePosts = () => {
    const { minPosts } = this
    const { numPosts, posts } = this.state
    this.setState({
        numPosts: Math.min(numPosts + minPosts, posts.length)
    })
    // console.log(Math.min(numPosts + minPosts, posts.length))
  }

  checkIfMounted = () => {
     return this.iRef.current != null;
  }

  render(){
    const { posts, tags, types, numPosts } = this.state
    const { tagFilter, tagSelect, selectedTags, addMorePosts, getTime } = this
    return (
      <Container ref={this.iRef}>
      {/*<div className='tagKnobs'>
        {Object.keys(tags).map( tagType =>
          <TagSelector
            key={tagType}
            tags={tags}
            tagSelect={tagSelect}
            tagType={tagType}
            getTime={getTime}
          />
        )}
        </div>*/}
        <SymbiosLoader
          getTime={getTime}
        />
        {/*<div  className="portfolio">
        {posts.length > 0 &&
          <InfiniteScrollFix
            dataLength={numPosts}
            next={addMorePosts}
            hasMore={numPosts < posts.length}
            loader={''}
          >
            <Row>
              {posts.slice(0, numPosts).map(
                (file) => 
                  file.postPreview
              )}
              {numPosts < posts.length ? 
              <Col 
                xs={12}
                md={6}
                lg={4}
                xl={3}
                className="post-teaser"
                ref={this.imgRef} 
              >
                Scroll to load more...
              </Col> : ''}
            </Row>

          </InfiniteScrollFix>}
          </div>*/}
      </Container>
      
    )
  }

}
export default Portfolio 
