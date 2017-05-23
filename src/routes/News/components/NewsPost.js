import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions';
import _ from 'lodash'
import './styles/NewsPost.scss'
import { Parser } from 'html-to-react'


let comments = {}
let articleData = {}
let tempPost = {}
class NewsPost extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      commentArr: [],
    }
  }


  //fetching comments async
  componentWillMount(){
    let articleId = this.props.routeParams.id

    if(!Number(articleId)){
      console.log('ERROR IN NEWS POST ID NOT A NUMBER')
    }
    console.log('NewsPost: ' + this.props.routeParams.id)
    articleId = Number(this.props.routeParams.id)

    tempPost = _.find(this.props.posts, function(article){
      console.log(article.id)
      return article.id === articleId
    })
    console.log('Post Identification:' + tempPost)

    this.props.fetchComments(tempPost.kids).then(()=>{
      console.log('Got comments!')
      this.setState({
        commentArr: this.props.comments
      })
      //console.log(this.state.commentArr)
    })
  }

  getComments(){
    console.log('Woahdere' + this.state.commentArr)
    var parser = new Parser()
    return _.map(this.state.commentArr, (comment, key) => {
      console.log('Comment GANG: ' + comment.text)
        var commentHtml = parser.parse(comment.text)
        return (<li key={key} className='comment'>
      <div><b>{comment.by}</b> @ {comment.time}</div>
        {commentHtml}
      </li>)
    })
  }

  getPostData(){

    //get the id of the article from the route
    let articleId = this.props.routeParams.id

    if(!Number(articleId)){
      console.log('ERROR IN NEWS POST ID NOT A NUMBER')
    }

    articleId = Number(this.props.routeParams.id)

    return _.map(this.props.posts, (post, key) => {
      //Using url's params ID path, get the required article
      if(post.id === articleId) {

        //post.kids is an array of comment ids from HN API
        return (
        <div key={key}>
          <h1>{post.title}</h1>
          <div>by {post.by}</div>
          <br/>
          <div>Click <a href={post.url}>here</a> to read</div>
      </div> )
      }
    })
  }


  render(){
    return(<div>
      <div>{this.getPostData()}</div>
      <div><ul className='comments'>{this.getComments()}</ul></div>


    </div>)
  }
}

function mapStateToProps(state) {
  return {
    posts: state.posts,
    postsOnPage: state.postsOnPage,
    comments: state.comments
  }
}

export default connect(mapStateToProps, actions)(NewsPost)
