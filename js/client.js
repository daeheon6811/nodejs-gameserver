const Client = {};
Client.socket = io.connect();


// data'객체는 서버가 보낸 socket.player 데이터에 해당
Client.socket.on('newplayer',(data) =>{
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',(data) =>{
    console.log(data);
    for(let i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }
});

Client.socket.on('remove',(id) => {
    Game.removePlayer(id);
});

Client.sendClick = (x,y) => {
    Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('move',(data) =>{
    Game.movePlayer(data.id,data.x,data.y);
});
