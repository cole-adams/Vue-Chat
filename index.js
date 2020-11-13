const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('client/dist'));
  
var messages = [];
const users = [];
var userCounter = 1;


io.on('connection', (socket) => {

    const username = 'User'+userCounter;
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const user = {
        username: username,
        color: '#' + randomColor
    }
    users.push(user);
    socket.emit('user', user);
    io.emit('online users', users);
    
    userCounter+=1;

    socket.emit('chat log', messages);

    socket.on('disconnect', () => {
        users.splice(users.indexOf(user), 1);
        io.emit('online users', users);
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
        var duplicate = false;
        for (const u of users) {
            if (u.username === name) {
                socket.emit('duplicate username', name);
                duplicate = true;
                break;
            }
        }

        if (!duplicate) {
            user.username = name;
            socket.emit('user', user);
            io.emit('online users', users);
            io.emit('chat log', messages);
        }
    });

    socket.on('change color', (color) => {
        user.color = color;
        socket.emit('user', user);
        io.emit('online users', users);
        io.emit('chat log', messages);
    });
});
  
http.listen(3000, () => {
    console.log('listening on *:3000');
});