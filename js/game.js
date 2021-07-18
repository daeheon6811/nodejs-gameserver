let Game = {};


// 설정할 변수는 하나
// 서버가 보낸 메세지에서 계속 반응하기위해 설정 하였다.
Game.init = () => {
    game.stage.disableVisibilityChange = true;
};

// assets을 재실행 하기위해 제작
Game.preload = () => {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png'); // 플레이어 들에게 뿌릴 이미지
};

// 지도를 만들고 표시
Game.create = () => {
    // 여 클라이언트가 새 플레이어를 만들어야한다는 사실을 서버에 알림
    Game.playerMap = {};
    let map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // json 파일에 위치한 키 값
    let layer;
    for(let i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // // 지도 클릭 허용 = true , 거부 false
    Client.askNewPlayer();

    layer.events.onInputUp.add(Game.getCoordinates, this);
};

Client.askNewPlayer = () => {
    Client.socket.emit('newplayer');
};

// 지정된 좌표에 스프라이트 만들고 제공된 ID 키를 이용하여 Game.create 에 선언된 배열에 해당 Sprite 객체르 저장
// 이렇게 하면 특정 플레이어에 해당하는 스프라이트에 쉽게 엑세스 가능
Game.addNewPlayer = (id,x,y) => {
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
};


//. id를 사용하면 즉시 가져올 수 있다 굳이 스프라이트 반복 X
Game.removePlayer = (id) => {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.getCoordinates = (layer,pointer) => {
    Client.sendClick(pointer.worldX,pointer.worldY);
};


Game.movePlayer = (id,x,y) => {
    let player = Game.playerMap[id];
    let distance = Phaser.Math.distance(player.x,player.y,x,y);
    let duration = distance*10;
    let tween = game.add.tween(player);
    tween.to({x:x,y:y}, duration);
    tween.start();
};
