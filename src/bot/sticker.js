const { client } = require("../application/app");
const config = require("../config/config.json");

const stickerHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (
        ["image", "video", "gif"].includes(message.type) ||
        message.caption === `${config.prefix}sticker`
      ) {
        client.sendMessage(message.from, "*[⏳]* Loading..");
        try {
          const media = await message.downloadMedia();
          client
            .sendMessage(message.from, media, {
              sendMediaAsSticker: true,
              stickerName: config.name,
              stickerAuthor: config.author,
            })
            .then(() => {
              client.sendMessage(message.from, "*[✅]* Successfully!");
            });
        } catch {
          client.sendMessage(message.from, "*[❎]* Failed!");
        }
      }
      else if (message.body === `${config.prefix}sticker`) {
        const quotedMsg = await message.getQuotedMessage();
        if (message.hasQuotedMsg && quotedMsg.hasMedia) {
          client.sendMessage(message.from, "*[⏳]* Loading..");
          try {
            const media = await quotedMsg.downloadMedia();
            client
              .sendMessage(message.from, media, {
                sendMediaAsSticker: true,
                stickerName: config.name,
                stickerAuthor: config.author,
              })
              .then(() => {
                client.sendMessage(message.from, "*[✅]* Successfully!");
              });
          } catch {
            client.sendMessage(message.from, "*[❎]* Failed!");
          }
        } else {
          client.sendMessage(message.from, "*[❎]* Reply Image First!");
        }
      }

      else if (message.type === "sticker") {
      }
    }
  });
};
module.exports = { stickerHandler }; 
