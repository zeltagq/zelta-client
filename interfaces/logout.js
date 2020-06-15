const axios = require('axios');
const chalk = require('chalk');

function logout() {
    axios.get(`${config.get('server-url')}/logout/${config.get('username')}/${config.get('token')}`).then((res) => {
        console.log(chalk.yellowBright('See you again! Have a nice day.'));
        config.set('username', null);
        config.set('token', null);
    }, (err) => {
        console.log(chalk.yellowBright('You are not logged in or there was an error contacting the server'));
    });
}

module.exports = {logout};