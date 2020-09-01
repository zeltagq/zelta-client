const axios = require('axios');
const chalk = require('chalk');

function members(group) {
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    axios.get(`${config.get('server-url')}/members/${config.get('username')}/${config.get('token')}/${group}`).then((res) => {
        if(res.status === 207) {
            return console.log(chalk.yellowBright('Group does not exist'));
        }
        if(res.status === 208) {
            return console.log(chalk.yellowBright('You are not a member or admin of the group'));
        }
        let members = res.data.members;
        let admin = res.data.admin;
        console.log(chalk.yellowBright(`Group has ${members.length + 1} members`));
        console.log('');
        console.log(chalk.whiteBright(`${admin} (admin)`));
        members.forEach(member => {
            console.log(chalk.whiteBright(member));
        });
    }, (err) => {
        console.log(chalk.yellowBright('Failed to fetch group members! This may be a server error or you need to login again.'));
    });
}

module.exports = {members};