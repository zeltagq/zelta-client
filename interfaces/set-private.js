const axios = require('axios');
const chalk = require('chalk');

function setPrivate(group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/set-private/${config.get('username')}/${config.get('token')}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are not the group admin'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('Group is already private'));
        }
        console.log(chalk.yellowBright(group) + chalk.whiteBright(' is now a private group. Only invited users can join.'));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to change group access! This may be a server error or you need to login again.'));
    });
}

module.exports = {setPrivate};