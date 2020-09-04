const { prompt } = require('enquirer');
const chalk = require('chalk');
const axios = require('axios');
const njwt = require('njwt');
const uniqid = require('uniqid');

function login() {
    let questions = [
        {
            type: 'input',
            name: 'username',
            message: chalk.bold.yellowBright('Username'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
        {
            type: 'password',
            name: 'password',
            message: chalk.bold.yellowBright('Password'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
    ];

    prompt(questions).then(answers => {
        let username = answers.username;
        let password = answers.password;
        let key = uniqid();
        axios.get(`${config.get('server-url')}/mk/${key}`).then((res) => {
            let key_string = res.data;
            let sk = Buffer.from(key_string, 'base64');
            let claims = {
                username: username,
                password: password
            }
            let jwt = njwt.create(claims, sk);
            let token = jwt.compact();
            axios.post(`${config.get('server-url')}/login`, {
                token: token,
                key_id: key
            }).then((response) => {
                if(response.status === 206) {
                    return console.log(chalk.whiteBright('Seems like you forgot your password!'));
                }
                console.log(chalk.whiteBright('Welcome ' + chalk.yellowBright(username)));
                let access_token = response.headers['x-auth-token'];
                config.set('username', username);
                config.set('token', access_token);
            }, (err) => {
                console.log(chalk.whiteBright('Login failed!'));
            });
        }, (err) => {
            console.log(chalk.whiteBright('Server unreachable!'));
        });
    }, (err) => {
        console.log(chalk.whiteBright('Login aborted'));
    });
}

module.exports = { login };