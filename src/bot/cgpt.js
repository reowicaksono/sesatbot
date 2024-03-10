const { client } = require("../application/app");
const config = require("../config/config.json");
const axios = require("axios");
require("dotenv").config();
const KEYCGPT = process.env.KEYCGPT || "wkwkwk";

const cgptHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}cgpt`)) {
        try {
          const text = message.body.substring(config.prefix.length + 5).trim();

          const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/text/chat",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${KEYCGPT}`,
            },
            data: JSON.stringify({
              providers: "openai",
              openai: "gpt-3.5-turbo",
              temperature: 0.1,
              max_tokens: 2000,
              text: text,
            }),
          };

          const response = await axios.request(options);
          const assistantMessage = response.data.openai.generated_text;

          await message.reply(assistantMessage);
        } catch (error) {
          console.log(error);
          await message.reply("Gagal mengirim ChatGPT.");
        }
      }
    }
  });
};

module.exports = { cgptHandler };
