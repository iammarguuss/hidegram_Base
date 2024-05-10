const express = require('express');
const app = express();
const http = require('http');
const { join } = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const res = require('express/lib/response');


app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const roomDataChange = {};

io.on('connection', (socket) => { 
    console.log('a user connected');  //test only

    socket.on('ChangeOpen', () => { //get request to send the message


        socket.on('changeSendReq', (msg) => { //get request to send the message
            console.log(msg)
            //error check if timeOut < 10 || timeOut > 120
            //error check if verify must be bool
            //error check if pubKey must be not empty

            let randRoom = Math.floor(Math.random() * 9000000000) + 1000000000; // connsction id
            //check if room is open => then regenerate new room

            socket.join("change:" + randRoom);

            roomDataChange[randRoom] = {
                verify:msg.verify,
                pubKey:msg.pubKey,
                timer: setTimeout(() => {
                    // Удаляем данные комнаты и отключаем всех пользователей
                    closeRoom("change:" + randRoom);
                }, msg.timeOut*60000)
            }
        
            let messageBack = {
                status:true,
                changeId:randRoom
            }

            io.to(socket.id).emit('changeSendReqResponce', messageBack);
            


            socket.on('GlobalExchange', (msg) => { //final exchange of the action
                //save to database!!!
                io.to("change:" + randRoom).emit('FinalExchange', msg);
                return;
            });
        }); 
        
        



        socket.on('changeGetReq', (msg) => { //get request to send the message
            console.log(msg)
            //error check if msg is int in range 1000000000-9999999999
            let message = "change:" + msg;
            let messageID = msg

            let roomChecker = io.sockets.adapter.rooms.get(message)
            if(!roomChecker){
                console.log("Room does not exist or has expired")
                //drop error
                return;
            }
            //error check if roomDataChange.message has data

            socket.join(message);

            let runner = {
                verify:roomDataChange[messageID].verify,
                pubKey: roomDataChange[messageID].pubKey
            }

            io.to(socket.id).emit('changeGetReqResp1', runner);

            socket.on('changeGetterResp', (msg) => { //gets message with enc key via server
                console.log(msg)
                io.to(message).emit('changePulicResp', msg);
            });
        }); 

    });
    



    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});





function closeRoom(roomId) {  // удаляет данные команты по таймауту
    if (roomDataChange[roomId]) {
        clearTimeout(roomDataChange[roomId].timer);
        delete roomDataChange[roomId];
    }
}


server.listen(3000, () => {
    console.log('listening on *:3000');
});