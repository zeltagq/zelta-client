const axios = require('axios');
const chalk = require('chalk');

function inviteUser(invite,group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/invite/${config.get('username')}/${config.get('token')}/${invite}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 210) {
            return console.log(chalk.yellowBright('Invited user does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are not the group admin'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('Invited user is already a member of the group'));
        }
        if(res.status === 211) {
            return console.log(chalk.yellowBright('Group has reached its member limit. Currently the limit is 50 members.'));
        }
        console.log(chalk.whiteBright('Invitation sent to ' + chalk.yellowBright(invite)));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to invite user! This may be a server error or you need to login again.'));
    });
}

module.exports = {inviteUser};