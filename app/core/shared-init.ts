import { ensureLogined } from './auth'

/**
 * 公共页面初始化
 *
 * @param eventName 触发事件
 */
export async function sharedInit(eventName?: string): Promise<void> {
  await ensureLogined()
}
