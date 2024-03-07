const { client } = require("../application/app");
const config = require("../config/config.json");
const randomTexts = require("../config/hina-adzim.json");

const hinaAdzimHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}hina-adzim`)) {
        const randomIndex = Math.floor(Math.random() * randomTexts.length);
        const chat = await message.getChat();
        let adzimPhone = "6289643614465@c.us";
        await chat.sendMessage(`${randomTexts[randomIndex]} @${adzimPhone}`, {
          mentions: [adzimPhone],
        });
      }
    }
  });
};

module.exports = { hinaAdzimHandler };
