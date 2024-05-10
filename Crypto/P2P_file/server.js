const express = require('express');
const httpModule = require('http');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const app = express();
const httpServer = httpModule.createServer(app);
const io = socketIO(httpServer);
const mysql = require('mysql2/promise');
const { ExpressPeerServer } = require('peer'); 

// Настройка статической папки public
app.use(express.static('public'));  
const activeRecords = {};


const pool = mysql.createPool({
  host: 'localhost', // или IP адрес сервера баз данных
  user: 'root',
  database: 'hidetest',
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
  password: ''
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('SendStartReq', async (data) => {
    console.log("Получены данные от клиента:", data);

    let response = {
      obj: {},
      error: false
    };

    if (typeof data.verificationPhrase !== 'boolean') {
      data.verificationPhrase = true; // Присваиваем true, если не false
    }

    if (data.nickname.length > 32) {
      response.error = true;
      response.obj.error = 1020;
    } else {
      let nicknameHex = Buffer.from(data.nickname).toString('hex');
      data.nickname = nicknameHex;
    }

    let idRegex = /^[0-9a-fA-F]{16}$/; // Пример регулярного выражения для проверки 16-символьного hex ID
    if (!idRegex.test(data.ID)) {
      response.error = true;
      response.obj.error = 1030;
    } 

    if (activeRecords.hasOwnProperty(data.ID)) {
      response.error = true;
      response.obj.error = 1040;
      socket.emit('SendStartResp', response);
      return; // Выходим из обработчика, если ошибка
    }

    try {
      const publicKey = JSON.parse(data.publicKey);
      // Проверяем наличие обязательных полей для RSA ключа
      if (!publicKey.n || !publicKey.e || publicKey.kty !== 'RSA') {
          throw new Error('Invalid public key format');
      }
  } catch (error) {
      console.error("Invalid public key:", error);
      socket.emit('SendStartResp', { error: 1050 }); // Код ошибки для невалидного публичного ключа
      return;
  }

    try {
      const existsInDatabase = await checkIDinDatabase(data.ID);
      if (existsInDatabase) {
        response.error = true;
        response.obj.error = 1040; // Код ошибки, если ID уже существует в базе данных
        socket.emit('SendStartResp', response);
        return;
      }
    } catch (error) {
      // Обработка ошибок базы данных
      response.error = true;
      response.obj.error = 2000;
      socket.emit('SendStartResp', response);
      return;
    }


    if (!response.error) {
      try {
        // Сохраняем key (ID) в базе данных
        await saveIDtoDatabase(data.ID); // Теперь передаем только key (ID)
        // Если сохранение прошло успешно, добавляем в activeRecords и отправляем ответ
        activeRecords[data.ID] = { ...data, sender: socket.id, publicKey: JSON.parse(data.publicKey) }; 
        console.log(activeRecords[data.ID])
        socket.emit('SendStartResp', { start: true });
        let id = data.ID;

        socket.on('handleFileSendDecision', (data) => {
          console.log("User has got the last reposnce")
          console.log(activeRecords[id].getter)
          io.to(activeRecords[id].getter).emit('LetsGo!', data);
        });
        //We ARE HERE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      } catch (error) {
        // Если произошла ошибка при сохранении в базу данных
        console.error("Failed to save ID to database:", error);
        response.error = true;
        response.obj.error = 2001;
        socket.emit('SendStartResp', response);
      }
    } else {
      socket.emit('SendStartResp', { start: false, error: response.obj.error });
    }
  });

  socket.on('GetStartReq', (data) => {
    const fileId = data.fileId;

    // Проверяем, соответствует ли fileId регулярному выражению
    const fileIdRegex = /^[0-9a-fA-F]{16}$/; // Пример регулярного выражения для проверки формата ID
    if (!fileIdRegex.test(fileId)) {
        // Отправляем ошибку с кодом 1110, если формат fileId неверен
        socket.emit('GetStartResp', { success: false, errorCode: 1110, message: "Invalid file ID format." });
        return;
    }

    // Проверяем, существует ли запись с таким fileId
    if (activeRecords[fileId]) {
        // Проверяем, уже ли установлен getter
        if (activeRecords[fileId].getter) {
            // Запись уже имеет getter, отправляем ошибку с кодом 1120
            socket.emit('GetStartResp', { success: false, errorCode: 1120, message: "File is already being retrieved." });
            return;
        }

        // Добавляем getter и обновляем activeRecords
        activeRecords[fileId].getter = socket.id;

        // Добавляем sender и getter в комнату, основанную на fileId
        const senderSocketId = activeRecords[fileId].sender;

        // Исправленное добавление в комнату
        if (io.sockets.sockets.get(senderSocketId)) {
            io.sockets.sockets.get(senderSocketId).join(fileId);
        }
        socket.join(fileId);

        // Отправляем обновлённую информацию об activeRecords[fileId] без непосредственных ссылок на sender и getter
        const responseObj = {...activeRecords[fileId]};
        delete responseObj.sender;
        delete responseObj.getter;

        io.to(fileId).emit('GetStartResp', { success: true, activeRecord: responseObj });
            socket.on('GetRsaRunner', (data) => {
              console.log("Получен GetRsaRunner от клиента:", data);
              if (activeRecords[fileId] && activeRecords[fileId].getter === socket.id) {
                // оба клиента в онлайне
                // TODO: Обработка данных GetRsaRunner
                // Теперь данные можно переслать отправителю файла
                io.to(activeRecords[fileId].sender).emit('SendRsaRunner', data); // Передача данных отправителю
                // socket.on('handleFileSendDecision', (data) => {
                //   console.log("User has got the last reposnce")
                //   io.to(activeRecords[fileId].getter).emit('LetsGo!', data);
                // });
              } else {
                  console.log("GetRsaRunner от неподтвержденного источника, игнорируем."); // DROP ERROR HERE
              }
            });
      
    } else {
        // Запись с таким fileId не найдена, отправляем ошибку с кодом 1130
        socket.emit('GetStartResp', { success: false, errorCode: 1130, message: "File ID not found." });
    }
});




















});








// Запуск HTTP сервера на порту 80 для редиректа на HTTPS
httpServer.listen(3000, () => {
  console.log('HTTP server running on port 3000'); 
});

// server.listen(9000, () => {
//   console.log('Express and PeerJS server running on port 9000');
// });

const httpsOptions = {
  key: fs.readFileSync('../ssl/hidechange_com.key'), // Путь к вашему ключу
  cert: fs.readFileSync('../ssl/_hidechange_com.crt'), // Путь к вашему сертификату
  // Если у вас есть цепочка сертификатов, используйте параметр ca для указания дополнительных сертификатов
  // ca: [fs.readFileSync('path/to/your/ssl/ca.pem')]
};

const httpsServerForPeer = https.createServer(httpsOptions, app);

// Создаем PeerJS сервер с использованием HTTPS сервера
const peerServer = ExpressPeerServer(httpsServerForPeer, {
  debug: true,
  path: '/myapp',
});

// Используем PeerJS на определенном пути
app.use('/peerjs', peerServer);

httpsServerForPeer.listen(5000, () => {
  console.log('HTTPS PeerJS server running on port 5000');
});




async function checkIDinDatabase(key) {
  try {
    const [rows, fields] = await pool.query('SELECT `key` FROM `id` WHERE `key` = ?', [key]);
    return rows.length > 0;
  } catch (err) {
    console.error(err);
    throw err; // Вы можете выбрать, хотите ли вы здесь пробросить ошибку или обработать её по-другому
  }
}

async function saveIDtoDatabase(key) {
  console.log(key)
  try {
    const query = 'INSERT INTO `id` (`key`) VALUES (?)';
    const [result] = await pool.query(query, [key]);
    console.log("ID saved to database:", result);
    return true;
  } catch (err) {
    console.error("Error saving ID to database:", err);
    throw err;
  }
}