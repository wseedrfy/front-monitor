import Router from '@koa/router';
import { Connection } from 'mysql2/promise';
import { LogController } from '../controllers/logController';
import { StatisticsController } from '../controllers/statisticsController';

export function createRoutes(db: Connection) {
  const router = new Router({ prefix: '/api' });
  const logController = new LogController(db);
  const statisticsController = new StatisticsController(db);

  // 日志相关路由
  router.post('/errors', logController.createLog.bind(logController));
  router.post('/behaviors', logController.createLog.bind(logController));
  router.get('/logs', logController.getLogs.bind(logController));

  // 统计相关路由
  router.get('/statistics', statisticsController.getStatistics.bind(statisticsController));
  router.get('/error-trend', statisticsController.getErrorTrend.bind(statisticsController));
  router.get('/behavior-trend', statisticsController.getBehaviorTrend.bind(statisticsController));
  router.get('/performance', statisticsController.getPerformanceMetrics.bind(statisticsController));

  return router;
} 