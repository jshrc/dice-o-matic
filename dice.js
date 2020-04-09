'use strict';

const express = require('express');
const socketIO = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || 3000;

const server = express()
  .use((request, response) => {
    let file = request.originalUrl;
    if (fs.existsSync('./dist/www'+file)) {
      return response.sendFile(file, {root: './dist/www'});
    }
    else {
      return response.sendFile('index.html', {root: './dist/www'});
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

let Players = {},
  clientCount = 0;

const io = socketIO(server);

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
