const { prompt } = require('enquirer');
const chalk = require('chalk');
const axios = require('axios');
axios.defaults.headers.post['X-Auth-Token'] = config.get('token');
const njwt = require('njwt');
const uniqid = require('uniqid');

function createGroup() {
    let questions1 = [
        {
            type: 'input',
            name: 'grp_name',
            message: chalk.bold.yellowBright('Group name'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        }
    ];
    let questions2 = [
        {
            type: 'password',
            name: 'passkey',
            message: chalk.bold.yellowBright('Passphrase'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
        {
            type: 'password',
            name: 'confirm_passkey',
            message: chalk.bold.yellowBright('Confirm passphrase'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
        {
            type: 'toggle',
            name: 'invite_only',
            message: chalk.bold.yellowBright('Private group'),
            enabled: 'Yes',
            disabled: 'No',
            focus: 'No'
        }
    ];
    if(config.get('token') === null) {
        return console.log(chalk.whiteBright('You need to be logged in. Use the zelta login command.'));
    }
    prompt(questions1).then(answers1 => {
        let grp_name = answers1.grp_name;
        if(grp_name.includes('@')) {
            console.log(chalk.whiteBright('@ is a reserved character and is used to identify groups'));
            return createGroup();
        }
        axios.get(`${config.get('server-url')}/grpAvail/@${grp_name}`).then((res) => {
            if(res.status === 206) {
                console.log(chalk.whiteBright('Group already exists'));
                return createGroup();
            }
            console.log(chalk.green('Group name is available!'));
            prompt(questions2).then(answers2 => {
                if(answers2.passkey !== answers2.confirm_passkey) {
                    return console.log(chalk.whiteBright('Passphrases do not match'));
                }
                let passkey = answers2.passkey;
                let invite_only = answers2.invite_only;
                let key = uniqid();
                axios.get(`${config.get('server-url')}/mk/${key}`).then((res) => {
                    let key_string = res.data;
                    let sk = Buffer.from(key_string, 'base64');
                    let claims = {
                        name: grp_name,
                        passkey: passkey,
                        admin: config.get('username'),
                        invite_only: invite_only
                    }
                    let jwt = njwt.create(claims, sk);
                    let token = jwt.compact();
                    axios.post(`${config.get('server-url')}/groups/create`, {
                        token: token,
                        key_id: key,
                        username: config.get('username')
                    }).then((response) => {
                        console.log(chalk.whiteBright('Group ' + chalk.yellowBright(grp_name + chalk.whiteBright(' has been created'))));
                    }, (err) => {
                        console.log(chalk.whiteBright('Server error or you need to login again'));
                    });
                }, (err) => {
                    console.log(chalk.whiteBright('Error contacting server!'));
                });
            }, (err) => {
                console.log(chalk.whiteBright('Zelta closed'));
            });
        }, (err) => {
            console.log(chalk.whiteBright('Error contacting server!'));
        });
    }, (err) => {
        console.log(chalk.whiteBright('Zelta closed'));
    });
}

module.exports = { createGroup };