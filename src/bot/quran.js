const { client } = require("../application/app");
const { MessageMedia } = require("whatsapp-web.js");
const config = require("../config/config.json");
const axios = require("axios");

const quranHandler = async () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;

    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}quran`)) {
        try {
          const apiUrl = "https://quran-api-id.vercel.app/random";
          const response = await axios.get(apiUrl);

          const translation = response.data.translation;
          const kemenagTafsirShort = response.data.tafsir.kemenag.short;
          const arab = response.data.arab;

          const media = await MessageMedia.fromUrl(response.data.image.primary);

          const replyMessage = `*Ayat Quran:*\n\n${arab}\n\n*_Translation:_*\n\n${translation}\n\n*_Tafsir Kemenag:_*\n\n${kemenagTafsirShort}`;

          await client.sendMessage(message.from, media, {
            caption: replyMessage,
          });
        } catch (error) {
          console.error(error);

          await client.sendMessage(
            message.from,
            "Failed to retrieve Quran information. Please try again later."
          );
        }
      }
    }
  });
};

module.exports = { quranHandler };
