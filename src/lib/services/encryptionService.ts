import * as crypto from 'crypto';
import * as eccrypto from 'eccrypto';


interface EncryptedKey{
  iv: string;
  ephemPublicKey : string;
  ciphertext : string;
  mac : string;
}
interface EncryptedFileResult{
  encryptedFile : Buffer;
  storagestring : string;
}


export async function encryptFile(file: File ,platformPublicKey: string ) : Promise<EncryptedFileResult>{
  const symmetricKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
  const arrbuf = await file.arrayBuffer(); 
  const encryptedFile = Buffer.concat([iv, cipher.update(Buffer.from(arrbuf)), cipher.final()]);
  const encryptedSymmetricKey = await eccrypto.encrypt(Buffer.from(platformPublicKey, 'hex'), symmetricKey);
  const encryptedKeyForStorage : EncryptedKey  = {
    iv: encryptedSymmetricKey.iv.toString('hex'),
    ephemPublicKey: encryptedSymmetricKey.ephemPublicKey.toString('hex'),
    ciphertext: encryptedSymmetricKey.ciphertext.toString('hex'),
    mac: encryptedSymmetricKey.mac.toString('hex')
  };
  const storagestring = JSON.stringify(encryptedKeyForStorage);
  return { encryptedFile, storagestring };
};

export async function decryptSymmetricKey(encryptedKeyString: EncryptedKey) : Promise<Buffer>{
  const encryptedSymmetricKey = {
    iv: Buffer.from(encryptedKeyString.iv, 'hex'),
    ephemPublicKey: Buffer.from(encryptedKeyString.ephemPublicKey, 'hex'),
    ciphertext: Buffer.from(encryptedKeyString.ciphertext, 'hex'),
    mac: Buffer.from(encryptedKeyString.mac, 'hex')
  };
  return await eccrypto.decrypt(Buffer.from(process.env.PLATFORM_PRIVATE_KEY!, 'hex'), encryptedSymmetricKey);
};

export function decryptFile(encryptedFile : Buffer, symmetricKey : Buffer) : Buffer {
  const iv = encryptedFile.slice(0, 16);
  const encryptedData = encryptedFile.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
};