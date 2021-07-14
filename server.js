// 필수 모듈

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server)


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
server.listen(8081,function(){
    console.log('Listening on '+server.address().port);
});