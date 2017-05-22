import { combineReducers } from 'redux'
import locationReducer from './location'
import postReducer from '../routes/News/reducers/post_reducer'
import postsOnPageRecucer from '../routes/News/reducers/postsOnPage_reducer'
import articleReducer from '../routes/News/reducers/articleForPage_reducer'
import commentsReducer from '../routes/News/reducers/commentsForArticle_reducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    posts: postReducer,
    postsOnPage: postsOnPageRecucer,
    article: articleReducer,
    comments: commentsReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
