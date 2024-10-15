/*
    SteroidCrypto class

    getSkey
    gives skey for the password in order to make it unpredictable
    
    SteroidCrypto.getSkey(raw password) => number (dec ~2^32)

    messageEnc
    encrypts or decripts the messages in main chat app

    messageEnc(message, password, bool)
        password - hex (as a standard)
        if bool == true  =>     encrypts message
        if bool == false =>     decrypts message 

        if success
            {
                s:1,
                t:text,
                v:0
            }
        else
            {
                s:0,
                t:text, // error, just "error"
                v:0
            }

    
    getPass
    gets hash from low entrophy password

    getPass(password)
        password - raw input => hex 256bit



    genPair 
    Generates Key Pair for RSA
    genPair(*bitKeySize) => 4k by default
        {
            s: true/false // as status if it was successfull
            e: erroe message IF error exist
            r: response { //if error => null
                            publicKey: base 64 from the key
                            privateKey: base 64 from the key
                        }
        }


    createPackage
    Creates ready to send package from the sender
    createPackage(publicKeyBase64, hexString (signature from server in hex), valicationPhrase, waitingTime)
        {
            s: true,                            //status true/false
            e: 0,                               // error message if exits
            salt: salt,                         // hex string -> have to be saved localy for later validation
            r: {                                // responce body (fully ready to be sent)
                publicKey: publicKeyBase64,     // public key in base64
                originSha: hexString,           // hexString from sever
                signature: signature            // signature
                valicationPhrase = false,       // add valication Phrase or not, bool  
                waitingTime = time in munutes   // waiting Time before the connection will be closed
            }
        }

    prevalidator
    prevalidator(createPackage.r, inputString) 
    inputString - hex 64 char original string from the server
    Checks if all the data is correct when recived
    {
        s: true,                            //status true/false
        e: 0,                               // error message if exits
        r: createPackage.r
    }

    responceRSA(prevalidator.r, inputstring, validationPhrase)
    inputString - hex 64 char original string from the server
    Prepares responce
    {
        s: true,                            //status true/false
        e: 0,                               // error message if exits
        r: {
            sha512:                         // signature in hex
            encryptedAesString:             // aes string, encrypted via public key and ready to be sent
            Phrase:                         // Encrypted phrase for validation
        }
        aes:                                // aes string for encryption => MUST BE SAVED LOCALY
    }

    encryptData - decrypts message, checks signatures and make the packege to send it back.
    encryptData(
        obj,                        {responceRSA().r}
        inputString,                original string from server
        signatureSha256,            sha string from the server (should be from localstorage)
        privateKeyBase64,           private key in base64
        publicKeyBase64,            publick key in base64
        password,                   object with password from change settings
        salt                        salt from createPackage.salt
    )

    return {
        s: true/false                       status
        e: null                             error null or error message in case signatures are not the same
        aes: hex aes                        aes the change protocol (just in case) 
        phrase: raw text                    Phrase for valication, SHOULE BE TESTED FOR XXS
        r: {
            password: base64 string         json->string->aes enc (password from change)
            salt: base64 string             just encrypted salt with the same key
        }
    }

    finalAccepter
    very last method from the reciver side before chat
    finalAccepter(
        packet,             // encryptionResult.r 
        signature,          // signature from the first method recived from sender
        publicKeyBase64,    // just public key
        hexString,          // sha256 from server, generated in the begininging
        aesKeyHex           // responseResult.aes => it should have been saved localyy before
    )

    return {
        s: true/false                       status
        e: null                             error null or error message in case signatures are not the same
        r: {
            finalKey: {},                   the password with all the settings from change, recived
                                            SHOULD BE SAVED LOCALY and to to chat with it
            signature:                      hex. should send to sender before clothing connection.
                                            the only one, that should be sent back and its over
        }
    }

    lastCheck - last solt validation
    (signature,     - finalAccepter.r.signature
    signature_old)  - old salt from local storage
    return {
        s: true/false - status
        e: error message or null
        r: true or false -> if everything works and we can go to chat
    }

    ChangePassGen - generates the password
    ChangePassGen(
        length,     - password length  
        Cap,        - Capital letters A-Z
        num,        - Numbers 0-9
        sch         - special chars
    )
    return {
        s: true/false
        e: error message or null,
        r: {    // responce
            pass: password itself,
            entropy: number for entropy (if more then 100 is => good)
        }
    };
    
*/
class SteroidCrypto {
  constructor() {}

  async getSkey(password) {
    // Локальные функции для хэширования
    const hash = async (algo, data) => {
      const encoder = new TextEncoder();
      const buffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest(algo, buffer);
      return new Uint8Array(hashBuffer);
    };

    // PBKDF2 функция
    const deriveKey = async (passwordHash, salt, iterations, hash) => {
      const baseKey = await crypto.subtle.importKey(
        "raw",
        passwordHash,
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
      );
      return await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: iterations,
          hash: hash,
        },
        baseKey,
        256 // Вывод в битах
      );
    };

    const pseudoHash = async (input) => {
      let sum = 0;
      for (let i = 0; i < input.length; i++) {
        sum += input.charCodeAt(i);
      }
      return sum;
    };

    const extractBits = async (key1, key2) => {
      // Получаем псевдо-хеш для key2
      const hashValue = await pseudoHash(key2);

      // Вычисляем стартовый индекс в битах
      const startIndex = hashValue % (256 - 32); // 256 бит в key1 и нужно 32 бита

      // Конвертируем key1 из hex в бинарный вид
      let key1Binary = "";
      for (let i = 0; i < key1.length; i += 2) {
        key1Binary += parseInt(key1.substring(i, i + 2), 16)
          .toString(2)
          .padStart(8, "0");
      }

      // Извлекаем 32 бита начиная с вычисленного индекса
      const extractedBits = key1Binary.substring(startIndex, startIndex + 32);

      // Возвращаем извлеченные биты в hex
      return parseInt(extractedBits, 2).toString(16).padStart(8, "0");
    };

    // Получение хешей пароля
    const sha256Password = await hash("SHA-256", password);
    const sha512Password = await hash("SHA-512", password);

    // Преобразование Uint8Array в hex строку
    const toHexString = (bytes) =>
      bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

    // Получение ключей через PBKDF2
    const key1Bytes = await deriveKey(
      sha256Password,
      sha512Password,
      10000,
      "SHA-256"
    );
    const key2Bytes = await deriveKey(
      sha512Password,
      sha256Password,
      1000,
      "SHA-512"
    );

    const key1Hex = toHexString(new Uint8Array(key1Bytes));
    const key2Hex = toHexString(new Uint8Array(key2Bytes));

    // Исправлен вызов extractBits и его обработка
    const bits = await extractBits(key1Hex, key2Hex);
    return parseInt(bits, 16);
  }

  async messageEnc(text, password, isEncrypt, algo = 0) {
    try {
      if (isEncrypt) {
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(password),
          { name: "PBKDF2" },
          false,
          ["deriveBits", "deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: salt,
            iterations: 100,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt"]
        );
        const encrypted = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv: iv },
          key,
          new TextEncoder().encode(text)
        );
        const encryptedBuffer = new Uint8Array(encrypted);
        const resultBuffer = new Uint8Array(
          salt.length + iv.length + encryptedBuffer.length
        );
        resultBuffer.set(salt, 0);
        resultBuffer.set(iv, salt.length);
        resultBuffer.set(encryptedBuffer, salt.length + iv.length);
        return {
          s: 1,
          t: resultBuffer, // возвращаем как Uint8Array
          v: algo,
        };
      } else {
        // Важно: 'text' должен быть Uint8Array при расшифровке
        const salt = text.slice(0, 32);
        const iv = text.slice(32, 44);
        const encrypted = text.slice(44);
        const keyMaterial = await crypto.subtle.importKey(
          "raw",
          new TextEncoder().encode(password),
          { name: "PBKDF2" },
          false,
          ["deriveBits", "deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            salt: salt,
            iterations: 100,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["decrypt"]
        );
        const decrypted = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
          key,
          encrypted
        );
        return {
          s: 1,
          t: new TextDecoder().decode(decrypted),
          v: algo,
        };
      }
    } catch (error) {
      console.error("Ошибка при шифровании/расшифровке:", error);
      return {
        s: 0,
        t: "error",
        v: algo,
      };
    }
  }

  async getPass(password) {
    // Хэширование пароля с использованием SHA-512 для создания соли
    const getSalt = async (password) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest("SHA-512", data);
      return new Uint8Array(hashBuffer);
    };

    const salt = await getSalt(password);

    // Импорт пароля как ключа для PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    // Производный ключ с использованием PBKDF2
    const derivedKey = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 1000000,
        hash: "SHA-512",
      },
      keyMaterial,
      { name: "HMAC", hash: "SHA-512", length: 512 }, // Параметры не имеют большого значения для deriveBits
      true,
      ["verify"] // Права не имеют значения, так как ключ не будет использоваться для HMAC
    );

    // Получение битов ключа
    const derivedBits = await crypto.subtle.exportKey("raw", derivedKey);
    const keyBuffer = new Uint8Array(derivedBits);

    // Конвертация битов ключа в hex строку
    return Array.from(keyBuffer)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////CHANGE HERE////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Добавляем метод genPair для генерации пары ключей RSA
  async genPair(keySize = 4096) {
    const generateKeyPair = async (keySize) => {
      // Генерация пары ключей с заданными параметрами
      return await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize, // Длина ключа в битах, по умолчанию 4096
          publicExponent: new Uint8Array([1, 0, 1]), // Обычно 65537, что равно 0x010001
          hash: { name: "SHA-256" }, // Алгоритм хеширования
        },
        true, // ключи должны быть экспортируемыми
        ["encrypt", "decrypt"] // возможности использования ключей
      );
    };

    try {
      const keyPair = await generateKeyPair(keySize);
      // Экспорт ключей в формате специфичном для Web Crypto API
      const publicKey = await crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey
      );
      const privateKey = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
      );

      // Преобразование ключей в строковый формат для удобства отображения
      const toBase64 = (buffer) =>
        window.btoa(String.fromCharCode(...new Uint8Array(buffer)));

      return {
        s: true,
        e: null,
        r: {
          publicKey: toBase64(publicKey),
          privateKey: toBase64(privateKey),
        },
      };
    } catch (error) {
      console.error("Ошибка генерации ключей RSA:", error);
      return {
        s: false,
        e: error.message,
        r: null,
      };
    }
  }

  async createPackage(
    publicKeyBase64,
    hexString,
    valicationPhrase = false,
    waitingTime = 30
  ) {
    try {
      // Генерация случайной соли
      const saltBytes = crypto.getRandomValues(new Uint8Array(32)); // 32 байта => 64 символа в hex
      const salt = Array.from(saltBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Создание SHA-512 хеша
      const encoder = new TextEncoder();
      const dataToHash = encoder.encode(publicKeyBase64 + hexString + salt);
      const hashBuffer = await crypto.subtle.digest("SHA-512", dataToHash);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Формирование ответа
      return {
        s: true,
        e: 0,
        salt: salt,
        r: {
          publicKey: publicKeyBase64,
          originSha: hexString,
          signature: signature,
          valicationPhrase: valicationPhrase,
          waitingTime: parseInt(waitingTime),
        },
      };
    } catch (error) {
      return {
        s: false,
        e: error.message,
        salt: null,
        r: null,
      };
    }
  }

  async prevalidator(receivedObj, inputString) {
    try {
      // Проверка длины входной строки (она должна быть равна длине hex SHA-256 хеша)
      if (inputString.length !== 64) {
        throw new Error("Некорректная длина входной строки");
      }

      // Регулярное выражение для проверки, что строка является корректной hex-строкой
      const hexRegex = /^[a-fA-F0-9]+$/;
      if (!hexRegex.test(inputString)) {
        throw new Error("Входная строка содержит недопустимые символы");
      }

      // Валидация publicKey с использованием регулярного выражения для base64
      const base64Regex =
        /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      if (!base64Regex.test(receivedObj.publicKey)) {
        throw new Error("Публичный ключ имеет некорректный формат");
      }

      // Валидация signature, должен быть hex-строкой
      const signatureHexRegex = /^[a-fA-F0-9]+$/;
      if (!signatureHexRegex.test(receivedObj.signature)) {
        throw new Error("Подпись имеет некорректный формат");
      }

      // Вычисление SHA-256 хеша для входной строки
      const encoder = new TextEncoder();
      const dataToHash = encoder.encode(inputString);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataToHash);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const calculatedSha = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Сравнение полученного хеша с originSha из объекта
      if (calculatedSha !== receivedObj.originSha) {
        throw new Error(
          "Хеш входной строки не совпадает с ожидаемым originSha"
        );
      }

      // Проверка, что все необходимые поля присутствуют в receivedObj
      if (!receivedObj.publicKey || !receivedObj.signature) {
        throw new Error("Объект не содержит всех необходимых полей");
      }

      // Все проверки пройдены
      return {
        s: true,
        e: 0,
        r: receivedObj,
      };
    } catch (error) {
      return {
        s: false,
        e: error.message,
        r: null,
      };
    }
  }

  async responceRSA(validatedObj, inputString, validationPhrase) {
    try {
      // Генерация случайного AES ключа (256 бит)
      const aesKey = crypto.getRandomValues(new Uint8Array(32));
      const aesKeyHex = Array.from(aesKey)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Импорт публичного ключа RSA
      const publicKey = await crypto.subtle.importKey(
        "spki",
        this.base64ToArrayBuffer(validatedObj.publicKey),
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        false,
        ["encrypt"]
      );

      // Шифрование AES ключа
      const encryptedAesKey = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        aesKey
      );

      // Конвертация зашифрованного ключа в Base64
      const encryptedAesKeyBase64 = this.arrayBufferToBase64(encryptedAesKey);

      // Вычисление SHA-512
      const encoder = new TextEncoder();
      const dataToHash = encoder.encode(
        validatedObj.publicKey + aesKeyHex + inputString
      );
      const hashBuffer = await crypto.subtle.digest("SHA-512", dataToHash);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha512 = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Шифрование фразы
      const encryptedPhrase = await this.validationPhraseTransfer(
        validationPhrase,
        aesKeyHex,
        true
      );

      // Формирование и возврат результата
      return {
        s: true,
        e: null,
        aes: aesKeyHex,
        r: {
          sha512: sha512,
          encryptedAesString: encryptedAesKeyBase64,
          Phrase: encryptedPhrase,
        },
      };
    } catch (error) {
      return {
        s: false,
        e: error.message,
        aes: null,
        r: null,
      };
    }
  }

  async encryptData(
    obj,
    inputString,
    signatureSha256,
    privateKeyBase64,
    publicKeyBase64,
    password,
    salt
  ) {
    try {
      // Проверка SHA-256
      const inputSha256 = await this.sha256(inputString);
      if (inputSha256 !== signatureSha256) {
        throw new Error("Ошибка подписи 1");
      }

      // Расшифровка AES ключа
      const privateKey = await crypto.subtle.importKey(
        "pkcs8",
        this.base64ToArrayBuffer(privateKeyBase64),
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        false,
        ["decrypt"]
      );

      const encryptedAesKeyBuffer = this.base64ToArrayBuffer(
        obj.encryptedAesString
      );
      const decryptedAesKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedAesKeyBuffer
      );
      const aesKeyHex = this.bufferToHex(decryptedAesKey);

      // Проверка SHA-512
      const computedSha512 = await this.sha512(
        publicKeyBase64 + aesKeyHex + inputString
      );
      if (computedSha512 !== obj.sha512) {
        throw new Error("Ошибка подписи 2");
      }

      const decryptedPhrase = await this.validationPhraseTransfer(
        obj.Phrase,
        aesKeyHex,
        false
      );

      // Шифрование данных с использованием AES
      const encryptedPassword = await this.encryptAes256(
        JSON.stringify(password),
        decryptedAesKey
      );
      const encryptedSalt = await this.encryptAes256(salt, decryptedAesKey);

      // Возврат результата
      return {
        s: true,
        e: null,
        aes: aesKeyHex,
        phrase: decryptedPhrase,
        r: {
          password: encryptedPassword,
          salt: encryptedSalt,
        },
      };
    } catch (error) {
      return {
        s: false,
        e: error.message,
        aes: null,
        r: null,
      };
    }
  }

  async finalAccepter(
    packet,
    signature,
    publicKeyBase64,
    hexString,
    aesKeyHex
  ) {
    try {
      // Расшифровываем соль
      const decryptedSaltBase64 = packet.salt;
      const decryptedSalt = await this.decryptAes256(
        decryptedSaltBase64,
        aesKeyHex
      );

      // Вычисляем SHA-512 для проверки подписи
      const dataForSignature = publicKeyBase64 + hexString + decryptedSalt;
      const calculatedSignature = await this.sha512(dataForSignature);

      // Проверяем соответствие подписи
      if (calculatedSignature !== signature) {
        throw new Error("Подпись не соответствует расчетной подписи");
      }

      // Расшифровываем пароль
      const decryptedPasswordBase64 = packet.password;
      const finalKey = await this.decryptAes256(
        decryptedPasswordBase64,
        aesKeyHex
      );

      // Вычисляем SHA-256 от расшифрованной соли
      const signatureFromDecryptedSalt = await this.sha256(decryptedSalt);

      // Формируем и возвращаем результат
      return {
        s: true,
        e: null,
        r: {
          finalKey: JSON.parse(finalKey),
          signature: signatureFromDecryptedSalt,
        },
      };
    } catch (error) {
      return {
        s: false,
        e: error.message,
        r: null,
      };
    }
  }

  async lastCheck(signature, signature_old) {
    try {
      // Вычисляем SHA-256 хеш для signature_old
      const hashOfSignatureOld = await this.sha256(signature_old);
      // Сравниваем полученный хеш с signature
      const isMatch = hashOfSignatureOld === signature;
      // Возвращаем результат
      return {
        s: true,
        e: null,
        r: isMatch,
      };
    } catch (error) {
      // Обработка возможных ошибок при выполнении хеш-функции
      return {
        s: false,
        e: error.message,
        r: false,
      };
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  // Вспомогательные функции для конвертации
  base64ToArrayBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Вспомогательные методы для SHA-256, SHA-512, AES-256 шифрования, конвертации ArrayBuffer в Hex
  async sha256(data) {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
    return this.bufferToHex(buffer);
  }

  async sha512(data) {
    const encoder = new TextEncoder();
    const buffer = await crypto.subtle.digest("SHA-512", encoder.encode(data));
    return this.bufferToHex(buffer);
  }

  async encryptAes256(data, keyBuffer) {
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(data)
    );
    // Объединение зашифрованных данных и IV для передачи
    const encryptedDataWithIv = new Uint8Array(
      encryptedData.byteLength + iv.length
    );
    encryptedDataWithIv.set(new Uint8Array(encryptedData), 0);
    encryptedDataWithIv.set(iv, encryptedData.byteLength);
    return this.arrayBufferToBase64(encryptedDataWithIv.buffer);
  }

  bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async decryptAes256(encryptedDataWithIvBase64, aesKeyHex) {
    const keyBuffer = this.hexToBuffer(aesKeyHex);
    const key = await crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
    const encryptedDataWithIv = this.base64ToArrayBuffer(
      encryptedDataWithIvBase64
    );
    const iv = new Uint8Array(
      encryptedDataWithIv,
      encryptedDataWithIv.byteLength - 12,
      12
    ); // Извлечение IV из конца
    const data = new Uint8Array(
      encryptedDataWithIv,
      0,
      encryptedDataWithIv.byteLength - 12
    ); // Извлечение зашифрованных данных
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );
    return new TextDecoder().decode(decrypted);
  }

  // Конвертация hex в ArrayBuffer
  hexToBuffer(hexString) {
    const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
    for (let i = 0, j = 0; i < hexString.length; i += 2, j++) {
      bytes[j] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes.buffer;
  }

  async ChangePassGen(length, Cap, num, sch) {
    try {
      // Наборы символов для генерации пароля
      const lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
      const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const numbers = "0123456789";
      const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,.<>?";

      // Формируем строку с возможными символами для пароля
      let validChars = lowerCaseLetters;
      if (Cap) validChars += upperCaseLetters;
      if (num) validChars += numbers;
      if (sch) validChars += specialCharacters;

      // Генерация пароля
      let password = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        password += validChars[randomIndex];
      }

      // Вычисление энтропии пароля
      const entropy = this.calculateEntropy(validChars.length, length);

      // Возвращаем результат
      return {
        s: true,
        e: null,
        r: {
          pass: password,
          entropy: entropy,
        },
      };
    } catch (error) {
      // Обработка ошибок
      return {
        s: false,
        e: error.message,
        r: null,
      };
    }
  }

  // Вспомогательный метод для расчета энтропии
  calculateEntropy(poolSize, passLength) {
    return Math.log2(poolSize) * passLength;
  }

  async validationPhraseTransfer(phrase, key, encrypt = true) {
    try {
      const iv = crypto.getRandomValues(new Uint8Array(12)); // Инициализирующий вектор для AES
      const keyMaterial = await crypto.subtle.importKey(
        "raw",
        this.hexToBuffer(key),
        { name: "AES-GCM" },
        false,
        encrypt ? ["encrypt"] : ["decrypt"]
      );

      const saltLength = 64; // Фиксированная длина соли

      if (encrypt) {
        const salt = crypto
          .getRandomValues(new Uint8Array(saltLength))
          .map((b) => String.fromCharCode(b))
          .join("");
        const encoder = new TextEncoder();
        const encodedPhrase = encoder.encode(salt + phrase); // Соль добавляется в начало фразы
        const encryptedData = await crypto.subtle.encrypt(
          { name: "AES-GCM", iv },
          keyMaterial,
          encodedPhrase
        );
        const result = new Uint8Array(encryptedData.byteLength + iv.length);
        result.set(new Uint8Array(encryptedData), 0);
        result.set(iv, encryptedData.byteLength);
        return this.arrayBufferToBase64(result);
      } else {
        const dataWithIv = this.base64ToArrayBuffer(phrase);
        const iv = dataWithIv.slice(-12);
        const encryptedData = dataWithIv.slice(0, -12);
        const decryptedData = await crypto.subtle.decrypt(
          { name: "AES-GCM", iv },
          keyMaterial,
          encryptedData
        );
        const decryptedText = new TextDecoder().decode(
          decryptedData.slice(saltLength)
        ); // Удаляем соль из данных
        return decryptedText;
      }
    } catch (error) {
      console.error("Error in validationPhraseTransfer:", error);
      return null;
    }
  }
}

(() => {
  window.SteroidCrypto = SteroidCrypto;
})();
