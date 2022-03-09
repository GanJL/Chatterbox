const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const chatBot = 'ChatterBot'


app.use(express.static(path.join(__dirname, 'public')))

// on client load, activate socket

io.on('connection', socket => {
    console.log("New web socket connection");

    // on receipt of joinRoom from main, activate function
    socket.on('joinRoom', ({username, room }) => {

        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        socket.emit('message', formatMessage(chatBot,'Welcome to Chatterbox!'));

        // broadcast to all clients in the server
        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(
            chatBot,`${user.username} has joined the chat!`
            )
        );
        
        // send to clients in the room
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    
    // on client disconnect, broadcast user leaving and update room and users info
    socket.on('disconnect', ()=>{

        const user = userLeave(socket.id)

        if (user) {
            io.to(user.room).emit('message', formatMessage(chatBot,`${user.username } has left the chat!`));
            
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }


        
    });

    // get current user and process message for main
    socket.on('chatMsg', (msg) => {

        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username,msg));
    })


})

const PORT = process.env.PORT || 3000 ;

server.listen(PORT, ()=> console.log(`Server running on ${PORT}`));