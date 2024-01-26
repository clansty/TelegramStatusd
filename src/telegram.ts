import { Api, TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import env from './env';
import { getLogger } from 'log4js';

const log = getLogger('Telegram');

const session = new StringSession(env.TG_SESSION);

const telegram = new TelegramClient(session, env.TG_API_ID, env.TG_API_HASH, {
  connectionRetries: 5,
  deviceModel: 'Statusd',
});

export default {
  async connect() {
    log.info('Connecting to Telegram');
    await telegram.connect();
    const me = await telegram.getMe() as Api.User;
    log.info('Logged in as', me.firstName);
  },
  async getMe() {
    return await telegram.getMe() as Api.User;
  },
  async updateStatus(status: Api.TypeEmojiStatus) {
    return await telegram.invoke(new Api.account.UpdateEmojiStatus({
      emojiStatus: status,
    }));
  },
};
