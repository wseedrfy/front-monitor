import { ConnectionOptions } from 'mysql2';

export const dbConfig: ConnectionOptions = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'monitor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}; 