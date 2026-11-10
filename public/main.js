const socket = io();
const messageBox = document.querySelector(".message-box");
const inputBox = document.querySelector(".input-message");
const chatBox = document.querySelector(".chatbox");
const user = document.querySelector(".name").innerHTML;

const options = {
  timeZone: "Asia/Jakarta",
  hour: '2-digit',
  minute: '2-digit'
};

const formatter = new Intl.DateTimeFormat('id-ID', options);
const date = new Date();

chatBox.scrollTop = chatBox.scrollHeight;

messageBox.addEventListener("submit", function(e) {
    e.preventDefault()
    if(inputBox.value === "") {
        return alert("Masukan Pesan!");
    }
    const data = {
        user,
        msg: inputBox.value,
        time: formatter.format(date),
        sender: true,
        }
    socket.emit("message", data);
    chatBox.innerHTML += updateMessageUI(data);
    clearfeedback();
    chatBox.scrollTop = chatBox.scrollHeight;
    removeAnimation();
    inputBox.value = "";
})

inputBox.addEventListener("focus", function(e) {
    socket.emit("delay-message", {user, on: true});
})

inputBox.addEventListener("blur", function(e) {
    socket.emit("delay-message", {user, on: false});
})


socket.on("broadcast-message", (data) => {
    chatBox.innerHTML += updateMessageUI(data);
    removeAnimation();
    chatBox.scrollTop = chatBox.scrollHeight;
})

socket.on("broadcast-delay", data => {
    if(data.on) {
        chatBox.innerHTML += feedback(data.user);
        chatBox.scrollTop = chatBox.scrollHeight;
    } else {
        clearfeedback();
        chatBox.scrollTop = chatBox.scrollHeight;
    }
})


function updateMessageUI(data) {
    return `
            <li class="${data.user == user ? "message-right" : "message-left"}"
            style="animation: messageIn .7s ease forwards;">
                <span>
                    ${data.msg}
                </span>
                <span>${data.user} : ${data.time}</span>
                <span><img src="img/love.png" width="40px"></span>
            </li>
    `
}


function feedback(user) {
    return `
        <li class="feedback">
            <span>${user} sedang mengetik...</span>
        </li>
    `
}

function clearfeedback() {
    document.querySelectorAll("li.feedback").forEach(element => {
        element.parentNode.removeChild(element);
    })
}

function removeAnimation() {
    setTimeout(() => {
        Array.from(chatBox.children).map(chat => {
            chat.removeAttribute("style");
        })
    }, 800);
}