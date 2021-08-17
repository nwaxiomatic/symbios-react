import React, { Component } from 'react'
// import ReactMarkdown from 'react-markdown'
import PostPreview from 'components/PostPreview'
import TagSelector from 'components/TagSelector'
import { Container, Row } from 'react-bootstrap'

import 'static/styles/main.css'

import * as matter from 'gray-matter'

import { getSC } from 'SoundCloudAPI'
import { getVimeo } from 'VimeoAPI'

// import * as twglr from 'twgl'
// const twgl = twglr.twgl


function findCommonElements(arr1, arr2) {
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
let tagsList = []
mdFiles.forEach( 
  file => {
    tagsList.push(...file.data.categories.split(","))
  }
)
tagsList = [...new Set(tagsList)]
let tags = tagsList.reduce((o, key) => ({ ...o, [key]: false}), {})



class Portfolio extends Component {

  allPosts = mdFiles
  tagFilter = []

  SC = null
  Vimeo = null
  YT = null
  BC = null

  state = {
    posts: [],
    tags: tags,
  }

  // constructor(props) {
    // super(props)

    // this.state = {
    //   posts: posts,
    //   tags: tags
    // }
  // }

  componentDidMount() {
    getSC((SC) => {
      this.SC = SC
      getVimeo((Vimeo) => {
        this.Vimeo = Vimeo
        let posts = this.filterPosts()
        this.setState({
          posts:posts
        })
      })
    })
  }

  saveImage = (idx, img) => {
    let { allPosts } = this
    allPosts[idx].img = img
  }

  filterPosts = () => {
    let { allPosts, tagFilter, SC, Vimeo } = this
    const { tags } = this.state
    if(tagFilter.length == 0){
      tagFilter = Object.keys(tags)
    }
    return allPosts.map( (file, idx) => {
      file.postPreview =
        <PostPreview 
          key={ file.data.title.toString() }
          content={file.content}
          data={file.data}
          img={file.img}
          saveImage={(img)=>{this.saveImage(idx, img)}}
          SC={SC}
          Vimeo={Vimeo}
        />
      return file
    }).filter((post) => 
      findCommonElements(post.data.categories.split(','), tagFilter)
    )
  }

  tagSelect = (tag) => {
    let { tags } = this.state
    tags[tag] = !tags[tag]
    this.tagFilter = this.selectedTags()
    let posts = this.filterPosts()
    this.setState({
      tags:tags,
      posts: posts
    })    
  }

  selectedTags = () => {
    const { tags } = this.state
    return Object.keys(tags).filter(tag=>tags[tag]==true)
  }

  render(){
    const { posts, tags } = this.state
    const { tagFilter, tagSelect, selectedTags } = this
     let thing = this.state.posts.filter((post) => 
     {
        let cats = post.data.categories.split(',')
        return findCommonElements(
          cats, 
          tagFilter
        )
      })
    return (
      <Container>
        <TagSelector
          tags={tags}
          tagSelect={tagSelect}
        />
        <Row>
          {posts.map(
            (file) => 
              file.postPreview
          )}
        </Row>
      </Container>
    )
  }

}
export default Portfolio 
