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
    return new Promise((resolve, rej)=>{
      Posts.child('topstories').on('value', snapshot => {
        console.log('dank')

        fetchIds(snapshot.val()).then(data => {
          console.log('DATA: ' + data)
          dispatch({
            type: FETCH_POSTS,
            payload: data
          })
          resolve('Resolving')
        })

      })
    })
  }
}


let tempData = [];

export function fetchPostsOnPage(page){

  const storiesPerPage = 20
  const start = (page-1)*storiesPerPage
  const end = (page)*storiesPerPage

  return dispatch => {
    return new Promise((resolve, reject) => {
      Posts.child('topstories').once('value', snapshot => {
        console.log('FETCH_ITEMS in promise =>')
        tempData = [...snapshot.val()].slice(start, end);
        console.log(tempData)
        const data = fetchIds(tempData)
        dispatch({
          type: FETCH_ITEMS,
          payload: data
        })
      })

    });
    // Posts.child('topstories').once('value', snapshot => {
    //   //console.log('FETCH_ITEMS')
    //   tempData = [...snapshot.val()].slice(start, end);
    //   console.log(tempData)
    //   const data = fetchIds(tempData)
    //   dispatch({
    //     type: FETCH_ITEMS,
    //     payload: data
    //   })
    // })
  }
}

//NewsPost
export function fetchIds(ids){
//  console.log('Comment ids: ' + ids)
  //return dispatch => {
    let data = []
    if (!ids || !ids.length) {
      data = []

    } else {
      console.log('gang shit')
      return Promise.all(ids.map(id => fetchPostItem(id)))
      // .then((data)=>{
      //   console.log('Data Within Promise:' + data)
      //   dispatch({
      //     type: FETCH_POSTS,
      //     payload: data
      //   })
      // })
    }
//  }
}

// function fetchIds(ids){
//   if (!ids || !ids.length) {
//     return []
//   } else {
//     return ids.map(id => fetchItem(id))
//   }
// }

function fetchPostItem(id){
  return new Promise((resolve, reject) => {
    if (itemsCache[id]) {
      resolve(itemsCache[id])
     } else {
       Posts.child('item/' + id).once('value', snapshot => {
         const story = itemsCache[id] = snapshot.val()
         //console.log(story.text)
         resolve(story)
       }, reject)
     }
   })
 }

// function fetchPostItem(id){
//   if (itemsCache[id]) {
//     //console.log('ItemsCache:' + itemsCache[id])
//     return itemsCache[id]
//    } else {
//      Posts.child('item/' + id).on('value', snapshot => {
//        const story = itemsCache[id] = snapshot.val()
//        return story
//      })
//    }
//  }
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

    return Promise.all(ids.map(id => fetchCommentItem(id))).then((data)=>{
        //console.log('Data Within Promise:' + data)
        dispatch({
          type: FETCH_COMMENTS,
          payload: data
        })
      })
    }
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
