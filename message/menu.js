const fs = require("fs");
const chalk = require("chalk");

function menu(pushName, sayyingTime, config, prefix) {
	const text = `Hallo kak *${pushName}*, *${sayyingTime}*

*List Menu:*
${config.menustyle} ${prefix}ai
${config.menustyle} ${prefix}serimg`
	return text
}
exports.menu = menu

// Auto Refresh
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.greenBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})