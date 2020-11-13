const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('client/dist'));
  
var messages = [];
const users = [];
const onlineUsers = [];
var userCounter = 1;


io.on('connection', (socket) => {
    var user = {
        userId: -1,
        connectedBrowsers: 0,
        username: '',
        color: ''
    }

    socket.emit('chat log', messages);

    socket.on('new user', () => {
        user = newUser();
        user.connectedBrowsers+=1;
        onlineUsers.push(user);
        socket.emit('user', user);
        io.emit('online users', onlineUsers);
    });

    socket.on('retrieve user', (id) => {
        var oldUser = users.find(element => element.userId == id);
        if (oldUser == null) {
            oldUser = newUser();
        } else if (!onlineUsers.includes(oldUser) && isDuplicate(oldUser.username)) {
            oldUser.username = 'User'+userCounter;
            userCounter+=1;
        }

        if (!onlineUsers.includes(oldUser)) {
            onlineUsers.push(oldUser);
        }
        user = oldUser;
        user.connectedBrowsers+=1;
        socket.emit('user', user);
        io.emit('online users', onlineUsers);
    })

    socket.on('disconnect', () => {
        user.connectedBrowsers-=1;
        if (user.connectedBrowsers <=0){
            onlineUsers.splice(onlineUsers.indexOf(user), 1);
        }
        io.emit('online users', onlineUsers);
    });

    socket.on('chat message', (msg) =>{
        const message = {
            content: msg,
            timestamp: new Date().toLocaleTimeString('en-US'),
            author: user
        }
        messages.push(message);
        if (messages.length > 200) {
            messages = messages.slice(messages.length-200, messages.length);
        }
        io.emit('chat message', message);
    });

    socket.on('change username', (name) => {
        if (isDuplicate(name)) {
            socket.emit('duplicate username', name);
        } else {
            user.username = name;
            socket.emit('user', user);
            io.emit('online users', onlineUsers);
            io.emit('chat log', messages);
        }
    });

    socket.on('change color', (color) => {
        user.color = color;
        socket.emit('user', user);
        io.emit('online users', onlineUsers);
        io.emit('chat log', messages);
    });
});
  
http.listen(3000, () => {
    console.log('listening on *:3000');
});

function isDuplicate(name) {
    for (const u of onlineUsers) {
        if (u.username === name) {
            return true;
        }
    }
    return false;
}

function newUser() {
    var username = 'User'+userCounter;
    while(isDuplicate(username)) {
        userCounter+=1;
        username = 'User'+userCounter;
    }
    const randomColor = Math.floor(Math.random()*16777215).toString(16);

    const user = {
        userId : userCounter,
        username: username,
        connectedBrowsers: 0,
        color : '#' + randomColor
    };
    userCounter+=1;

    users.push(user);
    return user;
}