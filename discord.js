const { Client } = require('discord.js');
const client = new Client();

client.once('ready', () => {
	console.log('Discord Ready')
});

client.on('message', message => {
	
});

module.exports = client