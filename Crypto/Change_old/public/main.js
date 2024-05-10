const socket = io.connect('http://localhost:3000');

class ChangeClass {

    data = {
        settings:{},
        keys:{},
        changeId:0,
        started:false
    };

    constructor(obj) {
        this.data.settings.type = obj.type;
        this.data.settings.data = obj.settings;
        this.data.started = true;

        if(this.data.settings.type){ //send or get set of functions
            this.funlist.startSend();
        }else{
            this.funlist.startGet();
        }
    }

    funlist = {
        startSend: async () => {  // using arrow function
            const keys = await this.generateKeys();
            this.data.keys["priKey"] = keys.privateKeyBase64;
            this.data.keys["pubKey"] = keys.publicKeyBase64;
            this.data.keys["priKeySign"] = keys.hashPrivateHex;
            this.data.keys["pubKeySign"] = keys.hashPublicHex;
            let message = {
                timeOut: this.data.settings.data.timeOut,
                pubKey: this.data.keys.pubKey,
                verify: this.data.settings.data.verify
            };
            socket.emit('changeSendReq', message);
        },
        startGet: () => {  //first actions to do if GET
            console.log(this.data.settings.data.code)
            socket.emit('changeGetReq', this.data.settings.data.code);
        },
        startSendResp: (msg) => {  //recive responce after being created
            //#FIX if msg.status !== true => error
            this.data.changeId = msg.changeId;
            console.log("\n\n\n")
            console.log("your change code:",this.data.changeId)
            console.log("your session expires at: TIMER сделай сам))")
            console.log("connection id:",socket.id)
            console.log("session id:",socket.io.engine.id)
            console.log("private key signature:",this.data.keys.priKeySign)
            console.log("public key signature:",this.data.keys.pubKeySign)
            console.log("private key:",this.data.keys.priKey)
            console.log("public key:",this.data.keys.pubKey)
            console.log("\n\n\n")
        },
        startGetResp: (msg) => { //#FIX recive the first responce (if error => dropp error, else go)
            //error output!!!!!!!!!#FIX!!!!!!!!!!!!!!!!!!!!!!!

            let verifyinput = "";
            if(msg.verify){ //#FIX input verification prase if needed!
                verifyinput = prompt("Verification phrase for the exchange sender (type anything to prove you have connected before)");
            }

            const publicKeyPEM = 'data:application/octet-stream;base64,'+msg.pubKey; // Вставьте ваш публичный ключ в формате base64

            // (async () => {
            //     const publicKey = await this.importPublicKey(publicKeyPEM);
            //     const symmetricKey = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
            //     this.data.keys['AES'] = this.arrayBufferToBase64(symmetricKey);
            //     const encryptedKey = await this.encryptSymmetricKeyWithPublicKey(publicKey, symmetricKey);
            //     const encryptedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));
            //     const saltBase64 = this.generateSaltBase64(32)
            //     this.encryptWithPBKDF2(this.data.keys['AES'], saltBase64, verifyinput).then(encryptedBase64 => {
            //         let runner = {
            //             verify:encryptedBase64,
            //             verifySalt:saltBase64,
            //             message:encryptedKeyBase64,
            //         }
            //         socket.emit('changeGetterResp', runner);
            //     });

            // })();

            async function performKeyExchange() {
                const publicKey = await this.importPublicKey(publicKeyPEM);
                const symmetricKey = crypto.getRandomValues(new Uint8Array(32)); // 256-bit key
                this.data.keys['AES'] = this.arrayBufferToBase64(symmetricKey);
                const encryptedKey = await this.encryptSymmetricKeyWithPublicKey(publicKey, symmetricKey);
                const encryptedKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedKey)));
                const saltBase64 = this.generateSaltBase64(32)
                const encryptedBase64 = await this.encryptWithPBKDF2(this.data.keys['AES'], saltBase64, verifyinput);
                
                let runner = {
                    verify: encryptedBase64,
                    verifySalt: saltBase64,
                    message: encryptedKeyBase64,
                }
                socket.emit('changeGetterResp', runner);
            }


            performKeyExchange.call(this);




        },
        sendRespWithKey:(msg) => { // sender recive enc aes key from getter
            this.decryptUsingPrivateKey(msg.message, this.data.keys.priKey).then(decryptedKeyBase64 => {
                this.data.keys['AES'] = decryptedKeyBase64;
                this.decryptWithPBKDF2(decryptedKeyBase64, msg.verifySalt, msg.verify)
                    .then(decryptedText => {
                        console.log("Decrypted Text:", decryptedText) 
                        if(!this.data.settings.data.passDef){
                            this.data.settings.data.passSet.password = this.generatePassword(
                                this.data.settings.data.passSet.length,
                                this.data.settings.data.passSet.upp,
                                this.data.settings.data.passSet.num,
                                this.data.settings.data.passSet.sym
                                )
                        }
                        let globalMassge = {
                            chatKey:this.data.settings.data.passSet.password,
                            chatId:this.data.settings.data.chatId,
                            method:this.data.settings.data.method,
                            verify:this.data.settings.data.verify,
                            verifyText:decryptedText,
                            changeId:this.data.changeId,
                            PublicKeySign:this.data.keys.priKeySign,
                            PrivateKeySign:this.data.keys.pubKeySign,
                        }
                        const saltBase64 = this.generateSaltBase64(64)
                        this.encryptWithPBKDF2(this.data.keys['AES'], saltBase64, JSON.stringify(globalMassge)).then(encryptedBase64 => {
                            console.log(encryptedBase64);
                            let globalRanner = {
                                exchangeId:this.data.changeId,
                                message:encryptedBase64,
                                public_key:this.data.keys.pubKeySign,
                                private_key:this.data.keys.priKeySign,
                                session_time:this.data.settings.data.timeOut,
                                salt:saltBase64
                            }
                            socket.emit('GlobalExchange', globalRanner);
                        });
                    })
                    .catch(error => {
                        //#FIX drop errer if decripted incorredctly
                        console.error("Decryption Error:", error);
                    });
            });
        },
        final: (msg)=> {
            if(!this.data.started){ //cahnge here!!!!!!!
                alert("Something is wrang! Reload the page or try not to use Change before reload");
                return;
            }
            this.decryptWithPBKDF2(this.data.keys.AES, msg.salt, msg.message).then(decryptedText => {
                let out = JSON.parse(decryptedText)
                console.log(out)
                //final output
                console.log("\n\n\n") //#FIX check redundency for XSS!!!!
                console.log("chat key:",out.chatKey)
                console.log("chat Id:",out.chatId)
                console.log("verification To Be displayed:",out.verify)
                console.log("verification phrase:",out.verifyText)
                console.log("Exchange Data:",this.jsonToFormattedString(out))
                console.log("Exchange Data (2nd oart):",this.jsonToFormattedString(msg))
                console.log("\nEND here!")
                console.log("\n\n\n")
            })
            .catch(error => {
                //#FIX drop errer if decripted incorredctly
                console.error("Decryption Error:", error);
            });
        }
    }




    async generateKeys() {
        const crypto = window.crypto || window.msCrypto;
        const config = {
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256"
        };
        const keyPair = await crypto.subtle.generateKey(config, true, ["sign", "verify"]);
        const exportedPrivateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        const privateKeyBase64 = this.arrayBufferToBase64(exportedPrivateKey);
        const exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const publicKeyBase64 = this.arrayBufferToBase64(exportedPublicKey);
        const hashPrivate = await crypto.subtle.digest("SHA-256", exportedPrivateKey);
        const hashPrivateArray = Array.from(new Uint8Array(hashPrivate));
        const hashPrivateHex = hashPrivateArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        const hashPublic = await crypto.subtle.digest("SHA-256", exportedPublicKey);
        const hashPublicArray = Array.from(new Uint8Array(hashPublic));
        const hashPublicHex = hashPublicArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return {
            privateKeyBase64,
            publicKeyBase64,
            hashPrivateHex,
            hashPublicHex
        };
    }
    
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const result = btoa(binary);
        return result;
    }
    
    async importPublicKey(pem) {
        const fetchArrayBuffer = async (url) => {
            const response = await fetch(url);
            return await response.arrayBuffer();
        };
        const publicKeyBuffer = await fetchArrayBuffer(pem);
        const importedPublicKey = await crypto.subtle.importKey(
            'spki',
            publicKeyBuffer,
            {
                name: 'RSA-OAEP',
                hash: 'SHA-256'
            },
            true,
            ['encrypt']
        );
        return importedPublicKey;
    }

    
    async encryptSymmetricKeyWithPublicKey(publicKey, symmetricKey) {
        const encryptedSymmetricKey = await crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP'
            },
            publicKey,
            symmetricKey
        );
        return encryptedSymmetricKey;
    }
    
    
    async decryptUsingPrivateKey(encryptedKeyBase64, privateKeyBase64) {
        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
        function arrayBufferToBase64(buffer) {
            const binary = Array.from(new Uint8Array(buffer))
                .map(byte => String.fromCharCode(byte))
                .join('');
            return btoa(binary);
        }
        async function importPrivateKey(pkcs8Base64) {
            const pkcs8ArrayBuffer = base64ToArrayBuffer(pkcs8Base64);
            return await window.crypto.subtle.importKey(
                "pkcs8",
                pkcs8ArrayBuffer,
                {
                    name: "RSA-OAEP",
                    hash: "SHA-256"
                },
                true,
                ["decrypt"]
            );
        }
        const encryptedData = base64ToArrayBuffer(encryptedKeyBase64);
        const privateKey = await importPrivateKey(privateKeyBase64);
        const decryptedArrayBuffer = await window.crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );
        return arrayBufferToBase64(decryptedArrayBuffer);
    }

    
    async encryptWithPBKDF2(password, saltBase64, plainText) {
        function base64ToArrayBuffer(base64) {
            const binaryString = atob(base64);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        }
        function arrayBufferToBase64(buffer) {
            const binary = Array.from(new Uint8Array(buffer))
                .map(byte => String.fromCharCode(byte))
                .join('');
            return btoa(binary);
        }
        const encoder = new TextEncoder();
        const importedPassword = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        const saltBuffer = base64ToArrayBuffer(saltBase64);
        const derivedKey = await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: saltBuffer,
                iterations: 100000,
                hash: 'SHA-256'
            },
            importedPassword,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt']
        );
        const data = encoder.encode(plainText);
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            derivedKey,
            data
        );
        const combinedBuffer = new Uint8Array(12 + encryptedBuffer.byteLength);
        combinedBuffer.set(iv, 0);
        combinedBuffer.set(new Uint8Array(encryptedBuffer), 12);
        return arrayBufferToBase64(combinedBuffer);
    }


    generateSaltBase64(length = 16) {
        const salt = window.crypto.getRandomValues(new Uint8Array(length));
        const saltBase64 = Array.from(salt)
            .map(b => String.fromCharCode(b))
            .join('');
        return btoa(saltBase64);
    }
    

    async decryptWithPBKDF2(password, saltBase64, encryptedTextBase64) {
        const enc = new TextEncoder();
        const dec = new TextDecoder();
        const passwordBuffer = enc.encode(password);
        const saltBuffer = new Uint8Array(atob(saltBase64).split("").map(char => char.charCodeAt(0)));
        const encryptedBuffer = new Uint8Array(atob(encryptedTextBase64).split("").map(char => char.charCodeAt(0)));
        const keyMaterial = await window.crypto.subtle.importKey(
            "raw",
            passwordBuffer,
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );   
        const cryptoKey = await window.crypto.subtle.deriveKey(
            { name: "PBKDF2", salt: saltBuffer, iterations: 100000, hash: "SHA-256" },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = encryptedBuffer.slice(0, 12);
        const actualEncryptedBuffer = encryptedBuffer.slice(12);
        const decryptedBuffer = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            cryptoKey,
            actualEncryptedBuffer
        );
        return dec.decode(decryptedBuffer);
    }
    

    jsonToFormattedString(json) {
        let result = '';
        for (let key in json) {
            result += `${key}:${json[key]}\n`;
        }
        return result;
    }

    
    generatePassword(length, useUppercase, useNumbers, useSymbols) {
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()-_=+{}[]|;:,.<>?';
        let characters = lowerChars;
        if (useUppercase) {characters += upperChars;}
        if (useNumbers) {characters += numberChars;}
        if (useSymbols) {characters += symbolChars;}
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            password += characters[randomIndex];
        }
        return password;
    }

}







/*
data
  -settings
      --type => bool true=send/false=get
      --settings
        ---method => bool true=code/false=link
        ---timeOut => int in mins
        ---chatId => int
        ---verify: => bool

        ---passDef => bool true=def/false=gen
        ---passSet
            ----If true - 
                password - string
            ----If false -
                length: int
                upp - true/false
                num - true/false
                sym - true/false







globalMassge => sample of final message


        */