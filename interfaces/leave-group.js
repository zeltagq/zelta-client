const axios = require('axios');
const chalk = require('chalk');

function leave(group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/leave/${config.get('username')}/${config.get('token')}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 209) {
            return console.log(chalk.yellowBright('You are not a member of the group'));
        }
        console.log(chalk.whiteBright('You left ' + chalk.yellowBright(group)));
    }, (err) => {
        console.log(chalk.yellowBright('Failed to leave group! This may be a server error or you need to login again.'));
    });
}

module.exports = {leave};