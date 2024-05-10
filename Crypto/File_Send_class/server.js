const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const readline = require('readline');

const app = express();
const server = http.createServer(app);
//const io = socketIo(server);
const io = require('socket.io')(server, {
    maxHttpBufferSize: 1e7 // Пример: 10 МБ
});

const directoryPath = path.join(__dirname, '../bin');
app.use(express.static('public'));

//config
const listSize = 1000

// CRCCalculator Class
class CRCCalculator {
    constructor() {
        this.crc32Table = [];
        this._makeCRCTable();
    }

    _makeCRCTable() {
        let c;
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            this.crc32Table[n] = c;
        }
    }

    _crc32(data) {
        let crc = 0 ^ (-1);
        for (let i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ this.crc32Table[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }
}

function createLineReader(filePath) {
    const stream = fs.createReadStream(filePath, 'utf8');
    const reader = readline.createInterface({ input: stream });
    let lines = [];
    
    reader.on('line', (line) => {
        lines.push(line);
    });

    return {
        readLine: function (lineNumber, callback) {
            if (lineNumber <= lines.length) {
                callback(null, lines[lineNumber - 1]);
            } else {
                reader.once('line', () => {
                    callback(null, lines[lineNumber - 1]);
                });
            }
        },
        close: function () {
            reader.close();
        }
    };
}



const crcCalculator = new CRCCalculator();

io.on('connection', (socket) => {
    console.log('New client connected');

    const validator = {}

    socket.on('SendFileReq', () => {
        console.log('Client asked for connect');
        //check for existing file
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        const uniqueFileName = generateUniqueFileName(directoryPath);
        fs.writeFileSync(path.join(directoryPath, uniqueFileName), ''); // создает пустой файл в директории ../bin
        console.log(`Created new file: ${path.join(directoryPath, uniqueFileName)}`);
        let filename = parseInt(uniqueFileName.slice(0, -4))
        validator[filename] = Math.floor(Math.random() * listSize)
        let filerunner = {
            file:filename,
            v:validator[filename]
        }
        socket.emit('StarterPackId',filerunner)
    });

    let fileExpector = {};
    let LocalIndexHolder = {}

    socket.on('ChankRunner', (message) => {
        console.log(isNaN(message.v),isNaN(message.file),!checkIndexPublic(message))
        if(isNaN(message.v) || isNaN(message.file) || !checkIndexPublic(message)){
            socket.emit("StartRunner",false)
            console.log("We are fucked")
            return;
        }
        console.log(Object.keys(message.indexpublic).length)
        socket.emit("StartRunner",true)
        fileExpector[message.v] = new Array(Object.keys(message.indexpublic).length);
        LocalIndexHolder[message.v] = message.indexpublic;
        return
    })

    socket.on('PrimaryRunner', (message) => {
        console.log(message)
        if(!fileExpector[message.v]){
            socket.emit('NextPlease', { success: false, message: "File error", again: false });
            console.log("File fileExpector error")
            return
        }
        //Запустить тут проверку crc32
        const crc32Result = crcCalculator._crc32(Buffer.from(message.chanck));
        console.log(crc32Result + " = " + LocalIndexHolder[message.v][message.id])

        if(crc32Result !== LocalIndexHolder[message.v][message.id]){
            socket.emit('NextPlease', { success: false, message: "Signature failed", again: false, id:message.id });//again: true, id:message.id });
            console.log("Fucked")
            return
        }

        let filePath = path.join(directoryPath, message.f + ".txt");
        appendChunkToFile(filePath, message.chanck.toString('base64'), (err) => {
//        appendCompressedChunkToFile(filePath, message.chanck, (err) => {
            if (err) {
                socket.emit('NextPlease', { success: false, message: err.message, again: false });
            } else {
                socket.emit('NextPlease', { success: true, again: false, id: message.id });
                if(message.id == (Object.keys(LocalIndexHolder[message.v]).length - 1)){
                    //console.log("Вщту")
                    //let link = "Wherever it gets: fileID: " + message.f + " and your own pass";
                    socket.emit('doneHere', {f:true,m:message.f});
                    return //socket.disconnect(); 
                }
            }
        });

    })


    //downloader
    socket.on('FirstReq', (msg) => {
console.log(msg + ' YOU BUSTERD');
let pather = directoryPath + "\\" + msg + ".txt";

checkFileExists(pather)
  .then(exists => {
    if(exists){
        console.log("File Was read");
        readSpecificLineFromFile(pather, 1, (err, line) => {
          if (!err) {
            let lineReader = createLineReader(pather);

            //console.log(`Прочитана строка: ${line}`);
//            socket.emit('GetReqDown', "Fuck yea!")
            socket.emit('GetReqDown',Buffer.from(line,'base64'));
                //// NEXT CHANK TO REQ
                socket.on('Downloadreq', (msg) => {
                    console.time("yourFunctionTimer");
                    console.log(msg)
                    let number = msg+1;
//                    readSpecificLineFromFile(pather, number, (err, line) => {
                    lineReader.readLine(number, (err, line) => {
                        ////////////////////////////////////////////////////////////////Если загрузка завершена - то удалить подключение через close
                        ///////////////////////////////////////////////////////////////https://chat.openai.com/share/2d12f2e6-c33b-4d3c-941e-ba9801d4a48f
                        console.timeEnd("yourFunctionTimer");
                        if(!err){
                            socket.emit('Downloadhandler',Buffer.from(line,'base64'))
                        }
                    })
                });
          } else {
            console.error('Произошла ошибка:', err.message); 
            socket.emit('GetReqDown', false)
        }
    });
  }else{
    socket.emit('GetReqDown', false)
  }})
  .catch(err => socket.emit('GetReqDown', false));
    });








    socket.on('disconnect', () => {
        console.log('Client disconnected');
        //socket.connect();
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



function generateUniqueFileName(dirPath) {
    let fileName;
    do {
        fileName = `${Math.floor(Math.random() * listSize)}.txt`;
    } while (fs.existsSync(path.join(dirPath, fileName)));

    return fileName;
}

function checkIndexPublic(obj) {
    for (let key in obj.indexpublic) {
        // Проверка, что ключ - это строка, представляющая цифру
        if (isNaN(parseInt(key))) {
            return false;
        }
        // Проверка, что значение - это валидное CRC32
        if (isNaN(obj.indexpublic[key])) {
            return false;
        }
    }
    return true;
}

////Функция для записи чанка в файл
function appendChunkToFile(filePath, chunk, callback) {
    // Открытие файла для добавления данных
    fs.open(filePath, 'a', (err, fd) => {
        if (err) {
            callback(err);
            return;
        }

        // Запись чанка в конец файла
        fs.write(fd, chunk + '\n', (err) => {
            fs.close(fd, (errClose) => {
                if (err || errClose) {
                    callback(err || errClose);
                    return;
                }
                callback(null);
            });
        });
    });
}

function checkFileExists(filePath) {
    return new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error(`${filePath} does not exist`);
          return resolve(false);
        }
        console.log(`${filePath} exists`);
        resolve(true);
      });
    });
  }

  function readSpecificLineFromFile(filePath, lineNumber, callback) {
    let lineCount = 0;
    let specificLine = null;

    const stream = fs.createReadStream(filePath, 'utf8');
    const reader = readline.createInterface({ input: stream });

    reader.on('line', (line) => {
        lineCount++;
        if (lineCount === lineNumber) {
            specificLine = line;
            reader.close();
        }
    });

    reader.on('close', () => {
        if (!specificLine) {
            return callback(new Error('Invalid line number'));
        }
        callback(null, specificLine);
    });

    stream.on('error', (err) => {
        callback(err);
    });
}
