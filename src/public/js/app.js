const socket = io();

const welcome = document.querySelector("#welcome");
const roomForm = welcome.querySelector("#room-name");
const room = document.querySelector("#room");
const nameForm = welcome.querySelector("#nick-name");

room.hidden = true;

let roomName;

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", value, roomName, () => {
    addMessage(`You: ${value}`);
});
    input.value = "";
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = welcome.querySelector("#nick-name input");
    const value = input.value;
    socket.emit("nickname", value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
    const msgForm = room.querySelector("#msg");
    msgForm.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

nameForm.addEventListener("submit", handleNicknameSubmit);
roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${user} 이(가) 방에 들어왔습니다😎`);
});

socket.on("bye", (left, newCount) => {
    const h3 = room.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`${left} 이(가) 방을 떠났습니다😞`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (room) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if (room.length === 0) {
        return;
    }
    room.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    });
});