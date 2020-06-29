#!/usr/bin/env node

const Conf = require('conf');
global.config = new Conf({ projectName: 'zelta' });
const {program} = require('commander');

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

// Available key ids (100 key ids)
global.key_ids = [];
for(let i=1; i<101; i++) {
    key_ids.push(`key${i}`);
}

// Application server url
config.set('server-url', 'https://v1.zelta.gq');

if(config.get('username') === undefined && config.get('token') === undefined) {
    config.set('username', null);
    config.set('token', null);
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

program.parse(process.argv);