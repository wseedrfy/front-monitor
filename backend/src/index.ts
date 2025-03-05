import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mysql from 'mysql2/promise';
import { dbConfig } from './config/database';
import { createRoutes } from './routes';

const app = new Koa();
const PORT = 3031;

// MySQL 数据库连接初始化
async function initDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to MySQL database');
    
    // 创建日志表
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS monitor_logs (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        type VARCHAR(50),
        message TEXT,
        url VARCHAR(255),
        time BIGINT,
        data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Monitor logs table created or already exists');

    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// 初始化应用
async function bootstrap() {
  try {
    // 连接数据库
    const dbConnection = await initDatabase();

    // 中间件：CORS
    app.use(cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization']
    }));

    // 中间件：解析请求体
    app.use(bodyParser({
      enableTypes: ['json'],
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '10mb'
    }));

    // 路由
    const router = createRoutes(dbConnection);
    app.use(router.routes());
    app.use(router.allowedMethods());

    // 优雅关闭数据库连接
    process.on('SIGINT', async () => {
      await dbConnection.end();
      console.log('Database connection closed.');
      process.exit(0);
    });

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 启动应用
bootstrap(); 