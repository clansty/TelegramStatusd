import express from 'express';
import bodyParser from 'body-parser';
import telegram from './telegram';
import { Api } from 'telegram';
import BigInteger = require('big-integer');
import { getLogger } from 'log4js';

const log = getLogger('Router');
const router = express.Router();
const parser = bodyParser.json();
let currentStatus: Api.TypeEmojiStatus;
let timeout: NodeJS.Timeout;

router.get('/current', async (req, res) => {
  const result = await telegram.getMe() as Api.User;
  res.json(result.emojiStatus);
});

router.post('/set', parser, async (req, res) => {
  const body = req.body as { id: string, duration?: number };
  log.info('Set status ID:', body.id, 'Duration:', body.duration);

  if (timeout) {
    log.info('Timer exists, clear it');
    clearTimeout(timeout);
    timeout = undefined;
  }
  else {
    const me = await telegram.getMe() as Api.User;
    currentStatus = me.emojiStatus;
  }

  if (body.duration) {
    timeout = setTimeout(async () => {
      log.info('Resetting status');
      await telegram.updateStatus(currentStatus);
      timeout = undefined;
    }, body.duration * 1000);
  }

  const result = await telegram.updateStatus(new Api.EmojiStatus({ documentId: BigInteger(body.id) }));
  res.json(result);
});

router.post('/reset', async (req, res) => {
  log.info('Resetting status by request');

  const result = await telegram.updateStatus(currentStatus);
  timeout = undefined;
  res.json(result);
});

export default router;
