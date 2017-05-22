import { FETCH_COMMENTS } from './types'

export function fetchComments(ids){
  console.log('Fetch comments')
  let data = []
  if (!ids || !ids.length) {
    data = []
  } else {
    data = ids.map(id => fetchCommentItem(id))
  }

  dispatch({
    type: FETCH_COMMENTS,
    payload: data
  })
}

function fetchCommentItem(id){

  if (itemsCache[id]) {
    //console.log('ItemsCache:' + itemsCache[id])
    return itemsCache[id]
   } else {
     Posts.child('item/' + id).on('value', snapshot => {
       //console.log('Val: ' + snapshot.val())
       //console.log('Val: ' + snapshot.val().title)
       const story = itemsCache[id] = snapshot.val()
       //console.log('Fetch:' + story)
       return story
     })
   }
 }
