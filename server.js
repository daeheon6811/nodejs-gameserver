// 필수 모듈

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);


// 파일 요청
//  정적 파일을 제공 할 수 있어야 한다.
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));


// 루트 페이지로 사용할 파일을 지정
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

// 서버가 통신해야하는 포트를 지정
server.listen(8081,() => {
    console.log('Listening on '+server.address().port);
});

server.lastPlayderID = 0; // 새 플레이어에게 할당 된 마지막 ID를 추적

io.on('connection',function(socket){
    socket.on('newplayer',function(){
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newplayer',socket.player);
    });
});

const getAllPlayers = () => {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

const randomInt = () => (low, high) => {
    return Math.floor(Math.random() * (high - low) + low);
}