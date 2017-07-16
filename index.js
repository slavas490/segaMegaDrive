const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const exec = require('child_process').exec;
const params = require('./settings.json');
const ip = require('ip');

let pages_path = __dirname + '/view/page/';

app.use(express.static(__dirname + '/view/build'));


app.get('/', function(req, res){
	console.dir(req.connection.remoteAddress)
	res.sendFile(pages_path + 'index.html');
});

app.get('/play/:n', function(req, res){
	res.sendFile(pages_path + 'pad.html');
});

app.use(function(req, res){
	res.redirect('/');
});


io.on('connection', function(socket){
	socket.on('key', function(key){
		let player = socket.request._query.play;
		key = key.split(':');

		if(params[player]){
			let keys = params[player];

			if(keys[key[1]]){
				if(key[0]=="d") exec("xdotool keydown "+keys[key[1]]);
				else exec("xdotool keyup "+keys[key[1]]);
			}
		}
	});
});


http.listen(3000, function(){
	console.log("connect to: http://"+ip.address()+":3000");
});