import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mysql from 'mysql2/promise';
import { dbConfig } from './config/database';
import { createRoutes } from './routes';

const app = new Koa();

// 配置 bodyParser，增加大小限制
app.use(bodyParser({
  jsonLimit: '10mb'
}));
app.use(cors());

// 数据库连接
let db: mysql.Connection;

async function initDatabase() {
  try {
    db = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');

    // 创建日志表（如果不存在）
    await db.execute(`
      CREATE TABLE IF NOT EXISTS monitor_logs (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT,
        url VARCHAR(1024),
        data JSON,
        time BIGINT NOT NULL,
        category ENUM('ERROR', 'BEHAVIOR', 'PERFORMANCE') NOT NULL DEFAULT 'ERROR',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Monitor logs table ready');
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

// 初始化数据库并启动服务器
initDatabase().then(() => {
  // 路由
  const router = createRoutes(db);
  app.use(router.routes()).use(router.allowedMethods());

  // 启动服务器
  const port = 3031;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});

// 优雅关闭
process.on('SIGINT', async () => {
  try {
    if (db) {
      await db.end();
      console.log('Database connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}); 