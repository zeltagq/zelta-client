const { prompt } = require('enquirer');
const chalk = require('chalk');
const axios = require('axios');
axios.defaults.headers.post['X-Auth-Token'] = config.get('token');
const njwt = require('njwt');

function joinGrp(group) {
    let questions = [
        {
            type: 'password',
            name: 'passkey',
            message: chalk.bold.yellowBright('Passphrase'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        }
    ];
    if(config.get('token') === null) {
        return console.log(chalk.whiteBright('You need to be logged in. Use the zelta login command.'));
    }
    prompt(questions).then(answers => {
        let passkey = answers.passkey;
        let key = key_ids[Math.floor(Math.random() * key_ids.length)];
        axios.get(`${config.get('server-url')}/mk/${key}`).then((res) => {
            let key_string = res.data;
            let sk = Buffer.from(key_string, 'base64');
            let claims = {
                name: group,
                passkey: passkey,
                username: config.get('username')
            }
            let jwt = njwt.create(claims, sk);
            let token = jwt.compact();
            axios.post(`${config.get('server-url')}/groups/join`, {
                token: token,
                key_id: key,
                username: config.get('username')
            }).then((response) => {
                if(response.status === 206) {
                    return console.log(chalk.whiteBright('Wrong passkey'));
                }
                if(response.status === 207) {
                    return console.log(chalk.whiteBright('You are already a member or admin of the group'));
                }
                if(response.status === 208) {
                    return console.log(chalk.whiteBright('Group does not exist'));
                }
                if(response.status === 209) {
                    return console.log(chalk.whiteBright('You need an invite to join this group'));
                }
                console.log(chalk.whiteBright('You joined ' + chalk.yellowBright(group)));
            }, (err) => {
                console.log(chalk.whiteBright('Failed to join group! This may be a server error or you need to login again.'));
            });
        }, (err) => {
            console.log(chalk.whiteBright('Error contacting server!'));
        });
    }, (err) => {
        console.log(chalk.whiteBright('Zelta closed'));
    });
}

module.exports = {joinGrp};