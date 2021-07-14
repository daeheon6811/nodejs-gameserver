
var game = new Phaser.Game(16*32, 600, Phaser.AUTO, document.getElementById('game'));
game.state.add('Game',Game);
game.state.start('Game');
var Game = {};


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
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // json 파일에 위치한 키 값
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // // 지도 클릭 허용 = true , 거부 false
};