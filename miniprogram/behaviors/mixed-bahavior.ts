import {shareAppBehavior} from './share-app-behavior'
import {themeBehavior} from './theme-behavior'

export const mixedBehavior = Behavior({
  behaviors: [shareAppBehavior, themeBehavior],
})
