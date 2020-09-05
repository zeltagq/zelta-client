<head>
  <link rel="shortcut icon" type="image/x-icon" href="favicon.ico">
</head>

### Updates
Update Priority : Breaking changes | Required update
* Stable version 1.0 (Code Blue) is live!
* Security : A key id pool was used to communicate the key value to the server for signing jwt or encrypting messages during beta. This could pose a security threat because of the finite number of key ids in the pool. In this version a new key as well as a unique key id is generated for each use. The server runs a cron job to regularly purge used keys in the database to free up space.
* New features : Encrypted Live Chat, Server Regions

<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/simple-chat-1.gif">
</p>

### Sections
* [General](https://www.zelta.gq/#general)
* [Messaging](https://www.zelta.gq/#messaging)
* [Groups](https://www.zelta.gq/#groups)
* [Inbox](https://www.zelta.gq/#inbox)
* [Timezone](https://www.zelta.gq/#timezone)
* [Live Chat](https://www.zelta.gq/#chat)

### Project Zelta
*Zelta is an open source, secure, anonymous and feature rich messaging service for the terminal.*

### Security & Encryption (High Level Overview)
* Zelta does not collect any personal information.
* Zelta does not log your ip address nor does it store cookies and trackers.
* Your messages are only stored until you see them. Once you view them, all records of their existence are completely erased. So do remember to screenshot important messages.
* User passwords and group passphrases are converted to salted hashes before they are stored in the database.
* The database server hardware encrypts all data at rest.
* Messages are encrypted using AES-256 with rotating cryptographic keys produced by the application server.
* All sensitive communication is carried out using signed json web tokens over tls.
* Zelta Chat provides real time end to end encrypted group chat.

### Requirement
Node JS (v8 and above)

### Install
```
npm i -g zelta
```
```
yarn global add zelta
```

### General

*Display a list of all the available commands*
```sh
$ zelta
```

*Register a new username*
```sh
$ zelta register
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/register.gif">
</p>

*Login. Once you login, the access token is valid for 24 hrs. You should logout after each session on an untrusted device.*
```sh
$ zelta login
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/login.gif">
</p>

### Messaging

*Send a message*
```sh
$ zelta send
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/send-msg.gif">
</p>

### Groups

*Create a group. There are two types of groups in zelta : public and private. Anyone can join a public group using the passphrase but private groups require an invite to join. The invitation is sent by the admin, who is the creator of the group. Currently the group limit is 50 members.*
```sh
$ zelta group
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/group-creation.gif">
</p>

*Join a public group using the passphrase. Group names are referred to using the @ symbol.*
```sh
$ zelta join <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/join-grp.gif">
</p>

*If you try joining a private group, zelta mentions that you need an invite.*
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/no-invite-join.gif">
</p>

*Invite a user to your group (admin privilege). Use @ for mentioning group name.*
```sh
$ zelta invite <user> <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/send-invite.gif">
</p>

*Accept a group invite. You will receive the invite in your inbox.*
```sh
$ zelta accept-invite <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/accept-invite.gif">
</p>

*To send messages to a group, just address the message to a group name using @. Needless to say, you need to be a member or admin of the group. Remember that @ tells zelta that you intend to send the message to a group. Without @ the message may be sent to a user with the same username as the group name.*
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/group-msg.gif">
</p>

*You can always change the access level of your groups (admin privilege)*
```sh
$ zelta set-public <group>
```
```sh
$ zelta set-private <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/public-private.gif">
</p>

*List all the members of a group. Needless to say, you need to be a member yourself.*
```sh
$ zelta members <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/members.gif">
</p>

*Leave a group. If you are the admin, the oldest member of the group becomes the new admin.*
```sh
$ zelta leave <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/leave.gif">
</p>

*Kick a group member (admin privilege)*
```sh
$ zelta kick <user> <group>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/kick.gif">
</p>

### Inbox

*Check your messages using the inbox command. Group messages appear in a user@group format. The time shown is GMT unless you have configured your local timezone.*
```sh
$ zelta inbox
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/inbox.gif">
</p>

### Timezone

*Configure your local timezone using the timezone configuration wizard. For your security and anonymity, this info is not sent to the server. You will have to re-configure your timezone each time you are on a new device or each time you perform a fresh install. If you dont do this all incoming messages will show the GMT time.*
```sh
$ zelta timezone
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/timezone.gif">
</p>

### Chat

*Create a chatroom*
```sh
$ zelta chatroom
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/chatroom.gif">
</p>

*Zelta supports multiple chat servers. Currently there are two : asia and europe (default). You can always host and contribute more servers.*
```sh
$ zelta region <region>
```
*When you use the ```chatroom``` command, a chatroom is created on that server. The room name must be unique for the server. The creator of the room is the room owner and reserves the right to destroy the room. Until the room is destroyed, it will be live for any participant with the room name and passphrase.*

* Passphrase : Must have a minimum length of 8
* Encryption : There are two choices for end to end encryption : Rabbit and AES

*You can enable ```typing-effect``` to have incoming chat messages typed on your screen (matrix style!). This may not work on every terminal and currently doesnt support emojis. It is not recommended to use it in busy rooms as the animation can create a backlog of messages.*
```sh
$ zelta typing-effect <value>
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/typing-effect.gif">
</p>

*Head over to a chatroom to see if it works*
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/typing-chat.gif">
</p>

*Customize the typing speed by setting the delay (in ms) between the printing of each character. Use the ```typing-delay``` command. Recommended value is between 100 - 130. Default is 115.*
```sh
$ zelta typing-delay 120
```

*Join a chatroom*
```sh
$ zelta chat
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/join-chat.gif">
</p>

*You will need to be connected to the same chat server as the chatroom and you must know the room name and passphrase. Currently there is no invitation system implemented into chat. But you may manually invite the person through a personal message (Refer : ```zelta send```)*

*Madbot is the chat moderator. It recognizes these commands:*
* ```members``` : List all the members in the room
* ```exit``` or ```leave``` : Exit the chat
* ```mad fact``` or ```mad facts``` : Bot tells you a random fact picked from wikipedia
* ```destroy``` : Only takes effect when used by the room creator. Destroys the room and releases the room name. Gives a 30 second headstart.

*If you have not used the ```timezone``` command to configure your local timezone, UTC/GMT time is shown by default.*

*For emojis you can use an OS provided emoji panel or use the following syntax - ```:emoji_name:``` Example - ```:smile:``` This will render as a smiley emoji for the receiver. Refer this list for emoji names : [emoji-list](https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json)*

### Logout

*Logout. You should logout after each session on an untrusted device. If you dont logout, the access token expires in 24 hrs.*
```sh
$ zelta logout
```
<p align="center">
  <img src = "https://raw.githubusercontent.com/zeltagq/docs/master/logout.gif">
</p>

<br><br>
<hr style="height:10px;border-width:10px;color:gray;background-color:gray">
<p align="center"><b>CREATED BY : ZAYGOZI</b></p>
<p align="center"><a href = "https://www.linkedin.com/in/zaygo/">Linkedin</a> | <a href = "https://github.com/zaygozi">Github</a></p>
<p align="center"><a href = "https://github.com/zeltagq">Show me the code</a></p>
<hr style="height:10px;border-width:10px;color:gray;background-color:gray">
