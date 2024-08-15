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



*/
class SteroidCrypto {
    constructor() {
    }

    async getSkey (password) {
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
                {name: "PBKDF2"},
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
            let key1Binary = '';
            for (let i = 0; i < key1.length; i += 2) {
              key1Binary += parseInt(key1.substring(i, i + 2), 16).toString(2).padStart(8, '0');
            }
            
            // Извлекаем 32 бита начиная с вычисленного индекса
            const extractedBits = key1Binary.substring(startIndex, startIndex + 32);
            
            // Возвращаем извлеченные биты в hex
            return parseInt(extractedBits, 2).toString(16).padStart(8, '0');
        };

        // Получение хешей пароля
        const sha256Password = await hash('SHA-256', password);
        const sha512Password = await hash('SHA-512', password);

        // Преобразование Uint8Array в hex строку
        const toHexString = bytes => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

        // Получение ключей через PBKDF2
        const key1Bytes = await deriveKey(sha256Password, sha512Password, 10000, 'SHA-256');
        const key2Bytes = await deriveKey(sha512Password, sha256Password, 1000, 'SHA-512');

        const key1Hex = toHexString(new Uint8Array(key1Bytes));
        const key2Hex = toHexString(new Uint8Array(key2Bytes));

        // Исправлен вызов extractBits и его обработка
        const bits = await extractBits(key1Hex, key2Hex);
        return parseInt(bits, 16);
    };

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
                        hash: "SHA-256"
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
                const resultBuffer = new Uint8Array(salt.length + iv.length + encryptedBuffer.length);
                resultBuffer.set(salt, 0);
                resultBuffer.set(iv, salt.length);
                resultBuffer.set(encryptedBuffer, salt.length + iv.length);
                return {
                    s: 1,
                    t: resultBuffer, // возвращаем как Uint8Array
                    v: algo
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
                        hash: "SHA-256"
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
                    v: algo
                };
            }
        } catch (error) {
            console.error("Ошибка при шифровании/расшифровке:", error);
            return {
                s: 0,
                t: "error",
                v: algo
            };
        }
    }


    async getPass(password) {
        // Хэширование пароля с использованием SHA-512 для создания соли
        const getSalt = async (password) => {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-512', data);
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
                hash: 'SHA-512'
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
        return Array.from(keyBuffer).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

}

(() => {
    window.SteroidCrypto = SteroidCrypto;
})()