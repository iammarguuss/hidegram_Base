class MainChange {
    #socket;
    #data = {}; // Приватный объект данных для хранения anchorID
    #peer;
    #chunksArray = {};

    // Приватные методы для отображения
    #dm = {
        displayLink: (id) => {
            let linkContainer = document.getElementById('linkContainer');
            if (!linkContainer) {
                linkContainer = document.createElement('div');
                linkContainer.id = 'linkContainer'; // Уникальный идентификатор
                document.body.appendChild(linkContainer);
            }
            linkContainer.innerHTML = `
                <p>ID: ${id}</p>
                <p>Ссылка: <strong>https://hidechange.com?get=${id}</strong><br>Оставайтесь на странице, пока получатель не пройдёт по ссылке</p>
            `;
            //                <p>Ссылка: <a href="https://hidechange.com?get=${id}" target="_blank">https://hidechange.com?get=${id}</a><br>Remain on this page until receiver join</p>
        },
        displayVerificationInput: () => {
            document.getElementById('verificationPhraseSection').style.display = 'block';
        },
        displayMessage: (message) => {
            document.getElementById('verificationPhraseSection').style.display = 'none';
            document.getElementById('verificationPhraseMessage').textContent = message;
        },
        displayProcessingMessage: () => {
            document.getElementById('verificationPhraseMessage').textContent = "В процессе, делаем криптографию...";
        },
        displayWaitingForFileMessage: () => {
            document.getElementById('verificationPhraseMessage').textContent = "Ждём файла от отправителя))";
            // Пока что пустой метод, будет реализован позже
            this.#fm.waitForFile();
        },
        removeLink: () => {
            const linkContainer = document.getElementById('linkContainer'); // Теперь используем getElementById
            if (linkContainer) {
                linkContainer.remove();
            }
        },
        displayProcessingReceiverResponse: () => {
            document.getElementById('verificationPhraseSection').style.display = 'none';
            document.getElementById('verificationPhraseMessage').textContent = "Обрабатываем ответ от получателя))";
        },
        displayVerificationOptions: (safePhrase) => {
            const verificationOptionsContainer = document.createElement('div');
            verificationOptionsContainer.innerHTML = `<p style="margin: 20px 0;">Проверочная фраза: <strong>${safePhrase}</strong></p>`;
        
            const confirmButton = document.createElement('button');
            confirmButton.textContent = "Я знаю этого человека, я отпавлю ему файл!";
            confirmButton.addEventListener('click', () => this.#fm.handleFileSendDecision(true));
        
            const declineButton = document.createElement('button');
            declineButton.textContent = "Не отправлять файл этому человеку";
            declineButton.addEventListener('click', () => this.#fm.handleFileSendDecision(false));
        
            verificationOptionsContainer.appendChild(confirmButton);
            verificationOptionsContainer.appendChild(declineButton);
            document.body.appendChild(verificationOptionsContainer);
        },        
        displayPrepareForFileEncryptionMessage: () => {
            document.body.innerHTML = '';
            // Добавляем заголовок
            const title = document.createElement('h3');
            title.textContent = "Подготовка к шифрованию и отправке файла";
            document.body.appendChild(title);    
            // Здесь могут быть добавлены дополнительные элементы UI
                    // Создаем и добавляем шкалу прогресса для шифрования
    // Создаем контейнер для шкал прогресса
    const progressContainer = document.createElement('div');
    progressContainer.style.display = 'flex';
    progressContainer.style.flexDirection = 'column';
    progressContainer.style.alignItems = 'center';
    progressContainer.style.gap = '20px';

    // Шкала прогресса шифрования
    const encryptionProgressBar = document.createElement('progress');
    encryptionProgressBar.id = 'encryptionProgress';
    encryptionProgressBar.max = 100;
    encryptionProgressBar.value = 0;
    encryptionProgressBar.style.width = '500px';

    // Подпись для шкалы прогресса шифрования
    const encryptionLabel = document.createElement('label');
    encryptionLabel.htmlFor = 'encryptionProgress';
    encryptionLabel.textContent = 'Encryption Progress';

    // Шкала прогресса отправки
    const uploadProgressBar = document.createElement('progress');
    uploadProgressBar.id = 'uploadProgress';
    uploadProgressBar.max = 100;
    uploadProgressBar.value = 0;
    uploadProgressBar.style.width = '500px';

    // Подпись для шкалы прогресса отправки
    const uploadLabel = document.createElement('label');
    uploadLabel.htmlFor = 'uploadProgress';
    uploadLabel.textContent = 'Upload Progress';

    // Шкала прогресса получения
    const downloadProgressBar = document.createElement('progress');
    downloadProgressBar.id = 'downloadProgress';
    downloadProgressBar.max = 100;
    downloadProgressBar.value = 0;
    downloadProgressBar.style.width = '500px';

    // Подпись для шкалы прогресса получения
    const downloadLabel = document.createElement('label');
    downloadLabel.htmlFor = 'downloadProgress';
    downloadLabel.textContent = 'Download Progress';

    // Сборка и отображение
    progressContainer.appendChild(encryptionLabel);
    progressContainer.appendChild(encryptionProgressBar);
    progressContainer.appendChild(uploadLabel);
    progressContainer.appendChild(uploadProgressBar);
    progressContainer.appendChild(downloadLabel);
    progressContainer.appendChild(downloadProgressBar);

    document.body.appendChild(progressContainer);

        },
        displayEncryptionMessage: () => {
            // Удаление предыдущего содержимого страницы, если необходимо
            document.body.innerHTML = '';
        
            // Создание контейнера для сообщения
            const messageContainer = document.createElement('div');
            messageContainer.id = 'messageContainer';
            document.body.appendChild(messageContainer);
        
            // Создание и добавление заголовка h3
            const messageHeader = document.createElement('h3');
            messageHeader.textContent = 'Отправитель шифрует сообщение, ожидаем...';
            messageContainer.appendChild(messageHeader);
        },
        displayDecryptionProgressBars: () => {
            // Удаление предыдущего содержимого страницы, если необходимо
            document.body.innerHTML = '';
        
            // Создание контейнера для индикаторов
            const progressContainer = document.createElement('div');
            progressContainer.id = 'progressContainer';
            document.body.appendChild(progressContainer);
        
            // Индикаторы
            const indicators = [
                { id: 'receivingProgress', label: 'Получение' },
                { id: 'verificationProgress', label: 'Проверка' },
                { id: 'decryptionProgress', label: 'Расшифровка' }
            ];
        
            // Создание и добавление индикаторов
            indicators.forEach(indicator => {
                const indicatorLabel = document.createElement('h4');
                indicatorLabel.textContent = indicator.label;
                progressContainer.appendChild(indicatorLabel);
        
                const progressBarContainer = document.createElement('div');
                progressBarContainer.classList.add('progress-bar-container');
                progressContainer.appendChild(progressBarContainer);
        
                const progressBar = document.createElement('div');
                progressBar.id = indicator.id;
                progressBar.classList.add('progress-bar');
                progressBarContainer.appendChild(progressBar);
        
                // Инициализация индикатора с нулевым значением
                progressBar.style.width = '0%';
                progressBar.textContent = '0%';
            });
        },
        updateProgressBars: (uploadProgress, downloadProgress) => {
            const uploadProgressBar = document.getElementById('uploadProgress');
            const downloadProgressBar = document.getElementById('downloadProgress');

                // Проверка на валидность значений
    uploadProgress = isFinite(uploadProgress) ? uploadProgress : 0;
    downloadProgress = isFinite(downloadProgress) ? downloadProgress : 0;
        
            if (uploadProgressBar && downloadProgressBar) {
                uploadProgressBar.value = uploadProgress;
                uploadProgressBar.textContent = `Upload: ${uploadProgress.toFixed(2)}%`; // Обновляем текстовое содержание, если необходимо
        
                downloadProgressBar.value = downloadProgress+0.1;
                downloadProgressBar.textContent = `Download: ${downloadProgress.toFixed(2)}%`; // Обновляем текстовое содержание, если необходимо
            }
        },
        updateProgress: (indicatorId, progressPercent) => {
            // Находим элемент индикатора по его id
            const progressBar = document.getElementById(indicatorId);
            // Проверяем, существует ли элемент
            if (!progressBar) {
                console.error(`Индикатор с id ${indicatorId} не найден.`);
                return;
            }
            
            // Обновляем стиль ширины и текстовое содержание индикатора
            progressBar.style.width = `${progressPercent}%`;
            progressBar.textContent = `${progressPercent.toFixed(2)}%`;
        },
        
                
    };

    // Приватные функциональные методы
    #fm = {
        setupSocketListeners: () => {
            this.#socket.on('SendStartResp', (response) => {
                console.log("Ответ от сервера:", response);
                if (response.start) {
                    // Если start=true, отображаем ID и ссылку
                    this.#dm.displayLink(this.#data.dataToSend.ID);
                    // Сохраняем ID в приватном объекте данных
                    this.#data.anchorID = this.#data.dataToSend.ID;
                }
            });
            this.#socket.on('GetStartResp', (response) => {
                //console.log("Ответ от сервера на запрос получения файла:", response);
                if(this.#data.anchorID){
                    return
                }
                if (response.success) {
                    // Предполагаем, что ответ сервера содержит данные об активной записи, включая публичный ключ
                    // Сохраняем полученные данные для последующего использования
                    this.#data.getterData = response.activeRecord;
                    this.#fm.handleVerificationPhrase(response);
                    console.log("Данные получателя сохранены", this.#data.getterData);
                } else {
                    console.error("Ошибка при получении данных файла: ", response.message);
                }
            });
            this.#socket.on('SendRsaRunner', async (data) => {
                console.log("Получены данные от отправителя через 'SendRsaRunner':", data);
                // TODO: Расшифровка и обработка полученных данных
    
                // Демонстрационно предполагаем, что мы вызываем метод для расшифровки и дальнейшей обработки
                await this.#fm.processReceivedData(data);
            });
            //socket for final responce
            this.#socket.on('LetsGo!', (runner) => {
                this.#fm.finalEpector(runner);
            });
        },
          // Метод для отправки запроса получения на сервер
        getStartRequest: (fileId) => {
            console.log(`Запрос файла с ID: ${fileId}`);
            // Отправка запроса на сервер через Socket.IO
            this.#socket.emit('GetStartReq', { fileId });
  },
  generateRsaKeyPair: async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
    );

    const publicKey = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    return { publicKey, keyPair };
},
        // Метод для инициализации PeerJS
        initializePeer: () => {
            this.#peer = new Peer({
                host: 'hidechange.com',
                port: 5000,
                path: '/peerjs/myapp',
                secure: true, // Важно для подключения через HTTPS
            });

    this.#peer.on('open', id => {  
        console.log('My peer ID is:', id);
        // Здесь вы можете сохранить peer ID или выполнить другие действия
    }); 

    // Обработка ошибок подключения
    this.#peer.on('error', err => {
        console.error('PeerJS error:', err);
    });

        // Настройка обработчика входящих соединений
        this.#peer.on('connection', (conn) => {
            this.#fm.handleIncomingConnection(conn);
        });
    // Дополнительные обработчики событий PeerJS могут быть добавлены здесь
        },

        processVerificationPhrase: async (phrase) => {
            console.log('Обработка и шифрование фразы:', phrase);
            // Логика шифрования и подготовки данных к отправке
            // Например, отправка зашифрованных данных обратно через сокет
            alert("Шифрование завершено и данные отправлены");
        },
        handleVerificationPhrase: () => {
            // Отображаем поле для ввода проверочной фразы
            this.#dm.displayVerificationInput();
    
            // Когда пользователь нажимает кнопку "Запросить файл"
            document.getElementById('requestFileButton').onclick = async () => {
                // Считываем введенную проверочную фразу
                const phrase = document.getElementById('verificationPhraseInput').value;
    
                // Отображаем сообщение о начале процесса криптографии
                this.#dm.displayProcessingMessage();
    
                // Генерируем и шифруем ключ AES-256
                await this.#fm.generateAndEncryptAesKey();
    
                // Здесь можно продолжить логику обработки, например, отправить данные на сервер
                console.log("Проверочная фраза и ключ обработаны.");
            };
        },
        escapeHtml: (unsafeStr) => {
            return unsafeStr
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        },
        generateAndEncryptAesKey: async () => {
            // Генерация случайной строки (ключа AES-256)
            const generateRandomString = (length) => {
                const array = new Uint8Array(length);
                window.crypto.getRandomValues(array);
                return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
            };
    
            const aesKey = generateRandomString(32); // Генерируем случайный ключ AES-256
            console.log("Сгенерированный ключ AES-256:", aesKey);
            this.#data.socketAesKey = aesKey;
    

            
            // Шифрование ключа AES-256 с использованием публичного ключа RSA
            const encryptAesKeyWithRsa = async (publicKeyJwk, aesKeyHex) => {
                const publicKey = await window.crypto.subtle.importKey(
                    "jwk",
                    publicKeyJwk,
                    {
                        name: "RSA-OAEP",
                        hash: {name: "SHA-256"},
                    },
                    false, // не экспортируемый
                    ["encrypt"]
                );
            
                // Преобразование hex-строки aesKey в ArrayBuffer для шифрования
                const aesKeyBuffer = hexStringToArrayBuffer(aesKeyHex);
            
                const encryptedAesKey = await window.crypto.subtle.encrypt(
                    {name: "RSA-OAEP"},
                    publicKey,
                    aesKeyBuffer
                );
            
                return encryptedAesKey;
            };
            
            // Вспомогательная функция для преобразования hex-строки в ArrayBuffer
            function hexStringToArrayBuffer(hexString) {
                var result = new Uint8Array(hexString.length / 2);
                for (var i = 0; i < hexString.length; i += 2) {
                    result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
                }
                return result.buffer;
            }
    
            if (!this.#data.getterData.publicKey) {
                console.error("Public key is not defined.");
                return;
            }
    
            const encryptedAesKey = await encryptAesKeyWithRsa(this.#data.getterData.publicKey, aesKey);
            console.log("Ключ AES-256 зашифрован публичным ключом RSA");
    
            // Сохраняем зашифрованный ключ AES-256 в состоянии
            this.#data.encryptedAesKey = encryptedAesKey;

            const extraAesKey = generateRandomString(256);
            console.log("Дополнительный ключ AES-256:", extraAesKey);
            this.#data.extraAesKey = extraAesKey;

        // Перед шифрованием JSON объекта
        await this.#fm.encryptAndSendData(extraAesKey);

        },
        generateRandomString: (length) => {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        },
        encryptAndSendData: async (extraAesKey) => {
            // Создаем JSON объект с данными
            const jsonData = {
                peer: this.#peer.id, // Peer ID
                phrase: this.#fm.escapeHtml(document.getElementById('verificationPhraseInput').value),
                key: extraAesKey,
            };
            console.log("Объект перед шифрованием:", jsonData);
    
            const encryptedDataObj = await this.#fm.encryptDataWithAesKey(jsonData);
            console.log("Подготовленный к отправке зашифрованный объект:", encryptedDataObj);
            
                    // Оборачиваем encData, iv и rsa зашифрованный ключ в объект GetRsaRunner
        const GetRsaRunner = {
            encData: encryptedDataObj.encryptedData, // Зашифрованные данные
            iv: encryptedDataObj.iv, // Инициализирующий вектор
            rsaEncryptedKey: this.#data.encryptedAesKey, // RSA зашифрованный AES ключ
        };

        // TODO: Отправка объекта GetRsaRunner через сокет
        console.log("Готово к отправке через сокет:", GetRsaRunner);
        this.#socket.emit('GetRsaRunner', GetRsaRunner); // Отправка на сервер
        this.#dm.displayWaitingForFileMessage();
        },
        encryptDataWithAesKey: async (jsonData) => {
            const jsonDataStr = JSON.stringify(jsonData); // Преобразование JSON в строку
            const textEncoder = new TextEncoder();
            const encodedData = textEncoder.encode(jsonDataStr);
    
            // Преобразование socketAesKey из hex в ArrayBuffer
            const aesKeyBuffer = this.#fm.hexStringToArrayBuffer(this.#data.socketAesKey);
    
            // Импорт ключа AES для использования в Web Crypto API
            const aesKey = await window.crypto.subtle.importKey(
                "raw", 
                aesKeyBuffer, 
                { name: "AES-GCM" }, 
                false, 
                ["encrypt"]
            );
    
            // Генерация IV для AES-GCM
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
            // Шифрование данных
            const encryptedData = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                aesKey,
                encodedData
            );
    
            // Преобразование зашифрованных данных и IV в строку base64
            const encryptedDataStr = this.#fm.arrayBufferToBase64(encryptedData);
            const ivStr = this.#fm.arrayBufferToBase64(iv);
    
            // Возвращаем зашифрованный объект для отправки
            return {
                encryptedData: encryptedDataStr,
                iv: ivStr,
                // Добавьте любые другие необходимые данные, если нужно
            };
        },
        hexStringToArrayBuffer: (hexString) => {
            const result = new Uint8Array(hexString.length / 2);
            for (let i = 0; i < hexString.length; i += 2) {
                result[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
            }
            return result;
        },
    
        arrayBufferToBase64: (buffer) => {
            const bytes = new Uint8Array(buffer);
            let result = '';
            const length = bytes.length;
            for (let i = 0; i < length; i++) {
                result += String.fromCharCode(bytes[i]);
            }
            return btoa(result);
        },
        waitForFile: () => {
            // Пустая реализация, здесь будет логика ожидания файла через PeerJS
            console.log("Ожидание файла...");
        },

        processReceivedData: async (encryptedData) => {
            //console.log("Обработка и расшифровка полученных данных:", encryptedData);
            this.#dm.removeLink(); // Удаление ID и ссылки с интерфейса
            this.#dm.displayProcessingReceiverResponse(); // Отображаем сообщение об обработке
    
            const rsaEncryptedKey = encryptedData.rsaEncryptedKey; // Получаем зашифрованный ключ из данных
            const decryptedAesKey = await this.#fm.decryptRsaEncryptedKey(rsaEncryptedKey); // Расшифровка ключа AES
        
        // Предположим, что encryptedMessage содержится в encryptedData
        const encryptedMessage = encryptedData//.encryptedMessage; // Зашифрованное сообщение
        const decryptedMessage = await this.#fm.decryptDataWithAesKey(encryptedMessage, decryptedAesKey); // Расшифровка сообщения

        console.log("Расшифрованное сообщение:", decryptedMessage);
        try {
            const messageObj = JSON.parse(decryptedMessage);
            //console.log("Расшифрованный JSON:", messageObj);
    
            // Проведение проверок
            if (!messageObj.peer || !messageObj.key || !messageObj.phrase) {
                throw new Error('Missing required fields');
            }
    
            const safePhrase = this.#fm.escapeHtml(messageObj.phrase);

            this.#data.MainKey = messageObj.key;
            this.#data.peerToR = messageObj.peer;
            //console.log("Проверенная фраза:", safePhrase);
            this.#dm.displayVerificationOptions(safePhrase); // Отображаем проверочную фразу и кнопки

            // TODO: Дальнейшие действия с расшифрованными данными
        } catch (error) {
            console.error("Ошибка при обработке расшифрованных данных:", error);
            alert(`Error: ${error.message} Code: 3000`);
            // Можешь здесь добавить дополнительную логику обработки ошибки
        }
        },

        decryptDataWithAesKey: async (encryptedData, aesKey) => {
            const iv = this.#fm.base64ToArrayBuffer(encryptedData.iv); // Преобразование IV из Base64
            const data = this.#fm.base64ToArrayBuffer(encryptedData.encData); // Преобразование зашифрованных данных из Base64
            console.log(iv,data)
            try {
                // Использование aesKey как ключа для расшифровки
                // Убедитесь, что aesKey уже является CryptoKey для AES
                const decryptedData = await window.crypto.subtle.decrypt(
                    { name: "AES-GCM", iv: iv },
                    aesKey,
                    data
                );
    
                // Преобразование из ArrayBuffer в строку
                const decryptedText = new TextDecoder().decode(decryptedData);
                return decryptedText;
            } catch (error) {
                console.error("Ошибка при расшифровке данных:", error);
                // Обработка ошибки расшифровки
                return null; // Возвращаем null или выбрасываем ошибку, в зависимости от вашей логики обработки ошибок
            }
        },

        handleFileSendDecision: async (decision) => {
            console.log("Отправка решения на сервер...");
            this.#socket.emit('handleFileSendDecision', { resp: decision });
        
            // Полная очистка страницы перед дальнейшими действиями
            document.body.innerHTML = '';
        
            if (!decision) {
                console.log("Пользователь отказался от отправки файла.");
                alert("Файл не будет отправлен. Страница будет перезагружена.");
                location.reload(); // Принудительная перезагрузка страницы
                return;
            } 
        
            //console.log("Пользователь подтвердил отправку файла.");
            // Отключаем подключение сокета
            this.#socket.disconnect();
        
            // Подготовка страницы к новым действиям
            this.#fm.prepareForFileEncryption();
        },
                
        prepareForFileEncryption: () => {
            //console.log("Подготовка к шифрованию и отправке файла...");
            // Вызываем метод #dm для отображения необходимой информации или элементов интерфейса
            this.#dm.displayPrepareForFileEncryptionMessage();
            this.#fm.consumeAndEncryptFile();
        },

        hexToArrayBuffer: (hex) => {
            // const typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(byte => parseInt(byte, 16)));
            // return typedArray.buffer;

                // Убедимся, что hex действительно строка
    if (typeof hex !== 'string') {
        console.error("hexToArrayBuffer ожидает строку, получено:", typeof hex);
        throw new TypeError("Ожидалась строка");
    }

    if (hex.length % 2 !== 0) {
        throw new Error("Некорректная длина hex строки!");
    }

    var typedArray = new Uint8Array(hex.length / 2);
    for (var i = 0; i < typedArray.length; i++) {
        var byteHex = hex.substring(i * 2, i * 2 + 2);
        typedArray[i] = parseInt(byteHex, 16);
    }
    return typedArray.buffer;

        },

        // Шифрование данных с использованием ключа в формате hex
        encryptData: async (arrayBuffer, keyHex) => {
            const keyBuffer = this.#fm.hexToArrayBuffer(keyHex);
            const key = await window.crypto.subtle.importKey(
                'raw',
                keyBuffer,
                { name: 'AES-GCM', length: 256 },
                false,
                ['encrypt']
            );
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encryptedData = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, arrayBuffer);
            return { encryptedData, iv };
        },

        // Генерация hex формата AES ключа
        generateAESKeyHex: async (keySize) => {
            const key = await window.crypto.subtle.generateKey({ name: 'AES-GCM', length: keySize }, true, ['encrypt', 'decrypt']);
            const exportedKey = await window.crypto.subtle.exportKey('raw', key);
            return Array.from(new Uint8Array(exportedKey)).map(b => b.toString(16).padStart(2, '0')).join('');
        },

        // Вычисление SHA-256 хеша
        calculateSHA256: async (arrayBuffer) => {
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
            return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        },

        consumeAndEncryptFile: async () => {
            const CHUNK_SIZE = 256 * 1024; // 256 KB
            const numChunks = Math.ceil(this.#data.file.unenc.size / CHUNK_SIZE);
            this.#chunksArray[0] = [];
        
                        // Метаданные файла
            const fileMetadata = {
                name: this.#data.file.unenc.name,
                size: this.#data.file.unenc.size,
                type: this.#data.file.unenc.type,
                lastModified: this.#data.file.unenc.lastModified
            };
            this.#chunksArray[0][0] = fileMetadata;

            // Обрезаем ключ до 256 бит (32 байта = 64 символа в hex)
            const aesKey = this.#data.MainKey.length > 64 ? this.#data.MainKey.substring(0, 64) : this.#data.MainKey;
        
            for (let i = 1; i <= numChunks; i++) {
                const offset = (i - 1) * CHUNK_SIZE;
                const chunk = this.#data.file.unenc.slice(offset, offset + CHUNK_SIZE);
                const arrayBuffer = await chunk.arrayBuffer();
                const originSign = await this.#fm.calculateSHA256(arrayBuffer);
                const randKey = await this.#fm.generateAESKeyHex(256);
                // Предполагается, что метод encryptData уже умеет работать с CryptoKey
                const { encryptedData, iv } = await this.#fm.encryptData(arrayBuffer, randKey);
                const encSign = await this.#fm.calculateSHA256(encryptedData);
                this.#chunksArray[i] = { data: encryptedData, sign: encSign };
                this.#chunksArray[0][i] = { iv: iv, key: randKey, sign: originSign };
                // Обновляем прогресс шифрования
                const encryptionProgress = (i / numChunks) * 100;
                document.getElementById('encryptionProgress').style.width = `${encryptionProgress}%`;
                document.getElementById('encryptionProgress').textContent = `Зашифровано: ${encryptionProgress.toFixed(2)}%`;
            }
            const metadataJson = JSON.stringify(this.#chunksArray[0]);
            const metadataArrayBuffer = new TextEncoder().encode(metadataJson);
            const { encryptedData: encryptedMetadata, iv } = await this.#fm.encryptData(metadataArrayBuffer, aesKey);
            const encryptedMetadataSign = await this.#fm.calculateSHA256(encryptedMetadata);
            this.#chunksArray[0] = { data: encryptedMetadata, sign: encryptedMetadataSign, iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('') };
        
            //console.log(this.#chunksArray);
            //return this.#chunksArray;
            return this.#fm.sendInitialPeerRequest();
        },

        decryptRsaEncryptedKey: async (rsaEncryptedKey) => {
            try {
                // Предполагаем, что rsaEncryptedKey - это ArrayBuffer
                const decryptedKeyBuffer = await window.crypto.subtle.decrypt(
                    { name: "RSA-OAEP" },
                    this.#data.keyPair.privateKey,
                    rsaEncryptedKey
                );
        
                console.log("Размер расшифрованного ключа AES:", decryptedKeyBuffer.byteLength);
                console.log("Расшифрованный ключ AES (ArrayBuffer):", decryptedKeyBuffer);
        
                // В этом месте мы уже имеем расшифрованный ключ AES в ArrayBuffer и можем его импортировать для использования
                const aesKey = await window.crypto.subtle.importKey(
                    "raw", // Импорт из "сырого" формата
                    decryptedKeyBuffer,
                    { name: "AES-GCM" },
                    false, // не экспортируемый
                    ["decrypt"] // только для расшифровки
                );
        
                console.log("RSA-шифрованный ключ AES успешно расшифрован и импортирован.");
                return aesKey;
            } catch (error) {
                console.error("Ошибка при расшифровке и импорте RSA-шифрованного ключа AES:", error);
                throw error;
            }
        },
        base64ToArrayBuffer: (base64) => {
            const binaryString = window.atob(base64); // Декодирование из Base64 в бинарную строку
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },

        sendInitialPeerRequest:() => {
            try {
                //const metadata = this.#chunksArray[0];
                const senderPeerId = this.#peer.id;
    
                const initialRequest = {
                    metadata: {
                        data: this.#fm.arrayBufferToBase64(this.#chunksArray[0].data),
                        sign: this.#chunksArray[0].sign,
                        iv: this.#chunksArray[0].iv,
                    },
                    senderPeerId: senderPeerId
                };
    
                const jsonStringToSend = JSON.stringify(initialRequest);
    
                // Попытка установить соединение с пиром
                const conn = this.#peer.connect(this.#data.peerToR);
                this.#data.conn = conn;
                conn.on('open', () => {
                    // Соединение успешно установлено
                    console.log("Соединение с пиром установлено.");
    
                    // Отправляем данные
                    conn.send(jsonStringToSend);
                    console.log("Начальный запрос и метаданные успешно отправлены получателю.");
                    this.#fm.sendFirstChunk();
                });
    
                conn.on('error', (err) => {
                    // Обработка ошибок соединения
                    console.error("Ошибка соединения с пиром:", err);
                });
    
            } catch (error) {
                console.error("Ошибка при отправке начального запроса и метаданных:", error);
            }
        },

        sendFirstChunk: async () => {
            // Проверяем, установлено ли соединение с пиром
            if (!this.#data.conn) {
                console.error("Соединение с пиром не установлено.");
                return;
            }
        
            // Подготовка данных первого чанка для отправки
            const firstChunkData = this.#fm.prepareChunkData(1);
            if (!firstChunkData) {
                console.error("Ошибка при подготовке данных первого чанка для отправки.");
                return;
            }
        
            // Отправка данных первого чанка получателю
            this.#data.conn.send(firstChunkData);
            console.log("Первый чанк успешно отправлен получателю.");
        },

        prepareChunkData: (chunkIndex) => {
            // Проверка наличия чанка по указанному индексу
            if (!this.#chunksArray[chunkIndex]) {
                console.error(`Чанк с индексом ${chunkIndex} не найден.`);
                return null;
            }
        
            // Формирование объекта с данными чанка
            const chunkData = {
                action: 'sendChunk',
                chunkIndex: chunkIndex,
                data: this.#chunksArray[chunkIndex].data, // Данные чанка
                //iv: this.#chunksArray[chunkIndex].iv, // IV для шифрования
                sign: this.#chunksArray[chunkIndex].sign // Подпись чанка
            };
        
            return chunkData;
        },
        
        

        finalEpector: (runner) => {
            // Полная очистка страницы перед дальнейшими действиями
            document.body.innerHTML = '';
            this.#dm.displayEncryptionMessage()
            if (!runner.resp) {
                console.log("Пользователь отказался от отправки файла.");
                alert("Файл не будет отправлен. Страница будет перезагружена.");
                location.reload(); // Принудительная перезагрузка страницы
                return;
            } 
            //console.log("Пользователь подтвердил отправку файла.");
            // Отключаем подключение сокета
            this.#socket.disconnect();
        },

        isJsonString: (str) => {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        handleIncomingConnection: (peerConnection) => {
            peerConnection.on('data', async (data) => {
                try {
                    // Предполагаем, что data - это JSON строка с объектом, содержащим поля metadata и senderPeerId
                    // console.log("Получены данные:", data);
                    const parsedData = JSON.parse(data); // Парсим полученные данные
                    //если тут даёт ошибку - отьёбываем в catch
                    this.#data.MainKey = this.#data.extraAesKey;
                    const encryptedMetadataChunk = parsedData.metadata;
                    const decryptionKeyHex = this.#data.MainKey; // Ключ расшифровки, предварительно сохраненный в состоянии
                    
                    // Расшифровываем метаданные с использованием метода из #fm
                    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                    const decryptedMetadata = await this.#fm.decryptMetadataChunk(encryptedMetadataChunk, decryptionKeyHex);
                    
                    console.log("Расшифрованные метаданные:", decryptedMetadata);
                    this.#data.meta = decryptedMetadata
                    this.#chunksArray[0] = decryptedMetadata
                    //  Обработка расшифрованных метаданных, например, проверка подписи и дальнейшая логика обмена данными
                    this.#dm.displayDecryptionProgressBars();
                    this.#fm.initializeConnectionAndSendConfirmation(parsedData.senderPeerId,true);
                    
                } catch (error) {
                    console.log(data)
                    if (typeof this.#data.peerToR !== 'undefined') {
                        if(data.chunkReq == 0){data.chunkDone = 0.01}
                        let all = Object.keys(this.#chunksArray).length-1;
                        this.#dm.updateProgressBars(100*data.chunkReq/all, 100*data.chunkDone/all);
                        this.#fm.sendChunk(data.chunkReq);
                    } else if (typeof this.#data.receiverPeerId !== 'undefined') {
                        if(data.chunkIndex == -1){ // exit from the loop
                            return this.#fm.assembleAndDownloadFile();
                        }
                        let test = await this.#fm.verifyEncryptedChunkSignature(data);
                        console.log(test)
                        let number = Object.keys(this.#data.meta).length-1;
                        this.#dm.updateProgress('receivingProgress', 100/number*data.chunkIndex);  //получение
                        this.#dm.updateProgress('verificationProgress', 100/number*(test-1));  //получение
                        this.#chunksArray[data.chunkIndex] = data.data;
                        this.#fm.requestChunk(test,data.chunkIndex);
                    }

                    // Обработка ошибок, возможно, показ сообщения пользователю или попытка повторного соединения
                }
            });
        },
        sendChunk: (chunkNumber) => {
            if (this.#data.conn && this.#data.conn.open) {
                // Проверяем, есть ли чанк с таким номером
                if (this.#chunksArray[chunkNumber]) {
                    // Формируем данные для отправки
                    const chunkData = this.#chunksArray[chunkNumber];
                    const messageToSend = {
                        action: 'sendChunk',
                        chunkIndex: chunkNumber,
                        data: chunkData.data, // Может потребоваться преобразование для ArrayBuffer
                        sign: chunkData.sign
                    };
        
                    // Отправляем данные чанка
                    this.#data.conn.send(messageToSend);
                    console.log(`Чанк номер ${chunkNumber} успешно отправлен через существующее соединение.`);
                } else {
                    console.log(this.#chunksArray[chunkNumber-1], " И ЧТО ТУТ ДЕЛАТЬ")
                    if(this.#chunksArray[chunkNumber-1]){
                        // а мы тут всё))
                        const messageToSend = {
                            action: 'sendChunk',
                            chunkIndex: -1
                        };
            
                        // Отправляем данные чанка
                        this.#data.conn.send(messageToSend);
                        console.log(`Чанк номер ${chunkNumber} успешно отправлен через существующее соединение.`);
                        console.log("Та всё, отправили!)");
                        alert("Файл отправлен.\nПолучетнль будет расшифровывать фалй, и может быть его скачает \nСтраница будет перезагружена.");
                        location.reload(); // Принудительная перезагрузка страницы
                    }else{
                        console.error(`Чанк номер ${chunkNumber} не найден.`);
                    }
                }
            } else {
                console.error("Соединение не установлено или уже закрыто.");
            }
        },

        // Метод для установления соединения и отправки подтверждения получения нулевого чанка и запроса на первый чанк
        initializeConnectionAndSendConfirmation: (receiverPeerId, isSuccess) => {
            this.#data.receiverPeerId = receiverPeerId;
console.log(this.#data.receiverPeerId)
            // Создание соединения с пиром получателя
            this.#data.conn = this.#peer.connect(receiverPeerId);

            this.#data.conn.on('open', () => {
                this.#data.conn.send({ 
                    action: 'confirmation',
                    isSuccess: isSuccess,
                    chunkReq:1,
                    chunkDone:0
                });
            });
        },

        processReceivedChunk: async (chunkData) => {
            try {
                const { chunkIndex, data, iv, sign } = chunkData;
                console.log(`Обработка чанка с индексом ${chunkIndex}.`);
        
                // TODO: Расшифровка данных чанка используя iv и проверка подписи с sign
        
                // После успешной обработки чанка, запрос следующего чанка
                // Это может быть реализовано через отправку сообщения обратно отправителю
                this.#data.conn.send({
                    action: 'requestNextChunk',
                    chunkIndex: chunkIndex + 1
                });
            } catch (error) {
                console.error("Ошибка при обработке полученного чанка:", error);
                // Обработка ошибки, возможно, отправка сообщения об ошибке отправителю
            }
        },

        handlePeerDataReceived: (conn) => {
            // Устанавливаем обработчик получения данных от пира
            conn.on('data', (data) => {
                console.log("Получены данные от пира:", data);
        
                // Обработка полученных данных в зависимости от их типа или действия
                if (data.action && data.action === 'sendChunk') {
                    // Обработка полученного чанка
                    this.processReceivedChunk(data);
                } else {
                    console.error("Неизвестный тип данных или действие от пира.");
                }
            });
        },
        
        

        base64ToArrayBuffer: function(base64) {
            const binaryString = window.atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        },
    
        decryptData: async function(encryptedData, key) {
            // Здесь должен быть ваш код для расшифровки данных
            // Это только примерная структура
            const decryptedData = await window.crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: encryptedData.iv }, // Пример, нужно адаптировать под ваши данные
                key,
                encryptedData.data
            );
            return decryptedData;
        },
    
        handleReceivedData: async function(data, decryptionKey) {
            try {
                // Предполагаем, что data - это объект с полями metadata и senderPeerId, а metadata.data - строка в формате Base64
                const encryptedDataArrayBuffer = this.base64ToArrayBuffer(data.metadata.data);
    
                // Расшифровываем данные
                const decryptedData = await this.decryptData(encryptedDataArrayBuffer, decryptionKey);
    
                // Далее идет обработка расшифрованных данных...
                console.log("Расшифрованные данные:", new TextDecoder().decode(decryptedData)); // Преобразование ArrayBuffer обратно в строку
            } catch (error) {
                console.error("Ошибка при обработке данных:", error);
            }
        },
            // Дополнительный метод для импорта ключа из hex строки
    importKeyFromHex: async function(hexString) {
        const keyBuffer = this.hexStringToArrayBuffer(hexString);
        const key = await window.crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-GCM", length: 256 },
            false, // не экспортируемый
            ["encrypt", "decrypt"]
        );
        return key;
    },

    // Метод для расшифровки данных с использованием CryptoKey и IV
    decryptData: async function(encryptedData, cryptoKey, ivHex) {
        const iv = this.hexStringToArrayBuffer(ivHex);
        const decryptedData = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            encryptedData
        );
        return decryptedData;
    },

decryptMetadataChunk: async (encryptedMetadataChunk, decryptionKeyHex) => {
    // Первоначально преобразуем ключ из Hex в CryptoKey
    const decryptionKey = await this.#fm.importKeyFromHex(this.#data.MainKey.length > 64 ? this.#data.MainKey.substring(0, 64) : this.#data.MainKey); 
    // Преобразуем iv из hex строки в ArrayBuffer
    const ivArray = this.#fm.hexStringToArrayBuffer(encryptedMetadataChunk.iv);
    // Преобразуем данные из base64 в ArrayBuffer
    const dataArrayBuffer = this.#fm.base64ToArrayBuffer(encryptedMetadataChunk.data);
    // Расшифровываем данные
    const decryptedMetadataArrayBuffer = await this.#fm.decryptDataChunk(dataArrayBuffer, decryptionKey, ivArray);
    const decryptedSign = await this.#fm.calculateSHA256(dataArrayBuffer);

    // Проверяем целостность данных
    if (decryptedSign !== encryptedMetadataChunk.sign) {
        throw new Error("Целостность метаданных нарушена");
    }

    // Преобразуем массив байтов обратно в JSON
    const decryptedMetadataJSON = new TextDecoder().decode(decryptedMetadataArrayBuffer);
    const decryptedMetadata = JSON.parse(decryptedMetadataJSON);

    return decryptedMetadata;
},

decryptDataChunk: async (encryptedData, decryptionKey, ivArray) => {
    // Проверяем, что ключ - это CryptoKey, иначе преобразуем
    if (!(decryptionKey instanceof CryptoKey)) {
        decryptionKey = await this.#fm.importKeyFromHex(decryptionKey);
    }
    

    // Расшифровываем данные
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivArray,
        },
        decryptionKey,
        encryptedData
    );

    return decryptedData;
},

verifyEncryptedChunkSignature: async (chunkData ) => {
    const { data, sign, chunkIndex } = chunkData; // Извлечение зашифрованных данных, подписи и индекса чанка
    
    // Вычисляем SHA-256 хеш зашифрованных данных чанка
    const calculatedSign = await this.#fm.calculateSHA256(data);
    
    // Сравниваем вычисленную подпись с подписью, предоставленной вместе с чанком
    if (calculatedSign === sign) {
        console.log(`Подпись зашифрованного чанка ${chunkIndex} верна.`);
        return chunkIndex + 1; // Возвращаем номер следующего чанка для запроса
    } else {
        console.error(`Подпись зашифрованного чанка ${chunkIndex} не совпадает.`);
        return chunkIndex; // Возвращаем текущий номер чанка для повторной отправки
    }
},

 requestChunk: async (chunkReq, chunkDone) => {
    console.log("Attempting to request chunk", chunkReq, "and confirm chunk", chunkDone);

    // Проверяем, есть ли объект соединения
    if (!this.#data.conn) {
        console.error("No connection object found.");
        return;
    }

    // Функция для отправки данных
    const sendMessage = () => {
        const messageToSend = {
            action: 'requestChunk',
            chunkReq: chunkReq,
            chunkDone: chunkDone,
        };
        this.#data.conn.send(messageToSend);
        console.log(`Request for chunk ${chunkReq} and confirmation of chunk ${chunkDone} sent successfully.`);
    };

    sendMessage();
},

assembleAndDownloadFile: async () => {

if (!this.#chunksArray[1] || !this.#data.meta) {
    console.error("Отсутствует первый чанк или метаданные.");
    return;
}

const assembledData = []; // Массив для сборки расшифрованных чанков
const totalChunks = Object.keys(this.#chunksArray).length - 1; // Исключаем метаданные

for (let chunkNumber = 1; chunkNumber <= totalChunks; chunkNumber++) {
    const chunkData = this.#chunksArray[chunkNumber];
    const metadata = this.#data.meta[chunkNumber];

    if (!metadata || !metadata.key || !metadata.iv) {
        console.error(`Отсутствуют метаданные для чанка ${chunkNumber}`);
        continue;
    }

    try {
        const decryptionKey = await this.#fm.importKeyFromHex(metadata.key);
        const ivArray = new Uint8Array(Object.values(metadata.iv));

        const decryptedData = await window.crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ivArray },
            decryptionKey,
            chunkData
        );

        const decryptedSign = await this.#fm.calculateSHA256(decryptedData);
        if (decryptedSign !== metadata.sign) {
            console.error(`Целостность чанка ${chunkNumber} нарушена.`);
            continue;
        }

        assembledData.push(decryptedData); // Добавляем расшифрованные данные в массив
        delete this.#chunksArray[chunkNumber]; // Удаляем чанк из памяти для оптимизации

        // Обновление прогресса расшифровки
        const decryptionProgress = (chunkNumber/(totalChunks))*100;
        this.#dm.updateProgress('decryptionProgress', decryptionProgress);

    } catch (error) {
        console.error(`Ошибка при обработке чанка ${chunkNumber}: ${error}`);
    }
}

if (!this.#chunksArray[0]) {
    console.error("Метаданные файла отсутствуют.");
    return;
}

const metadata = this.#chunksArray[0][0]; // Предполагаем, что метаданные хранятся в первом элементе массива
const { name, type } = metadata;

// Убедимся, что name и type содержат значения
console.log("Имя файла:", name);
console.log("Тип файла:", type);

if (!name || !type) {
    console.error("Метаданные файла неполные или отсутствуют.");
    return;
}

// // Собираем все чанки в один Blob
// const blob = new Blob(assembledData, { type: type || 'application/octet-stream' });

// // Создаем URL для скачивания
// const url = window.URL.createObjectURL(blob);

// // Создаем временную ссылку для скачивания и имитируем клик по ней
// const a = document.createElement('a');
// a.href = url;
// a.download = name || 'downloaded_file';
// document.body.appendChild(a); // Важно для Firefox
// a.click();

// // Очищаем ссылку и URL
// window.URL.revokeObjectURL(url);
// document.body.removeChild(a);

// Создание Blob и URL для скачивания
const blob = new Blob(assembledData, { type: type || 'application/octet-stream' });
const url = window.URL.createObjectURL(blob);

// Использование функции для скачивания
function downloadFile(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Вызов функции скачивания
downloadFile(url, name || 'downloaded_file');


alert("Файл успешно скачан!\nСтраница перезагрузиться автоматически.\nУже можно уходить))");

location.reload();

    }



    




    };

    constructor() {
        // Подключаемся к серверу Socket.IO при создании экземпляра класса
        this.#socket = io();
        this.#fm.setupSocketListeners();

        this.#fm.initializePeer();
    }

    // Метод для отправки данных формы отправителя
    async sendFileData(nickname, file, verificationPhraseChecked) {
        document.getElementById('loadingIndicator').style.display = 'block'; // Показываем индикатор загрузки

        this.#data.file = {
            unenc: file // Нешифрованный файл
        };

        const { publicKey, keyPair } = await this.#fm.generateRsaKeyPair(); // Генерация ключей
        this.#data.keyPair = keyPair; // Сохраняем приватный и публичный ключи в состоянии

        const id = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        this.#data.anchorID = id; // Сохраняем сгенерированный ID

        console.log(`Отправка данных: ID: ${id}, Nickname: ${nickname}, Проверочная фраза: ${verificationPhraseChecked}`);

        // Создание JSON объекта для отправки
        const dataToSend = {
            ID: id,
            nickname: nickname,
            verificationPhrase: verificationPhraseChecked,
            publicKey: JSON.stringify(publicKey) // Отправляем публичный ключ как строку
        };
    
        this.#data.dataToSend = dataToSend;
        // Отправка данных на сервер через Socket.IO
        this.#socket.emit('SendStartReq', dataToSend);
        document.getElementById('loadingIndicator').style.display = 'none'; // Скрываем индикатор загрузки после отправки
    }

    getStartRequest(fileId) {
        this.#fm.getStartRequest(fileId);
    }

}

// Создаём экземпляр класса MainChange
const mainChange = new MainChange();

document.getElementById('userTypeForm').addEventListener('change', function(event) {
    const userType = document.getElementById('userType').value;
    displayForm(userType);
});

function displayForm(userType) {
    if(userType === 'sender') {
        document.getElementById('senderForm').style.display = 'block';
        document.getElementById('receiverForm').style.display = 'none';
    } else if(userType === 'receiver') {
        document.getElementById('receiverForm').style.display = 'block';
        document.getElementById('senderForm').style.display = 'none';
    } else {
        document.getElementById('senderForm').style.display = 'none';
        document.getElementById('receiverForm').style.display = 'none';
    }
}

// Обработка отправки формы отправителем
document.getElementById('fileSendForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const nickname = document.getElementById('nickname').value;
    const file = document.getElementById('file').files[0];
    const verificationPhraseChecked = document.getElementById('verificationPhrase').checked;
    
    // Используем метод класса для отправки данных
    mainChange.sendFileData(nickname, file, verificationPhraseChecked);
});

// Обработка отправки формы получателя
document.getElementById('fileReceiveForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileId = document.getElementById('fileId').value;
    mainChange.getStartRequest(fileId); // Используем метод класса для отправки запроса
  });
  

  window.onload = function() {
    // Получаем параметры из URL
    const params = new URLSearchParams(window.location.search);
    // Проверяем, есть ли параметр 'get' в URL
    if (params.has('get')) {
      const receiverID = params.get('get');
      // Если есть, заполняем поле ввода ID
      const fileIdInput = document.getElementById('fileId');
      if (fileIdInput) {
        fileIdInput.value = receiverID;
        // Если форма ввода есть на странице, то переключаем пользователя на форму получателя
        document.getElementById('userType').value = 'receiver';
        displayForm('receiver'); // вызываем displayForm с параметром 'receiver'
      }
    }
  };