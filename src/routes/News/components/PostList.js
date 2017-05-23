import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'


import './styles/PostList.scss'
import * as actions from '../actions';

const pages = [1,2,3,4,5,6,7,8,9,10];

class PostList extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      postsOnPage: {},
      currentPage: 1
    }
  }

  componentWillReceiveProps(newProps){
    console.log("Page reload")
  }

  //returns an array of ids of posts for a page
  getPostsForPage(page){
    this.setState({
      currentPage: page
    })
    const storiesPerPage = 20
    const start = (page-1)*storiesPerPage
    const end = (page)*storiesPerPage
    return [...this.props.posts].slice(start, end);
  }

  componentWillMount() {

    //fetch the 'topstories' posts from HN firebase api
    this.props.fetchPosts().then(() => {
      console.log("Fetch post async " + this.state.currentPage)
      console.log("Gangshittt->" + this.props.posts)
      const tempPosts = this.getPostsForPage(1); //get posts for current page
      this.setState({
        postsOnPage: tempPosts
      })
    })
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

  renderPosts(){
    console.log("RENDER Posts")

    return _.map(this.state.postsOnPage, (post, key) => {
      if(post !== undefined) {
        const path = `/news/article/${post.id}`
        return <li className='article-in-list' onClick={() => this.handleArticleClick(post)} key={key}>
          ({post.score}) <Link to={path} activeClassName='route--active'>{post.title}</Link></li>
        }
    })
  }

  handlePageClick(page){
    console.log('Change to page: ' + page)
    this.setState({
      postsOnPage: this.getPostsForPage(page)
    })
  }

  renderPageNumb(){
    return _.map(pages, (number, key) => {
      const hrefPath = `#${number}`
      console.log(hrefPath)
      //return <li onClick={()=>this.handlePageClick(number)} className='page-number-list' key={key}><a href={hrefPath}>{number}</a>{' '}</li>
      const path =`/news/${number}`
      return  <li className='page-number-list' key={key}>
        <Link to={path} activeClassName='route--active'>{number}</Link></li>
    })
  }

  render(){
    return(<div>
      <h1> Articles</h1>
      <div className='articles'><ul>{this.renderPosts()}</ul></div>
      <ul>{this.renderPageNumb()}</ul>

    </div>)
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    postsOnPage: state.postsOnPage
    }
}

export default connect(mapStateToProps, actions)(PostList)
