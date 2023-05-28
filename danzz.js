const config = require("./controller/config.json");
const msg = require("./controller/msg.json");
const apikey = require("./controller/apikey.json");

const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require("@adiwajshing/baileys");
/*const {
	Configuration,
	OpenAIApi
} = require("openai");*/
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const util = require("util");
const chalk = require("chalk");
const timeZone = require("moment-timezone");

// lib
const {
    smsg,
    formatp,
    tanggal,
    formatDate,
    getTime,
    isUrl,
    sleep,
    clockString,
    runtime,
    fetchJson,
    getBuffer,
    jsonformat,
    format,
    parseMention,
    getRandom,
    getGroupAdmins
} = require('./lib/function');
const {
    getRegisteredRandomId,
    addRegisteredUser,
    createSerial,
    checkRegisteredUser
} = require('./lib/register');

// Database
let banned = JSON.parse(fs.readFileSync('./database/user/banned.json'));

// Time
const time = timeZone.tz('Asia/Jakarta')
    .format('HH:mm:ss');
const today = timeZone.tz('Asia/Jakarta')
    .format('dddd, DD MMMM YYYY');
const WIB = timeZone.tz('Asia/Jakarta')
    .format('HH:mm:ss');
const WITA = timeZone.tz('Asia/Makassar')
    .format('HH:mm:ss');
const WIT = timeZone.tz('Asia/Jayapura')
    .format('HH:mm:ss');

// Sayying Time
const hours = timeZone()
    .tz('Asia/Jakarta')
    .format('HH:mm:ss')
if (hours < "23:59:00") {
    var sayyingTime = 'Selamat Malam '
}
if (hours < "19:00:00") {
    var sayyingTime = 'Selamat Petang '
}
if (hours < "18:00:00") {
    var sayyingTime = 'Selamat Sore '
}
if (hours < "15:00:00") {
    var sayyingTime = 'Selamat Siang '
}
if (hours < "10:00:00") {
    var sayyingTime = 'Selamat Pagi '
}
if (hours < "05:00:00") {
    var sayyingTime = 'Selamat Subuh '
}
if (hours < "03:00:00") {
    var sayyingTime = 'Selamat Tengah Malam '
}

module.exports = danzz = async (danzz, m, store, chatUpdate) => {
	try {
		var body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
        var budy = (typeof m.text == 'string' ? m.text : '')
		var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : config.prefix;
		const isCmd = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const arg = body.substring(body.indexOf(" ") + 1);
        const args = body.trim().split(/ +/).slice(1);
   	 const text = args.join(" ");
		const q = args.join(" ");
		const url = args.join(" ");
    	const pushName = m.pushName || "No Name";
 	   const botNumber = await danzz.decodeJid(danzz.user.id);
 	   const isOwner = [botNumber, ...config.ownerNumber].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
  	  const from = m.chat;
	    const reply = m.reply;
	    const sender = m.sender;
 	   const mek = chatUpdate.messages[0];
    	const isRegistered = checkRegisteredUser(sender);
    	const isBanned = banned.includes(sender);
    	const isGroup = m.isGroup;
    	const { menu } = require('./message/menu');
    	const openAI = require('./message/openAI')
    	/*
    	const reSize = async(buffer, ukur1, ukur2) => {
             return new Promise(async(resolve, reject) => {
             let jimp = require('jimp')
             var baper = await jimp.read(buffer);
             var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
             resolve(ab)
             })
        }
    	
        const ftroli ={key: {fromMe: false,"participant":"0@s.whatsapp.net", "remoteJid": "status@broadcast"}, "message": {orderMessage: {itemCount: 99999,status: 200, thumbnail: await reSize(img, 100, 100), surface: 200, message: `Danzz Coding`, orderTitle: 'Danzz Coding', sellerJid: '0@s.whatsapp.net'}}, contextInfo: {"forwardingScore":999,"isForwarded":true},sendEphemeral: true}
		const fdoc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {documentMessage: {title: `Danzz Coding`,jpegThumbnail: await reSize(img, 100, 100)}}}
		const fvn = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: { "audioMessage": {"mimetype":"audio/ogg; codecs=opus","seconds":359996400,"ptt": "true"}} } 
		const ftextt = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})}, message: { "extendedTextMessage": {"text":`Danzz Coding`, "title": `${botName}`, 'jpegThumbnail': await reSize(img, 100, 100)}}}
        const ftoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast" } : {})}, message: { "productMessage": { "product": { "productImage":{ "mimetype": "image/jpeg", "jpegThumbnail": await reSize(img, 100, 100)},"title": `Danzz Coding`, "description": `${botName}`, "currencyCode": "IDR", "priceAmount1000": "1000000000000000000", "retailerId": `Danzz Coding`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}} 
		const fgif = {key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: {"videoMessage": { "title":`Danzz Coding`, "h": `Hmm`,'seconds': '359996400', 'gifPlayback': 'true', 'caption': `Danzz Coding`, 'jpegThumbnail': await reSize(img, 100, 100)}}}
		const fgclink = {key: {participant: "0@s.whatsapp.net","remoteJid": "0@s.whatsapp.net"},"message": {"groupInviteMessage": {"groupJid": "6288213840883-1616169743@g.us","inviteCode": "m","groupName": `Danzz Coding`, "caption": `Danzz Coding`, 'jpegThumbnail': await reSize(img, 100, 100)}}}
		const fvideo = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) },message: { "videoMessage": { "title":`Danzz Coding`, "h": `Hmm`,'seconds': '359996400', 'caption': `Danzz Coding`, 'jpegThumbnail': await reSize(img, 100, 100)}}}
		const floc = {key : {participant : '0@s.whatsapp.net', ...(m.chat ? { remoteJid: `status@broadcast` } : {}) },message: {locationMessage: {name: `Danzz Coding`,jpegThumbnail: await reSize(img, 100, 100)}}}
		const floc2 = {key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {}) }, message: { "liveLocationMessage": { "title": `Danzz Coding`,"h": `Hmm`, 'jpegThumbnail': await reSize(img, 100, 100)}}}
		const fkontak = { key: {participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': `Danzz Coding`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;ytname,;;;\nFN:ytname\nitem1.TEL;waid=6289512545999:6289512545999\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': await reSize(img, 100, 100), thumbnail: await reSize(img, 100, 100),sendEphemeral: true}}}
	    const fakestatus = {key: {fromMe: false,participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: "status@broadcast" } : {})},message: { "imageMessage": {"url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc","mimetype": "image/jpeg","caption": `Danzz Coding`,"fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=","fileLength": "28777","height": 1080,"width": 1079,"mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=","fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=","directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69","mediaKeyTimestamp": "1610993486","jpegThumbnail": await reSize(img, 100, 100),"scansSidecar": "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=="}}}
		*/
		
		// Public & Self
        if (!danzz.public) {
            if (!m.key.fromMe) return
        }

        // Push Message To Console && Auto Read
        if (m.message) {
            //danzz.readMessages([m.key])
            console.log(chalk.black(chalk.bgGreen('[ Chat ]')), chalk.black(chalk.blueBright(new Date)), chalk.black(chalk.greenBright(budy || m.mtype)) + '\n' + chalk.magentaBright('- from'), chalk.blueBright(pushName), chalk.greenBright(m.sender) + '\n' + chalk.blueBright('- in'), chalk.cyanBright(m.isGroup ? pushName : 'Private Chat', m.chat))
        }
        
        // Hit
        global.hit = {}
		if (isCmd) {
		data = await fetchJson('https://api.countapi.xyz/hit/danzzcoding/totalhit')
		totalhit = `${data.value}`
		data2 = await fetchJson(`https://api.countapi.xyz/hit/danzzcoding${timeZone.tz('Asia/Jakarta').format('DDMMYYYY')}/visits`)
		hittoday = `${data2.value}`
		}
  
    // End
    if (isCmd) {
    switch(command) {
    	case "register": case "daftar": {
    		if (isRegistered) return reply('Kamu sudah terdaftar');
    		if (!q.includes('.')) return reply(`Format salah!\n\nExample: ${prefix + command} Danzz.17`);
    		const nameUser = q.substring(0, q.indexOf('.') - 0);
			const ageUser = q.substring(q.lastIndexOf('.') + 1);
			const serialUser = createSerial(20);
			if (isNaN(ageUser)) return m.reply('Umur harus berupa angka!!');
			if (nameUser.length >= 30) return m.reply(`Why is your name so long it's a name or a train`);
			if (ageUser > 40) return m.reply(`Your age is too  old maximum 40 years`);
			if (ageUser < 12) return m.reply(`Your age is too young minimum 12 years`);
			try {
				ppuser = await danzz.profilePictureUrl(num, 'image');
			} catch {
				ppuser = 'https://tinyurl.com/yx93l6da';
			}
			txt = `Registration was successful:\n\n${config.menustyle} Name: ${nameUser}\n${config.menustyle} Age: ${ageUser}\n${config.menustyle} Number: wa.me/${m.sender.split("@")[0]}\n${config.menustyle} Registration time: ${time}\n${config.menustyle} SN: ${serialUser}`;
			{
				addRegisteredUser(m.sender, nameUser, ageUser, serialUser);
                danzz.sendMessage(m.chat, {image: {url: ppuser}, caption: txt}, {quoted: m});
            }
    	}
		break;
		
		/*
		case "menu": case "help": {
			if (isBanned) return reply(msg.banned);
			if (!isRegistered) return reply(msg.notRegister);
			const menu = `Hallo kak *${pushName}*, *${sayyingTime}*\n\n *List Menu*\n${config.menustyle} ${prefix}ai\n${config.menustyle} ${prefix}serimg`;
			reply(menu);
		}
		break;
    	*/
    	
    	case "menu": {
    		if (isBanned) return reply(msg.banned);
			if (!isRegistered) return reply(msg.notRegister);
    		reply(menu(pushName, sayyingTime, config, prefix))
    	}
    	break;
        
        case "openai": case "chatgpt": case "ai": case "gpt": case "danzz": 
        if (isBanned) return reply(msg.banned);
		if (!isRegistered) return reply(msg.notRegister);
		if (!text) return reply(`Hai *${pushName}*, ada yang bisa saya bantu?`);
    	reply(msg.wait);
			const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: apikey.openAI,
});

const openai = new OpenAIApi(configuration);

async function getChatGptResponse(request) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }],
    });

    reply(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (err) {
    reply('Error: ' + err);
    console.log('Error: ' + err);
    return err;
  }
}

getChatGptResponse();
		break;
        
		case "searchimg": case "serimg": case "img": {
			try {
    			if (isBanned) return reply(msg.banned);
				if (!isRegistered) return reply(msg.notRegister);
    			if (apikey.openAI === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
    			if (!text) return reply(`Hai *${pushName}*, ada yang bisa saya bantu?`);
    			reply(msg.wait);
    			const configuration = new Configuration({
     	         apiKey: apikey.openAI
         	   });
     	       const openai = new OpenAIApi(configuration);
     	       const response = await openai.createImage({
            		prompt: text,
           		 n: 1,
         	 	  size: "512x512"
            	});
          	  const searchImg = openAI.searchImg(response)
				danzz.sendImage(from, searchImg, text, mek);
			} catch (err) {
				console.log(err);
            	reply("Maaf, sepertinya ada yang error:" + err);
			}
		}
		break;
		
		case 'author': case 'owner': case 'creator': case 'developer': {
        	danzz.sendContact(m.chat, config.ownerNumber, m);
        }
        break;
        
        case 'banned': case 'ban': {
        	const userNumber = args.join(" ")
        	if (!isOwner) return m.reply(msg.owner)
 		   if (isGroup) return m.reply(msg.private)
			if (!userNumber) throw `Enter number`
			banned.push(`${userNumber}@s.whatsapp.net`)
		    fs.writeFileSync('./database/user/banned.json', JSON.stringify(banned))
			m.reply(msg.success)
			}
			break
		
 	   // End Cmd
		default:
		}
	}
	} catch (err) {
		m.reply(util.format(err))
	}
}

// Auto Refresh
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})