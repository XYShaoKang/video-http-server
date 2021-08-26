import { merge } from 'webpack-merge'
import { common } from './config/common.mjs'
import { development } from './config/development.mjs'
import { production } from './config/production.mjs'

export default (_env, _args) => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return merge(common, development)
    case 'production':
      return merge(common, production)
    default:
      throw new Error('No matching configuration was found!')
  }
}
