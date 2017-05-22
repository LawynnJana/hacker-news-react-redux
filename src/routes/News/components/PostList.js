import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Parser } from 'html-to-react'

import './styles/PostList.scss'
import * as actions from '../actions';

const pages = [1,2,3,4,5,6,7,8,9,10];

class PostList extends React.Component{

  constructor(props){
    super(props)
  }

  componentWillReceiveProps(newProps){
    console.log("Page reload")
  }

  componentWillMount() {
    this.props.fetchItems(1)
  }

  componentDidMount(){
  }

  renderPosts(){
    return _.map(this.props.posts, (post, key) => {
      return <li key={key}>{post}</li>
    })
  }

  /*use react-redux-router. */

  handleArticleClick(post){
    console.log('Show article')
    //window.location = `/news/article/${post.id}`

  }

  renderItems(){
    console.log("RENDER ITEMS")
    console.log(this.props.posts)

    return _.map(this.props.postsOnPage, (post, key) => {
      if(post !== undefined) {
        const path = `/news/article/${post.id}`
        return <li className='article-in-list' onClick={() => this.handleArticleClick(post)} key={key}>
          ({post.score}) <Link to={path} activeClassName='route--active'>{post.title}</Link></li>
        }
    })
  }

  handlePageChange(page){
    console.log('Change to page: ' + page)
    //window.location.path = `/news/${page}`
    this.props.fetchItems(page)
  }

  renderPageNumb(){
    return _.map(pages, (number, key) => {

      return <li onClick={()=>this.handlePageChange(number)} className='page-number-list' key={key}><a href="#">{number}</a>{' '}</li>
      // const path =`/news/${number}`
      // return  <li className='page-number-list' key={key}>
      //   <Link to={path} activeClassName='route--active'>{number}</Link></li>
    })
  }

  render(){
    return(<div>
      <h1> Articles</h1>
      <div className='articles'><ul>{this.renderItems()}</ul></div>
      <ul>{this.renderPageNumb()}</ul>

    </div>)
  }
}

function mapStateToProps(state) {
  return {
    postsOnPage: state.postsOnPage
    }
}

export default connect(mapStateToProps, actions)(PostList)
