const { client } = require("../application/app");
const config = require("../config/config.json");
const moment = require("moment");
const { MessageMedia } = require("whatsapp-web.js");

const MaretHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.toLowerCase() === `${config.prefix}18maret`) {
        const countdownDetails = calculateRemainingTime();
        const media = await MessageMedia.fromUrl(
          "https://ik.imagekit.io/abazure/mega.png?updatedAt=1709813294219"
        );
        const captionText = `Hitung mundur untuk insiden *18 Maret 2024*\n\n${countdownDetails}`;

        const additionalEventText = `*Apa itu insiden 18 Maret 2024:*\n\nInsiden 18 Maret 2024 ( G18MPDI ) adalah sebuah peristiwa pembunuhan yang masih direncanakan dan belum terjadi, kejadian ini masih simpang siur dan korban pembunuhan merupakan pejabat penting atau orang paling berpengaruh di Indonesia.\n\nLokasi kejadian peristiwa perencanaan pembunuhan ini berada di Jalan Teuku Umar No.29, Kec. Menteng, Kota Jakarta Pusat.`;

        client.sendMessage(message.from, media, {
          caption: `${captionText}\n\n${additionalEventText}`,
        });
      }
    }
  });
};

const calculateRemainingTime = () => {
  const targetDate = moment("2024-03-18");
  const currentDate = moment();
  const duration = moment.duration(targetDate.diff(currentDate));

  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `Sisa Waktu: ${days} hari, ${hours} jam, ${minutes} menit`;
};

module.exports = { MaretHandler };
