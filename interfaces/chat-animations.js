// Module to enable and customize chat animations
const term = require('terminal-kit').terminal;

// Chat typing effect
function typingEffect(value) {
    if (value === 'on') {
        config.set('chat-animation', true);
        term.slowTyping(
            'Typing effect has been turned on\n',
            { flashStyle: false, delay: 115, style: term.brightYellow },
            function () {
                process.exit();
            }
        );
    }
    else if (value === 'off') {
        config.set('chat-animation', false);
        term.brightYellow('Typing effect has been turned off\n');
    }
    else {
        term.brightYellow('Specify on or off\n');
    }
}

// Typing effect delay (typing speed)
function typingDelay(value) {
    if (Number.isInteger(value)) {
        config.set('typing-delay', value);
        term.brightYellow(`[Zelta Chat] (Typing Effect) Delay : ${value} ms`);
    }
    else {
        term.brightYellow('Please provide an integer value in milliseconds');
    }
}

module.exports = {typingEffect, typingDelay};