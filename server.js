const path = require('path');
const fs = require('fs');

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const engine = require('./engine.js');


//-----routing-----//
app.use(express.static(__dirname));
app.get('/', (req, res, next) => {
	res.sendFile('index.html');

});

//-----socketIO-----//
io.on('connection', function(socket) {
	let sessionID = socket.id;
	let logfile = (__dirname + '/logs/' + sessionID.replace(/\//g,''));
	fs.closeSync(fs.openSync(logfile, 'w'));
	console.log(sessionID);

	socket.on('start', (msg, fn) => {
		// console.log(msg);
		fn('--STARTED--');

		engine(msg.headless, msg.proxy, msg.url, msg.wait_time, msg.n_limit, logfile)
		.then(res => {
			socket.emit('fn-finish', 'exit code : ' + res);
			console.log('--PASSER DONE--');
		})
		.catch(err => {
			console.log(err);
			socket.emit('fn-finish', 'Error : ' + err);
			console.log('--PASSER ERROR--');
		});

		logger = setInterval(() => {
			let loggings = fs.readFileSync(logfile, 'utf8');
			socket.emit('log', loggings.split('\n'));
		}, 500);
	});

	socket.on('stop-log', (msg, fn) => {
		console.log(msg);
		fn('logging stopped');
		clearTimeout(logger);
	});

	socket.on('disconnect', () => {
		fs.unlinkSync(logfile);
	});
});

//-----listening-----//
http.listen(1544, () => { console.log('Bot Server Up and Running on Port 1544'); });
