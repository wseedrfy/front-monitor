import { Context } from 'koa';
import { Connection, RowDataPacket } from 'mysql2/promise';
import dayjs from 'dayjs';

export class StatisticsController {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  // 获取统计数据
  async getStatistics(ctx: Context) {
    try {
      const { startTime, endTime, category = 'ERROR' } = ctx.query;
      const params: any[] = [];
      let whereClause = 'WHERE 1=1';

      if (startTime) {
        whereClause += ' AND time >= ?';
        params.push(Number(startTime));
      }

      if (endTime) {
        whereClause += ' AND time <= ?';
        params.push(Number(endTime));
      }

      whereClause += ' AND category = ?';
      params.push(category);

      if (category === 'ERROR') {
        const query = `
          SELECT 
            COUNT(*) as totalErrors,
            COUNT(DISTINCT JSON_EXTRACT(data, '$.url')) as affectedUrls,
            COUNT(DISTINCT type) as errorTypes
          FROM monitor_logs
          ${whereClause}
        `;

        const [rows] = await this.db.query<RowDataPacket[]>(query, params);
        ctx.body = rows[0];
      } else {
        const query = `
          SELECT 
            COUNT(*) as totalBehaviors,
            COUNT(CASE WHEN type = 'CLICK' THEN 1 END) as clicks,
            COUNT(CASE WHEN type = 'ROUTE' THEN 1 END) as routes,
            COUNT(CASE WHEN type = 'CUSTOM' THEN 1 END) as customs,
            COUNT(DISTINCT JSON_EXTRACT(data, '$.sessionId')) as uniqueSessions
          FROM monitor_logs
          ${whereClause}
        `;

        const [rows] = await this.db.query<RowDataPacket[]>(query, params);
        ctx.body = rows[0];
      }
    } catch (error) {
      console.error('Error getting statistics:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get statistics' };
    }
  }

  // 获取错误趋势
  async getErrorTrend(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      const params: any[] = [];
      let whereClause = 'WHERE category = "ERROR"';

      if (startTime) {
        whereClause += ' AND time >= ?';
        params.push(Number(startTime));
      }

      if (endTime) {
        whereClause += ' AND time <= ?';
        params.push(Number(endTime));
      }

      const query = `
        SELECT 
          DATE_FORMAT(FROM_UNIXTIME(time/1000), '%Y-%m-%d %H:00:00') as hour,
          COUNT(*) as count,
          type
        FROM monitor_logs
        ${whereClause}
        GROUP BY hour, type
        ORDER BY hour ASC
      `;

      const [rows] = await this.db.query<RowDataPacket[]>(query, params);
      ctx.body = rows;
    } catch (error) {
      console.error('Error getting error trend:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get error trend' };
    }
  }

  // 获取行为趋势
  async getBehaviorTrend(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      const params: any[] = [];
      let whereClause = 'WHERE category = "BEHAVIOR"';

      if (startTime) {
        whereClause += ' AND time >= ?';
        params.push(Number(startTime));
      }

      if (endTime) {
        whereClause += ' AND time <= ?';
        params.push(Number(endTime));
      }

      const query = `
        SELECT 
          DATE_FORMAT(FROM_UNIXTIME(time/1000), '%Y-%m-%d %H:00:00') as hour,
          COUNT(*) as count,
          type
        FROM monitor_logs
        ${whereClause}
        GROUP BY hour, type
        ORDER BY hour ASC
      `;

      const [rows] = await this.db.query<RowDataPacket[]>(query, params);
      ctx.body = rows;
    } catch (error) {
      console.error('Error getting behavior trend:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get behavior trend' };
    }
  }

  // 获取性能指标
  async getPerformanceMetrics(ctx: Context) {
    try {
      const { startTime, endTime } = ctx.query;
      const params: any[] = [];
      let whereClause = 'WHERE type = "PERFORMANCE"';

      if (startTime) {
        whereClause += ' AND time >= ?';
        params.push(Number(startTime));
      }

      if (endTime) {
        whereClause += ' AND time <= ?';
        params.push(Number(endTime));
      }

      const query = `
        SELECT 
          AVG(JSON_EXTRACT(data, '$.dns')) as avgDns,
          AVG(JSON_EXTRACT(data, '$.tcp')) as avgTcp,
          AVG(JSON_EXTRACT(data, '$.ttfb')) as avgTtfb,
          AVG(JSON_EXTRACT(data, '$.fp')) as avgFp,
          AVG(JSON_EXTRACT(data, '$.fcp')) as avgFcp,
          AVG(JSON_EXTRACT(data, '$.lcp')) as avgLcp,
          AVG(JSON_EXTRACT(data, '$.fid')) as avgFid,
          AVG(JSON_EXTRACT(data, '$.cls')) as avgCls,
          COUNT(*) as sampleCount
        FROM monitor_logs
        ${whereClause}
      `;

      const [rows] = await this.db.query<RowDataPacket[]>(query, params);
      ctx.body = rows[0];
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get performance metrics' };
    }
  }
} 