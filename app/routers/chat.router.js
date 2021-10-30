
module.exports = function (router) {
    const http = require('http');
    /*
    const server = http.createServer(router)
    const {
        Server
    } = require('socket.io')

    const io = new Server(server);
    */
    // Post
    var chatController = require('../controllers/chat.controller');
    router.get('/chat/getchat', chatController.getchat);

    /*
    io.on('connection', (socket) => {
        console.log("user da connceted");

    })
    */
}