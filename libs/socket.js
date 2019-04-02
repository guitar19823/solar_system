const config = require('config');
const socketIO = require('socket.io');

function socket(server) {
    const io = socketIO(server);

    io.on('connection', socket => {
        //socket.emit('message', 'Hello User!');

        socket.on('message', msg => {
            if (msg.msg) {
                socket.emit('message', msg);
                socket.broadcast.emit('message', msg);
            }
        });
    });
}

module.exports = socket;
