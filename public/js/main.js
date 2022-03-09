const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

// emit joinRoom to allow user to join selected room

socket.emit('joinRoom', { username, room })

// on receipt of roomUsers from server, activate function to show room name and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
    outputUsers(users)
})

// on receipt of message from server, activate function to output message and scroll up
socket.on('message', message =>{
    console.log(message);
    outputMsg(message)

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// send message from client to server
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value

    socket.emit('chatMsg', msg)

    e.target.elements.msg.value = "";

    e.target.elements.msg.focus()
})

// output message from server
function outputMsg(msg) {
    const div = document.createElement('div');

    if (username === msg.username) {
        div.classList.add('myMessage');
        div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>    
        `
    }
    else {
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
        <p class="text">
            ${msg.text}
        </p>    
        `
    }


    document.querySelector('.chat-messages').appendChild(div)
}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user=> `<li class="username">${user.username}</li>`).join('')}
    
    `
}
