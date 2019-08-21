'use strict';

const socketIO = require('socket.io');
const ot = require('ot');
const roomList = {};
const Task = require('../models/Task');

module.exports = function (server) {
    let str = '//TYPE YOUR CODE HERE... \n\n' +
        'var i = i + 1;';
    const io = socketIO(server);
    io.on('connection', socket => {
        socket.on('joinRoom', data => {
            if (!roomList[data.room]) {
                let socketIOServer = new ot.EditorSocketIOServer(str, [], data.room, (socket, cb) => {
                    let self = this;
                    //TODO Save content to the db
                  //  console.log(self);
                  //  Task.findByIdAndUpdate(data.room, { content: self.document }, (err) => {
                      //  if (err) return cb(false);
                        cb(true);
                   // })
                });
                roomList[data.room] = socketIOServer;
            }
            roomList[data.room].addClient(socket);
            roomList[data.room].setName(socket, data.username);

            socket.room = data.room;
            socket.join(data.room);
        });

        socket.on('chatMessage', data => {
            io.to(socket.room).emit('chatMessage', data);
        });

        socket.on('disconnect', () => {
            socket.leave(socket.room);
        });

    })
}