// 필수 모듈

const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


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


// Socket.emit()는 특정 소켓 하나에 메시지를 보냄.
io.on('connection',(socket) => {
    socket.on('newplayer',() => {  // 새 사용자 지정 개체를 만들어 소켓 개체에 저장
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400)
        };
        socket.emit('allplayers',getAllPlayers()); //
        socket.broadcast.emit('newplayer',socket.player); //  모든 연결된 소켓에 메시지를 보낸다


        socket.on('click',(data) =>{
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',() =>{
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',() => {
        console.log('수신 체크');
    });
});



/*. 모든 소켓을 반복 처리하고, 추가 한 플레이어 속성을 가져 와서 목록에 추가하여 연결된 플레이어를 효과적으로 나열 */
const getAllPlayers = () => {
    var players = [];
    Object.keys(io.sockets.connected).forEach((socketID)=>{
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

const randomInt = () => (low, high) => {
    return Math.floor(Math.random() * (high - low) + low);
}
