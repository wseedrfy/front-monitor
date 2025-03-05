import { Context } from 'koa';
import { Connection } from 'mysql2/promise';

export class StatisticsController {
  private dbConnection: Connection;

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  // 获取统计数据
  async getStatistics(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      const timeFilter = startTime && endTime
        ? 'AND time BETWEEN ? AND ?'
        : '';

      // 获取总错误数
      const [totalResult] = await this.dbConnection.execute(
        `SELECT COUNT(*) as total FROM monitor_logs WHERE type LIKE '%ERROR%' ${timeFilter}`,
        timeFilter ? [startTime, endTime] : []
      );
      const totalErrors = (totalResult as any)[0].total;

      // 按错误类型统计
      const [typeResult] = await this.dbConnection.execute(
        `SELECT type, COUNT(*) as count 
         FROM monitor_logs 
         WHERE type LIKE '%ERROR%' ${timeFilter}
         GROUP BY type`,
        timeFilter ? [startTime, endTime] : []
      );

      // 获取性能指标平均值
      const [perfResult] = await this.dbConnection.execute(
        `SELECT 
           AVG(JSON_EXTRACT(data, '$.DNS')) as DNS,
           AVG(JSON_EXTRACT(data, '$.TCP')) as TCP,
           AVG(JSON_EXTRACT(data, '$.TTFB')) as TTFB,
           AVG(JSON_EXTRACT(data, '$.FP')) as FP,
           AVG(JSON_EXTRACT(data, '$.FCP')) as FCP,
           AVG(JSON_EXTRACT(data, '$.LCP')) as LCP,
           AVG(JSON_EXTRACT(data, '$.FID')) as FID,
           AVG(JSON_EXTRACT(data, '$.CLS')) as CLS
         FROM monitor_logs 
         WHERE type = 'PERFORMANCE' ${timeFilter}`,
        timeFilter ? [startTime, endTime] : []
      );

      ctx.body = {
        totalErrors,
        errorsByType: (typeResult as any[]).reduce((acc, { type, count }) => {
          acc[type] = count;
          return acc;
        }, {}),
        averagePerformance: (perfResult as any)[0]
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to get statistics' };
    }
  }

  // 获取错误趋势
  async getErrorTrend(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      
      if (!startTime || !endTime) {
        ctx.status = 400;
        ctx.body = { message: 'startTime and endTime are required' };
        return;
      }

      const [result] = await this.dbConnection.execute(
        `SELECT 
           DATE(FROM_UNIXTIME(time/1000)) as date,
           type,
           COUNT(*) as count
         FROM monitor_logs
         WHERE type LIKE '%ERROR%'
         AND time BETWEEN ? AND ?
         GROUP BY DATE(FROM_UNIXTIME(time/1000)), type
         ORDER BY date`,
        [startTime, endTime]
      );

      ctx.body = result;
    } catch (error) {
      console.error('Error getting error trend:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to get error trend' };
    }
  }

  // 获取性能指标
  async getPerformanceMetrics(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      const timeFilter = startTime && endTime
        ? 'AND time BETWEEN ? AND ?'
        : '';

      const [result] = await this.dbConnection.execute(
        `SELECT data
         FROM monitor_logs
         WHERE type = 'PERFORMANCE' ${timeFilter}
         ORDER BY time DESC
         LIMIT 1`,
        timeFilter ? [startTime, endTime] : []
      );

      ctx.body = (result as any[])[0]?.data 
        ? JSON.parse((result as any[])[0].data)
        : {};
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to get performance metrics' };
    }
  }
} 