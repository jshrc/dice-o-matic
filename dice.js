const express = require('express');
const util = require('util');
const socket = require('socket.io');
const BodyParser = require("body-parser");

let app = express();

io = socket(app.listen(3000, () => { console.log(`Socket.IO listening on port 3000`)}));
let Players = {},
  clientCount = 0;

io.on('connection', function(socket){

  clientConnected(this);
  socket.on('disconnect', function() {
    clientDisconnected(this);
    delete Players[socket.id];
  });

  socket.on('playerLeave', function(params) {
    delete Players[socket.id];
  });

  socket.on('playerJoin', function(params) {
    let playerName = params.name;
    if (playerName == undefined ||playerName == '') {
      playerName = "No Name";
    }
    Players[socket.id] = {
      name: playerName,
    };
    io.emit('players', Players);
    socket.emit('joinSuccess', {playerName: playerName, socket_id: socket.id})
  });

  socket.on('rollDie', function(params) {
    if (Players[socket.id] !== undefined) {
      let rolls = [],
        rollsSum = 0;
      for (let i = 0; i < params.diceCount; i++) {
        rolls.push(rollDie(params.numberOfSides));
        rollsSum += rolls[rolls.length-1].result;
      }
      let result = {player: Players[socket.id],
          'rolls': rolls,
          'numberOfSides': params.numberOfSides,
          'diceCount': params.diceCount,
          'rollsSum': rollsSum,
        };
      io.emit('dieRolled', result);
    }
  });

});

function clientConnected(io) {
  clientCount++;
  console.log('Client connected, count: '+clientCount);
  io.emit('activeClients', clientCount);
  io.emit('connected', clientCount);
}

function clientDisconnected(io) {
  clientCount--;
  io.emit('activeClients', clientCount);
  console.log('Client disconnected, count: '+clientCount);
}

function rollDie(numberOfSides) {
  let roll = Math.floor(Math.random() * Math.floor(numberOfSides))+1;
  return {numberOfSides: numberOfSides, result: roll};
}


let webApp = express();

webApp.listen(80, function(){
  console.log(`webApp listening on port 80`);
});

app.get("/*", (request, response, next) => {
  let file = request.params[0] ? request.params[0] : 'index.html';
  if (fs.existsSync('./dist/www/'+file)) {
    return response.sendFile(file, {root: './dist/www'})
  }
  else {
    return response.sendFile('index.html', {root: './dist/www'})
  }
});
