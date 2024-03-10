const { client } = require("../application/app");
const { MessageMedia } = require("whatsapp-web.js");
const config = require("../config/config.json");
const axios = require("axios");

const endPoint = "https://quran-api-id.vercel.app/";

const quranHandler = async () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;

    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}quran`)) {
        try {
          const text = message.body.substring(config.prefix.length + 6);
          const response = await axios.get(`${endPoint}surahs/${text}`);

          const arabicText = response.data.ayahs[0].arab;

          const truncatedArabicText = arabicText.substring(0, 20);

          const replyMessage = `*Ayat Quran:*\n${truncatedArabicText}\n\n*_Translation:_*\n\n${response.data.translation}\n\n*_Tafsir Kemenag:_*\n\n${response.data.tafsir.kemenag.short}`;

          const media = await MessageMedia.fromUrl(response.data.image.primary);
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
