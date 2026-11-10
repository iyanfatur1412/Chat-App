const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const expressLayouts = require('express-ejs-layouts');
const { getAllData, addChatDatabase, cekUserValidation } = require("./utilities/db_chat");
const session = require("express-session");
const { error } = require('node:console');
const requestIp = require("request-ip");

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded());

app.use(session({
  secret: 'log-in',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 hari
}));

app.get("/", (req, res) => {
    if(!req.session.user) {
        return res.redirect("/login");
    }
    
    const data = getAllData();
    res.render("index", {
        title: "ChatBox",
        layout: "./layouts/main",
        data,
        user: req.session.user.user,
    })
    req.session.destroy();
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login ChatBox",
        layout: "./layouts/main",
        error: "",
    })
})

app.post("/login", (req, res) => {
    const input = req.body;
    const result = cekUserValidation(input);
    if(result.error) {
        res.render("login", {
        title: "Login ChatBox",
        layout: "./layouts/main",
        error: result.error,
    })
    }else {
        req.session.user = result;
        res.redirect("/");
    }
})







io.on('connection', (socket) => {

  console.log("User telah Log In");

    socket.on("message", (data) => {
        addChatDatabase(data);
        socket.broadcast.emit("broadcast-message", data);
    })

    socket.on("delay-message", data => {
        socket.broadcast.emit("broadcast-delay", data);
    })


  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

server.listen(port, ()=> {
    console.log(`Server Activated in port : ${port}`);
})