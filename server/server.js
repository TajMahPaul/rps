const http = require('http');
const express = require('express'); 
const socketio = require('socket.io');

const RpsGame = require('./rps-game');

const app = express();

const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);
let waitingPlayer = null;


const PORT = process.env.PORT || 8080;

io.on('connection', (sock)  => {
    if(waitingPlayer){
        // start game
        sock.emit('message','You are player 2');
        new RpsGame(waitingPlayer,sock);
        waitingPlayer = null;

    }else{
        waitingPlayer = sock;
        waitingPlayer.emit('message','Waiting for opponent');
        waitingPlayer.emit('message','You are player 1');
    }

    sock.on('message', (text)  =>{
        io.emit('message', text);
        
    });
});

server.on('error', (err) =>{
    console.error('Server error:',err);
});

server.listen(PORT, () => {
    console.log('RPS started on 8080');

});
