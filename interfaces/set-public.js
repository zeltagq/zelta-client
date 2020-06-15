const axios = require('axios');
const chalk = require('chalk');

function setPublic(group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/set-public/${config.get('username')}/${config.get('token')}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are not the group admin'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('Group is already public'));
        }
        console.log(chalk.yellowBright(group) + chalk.whiteBright(' is now a public group. Anyone who knows the passphrase can join.'));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to change group access! This may be a server error or you need to login again.'));
    });
}

module.exports = {setPublic};