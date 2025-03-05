import Router from '@koa/router';
import { LogController } from '../controllers/logController';
import { Connection } from 'mysql2/promise';
import { Context } from 'koa';

export function createLogRoutes(dbConnection: Connection) {
  const router = new Router();
  const logController = new LogController(dbConnection);

  router.post('/api/errors', (ctx: Context) => logController.createLog(ctx));

  return router;
} 