const { client } = require("../application/app");
const config = require("../config/config.json");

const menuHandler = () => {
  client.on("message", async (message) => {
    const isGroups = message.from.endsWith("@g.us") ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
      if (message.body.startsWith(`${config.prefix}menu`)) {
        const menuText =
          `𝐃𝐚𝐟𝐭𝐚𝐫 𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡\n\n` +
          `Ubah Gambar / GIF Jadi Sticker\nKirim atau balas gambar !sticker\n\n` +
          `Ubah GIF Jadi Sticker\nKirim atau balas gambar !gif\n\n` +
          `Ubah VIDEO Jadi Sticker\nKirim atau balas gambar !video\n\n` +
          `Chat Gpt\nKirim atau balas gambar !gpt {message}\n\n` +
          `Cek Anime \nKirim  !anime \n\n` +
          `Check Email Pwned\nKirim atau balas email !checkpwned {email_kalian}\n\n` +
          `Tag Everyone\n !hola\n\n` +
          `ＵＰＤＡＴＥ ＦＥＡＴＵＲＥ\n\n` +
          `𝘿𝙖𝙛𝙩𝙖𝙧 𝙎𝙚𝙢𝙪𝙖 𝙋𝙚𝙧𝙞𝙣𝙩𝙖𝙝\n!cmd`;
        client.sendMessage(message.from, menuText);
        return;
      }
    }
  });
};

module.exports = { menuHandler };
