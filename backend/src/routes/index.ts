import Router from '@koa/router';
import { Connection } from 'mysql2/promise';
import { LogController } from '../controllers/logController';
import { StatisticsController } from '../controllers/statisticsController';

export function createRoutes(dbConnection: Connection) {
  const router = new Router({ prefix: '/api' });
  const logController = new LogController(dbConnection);
  const statsController = new StatisticsController(dbConnection);

  // 日志相关路由
  router.post('/errors', ctx => logController.createLog(ctx));
  router.get('/logs', ctx => logController.getLogs(ctx));

  // 统计相关路由
  router.get('/statistics', ctx => statsController.getStatistics(ctx));
  router.get('/error-trend', ctx => statsController.getErrorTrend(ctx));
  router.get('/performance', ctx => statsController.getPerformanceMetrics(ctx));

  return router;
} 