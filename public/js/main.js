const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById("room-name")
const userList = document.getElementById("users")

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

socket.emit('joinRoom', { username, room })

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room),
    outputUsers(users)
})


socket.on('message', message =>{
    console.log(message);
    outputMsg(message)

    chatMessages.scrollTop = chatMessages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value

    socket.emit('chatMsg', msg)

    e.target.elements.msg.value = "";

    e.target.elements.msg.focus()
})

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
