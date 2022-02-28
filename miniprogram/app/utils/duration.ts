/**
 * 时长类，主要用于计算缓存时长
 */
export class Duration {
  /** 一天的小时数 */
  public static HOURS_PER_DAY = 24

  /** 一小时的分钟数 */
  public static MINUTES_PER_HOUR = 60

  /** 一分钟的秒数 */
  public static SECONDS_PER_MINUTE = 60

  /**
   * 构造函数
   * @param {number} milliseconds 毫秒数
   */
  constructor(private milliseconds: number) {}

  public static ofDays(days: number): Duration {
    return new Duration(days * this.HOURS_PER_DAY * this.MINUTES_PER_HOUR * this.SECONDS_PER_MINUTE * 1000)
  }

  public static ofHours(hours: number): Duration {
    return new Duration(hours * this.MINUTES_PER_HOUR * this.SECONDS_PER_MINUTE * 1000)
  }

  public static ofMinutes(minutes: number): Duration {
    return new Duration(minutes * this.SECONDS_PER_MINUTE * 1000)
  }

  public static ofSeconds(seconds: number): Duration {
    return new Duration(seconds * 1000)
  }

  /**
   * 返回毫秒数
   */
  toMillis(): number {
    return this.milliseconds
  }
}
