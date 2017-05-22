import React, { Component } from 'react'
import { Link } from 'react-router'
import PostList from './PostList'


//const pages = [1,2,3,4,5,6,7,8,9,10];

class NewsApp extends Component {
   constructor(props){
     super(props)
   }
   render(){
     return(
       <div>
         <h4>Hacker News</h4>
         <PostList/>

       </div>
     )
   }
}

export default NewsApp
