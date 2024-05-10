const socket = io();

class Runner {
    constructor() {
        this.inputs = {
            isSender: false,
            selectedFile: null,
            password: "",
            fileId: "",
            crc32Table: [],
        };

        this.chanked = {
            meta: "",
            index: {},
            chanked: {},
            indexpublic: {}
        };

        this.output = {
            File:"",
            FileMeta:"",//finishLater
            Key:"",
            ServerValidator:""
        }

        // Инициализация CRC32 таблицы
        this._makeCRCTable();
    }

    reconscrtuct(){
        this.inputs = {
            isSender: false,
            selectedFile: null,
            password: "",
            fileId: "",
            crc32Table: [],
        };

        this.chanked = {
            meta: "",
            index: {},
            chanked: {},
            indexpublic: {}
        };

        this.output = {
            File:"",
            FileMeta:"",//finishLater
            Key:"",
            ServerValidator:""
        }

        this._makeCRCTable();
    }

    // Запуск обработки файла
    start(isSender, file = null, password = "", fileId = "123") {
        this.inputs.isSender = isSender;
        this.inputs.selectedFile = file;
        this.inputs.password = password;
        this.inputs.fileId = fileId;

//      if (this.inputs.isSender && this.inputs.selectedFile && this.inputs.password && this.inputs.fileId) {
        if (this.inputs.isSender) {
            console.log("Selected file:", this.inputs.selectedFile.name);
            socket.emit("SendFileReq", true);
        } else if (this.inputs.password && this.inputs.fileId) {
            this.FirstReq();
            console.log("Requesting file with ID:", this.inputs.fileId);
        } else {
            throw new Error('ErrCode: 001, Not all data was given');
        }
    }

    // Основная функция для обработки отправляемого файла
    async _sendStart(FileID) {
        console.log(FileID)
        const meta = {
            name: this.inputs.selectedFile.name,
            size: this.inputs.selectedFile.size,
            type: this.inputs.selectedFile.type
        };
        document.getElementById('FileName').textContent = this.inputs.selectedFile.name;
        document.getElementById('FileSize').textContent = this.inputs.selectedFile.size;
        document.getElementById('FileState').textContent = 'Encrypting file';
        this.chanked.meta = meta;

        const CHUNK_SIZE = 128 * 1024; // Размер чанка в байтах (128KB)
        let chunkIndex = 1; // Индекс чанка начинается с 1

        for (let i = 0; i < this.inputs.selectedFile.size; i += CHUNK_SIZE) {
            const currentChunk = this.inputs.selectedFile.slice(i, i + CHUNK_SIZE);
            const chunkArrayBuffer = await currentChunk.arrayBuffer();

            const originalCrc32 = this._crc32(new Uint8Array(chunkArrayBuffer));
            const randomKeyArray = window.crypto.getRandomValues(new Uint8Array(32)); // 256-битный ключ
            const randomKey = await this._importKey(randomKeyArray); // Преобразование в CryptoKey

            const encryptedChunk = await this._encryptData(chunkArrayBuffer, randomKey); // Шифрование чанка
            const encryptedCrc32 = this._crc32(new Uint8Array(encryptedChunk));

            this.chanked.index[chunkIndex] = {
                O: originalCrc32,   // Original CRC32 
                K: randomKeyArray,  // Случайный ключ (необходимо сохранять его в необработанном виде для дешифрования)
                E: encryptedCrc32   // Encrypted CRC32
            };

            this.chanked.indexpublic[chunkIndex] = encryptedCrc32; // Только зашифрованные CRC32
            this.chanked.chanked[chunkIndex] = encryptedChunk;

            chunkIndex++;
        }

        console.log("File processing complete", this.chanked);

         // Генерация ключа шифрования
         const encryptionKey = await this._generateEncryptionKey();

         // Шифрование индекса
         const encryptedIndexArrayBuffer = await this._encryptIndex(encryptionKey.key);
         this.chanked.chanked[0] = encryptedIndexArrayBuffer;  // Сохранение зашифрованного индекса как ArrayBuffer
 
         // Вычисление CRC32 зашифрованного индекса
         const encryptedIndexCrc32 = this._crc32(new Uint8Array(encryptedIndexArrayBuffer));
         this.chanked.indexpublic[0] = encryptedIndexCrc32; // Сохранение CRC32 зашифрованного индекса
 
         console.log("File processing complete", this.chanked);
 
         // Очистка выбранного файла из памяти
         this.inputs.selectedFile = null;

         let exportedKey = await window.crypto.subtle.exportKey("raw", encryptionKey.key);
         let keyString = this._arrayBufferToHexString(exportedKey);

         this.output.File = FileID.file
         this.output.ServerValidator = FileID.v
         this.output.Key = keyString
         this.output.FileMeta = this.chanked.meta

         //отправка индексов
         document.getElementById('FileState').textContent = 'Sending file';
         socket.emit("ChankRunner", {
            indexpublic:this.chanked.indexpublic,
            v:FileID.v,
            file:FileID.file
        })
     }
 
    _sendStartRunner(test){
        if(!test){
            throw new Error('ErrCode: 002, File is missconfigured, try again!');
        }

        this.sendChanckRunner(0)
        return
    }

    _NextToSend(message){
        console.log(message)
        if(!message.success && !message.again){
            throw new Error('ErrCode: 003, File is missconfigured, try again!');
            return
        }
        let id = message.id + 1;
        if(message.again){
            id--
        }
        console.log(id)
        if(id == Object.keys(this.chanked.indexpublic).length){
            console.log("We are done!"); // delete file from memory here))
            //load constructer
            document.getElementById('FileState').textContent = 'File was uploaded))';
            return 1;
        }
        this.sendChanckRunner(id);
    }

    async sendChanckRunner(id){
        let obj = {
            id:id,
            v:this.output.ServerValidator,
            f:this.output.File,
            chanck:this.chanked.chanked[id]
        }
        socket.emit("PrimaryRunner",obj)
        return
    }

    _GetLink(msg){  
        //console.log(msg)
        if(!msg.f){
            console.log("Shit happends")
        }

        let output = JSON.stringify(this.output)
        console.log(output);
        document.getElementById('FileID').textContent = 'FileID: '+ this.output["File"];
        document.getElementById('FileKEY').textContent = 'FileKEY: '+ this.output["Key"];
        //"key=" + this.output.Key + "&id=" + this.output.ServerValidator + "&name=" + this.chanked.meta + "";
        return this.reconscrtuct(); ///!!!!!!!!!!!!!!! check if it works
    }

    async _encryptIndex(key) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const indexString = JSON.stringify({index:this.chanked.index,meta:this.chanked.meta});
        const encrypted = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv }, key, new TextEncoder().encode(indexString)
        );
    
        // Конвертируем IV и зашифрованные данные в формат ArrayBuffer и объединяем их
        const combined = new Uint8Array(iv.length + encrypted.byteLength);
        combined.set(new Uint8Array(iv), 0);
        combined.set(new Uint8Array(encrypted), iv.length);
    
        return combined.buffer;
    }

    FirstReq(){
        socket.emit("FirstReq",this.inputs.fileId);
        return
    }

    async _GetReqDown(msg) {
        console.log(msg);
        try {
            let inputobj = await this._decryptIndex(msg, this.inputs.password);
            console.log("Расшифрованные данные:", inputobj);
            //fix xss just in case
            if(this.isPlainObject(inputobj)){
                document.getElementById('FileName').textContent = inputobj.meta.name;
                document.getElementById('FileSize').textContent = inputobj.meta.size;
                document.getElementById('FileState').textContent = 'Downloading the file';
                this.chanked.counter = 1;
                this.chanked.index = inputobj.index;
                this.chanked.meta = inputobj.meta;
                return this.Downloadreq(this.chanked.counter)
            }else{
                document.getElementById('FileState').textContent = 'File isdamaged';
                console.log("File is fucked up");
                return
            }
        } catch (error) {
            document.getElementById('FileState').textContent = 'Key does not match :-( Most probably))';
            //console.error("Ключ не подходит к обьекту((")
            console.error("Ошибка при расшифровке:", error);
            // Здесь можно добавить дополнительные действия, например, показать сообщение пользователю
        }
    }


    Downloadreq(chank){
        socket.emit("Downloadreq",chank);
        return 1;
    }

    _Downloadhandler(msg){
        console.time("yourFunctionTimer");
        //console.log("FUCK this place")
        //console.log(msg)
        let encryptedCrc32 = this._crc32(new Uint8Array(msg));
        //console.log(encryptedCrc32, this.chanked.index[this.chanked.counter].E)

        if(encryptedCrc32 != this.chanked.index[this.chanked.counter].E){
           console.log("Fuck Noooo"); 
           console.error("File is damaged!");
           return 
        }
        this.chanked.chanked[this.chanked.counter] = msg
        console.log(Object.keys(this.chanked.index).length,Object.keys(this.chanked.chanked).length)
        if(Object.keys(this.chanked.index).length == Object.keys(this.chanked.chanked).length){
            console.log("We downloaded it")
            document.getElementById('FileState').textContent = 'Downloaded, Decryptoing the file';
            return this.DecryptONDown();
        }
        this.chanked.counter++;
        socket.emit("Downloadreq",this.chanked.counter);
        console.timeEnd("yourFunctionTimer");
    }

    async DecryptONDown(){

let assembledFile = new Blob([], { type: "application/octet-stream" });
let chunkIndex = 1; // Индекс чанка начинается с 1

while (this.chanked.chanked[chunkIndex]) {
    try {
        const encryptedChunk = this.chanked.chanked[chunkIndex];
        const rawKey = new Uint8Array(Object.values(this.chanked.index[chunkIndex].K));
        const key = await this._importKey(rawKey);
        
        const decryptedChunk = await this._decryptData(encryptedChunk, key);
        const decryptedCrc32 = this._crc32(new Uint8Array(decryptedChunk));

        if (decryptedCrc32 !== this.chanked.index[chunkIndex].O) {
            throw new Error(`CRC check failed for chunk ${chunkIndex}: File may be damaged or tampered`);
        }

        assembledFile = new Blob([assembledFile, decryptedChunk], { type: "application/octet-stream" });
        chunkIndex++;
    } catch (error) {
        console.error('Ошибка при обработке файла:', error);
        return;
    }
}

console.log("File assembly complete");
return this._processAndDownloadFile(assembledFile);
    }

    async _processAndDownloadFile(assembledFile) {
        // Проверка размера файла
        if (assembledFile.size !== this.chanked.meta.size) {
            throw new Error("File size mismatch: the assembled file may be corrupted.");
        }

        // Установка метаданных файла
        const file = new File([assembledFile], this.chanked.meta.name, { type: this.chanked.meta.type });

        // Инициирование скачивания файла
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = this.chanked.meta.name;
        document.body.appendChild(a);
        a.click();

        // Очистка ссылки
        window.URL.revokeObjectURL(url);
        a.remove();

        console.log("File download initiated");

        // Здесь можете добавить код для завершения обработки класса
        // Например, очистка используемых ресурсов, вызов callback-функции и т.д.
        // ...
        console.log("We are done!"); // delete file from memory here))
        //load constructer
        document.getElementById('FileState').textContent = 'File was downloaded))';
        return this.reconscrtuct(); ///!!!!!!!!!!!!!!! check if it works
    }


//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
//.............................................................................................................
    // Создание таблицы для вычисления CRC32
    _makeCRCTable() {
        let c;
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            this.inputs.crc32Table[n] = c;
        }
    }

    // Вычисление CRC32 для данных
    _crc32(data) {
        let crc = 0 ^ (-1);
        for (let i = 0; i < data.length; i++) {
            crc = (crc >>> 8) ^ this.inputs.crc32Table[(crc ^ data[i]) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }


    async _generateEncryptionKey() {
        const key = await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]
        );
        // Экспорт ключа не обязателен, если вы будете использовать его только в этом контексте
        // Но если вы хотите его сохранить или передать, вам нужно будет его экспортировать
        const exportedKey = await window.crypto.subtle.exportKey("raw", key);
        const keyString = this._arrayBufferToHexString(exportedKey);
        console.log("Сгенерированный ключ (hex):", keyString);
    
        return {key:key}; // Возвращает только ключ
    }
    

    _arrayBufferToHexString(buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), byte => {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    async _decryptIndex(combined, hexKey) {
        try {
            // Преобразуем hex-ключ в ArrayBuffer
            const keyBuffer = this._hexStringToArrayBuffer(hexKey);
    
            // Импортируем ключ
            const key = await window.crypto.subtle.importKey(
                "raw", keyBuffer, { name: "AES-GCM" }, false, ["decrypt"]
            );
    
            // Разделяем IV и зашифрованные данные
            const iv = combined.slice(0, 12);
            const encryptedData = combined.slice(12);
    
            // Расшифровываем данные
            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv }, key, encryptedData
            );
            const indexString = new TextDecoder().decode(decrypted);
            return JSON.parse(indexString);
        } catch (e) {
            console.error("Ошибка при расшифровке:", e);
            throw e; // или обработайте ошибку по своему усмотрению
        }
    }
    
    // Вспомогательная функция для преобразования hex-строки в ArrayBuffer
    _hexStringToArrayBuffer(hexString) {
        const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
        for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
            bytes[j] = parseInt(hexString.substr(i, 2), 16);
        }
        return bytes.buffer;
    }

    isPlainObject(obj) {
        return obj && typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
    }


concatenateBuffers(...buffers) {
    let totalLength = buffers.reduce((acc, value) => acc + value.byteLength, 0);
    let result = new Uint8Array(totalLength);
    
    let offset = 0;
    buffers.forEach(buffer => {
        result.set(new Uint8Array(buffer), offset);
        offset += buffer.byteLength;
    });

    return result.buffer;
}

// Функция для импорта сырого ключа
async _importKey(rawKey) {
    return window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}

// Функция шифрования
async _encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Вектор инициализации

    const encryptedData = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    );

    return this.concatenateBuffers(iv, encryptedData);
}

// Функция дешифрования
async _decryptData(encryptedBuffer, key) {
    const ivSize = 12; // Размер IV
    const iv = encryptedBuffer.slice(0, ivSize);
    const encryptedData = encryptedBuffer.slice(ivSize);

    return window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encryptedData
    );
}

// Тестирование функций шифрования и дешифрования
async testEncryptionDecryption() {
    const testData = new TextEncoder().encode("Тестовые данные");

    try {
        const rawKey = window.crypto.getRandomValues(new Uint8Array(32)); // 256-битный ключ
        const key = await this._importKey(rawKey);

        const encryptedData = await this._encryptData(testData, key);
        console.log('Зашифрованные данные:', encryptedData);

        const decryptedData = await this._decryptData(encryptedData, key);
        console.log('Дешифрованные данные:', new TextDecoder().decode(decryptedData));
    } catch (error) {
        console.error('Ошибка:', error);
    }
}















}