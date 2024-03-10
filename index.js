const { client } = require("./src/application/app");
const { animeHandler } = require("./src/bot/anime");
const { autoGifHandler } = require("./src/bot/auto-gif");
const { cgptHandler } = require("./src/bot/cgpt");
const { hinaAdzimHandler } = require("./src/bot/hina-adzim");
const { menuHandler } = require("./src/bot/menu");
const { pwnedHandler } = require("./src/bot/pwned");
const { quranHandler } = require("./src/bot/quran");
const { stickerHandler } = require("./src/bot/sticker");

menuHandler();
hinaAdzimHandler();
animeHandler();
cgptHandler();
pwnedHandler();
stickerHandler();
quranHandler();
client.initialize();