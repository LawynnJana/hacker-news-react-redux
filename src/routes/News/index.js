import NewsApp from './components/NewsApp'

import NewsPostRoute from './components/NewsPostRoute'
// Sync route definition

export default {
  path:'/news/:id',
  component : NewsApp,
  //childRoutes: [NewsPostRoute]
}
