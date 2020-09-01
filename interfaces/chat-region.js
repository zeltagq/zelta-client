// Module to set server region
const chalk = require('chalk');

function chatRegion(value) {
    if (value.toLowerCase() === 'asia') {
        config.set('chat-url', 'https://as.chat.zelta.gq');
        cosnole.log(chalk.yellowBright('[Zelta Chat] Server : Asia (India)'));
    }
    else if (value.toLowerCase() === 'europe') {
        config.set('chat-url', 'https://eu.chat.zelta.gq');
        cosnole.log(chalk.yellowBright('[Zelta Chat] Server : Europe (Ireland)'));
    }
    else {
        console.log(chalk.yellowBright('This region currently does not host a chat server!'));
    }
}

module.exports = {chatRegion};