import React, { Component } from 'react'

class TagSelector extends Component {

  componentDidMount() {
    // this.setState({
    //   tags: this.props.tags
    // })
  }

  render(){
    const { tags, tagSelect } = this.props
    return (
      <div className='TagSelector'>
        <ul>
          {Object.keys(tags).map(function(tag){
            return (
              <li key={tag}>
                <button 
                  onClick={() => tagSelect(tag)}
                  className={tags[tag] ? 'tagSelected' : ''}
                >
                  {tag}
                </button>
              </li>
            )
           })}
        </ul>
      </div>
    )
  }

}
export default TagSelector 
