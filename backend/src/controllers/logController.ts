import { Context } from 'koa';
import { Connection } from 'mysql2/promise';
import { LogData } from '../types/log';

export class LogController {
  private dbConnection: Connection;

  constructor(dbConnection: Connection) {
    this.dbConnection = dbConnection;
  }

  async createLog(ctx: Context) {
    try {
      const logData = ctx.request.body as LogData;
      
      // 数据验证
      if (!logData || typeof logData !== 'object') {
        ctx.status = 400;
        ctx.body = { message: '无效的日志数据' };
        return;
      }

      // 确保所有必要字段都存在，并处理可能的undefined值
      const sanitizedData = {
        type: logData.type || 'UNKNOWN',
        message: logData.message || '',
        url: logData.url || '',
        time: logData.time || Date.now(),
        data: logData.data ? JSON.stringify(logData.data) : null
      };

      // 将日志存储到数据库
      await this.dbConnection.execute(
        'INSERT INTO monitor_logs (type, message, url, time, data) VALUES (?, ?, ?, ?, ?)',
        [
          sanitizedData.type,
          sanitizedData.message,
          sanitizedData.url,
          sanitizedData.time,
          sanitizedData.data
        ]
      );

      ctx.status = 200;
      ctx.body = { message: 'Log received and stored successfully' };
    } catch (error) {
      console.error('Error storing log:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to store log', error: String(error) };
    }
  }

  async getLogs(ctx: Context) {
    try {
      const { type, startTime, endTime, page = '1', pageSize = '10' } = ctx.query;
      const offset = (Number(page) - 1) * Number(pageSize);
      
      // 构建查询条件
      let sql = 'SELECT * FROM monitor_logs';
      const params: any[] = [];
      const conditions: string[] = [];
      
      if (type) {
        conditions.push('type = ?');
        params.push(type);
      }
      
      if (startTime && endTime) {
        conditions.push('time BETWEEN ? AND ?');
        params.push(Number(startTime), Number(endTime));
      }
      
      if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
      }

      // 获取总数
      const [countResult] = await this.dbConnection.query(
        `SELECT COUNT(*) as total FROM monitor_logs ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}`,
        params
      );
      const total = (countResult as any)[0].total;

      // 获取分页数据
      sql += ' ORDER BY time DESC LIMIT ? OFFSET ?';
      params.push(Number(pageSize), Number(offset));

      const [logs] = await this.dbConnection.query(sql, params);

      ctx.body = {
        data: logs,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      };
    } catch (error) {
      console.error('Error querying logs:', error);
      ctx.status = 500;
      ctx.body = { message: 'Failed to query logs' };
    }
  }
} 