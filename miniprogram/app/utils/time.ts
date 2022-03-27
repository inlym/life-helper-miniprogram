import dayjs from 'dayjs'

/**
 * 计算星期文案，示例：昨天、今天、明天、周一、…、周日
 *
 * @param date 标准格式日期
 */
export function calcWeekdayText(date: string) {
  const now = dayjs()
  const target = dayjs(date, 'YYYY-MM-DD')

  if (target.add(1, 'day').isSame(now, 'date')) {
    return '昨天'
  } else if (target.isSame(now, 'date')) {
    return '今天'
  } else if (target.subtract(1, 'day').isSame(now, 'date')) {
    return '明天'
  } else {
    const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return week[target.day()]
  }
}
