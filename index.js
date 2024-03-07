const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');
const colors = require('colors');
const fs = require('fs');
const axios = require('axios');
const randomTexts = require('./config/hina-adzim.json');
var cron = require('node-cron');



const sahurReminder = cron.schedule('0 30 14 * *', async () => { 
    const chat = await message.getChat();
    let text = '';
    let mentions = [];
  
    for (let participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        mentions.push(contact);
        text += `@${participant.id.user} `;
    }
  
    await chat.sendMessage(`Waktunya sahur! Selamat menjalankan ibadah puasa. `, { mentions });
}, {
    scheduled: false 
})


const client = new Client({
    restartOnAuthFail: true,
    puppeteer: {
        headless: true,
        args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
    },
    ffmpeg: './ffmpeg.exe',
    authStrategy: new LocalAuth({ clientId: "client" })
});
const config = require('./config/config.json');

client.on('qr', (qr) => {
    console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Scan the QR below : `);
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.clear();
    const consoleText = './config/console.txt';
    fs.readFile(consoleText, 'utf-8', (err, data) => {
        if (err) {
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] Console Text not found!`.yellow);
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
        } else {
            console.log(data.green);
            console.log(`[${moment().tz(config.timezone).format('HH:mm:ss')}] ${config.name} is Already!`.green);
        }
    });
});

client.on('message', async (message) => {
    const isGroups = message.from.endsWith('@g.us') ? true : false;
    if ((isGroups && config.groups) || !isGroups) {
        if (message.body.startsWith(`${config.prefix}menu`)) {
            const menuText = `𝐃𝐚𝐟𝐭𝐚𝐫 𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡\n\n` +
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
        }else if (message.body.startsWith(`${config.prefix}hina-adzim`)) {
            const randomIndex = Math.floor(Math.random() * randomTexts.length);
            const chat = await message.getChat();
            let adzimPhone = "6289643614465@c.us";
            await chat.sendMessage(`${randomTexts[randomIndex]} @6289643614465`, {
              mentions: [adzimPhone],
            });
        }else if (message.body.startsWith(`${config.prefix}sahur`)) {
            if (message.body === `${config.prefix}sahur on`) {
                sahurReminder.start();
                await message.reply(`Sahur reminder has been turned on!`);
            } else if (message.body === `${config.prefix}sahur off`) {
                sahurReminder.stop();
                await message.reply(`Sahur reminder has been turned off!`);
            }
        }
        
        
        else if (message.body.startsWith(`${config.prefix}anime`)) {
       
            try {
                const regex = /^!anime\s+(\w+)\s+(\d{4})$/; 
                const match = message.body.match(regex);
            
                if (match) {
                    const season = match[1].toLowerCase(); 
                    const year = match[2]; 
            
                    const apiUrl = `https://api.jikan.moe/v4/anime?season=${season}&year=${year}`;
                    const response = await axios.get(apiUrl);
                    const animeList = response.data.data.map(anime => `* ${anime.title} (${anime.score})`).join('\n');
            
                    await message.reply(`Here are some anime airing in ${season} ${year}:\n${animeList}`);
                } else {
                    
                    await message.reply('Ada yang kurang tuh. Format yang benar: !anime <season> <year>');
                }
            } catch (error) {
                console.error(error);
                await message.reply('Failed to retrieve anime information. Please try again later.');
            }
            
          } else if (message.body.startsWith(`${config.prefix}cgpt`)) {
            try {
                const text = message.body.substring(config.prefix.length + 5).trim();
				
				const options = {
					method: 'POST',
					url: 'https://api.edenai.run/v2/text/chat',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNmU4OTc5ZTAtZGY2MC00MjUyLWEyNWItY2M3Zjg4MGQxM2JjIiwidHlwZSI6ImFwaV90b2tlbiJ9.MXlkW0-FWqUeRg0KJL1Q88K5jtc6CECsIcHcM0szNsA`
					},
					data: JSON.stringify({
						providers: "openai",
  						openai: "gpt-3.5-turbo",
 						temperature : 0.1,
  						max_tokens : 2000,
  						text: text
					  })
					};
					
  				const response = await axios.request(options);
				const assistantMessage = response.data.openai.generated_text;
				
				await message.reply(assistantMessage);
             } catch (error) {
                console.log(error);
				await message.reply('Gagal mengirim ChatGPT.');
		}}else if (message.body === "!hola") {
            const chat = await message.getChat();
            let text = "";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                mentions.push(contact);
                text += `@${participant.id.user} `;
            }

            await chat.sendMessage(text, { mentions });
        }
        
        else if (message.body.startsWith(`${config.prefix}checkpwned`)) {
            try {
                const email = encodeURIComponent(message.body.substring(config.prefix.length + 11)); 
                const apiUrl = `https://eapi.pcloud.com/checkpwned?checkemail=${email}`;
                const response = await axios.get(apiUrl);
                const data = response.data;
        
                if ( data.data.length > 0) {
                    let resultText = "Data kebocoran:\n";
        
                    data.data.forEach(breach => {
                        resultText += `*${breach.Name} ${breach.Domain}*\n`;
                        resultText += `Tanggal kejadian: ${breach.BreachDate}\n`;
                        resultText += `Data yang bocor: ${breach.DataClasses.join(', ')}\n`;
                        resultText += `Total keseluruhan data yang bocor: ${breach.PwnCount}\n\n`;
                    });
        
                    await message.reply(resultText);
                } else {
                    await message.reply(`Tidak ada data kebocoran. ${email}`);
                }
            } catch (error) {
                console.log(error);
                await message.reply('Gagal melakukan pengecekan kebocoran data.');
            }
            
        }
        else if((message.type == "image") && ((message.body.startsWith(`${config.prefix}sticker`) || (message.body.startsWith(`${config.prefix}sticker`)) )) ){
            try {
                const media = await message.downloadMedia();
                client.sendMessage(message.from, media, {
                    sendMediaAsSticker: true,
                    stickerName: config.name, 
                    stickerAuthor: config.author 
                }).then(() => {
                    client.sendMessage(message.from, "*[✅]* Successfully!");
                });
            } catch {
                client.sendMessage(message.from, "*[❎]* Failed!");
            
        client.sendMessage(message.from, "*[❎]* Failed!");
            }
           const chat = await message.getChat();
            let text = "";
            let mentions = [];

            for (let participant of chat.participants) {
                const contact = await client.getContactById(participant.id._serialized);
                mentions.push(contact);
                text += `@${participant.id.user} `;
            }

            await chat.sendMessage(text, { mentions });
        }
         else if (message.body.startsWith(`${config.prefix}change`)) {
            if (message.body.includes('|')) {
                let name = message.body.split('|')[0].replace(message.body.split(' ')[0], '').trim();
                let author = message.body.split('|')[1].trim();
                const quotedMsg = await message.getQuotedMessage(); 
                if (message.hasQuotedMsg && quotedMsg.hasMedia) {
                    client.sendMessage(message.from, "*[⏳]* Loading..");
                    try {
                        const media = await quotedMsg.downloadMedia();
                        client.sendMessage(message.from, media, {
                            sendMediaAsSticker: true,
                            stickerName: name,
                            stickerAuthor: author
                        }).then(() => {
                            client.sendMessage(message.from, "*[✅]* Successfully!");
                        });
                    } catch {
                        client.sendMessage(message.from, "*[❎]* Failed!");
                    }
                } else {
                    client.sendMessage(message.from, "*[❎]* Reply Sticker First!");
                }
            } else {
                client.sendMessage(message.from, `*[❎]* Run the command :\n*${config.prefix}change <name> | <author>*`);
            }
        
        } else {
            client.getChatById(message.id.remote).then(async (chat) => {
                await chat.sendSeen();
            });
        }
    }
});

client.initialize();
