import telegram from './telegram';
import { configure, getLogger } from 'log4js';
import express from 'express';
import router from './router';

(async () => {
  configure({
    appenders: {
      console: { type: 'console' },
    },
    categories: {
      default: { level: 'info', appenders: ['console'] },
    },
  });
  const log = getLogger('Main');
  process.on('unhandledRejection', error => {
    log.error('UnhandledException: ', error);
  });

  await telegram.connect();

  const app = express();
  app.use('/', router);
  app.listen(8000, () => {
    log.info('Listening on 8000');
  });
})();
