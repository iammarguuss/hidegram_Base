async function encryptDecryptMessage(text, password, isEncrypt) {
    if (isEncrypt) {
        // Шифрование
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

        return btoa(String.fromCharCode(...resultBuffer));
    } else {
        // Расшифровка
        const data = atob(text);
        const dataBuffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; i++) {
            dataBuffer[i] = data.charCodeAt(i);
        }

        const salt = dataBuffer.slice(0, 32);
        const iv = dataBuffer.slice(32, 44);
        const encrypted = dataBuffer.slice(44);

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

        return new TextDecoder().decode(decrypted);
    }
}

const message = "Привет, мир!";
const password = "секретныйКлюч";

// Шифрование сообщения
encryptDecryptMessage(message, password, true) // true для шифрования
    .then(encryptedMessage => {
        console.log("Зашифрованное сообщение:", encryptedMessage);
        // Расшифровка сообщения
        return encryptDecryptMessage(encryptedMessage, password, false); // false для расшифровки
    })
    .then(decryptedMessage => {
        console.log("Расшифрованное сообщение:", decryptedMessage);
    })
    .catch(error => console.error("Ошибка:", error));
