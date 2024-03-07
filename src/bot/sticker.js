const { client } = require("../application/app");
const config = require("../config/config.json");

const stickerHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      // Image, Video, GIF to Sticker (Auto && Caption)
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
      // Image, Video, GIF to Sticker (With Reply Image)
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
      // Sticker to Image (Auto)
      else if (message.type === "sticker") {
        // Handle Sticker to Image conversion logic here
      }
    }
  });
};
module.exports = { stickerHandler }; // Assuming you export the client for use elsewhere
