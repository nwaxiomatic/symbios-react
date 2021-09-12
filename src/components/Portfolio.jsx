import React, { Component } from 'react'
// import ReactMarkdown from 'react-markdown'
import PostPreview from 'components/PostPreview'
import TagSelector from 'components/TagSelector'
import SymbiosLoader from 'components/SymbiosLoader'
import Header from 'components/Header'

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

  showIntro = false

  introTime = 8

  animLength = 30

  APIs = {}

  SC = null
  Vimeo = null
  YT = null
  BC = null

  TIME = 0

  firstUpdate = false

  resizeTimer = null
  scrollTimer = null

  state = {
    posts: [],
    tags: tags,
    numPosts: 0,
    intro:true,
    menu: false,
  }

  constructor(props) {
    super(props)

    this.iRef = React.createRef()
    this.contRef = React.createRef()

    document.body.classList.add("bg-rainbow")
    this.animLength = parseFloat(
      getComputedStyle(document.body).animationDuration
    )

    this.resizeStuff()
    
    window.addEventListener('resize', () => {
      this.stopTrans()
      this.resizeStuff()
    })

    // window.addEventListener('scroll', () => {
    //    this.stopHover()
    // }, false)

    // window.addEventListener('touchmove', () => {
    //    this.stopHover()
    // }, false)
  }

  stopHover = () => {
    const filters = document.querySelectorAll('.teaser-square')
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer)
      this.scrollTimer = null
    }
    filters.forEach(node =>{
      if(!node.classList.contains('disable-hover')) {
        node.classList.add('disable-hover')
      }
    })
    this.scrollTimer = setTimeout(function(){
      filters.forEach(node =>{
        node.classList.remove('disable-hover')
        this.scrollTimer = null
      })
    }, 500)
  }

  stopTrans = () => {
    const classes = document.body.classList
    if (this.resizeTimer) {
          clearTimeout(this.resizeTimer)
          this.resizeTimer = null
      }
      else
          classes.add('stop-transitions');

      this.resizeTimer = setTimeout(() => {
          classes.remove('stop-transitions')
          this.resizeTimer = null
      }, 100)
  }

  resizeStuff = () => {

      var root = document.documentElement
      // console.log(x)
      var w = window.innerWidth
      var h = window.innerHeight

      let newWidth = (w - .4*h) / w
      let newHeight = 100 / newWidth
      let offHeight = 50 * (1 - newWidth)
      root.style.setProperty(
        '--scale-filter',
        'translate(40vh, -' + offHeight.toString() + 'vh) scale(' + newWidth.toString() + ')'
      )
      root.style.setProperty(
        '--scale-filter-height',
        newHeight.toString() + 'vh'
      )
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
    setTimeout(()=>{
      this.setState({intro:false})
    }, this.showIntro ? this.introTime*1000 : 10)
  }

  componentDidUpdate() {
    // console.log(this.contRef)
    if(this.contRef.current && !this.firstUpdate){
      this.contRef.current.addEventListener('scroll', () => {
        // this.stopTrans()
        this.stopHover()
      }, false)
      this.firstUpdate = true
      console.log('hi')
    }
  }

  animDelay = function(animLength, getTimeAgain = false) {
    const { getTime } = this.props
    const theTime = getTimeAgain ? getTime() : this.firstTime
    let animDelayStr = ''
    let animSec = animLength.map((item) => {
      // console.log(item)
      return ((-theTime)%item).toString() + 's'
    })
  // console.log(animSec.join(', '))
    return { 
      animationDelay: animSec.join(', ')
    }
  }

  setTime = (time) => {
    // if(this.checkIfMounted()){
      this.TIME = time/1000
      // console.log(this.TIME)
      requestAnimationFrame(this.setTime)
    // }
  }

  getTime = () => {
    return this.TIME
  }

  saveImage = (idx, img) => {
    let { allPosts } = this
    allPosts[idx].img = img
  }

  postPreview = (file, idx) => {
    let { SC, Vimeo, getTime, animDelay, animLength } = this
    return <PostPreview 
        key={ file.data.title.toString() }
        content={file.content}
        data={file.data}
        img={file.img}
        saveImage={(img)=>{this.saveImage(idx, img)}}
        SC={SC}
        Vimeo={Vimeo}
        getTime={getTime}
        animDelay={animDelay}
        animLength={animLength}
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

  menuClick = () => {
    this.setState({menu:!this.state.menu})
    // console.log('hi')
  }

  render(){
    const { posts, tags, types, numPosts, intro, menu } = this.state
    const { 
      tagFilter, tagSelect, selectedTags, addMorePosts, getTime, menuClick,
      animDelay, animLength
    } = this

    return (
      <div ref={this.iRef}>
      <svg xmlns="http://www.w3.org/2000/svg" id="turbFilter">
          <filter id="filter" x="0%" y="0%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="linearRGB">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.003 0.003" 
              numOctaves="1" seed="2" 
              stitchTiles="noStitch" 
              result="turbulence"
            />
            <feColorMatrix in="turbulence" type="hueRotate" values="0" result="cloud">
              <animate attributeName="values" from="0" to="360" dur="4s" repeatCount="indefinite"/>
            </feColorMatrix>
            
            <feDisplacementMap in="SourceGraphic" in2="cloud" scale="100" xChannelSelector="G" yChannelSelector="A" result="displacementMap"/>
            <feGaussianBlur stdDeviation=".1" />
          </filter>
          </svg>
      {intro ? 
        <SymbiosLoader
          getTime={getTime}
          animLength={animLength}
          animDelay={animDelay}
        /> :
        <Container className="ox-cont">
        <div className={"tagKnobs " + (menu && "tagKnobs-slide")}>
          <div className="port-shad-cont"><div className="port-shad"/></div>
          <div className="tag-selector-knobs">
            {Object.keys(tags).map( tagType =>
              <TagSelector
                key={tagType}
                tags={tags}
                tagSelect={tagSelect}
                tagType={tagType}
                getTime={getTime}
                animDelay={animDelay}
                animLength={animLength}
              />
            )}
          </div>
        </div>
        <div 
          ref={this.contRef} 
          className={"portfolio-cont " + (menu && "portfolio-cont-slide")}
        >
        <div className="portfolio">
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
              </InfiniteScrollFix>
            }
          </div>
          </div>
           <Header
            getTime={getTime}
            animLength={animLength}
            menuClick={menuClick}
            animDelay={animDelay}
            animLength={animLength}
          />
        </Container>
       }
       </div>
    )
  }

}
export default Portfolio 
