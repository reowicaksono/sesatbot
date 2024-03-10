const { client } = require("../application/app");
const config = require("../config/config.json");
const axios = require("axios");

const animeHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}anime`)) {
        try {
          const regex = /^!anime\s+(\w+)\s+(\d{4})$/;
          const match = message.body.match(regex);

          if (match) {
            const season = match[1].toLowerCase();
            const year = match[2];

            const apiUrl = `https://api.jikan.moe/v4/anime?season=${season}&year=${year}`;
            const response = await axios.get(apiUrl);
            const animeList = response.data.data
              .map((anime) => `* ${anime.title} (${anime.score})`)
              .join("\n");

            await message.reply(
              `Here are some anime airing in ${season} ${year}:\n${animeList}`
            );
          } else {
            await message.reply(
              "Ada yang kurang tuh. Format yang benar: !anime <season> <year>"
            );
          }
        } catch (error) {
          console.error(error);
          await message.reply(
            "Failed to retrieve anime information. Please try again later."
          );
        }
      }
    }
  });
};

module.exports = { animeHandler };
