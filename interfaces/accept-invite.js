const axios = require('axios');
const chalk = require('chalk');

function acceptInvite(group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/accept-invite/${config.get('username')}/${config.get('token')}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are already a member of the group'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('You dont have an invitation for the group'));
        }
        if(res.status === 211) {
            return console.log(chalk.whiteBright('Group is currently full'));
        }
        console.log(chalk.whiteBright('You joined ' + chalk.yellowBright(group)));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to join group! This may be a server error or you need to login again.'));
    });
}

module.exports = {acceptInvite};