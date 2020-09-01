const axios = require('axios');
const chalk = require('chalk');

function kick(target, group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/kick/${config.get('username')}/${config.get('token')}/${group}/${target}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are not the group admin'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('User is not a member of the group'));
        }
        console.log(chalk.yellowBright(target + chalk.whiteBright(' has been kicked out')));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to kick user! This may be a server error or you need to login again.'));
    });
}

module.exports = {kick};