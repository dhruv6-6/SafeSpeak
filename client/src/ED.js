const cryptoKeyRSA = async (keyBuffer, isPrivateKey) => {
    const keyFormat = isPrivateKey ? "pkcs8" : "spki";
    const keyType = isPrivateKey ? "decrypt" : "encrypt";

    const key = await crypto.subtle.importKey(
        keyFormat,
        keyBuffer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" },
        },
        true,
        [keyType]
    );

    return key;
};
const generateRSAKeys = async () => {
    const keyPair = await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: { name: "SHA-256" },
        },
        true,
        ["encrypt", "decrypt"]
    );
    const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    );
    return { publicKey, privateKey };
};
const encrypt = async (publicKey, plaintext) => {
    publicKey = await cryptoKeyRSA(publicKey, 0);
    console.log(publicKey);
    var encodedPlaintext = new TextEncoder().encode(plaintext);
    const encryptedData = await crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedPlaintext
    );
    return encryptedData;
};
const decrypt = async (privateKey, encryptedData) => {
    privateKey = await cryptoKeyRSA(privateKey, 1);
    const decryptedData = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        importedPrivateKey,
        encodedEncryptedData
    );
    return new TextDecoder().decode(decryptedData);
};
const arrayBufferToBase64 = async (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
};
const base64ToArrayBuffer = (base64) => {
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        buffer[i] = binary.charCodeAt(i);
    }
    return buffer.buffer;
};

const deriveKeyFromPassword = async (password, salt) => {
    const encoder = new TextEncoder();
    const passwordData = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        passwordData,
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    const derivedKey = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt,
            iterations: 100000,
            hash: { name: "SHA-256" },
        },
        keyMaterial,
        256
    );

    return crypto.subtle.importKey(
        "raw",
        derivedKey,
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
    );
};
const encryptPrivateKey = async (privateKey, secretString) => {
    privateKey = arrayBufferToBase64(privateKey);
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const secretKey = await deriveKeyFromPassword(secretString, salt);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        secretKey,
        new TextEncoder().encode(privateKey)
    );

    const saltBase64 = await arrayBufferToBase64(salt);
    const ivBase64 = await arrayBufferToBase64(iv);
    const encryptedDataBase64 = await arrayBufferToBase64(encryptedData);

    return `${saltBase64}.${ivBase64}.${encryptedDataBase64}`;
};
const decryptPrivateKey = async (encryptedPrivateKey, secretString) => {
    const [saltBase64, ivBase64, encryptedDataBase64] =
        encryptedPrivateKey.split(".");
    const salt =  base64ToArrayBuffer(saltBase64);
    const iv =  base64ToArrayBuffer(ivBase64);
    const encryptedData = base64ToArrayBuffer(encryptedDataBase64);
    const secretKey = await deriveKeyFromPassword(secretString, salt);
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
        },
        secretKey,
        encryptedData
    );
    console.log(decryptedData);
    return new TextDecoder().decode(decryptedData);
};