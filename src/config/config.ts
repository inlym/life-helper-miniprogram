import secret from 'life-helper-miniprogram-secret'
import { stage } from '../../config'

const secretConfig = secret.prod

export const config = {
  signature: secretConfig.secretConfig,
  baseURL: 'http://localhost:3000',
}
