import Firebase from 'firebase/app'
import Database from 'firebase/database'
import _ from 'lodash'
import { EventEmitter } from 'events'
import { Promise } from 'es6-promise'

//define Constants
import {
  FETCH_POSTS,
  FETCH_ITEMS,
  FETCH_ARTICLE,
  FETCH_COMMENTS,
} from './types'


const config = {
  databaseURL: 'https://hacker-news.firebaseio.com'
}
Firebase.initializeApp(config)
const version = '/v0'
const Posts = Firebase.database().ref(version)
const itemsCache = Object.create(null)


//POST LIST
export function fetchPosts(){
  console.log('FetchPosts @ News/actions/index.js')
  return (dispatch) => {
    Posts.child('topstories').on('value', snapshot => {
      dispatch({
        type: FETCH_POSTS,
        payload: snapshot.val(),
      })
      //dispatch(fetchItems(1))
    })

  }

}


let tempData = [];

export function fetchItems(page){
  const storiesPerPage = 20
  const start = (page-1)*storiesPerPage
  const end = (page)*storiesPerPage

  return dispatch => {
    Posts.child('topstories').once('value', snapshot => {
      //console.log('FETCH_ITEMS')
      tempData = [...snapshot.val()].slice(start, end);
      console.log(tempData)
      const data = fetchIds(tempData)
      dispatch({
        type: FETCH_ITEMS,
        payload: data
      })
    })
  }
}

function fetchIds(ids){
  if (!ids || !ids.length) {
    return []
  } else {
    return ids.map(id => fetchItem(id))
  }
}

function fetchItem(id){
  if (itemsCache[id]) {
    //console.log('ItemsCache:' + itemsCache[id])
    return itemsCache[id]
   } else {
     Posts.child('item/' + id).on('value', snapshot => {
       const story = itemsCache[id] = snapshot.val()
       return story
     })
   }
 }
//END OF POST LIST


let commentsCache = []
//NewsPost
export function fetchComments(ids){
  console.log('Comment ids: ' + ids)
  return dispatch => {
    let data = []
    if (!ids || !ids.length) {
      data = []

    } else {
      //_.maps(ids, (id) => fetchCommentItem(id))

    return Promise.all(ids.map(id => fetchCommentItem(id))).then((data)=>{
        //console.log('Data Within Promise:' + data)
        dispatch({
          type: FETCH_COMMENTS,
          payload: data
        })
      })
      // Promise.all.(ids.map(id => fetchCommentItem(id))).then(data => {
      //   dispatch({
      //     type: FETCH_COMMENTS,
      //     payload: data
      //   })
      // })
      //console.log('datataa:' + data)
    }

    //dispatch({
      //type: FETCH_COMMENTS,
      //payload: data
    //})
  }
}

function fetchCommentItem(id){

  return new Promise((resolve, reject) => {
    if (commentsCache[id]) {
      //console.log('ItemsCache:' + itemsCache[id])
      resolve(commentsCache[id])
     } else {
       Posts.child('item/' + id).once('value', snapshot => {
         const story = commentsCache[id] = snapshot.val()
         //console.log(story.text)
         resolve(story)
       }, reject)
     }
   })
 }
//
// function fetchCommentItem(id){
//   console.log('FETCHCOMMENTITEM')
//   if (commentsCache[id]) {
//     //console.log('ItemsCache:' + itemsCache[id])
//     return commentsCache[id]
//    } else {
//      Posts.child('item/' + id).on('value', snapshot => {
//        const story = commentsCache[id] = snapshot.val()
//        console.log(story.text)
//        return story
//      })
//    }
//  }
