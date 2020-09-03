// This module manages joining as well as the client side chat interface
const { prompt } = require('enquirer');
const CryptoJS = require('crypto-js');
const chalk = require('chalk');
const boxen = require('boxen');
const moment = require('moment');
const term = require('terminal-kit').terminal;
const cliCursor = require('cli-cursor');
const Quote = require('inspirational-quotes');
const gradient = require('gradient-string');
const emoji = require('node-emoji');
const io = require('socket.io-client');

// room variables
let socket = null;
let enc_key = null;
let enc_alg = null;
let join_signal = false;
let enc_signal = false;
let start_signal = false;
let currentInput = null;
let time_diff = null;
let chat_animation = config.get('chat-animation');

// setting correct time according to timezone
if(config.get('timezone') !== undefined) {
    time_diff = config.get('timezone');
}
else {
    time_diff = 0;
}

function joinRoom() {
    let questions = [
        {
            type: 'input',
            name: 'room',
            message: chalk.bold.yellowBright('Room'),
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
                return value.length !== 0;
            }
        }
    ];
    if(config.get('token') === null) {
        return console.log(chalk.yellowBright('You need to be logged in. Use the zelta login command.'));
    }
    prompt(questions).then((answers) => {
        let room = answers.room;
        let passphrase = answers.passphrase;
        let user = config.get('username');
        let token = config.get('token');

        // socket.io events
        socket = io(config.get('chat-url'), {
            reconnection: true,
            reconnectionAttempts: 10,
        });

        // Initiating connection by providing credentials
        socket.emit('auth', {
            room : room,
            passphrase : passphrase,
            user : user,
            token : token
        });

        socket.on('auth-error', (data) => {
            console.log(chalk.yellowBright(data));
            process.exit();
        });
        socket.on('join-failed', (data) => {
            term('\n');
            process.exit();
        });
        socket.on('room-auth-error', (data) => {
            console.log(chalk.yellowBright(data));
            process.exit();
        });
        socket.on('server-error', (data) => {
            console.log(chalk.yellowBright(data));
            process.exit();
        });
        socket.on('join-success', () => {
            console.log(chalk.bold.greenBright('Room authentication : Successful'));
            join_signal = true;
        });
        socket.on('enc', (enc) => {
            enc_key = enc.key;
            enc_alg = enc.algo;
            console.log(chalk.bold.greenBright('Fetch encryption key : Successful'));
            enc_signal = true;
        });
        // Start chat terminal
        socket.on('start-chat', () => {
            if(join_signal && enc_signal) {
                console.log(chalk.bold.greenBright('Preparing Console'));
                // Timeout designed to avoid potential memory stack problems and to warn room members
                setTimeout(() => {
                    console.clear();
                    console.log(boxen(chalk.bold.whiteBright(`ZELTA CHAT\nEncryption : ${enc_alg}\nRoom : ${room}`), {padding: 1, margin: 1, borderStyle: 'singleDouble', align: 'center', float: 'center', backgroundColor: '#00BFFF', borderColor: 'yellowBright'}));
                    console.log(boxen(gradient.pastel(getQuote()), {padding: 1, margin: 1, borderStyle: 'round', align: 'center', float: 'center', dimBorder: true, borderColor: 'yellowBright'}));
                    takeInput();
                    socket.emit('in-chat');  // throws room join notification
                    start_signal = true;
                }, 4000);
            }
        });
        socket.on('msg', (data) => {
            if(start_signal && join_signal && enc_signal) {
                let unencrypted = null;
                if(enc_alg === 'AES (256)') {
                    unencrypted = CryptoJS.AES.decrypt(data.msg, enc_key).toString(CryptoJS.enc.Utf8);
                }
                else {
                    unencrypted = CryptoJS.Rabbit.decrypt(data.msg, enc_key).toString(CryptoJS.enc.Utf8);
                }
                if(chat_animation) {
                    // Typing animation
                    currentInput.hide();
                    term.bold.brightYellow(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (${data.from}) `);
                    term.slowTyping(
                        emoji.emojify(unencrypted),
                        { flashStyle: false, delay: 115, style: term.yellow },
                        function () {
                            return takeInput();
                        }
                    );
                }
                else {
                    // No animation
                    currentInput.hide();
                    term.bold.brightYellow(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (${data.from}) `);
                    term.yellow(emoji.emojify(unencrypted));
                    takeInput();
                }
            }
        });
        socket.on('bot', (msg) => {
            currentInput.hide();
            term.bold.brightCyan(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (madbot) `);
            term.cyan(msg);
            takeInput();
        });
        socket.on('reconnecting', () => {
            if(!start_signal) {
                return console.log(chalk.bold.redBright('Failed to connect! Reconnecting....'));
            }
            currentInput.hide();
            term.bold.brightCyan(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (madbot) `);
            term.cyan(`[PM] Hey ${config.get('username')}, looks like you have a shitty connection. Dont worry I will try my best to reconnect you to the room. Sit tight!`);
        });
        socket.on('reconnect', () => {
            if(!start_signal) {
                console.log(chalk.bold.greenBright('Connection Established'));
                console.log(chalk.bold.greenBright('Authenticating....'));
                return socket.emit('auth', {
                    room : room,
                    passphrase : passphrase,
                    user : user,
                    token : token
                });
            }
            currentInput.hide();
            term.bold.brightCyan(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (madbot) `);
            term.cyan('[PM] Here you go! We are back online.');
            takeInput();
        });
        socket.on('reconnect_failed', () => {
            if(!start_signal) {
                console.log(chalk.bold.redBright('Connection failed! Possible network problem!'));
                term('\n');
                return process.exit();
            }
            currentInput.hide();
            term.bold.brightCyan(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (madbot) `);
            term.cyan('[PM] Sorry, I could not reconnect you to the room! I am closing the console on your behalf.');
            socket.emit('exit');
            socket.disconnect();
            term('\n\n');
            process.exit();
        });
        socket.on('close', () => {
            setTimeout(() => {
                term.bold.brightCyan(`[${moment().utc().add(time_diff, 'hours').format('HH:mm')}] (madbot) `);
                term.cyan('[PM] Farewell!');
                socket.disconnect();
                term('\n\n');
                process.exit();
            }, 1000 * 30);
        });

    }, (err) => {
        console.log(chalk.yellowBright('Zelta closed'));
    });
}

// Handles user input
function takeInput() {
    if (!currentInput) {
        term('\n\n');
        cliCursor.show();
        currentInput = term.inputField((err, message) => {
            if (err) throw err;
            let encrypted = null;
            if (message.trim() === 'exit' || message.trim() === 'leave') {
                term('\n\n');
                socket.emit('exit');
                socket.disconnect();
                process.exit();
            }
            else if (message.trim() === 'members') {
                if (enc_alg === 'AES (256)') {
                    encrypted = CryptoJS.AES.encrypt(message.trim(), enc_key).toString();
                }
                else {
                    encrypted = CryptoJS.Rabbit.encrypt(message.trim(), enc_key).toString();
                }
                socket.emit('msg', encrypted);
                socket.emit('members');  // call for list of members
                currentInput = null;
                takeInput();
            }
            else if (message.trim() === 'mad fact' || message.trim() === 'mad facts') {
                if (enc_alg === 'AES (256)') {
                    encrypted = CryptoJS.AES.encrypt(message.trim(), enc_key).toString();
                }
                else {
                    encrypted = CryptoJS.Rabbit.encrypt(message.trim(), enc_key).toString();
                }
                socket.emit('msg', encrypted);
                socket.emit('fact');  // call for a random fact
                currentInput = null;
                takeInput();
            }
            else if (message.trim().length === 0) {
                // Dont send blank space
            }
            else if (message.trim() === 'destroy') {
                socket.emit('destroy');
                currentInput = null;
                takeInput();
            }
            else {
                if (enc_alg === 'AES (256)') {
                    encrypted = CryptoJS.AES.encrypt(message.trim(), enc_key).toString();
                }
                else {
                    encrypted = CryptoJS.Rabbit.encrypt(message.trim(), enc_key).toString();
                }
                socket.emit('msg', encrypted);
                currentInput = null;
                takeInput();
            }
        });
    }
    else {
        term('\n\n');
        currentInput.rebase();
        cliCursor.show();
    }
}

// Generating random welcome quote
function getQuote() {
    let quote = Quote.getRandomQuote();
    if (quote.length > 100) {
        return 'If you like zelta, do consider a donation towards server costs (www.zelta.gq)';
    }
    else {
        return quote;
    }
}

module.exports = {joinRoom};