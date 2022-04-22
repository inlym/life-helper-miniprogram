import {pageLifetimesBehavior} from './page-lifetimes-behavior'
import {themeBehavior} from './theme-behavior'

export const mixedBehavior = Behavior({
  behaviors: [pageLifetimesBehavior, themeBehavior],
})
