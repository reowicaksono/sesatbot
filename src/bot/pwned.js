const { client } = require("../application/app");
const config = require("../config/config.json");
const axios = require("axios");

const pwnedHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}checkpwned`)) {
        try {
          const email = encodeURIComponent(
            message.body.substring(config.prefix.length + 11)
          );
          const apiUrl = `https://eapi.pcloud.com/checkpwned?checkemail=${email}`;
          const response = await axios.get(apiUrl);
          const data = response.data;

          if (data.data.length > 0) {
            let resultText = "Data kebocoran:\n";

            data.data.forEach((breach) => {
              resultText += `*${breach.Name} ${breach.Domain}*\n`;
              resultText += `Tanggal kejadian: ${breach.BreachDate}\n`;
              resultText += `Data yang bocor: ${breach.DataClasses.join(
                ", "
              )}\n`;
              resultText += `Total keseluruhan data yang bocor: ${breach.PwnCount}\n\n`;
            });

            await message.reply(resultText);
          } else {
            await message.reply(`Tidak ada data kebocoran. ${email}`);
          }
        } catch (error) {
          console.log(error);
          await message.reply("Gagal melakukan pengecekan kebocoran data.");
        }
      }
    }
  });
};

module.exports = { pwnedHandler };
