const fs = require("fs");

if(!fs.existsSync("./db")) {
    fs.mkdirSync("./db");
}

if(!fs.existsSync("./db/user.json")) {
    fs.writeFileSync("./db/chat_db.json", "[]");
}

function getAllData() {
    return JSON.parse(fs.readFileSync("./db/chat_db.json"));
}

function getAllUser() {
    return JSON.parse(fs.readFileSync("./db/user.json"));
}

function addChatDatabase(msg) {
    const data = getAllData();
    data.push(msg);
    fs.writeFileSync("./db/chat_db.json", JSON.stringify(data));
}

function cekUserValidation(login) {
    const users = getAllUser();
    const user = users.find(item => item.user == login.user);
    if(!user) {
        return {error: "Username tidak ada"}
    }
    const password = users.find(item => item.password == login.password);
    if(!password) {
        return {error: "Password Salah"};
    } else {
        return password;
    }
}

module.exports = { getAllData, addChatDatabase, cekUserValidation };