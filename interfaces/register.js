const {prompt} = require('enquirer');
const chalk = require('chalk');
const axios = require('axios');
const njwt = require('njwt');

function register() {
    let questions1 = [
        {
            type: 'input',
            name: 'username',
            message: chalk.bold.yellowBright('Choose a unique username'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        }
    ];
    let questions2 = [
        {
            type: 'password',
            name: 'password',
            message: chalk.bold.yellowBright('Choose a strong password'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        },
        {
            type: 'password',
            name: 'confirm_password',
            message: chalk.bold.yellowBright('Confirm your password'),
            validate: (input) => {
                let value = input.trim();
                return value.length !== 0;
            }
        }
    ];

    prompt(questions1).then(answers1 => {
        let username = answers1.username;
        if(username.includes('@')) {
            console.log(chalk.whiteBright('@ is a reserved character and is used to identify groups'));
            return register();
        }
        axios.get(`${config.get('server-url')}/userAvail/${username}`).then((res) => {
            if(res.status === 200) {
                console.log(chalk.green('Username is available!'));
                prompt(questions2).then(answers2 => {
                    if(answers2.password === answers2.confirm_password) {
                        let password = answers2.password;
                        let key = key_ids[Math.floor(Math.random() * key_ids.length)];
                        axios.get(`${config.get('server-url')}/mk/${key}`).then((res) => {
                            let key_string = res.data;
                            let sk = Buffer.from(key_string, 'base64');
                            let claims = {
                                username: username,
                                password: password
                            }
                            let jwt = njwt.create(claims, sk);
                            let token = jwt.compact();
                            axios.post(`${config.get('server-url')}/register`, {
                                token: token,
                                key_id: key
                            }).then((response) => {
                                if(response.status === 200) {
                                    config.set('username', username);
                                    config.set('token', null);
                                    return console.log(chalk.whiteBright(`Registration successful! ` + chalk.yellowBright(username) + chalk.whiteBright(' is your new zelta identity')));
                                }
                                console.log(chalk.whiteBright('Registration failed! Try again later.'));
                            }, (err) => {
                                console.log(chalk.whiteBright('Error contacting server!'));
                            });
                        }, (err) => {
                            console.log(chalk.whiteBright('Error contacting server!'));
                        });
                    }
                    else {
                        console.log(chalk.whiteBright('Passwords do not match'));
                    }
                }, (err) => {
                    console.log(chalk.whiteBright('Zelta closed'));
                });
            }
            else if(res.status === 206) {
                console.log(chalk.whiteBright('Username is already taken!'))
                register();
            }
        }, (err) => {
            console.log(chalk.whiteBright('Error contacting server!'));
        });
    }, (err) => {
        console.log(chalk.whiteBright('Zelta closed'));
    });
}

module.exports = {register};