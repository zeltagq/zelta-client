const { prompt } = require('enquirer');
const axios = require('axios');
axios.defaults.headers.post['X-Auth-Token'] = config.get('token');
const chalk = require('chalk');

function createRoom() {
    let questions = [
        {
            type: 'input',
            name: 'room',
            message: chalk.bold.yellowBright('Room name (must be unique in a region)'),
            validate: (input) => {
                let value = input.trim();
                return value.length >= 3;
            }
        },
        {
            type: 'password',
            name: 'passphrase',
            message: chalk.bold.yellowBright('Passphrase'),
            validate: (input) => {
                let value = input.trim();
                return value.length >= 8;
            }
        },
        {
            type: 'select',
            name: 'enc',
            message: chalk.bold.yellowBright('Encryption Algorithm'),
            choices: ['Rabbit (256)', 'AES (256)']
        }
    ];
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    prompt(questions).then((answers) => {
        let room = answers.room;
        let passphrase = answers.passphrase;
        let enc = answers.enc;
        let user = config.get('username');
        axios.post(`${config.get('chat-url')}/chat/create`, {
            user : user,
            room : room,
            passphrase : passphrase,
            enc : enc
        }).then((res) => {
            if(res.status === 201) {
                return console.log(chalk.yellowBright('Room name is taken'));
            }
            console.log(chalk.yellowBright('Room created. Go ahead and join the room to start chatting.'));
        }, (err) => {
            console.log(chalk.yellowBright('Unable to create room. Possible server error or authentication failed'));
        });
    }, (err) => {
        console.log(chalk.yellowBright('Zelta closed'));
    });
}

module.exports = {createRoom};