import { Context } from 'koa';
import { Connection, RowDataPacket } from 'mysql2/promise';

interface LogData {
  type: string;
  data?: any;
  time: number;
  url?: string;
  message?: string;
  level?: string;
  request?: any;
  response?: any;
}

export class LogController {
  private db: Connection;

  constructor(db: Connection) {
    this.db = db;
  }

  async createLog(ctx: Context) {
    try {
      const logData = ctx.request.body as LogData;
      console.log('Received log data:', logData);

      // 验证必填字段
      if (!logData.type) {
        ctx.status = 400;
        ctx.body = { error: 'Missing type field' };
        return;
      }

      if (!logData.time) {
        ctx.status = 400;
        ctx.body = { error: 'Missing time field' };
        return;
      }

      // 构建完整的数据对象
      const fullData = {
        ...logData,
        level: logData.level || 'info',
        request: logData.request || null,
        response: logData.response || null
      };

      // 处理 data 字段
      const data = JSON.stringify(fullData);

      const category = logData.type.startsWith('ERROR') ? 'ERROR' : 'BEHAVIOR';
      
      // 构建插入数据
      const insertData = {
        type: logData.type,
        data,
        time: logData.time,
        url: logData.url || '',
        message: logData.message || '',
        category
      };

      console.log('Inserting data:', insertData);

      const [result] = await this.db.execute(
        'INSERT INTO monitor_logs (type, data, time, url, message, category) VALUES (?, ?, ?, ?, ?, ?)',
        [insertData.type, insertData.data, insertData.time, insertData.url, insertData.message, insertData.category]
      );

      ctx.body = { success: true, data: result };
    } catch (error) {
      console.error('Error creating log:', error);
      ctx.status = 500;
      ctx.body = { 
        error: 'Failed to create log',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getLogs(ctx: Context) {
    try {
      const { type, startTime, endTime, page = 1, pageSize = 10, category } = ctx.query;
      const params: any[] = [];
      let whereClause = 'WHERE 1=1';

      if (category) {
        whereClause += ' AND category = ?';
        params.push(category);
      }

      if (type) {
        whereClause += ' AND type = ?';
        params.push(type);
      }

      if (startTime) {
        whereClause += ' AND time >= ?';
        params.push(Number(startTime));
      }

      if (endTime) {
        whereClause += ' AND time <= ?';
        params.push(Number(endTime));
      }

      const offset = (Number(page) - 1) * Number(pageSize);
      const countQuery = `SELECT COUNT(*) as total FROM monitor_logs ${whereClause}`;
      const [totalRows] = await this.db.query<RowDataPacket[]>(countQuery, params);
      const total = totalRows[0].total;

      const query = `
        SELECT * FROM monitor_logs 
        ${whereClause}
        ORDER BY time DESC
        LIMIT ? OFFSET ?
      `;

      const [rows] = await this.db.query<RowDataPacket[]>(query, [...params, Number(pageSize), offset]);

      ctx.body = {
        data: rows,
        total,
        page: Number(page),
        pageSize: Number(pageSize)
      };
    } catch (error) {
      console.error('Error getting logs:', error);
      ctx.status = 500;
      ctx.body = { error: 'Failed to get logs' };
    }
  }
} 