import { ConnectionOptions } from 'mysql2';

export const dbConfig: ConnectionOptions = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'monitor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}; 