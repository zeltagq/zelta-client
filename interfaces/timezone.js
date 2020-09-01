const {prompt} = require('enquirer');
const chalk = require('chalk');
const moment = require('moment');

function timezone() {
    let questions = [
        {
            type: 'toggle',
            name: 'difference',
            message: chalk.bold.yellowBright('Is your local time ahead or behind GMT?'),
            enabled: 'Ahead',
            disabled: 'Behind'
        },
        {
            type: 'numeral',
            name: 'value',
            message: chalk.bold.yellowBright('By how many hours? (Example: 1 hour 30 mins = 1.5)'),
            initial: 0
        }
    ]
    prompt(questions).then(answers => {
        let value = answers.value;
        if(answers.difference) {
            let time_diff = 0 + value;
            config.set('timezone', time_diff);
            let time = moment().utc().add(time_diff,'hours').format('(DD-MM-YYYY) hh:mm A');
            console.log(chalk.whiteBright('Your current local time is ' + chalk.yellowBright(time)));
            console.log(chalk.whiteBright('If this is incorrect, perform the timezone configuration again'));
        }
        else {
            let time_diff = 0 - value;
            config.set('timezone', time_diff);
            let time = moment().utc().add(time_diff,'hours').format('(DD-MM-YYYY) hh:mm A');
            console.log(chalk.whiteBright('Your current local time is ' + chalk.yellowBright(time)));
            console.log(chalk.whiteBright('If this is incorrect, perform the timezone configuration again'));
        }
    }, (err) => {
        console.log(chalk.whiteBright('Zelta closed'));
    });
}

module.exports = {timezone};