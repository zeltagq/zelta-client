#!/usr/bin/env node

const Conf = require('conf');
global.config = new Conf({ projectName: 'zelta' });
const {program} = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('./package.json');
program.version(`${pkg.version} (Code Blue) [Stable Release 2020]`);

const {register} = require('./interfaces/register');
const {login} = require('./interfaces/login');
const {logout} = require('./interfaces/logout');
const {createGroup} = require('./interfaces/create-group');
const {joinGrp} = require('./interfaces/join-group');
const {send} = require('./interfaces/send-msg');
const {inbox} = require('./interfaces/inbox');
const {inviteUser} = require('./interfaces/invite-user');
const {acceptInvite} = require('./interfaces/accept-invite');
const {kick} = require('./interfaces/kick-user');
const {setPrivate} = require('./interfaces/set-private');
const {setPublic} = require('./interfaces/set-public');
const {leave} = require('./interfaces/leave-group');
const {members} = require('./interfaces/list-members');
const {timezone} = require('./interfaces/timezone');
const {createRoom} = require('./interfaces/create-chat');
const {joinRoom} = require('./interfaces/join-chat');
const {typingEffect, typingDelay} = require('./interfaces/chat-animations');
const {chatRegion} = require('./interfaces/chat-region');

// Notify user about new updates
updateNotifier({pkg}).notify();

// Application server url
config.set('server-url', 'https://v1.zelta.gq');

// Username and token
if(config.get('username') === undefined && config.get('token') === undefined) {
    config.set('username', null);
    config.set('token', null);
}

// Live chat region
if(config.get('chat-url') === undefined) {
    config.set('chat-url', 'http://eu.chat.zelta.gq');
}

// Chat animation
if(config.get('chat-animation') === undefined) {
    config.set('chat-animation', false);
}

// Chat animation delay
if(config.get('typing-delay') === undefined) {
    config.set('typing-delay', 115);
}

// -------- Commands --------

// Register
program
    .command('register')
    .description('Register a new username')
    .action(() => {
        register();
    });

// Login
program
    .command('login')
    .description('Login')
    .action(() => {
        login();
    });

// Logout
program
    .command('logout')
    .description('Logout')
    .action(() => {
        logout();
    });

// Create Group
program
    .command('group')
    .description('Create a group')
    .action(() => {
        createGroup();
    });

// Join Group
program
    .command('join <group>')
    .description('Join a group')
    .action((group) => {
        joinGrp(group);
    });

// Send msg
program
    .command('send')
    .description('Send a message')
    .action(() => {
        send();
    });

// Inbox
program
    .command('inbox')
    .description('View your inbox')
    .action(() => {
        inbox();
    });

// Invite user to group
program
    .command('invite <user> <group>')
    .description('Invite a user to your group')
    .action((user,group) => {
        inviteUser(user,group);
    });

// Accept an invite
program
    .command('accept-invite <group>')
    .description('Accept a group invitation')
    .action((group) => {
        acceptInvite(group);
    });

// Kick user
program
    .command('kick <user> <group>')
    .description('Kick a group member')
    .action((user, group) => {
        kick(user,group);
    });

// Change group access to private
program
    .command('set-private <group>')
    .description('Make a group private')
    .action((group) => {
        setPrivate(group);
    });

// Change group access to public
program
    .command('set-public <group>')
    .description('Make a group public')
    .action((group) => {
        setPublic(group);
    });

// Leave group
program
    .command('leave <group>')
    .description('Leave a group')
    .action((group) => {
        leave(group);
    });

// List group members
program
    .command('members <group>')
    .description('List all the group members')
    .action((group) => {
        members(group);
    });

// Configure local timezone
program
    .command('timezone')
    .description('Configure local timezone')
    .action(() => {
        timezone();
    });

// Create chat room
program
    .command('chatroom')
    .description('Create a chat room')
    .action(() => {
        createRoom();
    });

// Join chat room
program
    .command('chat')
    .description('Join a chat room')
    .action(() => {
        joinRoom();
    });

// Enable or disable typing effect
program
    .command('typing-effect <value>')
    .description('Enable or disable chat typing effect')
    .action((value) => {
        typingEffect(value);
    });

// Typing effect delay (typing speed)
program
    .command('typing-delay <value>')
    .description('Delay in milliseconds between typing each character when typing effect is on')
    .action((value) => {
        typingDelay(parseInt(value));
    });

// Change chat server region
program
    .command('region <value>')
    .description('Set chat server region (default : europe)')
    .action((region) => {
        chatRegion(region);
    });

program.parse(process.argv);