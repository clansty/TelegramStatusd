import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input"; // npm i input
import env from "./env";

const stringSession = new StringSession(""); // fill this later with the value from session.save()

(async () => {
  const client = new TelegramClient(stringSession, env.TG_API_ID, env.TG_API_HASH, {
    connectionRetries: 5,
    deviceModel: 'Statusd'
  });
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });
  console.log("You should now be connected.");
  console.log(client.session.save()); // Save this string to avoid logging in again
  process.exit(0);
})();
