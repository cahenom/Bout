const fs = require("fs");
const chalk = require("chalk");

function chatGPT(response) {
	return `${response.data.choices[0].text}`
}
exports.chatGPT = chatGPT

function searchImg(response) {
	return `${response.data.data[0].url}`
}
exports.searchImg = searchImg

// Auto Refresh
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})