// Tiny function to enable chat typing effect
const term = require('terminal-kit').terminal;

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

module.exports = {typingEffect};