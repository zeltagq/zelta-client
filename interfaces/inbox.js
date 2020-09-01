const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');

function inbox() {
    let username = config.get('username');
    let access_token = config.get('token');
    if(access_token === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/inbox/${username}/${access_token}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('No new messages'));
        }
        let messages = res.data;
        let time_diff = null;
        if(config.get('timezone') !== undefined) {
            time_diff = config.get('timezone');
        }
        else {
            time_diff = 0;
        }
        console.log(chalk.bold.yellowBright(`${messages.length} new messages`));
        messages.forEach((msg) => {
            console.log('');
            console.log(chalk.bold.yellowBright('From : ' + chalk.whiteBright(msg.from)));
            console.log(chalk.bold.yellowBright('Time : ' + chalk.whiteBright(moment(msg.time).add(time_diff, 'hours').format('(DD-MM-YYYY) hh:mm A'))));
            console.log(chalk.bold.yellowBright('Msg : ' + chalk.whiteBright(msg.msg)));
        });
    }, (err) => {
        console.log(chalk.yellowBright('Failed to fetch messages! This may be a server error or you need to login again.'));
    });
}

module.exports = {inbox};