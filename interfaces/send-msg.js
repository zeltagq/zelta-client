const { prompt } = require('enquirer');
const axios = require('axios');
axios.defaults.headers.post['X-Auth-Token'] = config.get('token');
const CryptoJS = require('crypto-js');
const chalk = require('chalk');
const uniqid = require('uniqid');

function send() {
    let questions = [
        {
            type: 'input',
            name: 'to',
            message: chalk.bold.yellowBright('To'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
        {
            type: 'input',
            name: 'msg',
            message: chalk.bold.yellowBright('Msg'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        }
    ];
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    prompt(questions).then(answers => {
        if(answers.to === config.get('username')) {
            return console.log(chalk.yellowBright('You are so lonely that you need to send messages to yourself!'));
        }
        let key = uniqid();
        axios.get(`${config.get('server-url')}/mk/${key}`).then((res) => {
            let sk = res.data;
            let msg = answers.msg;
            let cipher = CryptoJS.AES.encrypt(msg, sk).toString();
            console.log(chalk.bold.grey('Encrypting message.....(AES)'));
            let claims = {
                to : answers.to,
                from : config.get('username'),
                msg : cipher,
                key_id : key
            }
            axios.post(`${config.get('server-url')}/send`, claims).then((response) => {
                if(response.status === 207) {
                    return console.log(chalk.yellowBright('Recipient does not exist'));
                }
                if(response.status === 208) {
                    return console.log(chalk.yellowBright('Group does not exist'));
                }
                if(response.status === 209) {
                    return console.log(chalk.yellowBright('Group has no members'));
                }
                if(response.status === 210) {
                    return console.log(chalk.yellowBright('You are not a member of the group'));
                }
                console.log(chalk.yellowBright('Message sent'));
            }, (err) => {
                console.log(chalk.yellowBright('Failed to send message! This may be a server error or you need to login again.'));
            });
        }, (err) => {
            console.log(chalk.yellowBright('Error contacting server!'));
        });
    }, (err) => {
        console.log(chalk.yellowBright('Zelta closed'));
    });
}

module.exports = {send};