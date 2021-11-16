let lastTime;
let username;
let recipient = "Todos";
let typeMessage = "message";
let urlChat = "https://mock-api.driven.com.br/api/v4/uol";

function loginChat () {
    username = prompt("Qual o seu nome?");
    const promise = axios.post(`${urlChat}/participants`, {
        name: username
    });
    promise.then(startChat);
    promise.catch(reloadPage)
}

function startChat () {
    loadMessages();
    loadUsers();
    setInterval(loadMessages, 3000);
    setInterval(keepLogged, 5000);
    setInterval(loadUsers, 10000);
    document.addEventListener("keyup", sendMessageEnter)
}

function sendMessageEnter (e) {
    if(e.keyCode === 13) {
        sendMessage();
    }
}

function keepLogged () {
    axios.post(`${urlChat}/status`, {
        name: username
    });
}

function reloadPage () {
    window.location.reload();
}

function loadMessages () {
    const promise = axios.get(`${urlChat}/messages`);
    promise.then(renderMessages);
}

function renderMessages (response) {
    const ul = document.querySelector(".container-messages");
    ul.innerHTML = "";

    for (let i = 0 ; i < response.data.length ; i ++ ) {
        if (response.data[i].type === "status") {
            ul.innerHTML += `<li class="status-user" data-identifier="message">
                <span class="horario">(${response.data[i].time})</span>
                <strong>${response.data[i].from}</strong>
                <span>${response.data[i].text}</span>
            </li>`
        }
        if (response.data[i].type === "message") {
            ul.innerHTML += `<li class="public-chat" data-identifier="message">
                <span class="horario">(${response.data[i].time})</span>
                <strong>${response.data[i].from}</strong>
                <span> para </span>
                <strong>${response.data[i].to}</strong>
                <span>${response.data[i].text}</span>
            </li>`
        }
        if (response.data[i].type === "private_message" && (response.data[i].to ===username || response.data[i].from ===username)) {
            ul.innerHTML += `<li class="private-chat" data-identifier="message">
                <span class="time">(${response.data[i].time})</span>
                <strong>${response.data[i].from}</strong>
                <span> para </span>
                <strong>${response.data[i].to}</strong>
                <span>${response.data[i].text}</span>
            </li>`
        }
    }
    const lastMessage = response.data[response.data.length -1].time;
    scrollMessages(lastMessage);
}

function scrollMessages (lastMessage) {
    if (lastMessage !== lastTime) {
        const lastMessage = document.querySelector(".container-messages li:last-child");
        lastMessage.scrollIntoView();
        lastTime = lastMessage;
    }
}

function sendMessage () {
    const input = document.querySelector(".message-input");
    const text = input.value;
    const message = {
        to: recipient,
        from: username,
        text: text,
        type: typeMessage,
    };
    input.value = "";
    const promise = axios.post(`${urlChat}/messages`, message);
    promise.then(loadMessages);
    promise.catch(reloadPage);
}

function loadUsers () {
    const promise = axios.get(`${urlChat}/participants`);
    promise.then(renderUsers);
}

function renderUsers (response) {
    let userList = document.querySelector(".users");
    let userType = "";

    if (recipient === "Todos") {
        userType = "selected";
    }
    userList.innerHTML = `<li class="visibility-public ${userType}" onclick="selectRecipient(this)" data-identifier="participant">
        <ion-icon name="people"></ion-icon>
        <span class="username">Todos</span>
        <ion-icon class="check" name="checkmark-outline">
        </ion-icon>
    </li>`;

    for (let i = 0 ; i < response.data.length ; i ++) {
        if (recipient === response.data[i].name) {
            userType = "selected";
        } else {
            userType = "";
        }
        userList.innerHTML += `<li class="visibility-public ${userType}" onclick="selectRecipient(this)" data-identifier="participant">
        <ion-icon name="person-circle"></ion-icon>
        <span class="username">${response.data[i].name}</span>
        <ion-icon class="check" name="checkmark-outline">
        </ion-icon>
      </li>`;
    }
}

function selectRecipient (element) {
    recipient = element.querySelector(".username").innerHTML;
    document.querySelector(".sending").innerHTML = `Enviando para ${recipient}...`;
    loadUsers();
}

function selectVisibility (element, type) {
    document.querySelector(".visibilities .selected").classList.remove("selected");
    element.classList.add("selected");
    typeMessage = type;
}

function openMenu () {
    const menu = document.querySelector(".menu");
    const overlay = document.querySelector(".overlay");
    menu.classList.toggle("hidden");
    overlay.classList.toggle("hidden");
}

loginChat();