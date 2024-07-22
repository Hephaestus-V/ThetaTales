import * as crypto from 'crypto';
import * as secp256k1 from '@noble/secp256k1';
import { Buffer } from 'buffer';

interface EncryptedKey {
  iv: string;
  ephemPublicKey: string;
  ciphertext: string;
  mac: string;
}

interface EncryptedFileResult {
  encryptedFile: Buffer;
  storagestring: string;
}

export async function encryptFile(fileBuffer: Buffer, platformPublicKey: string): Promise<EncryptedFileResult> {
  const symmetricKey = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
 
  const encryptedFile = Buffer.concat([iv, cipher.update(fileBuffer), cipher.final()]);

  // Rest of the function remains the same
  const ephemPrivateKey = secp256k1.utils.randomPrivateKey();
  const ephemPublicKey = secp256k1.getPublicKey(ephemPrivateKey);

  const sharedSecret = secp256k1.getSharedSecret(ephemPrivateKey, Buffer.from(platformPublicKey, 'hex'));
  const derivedKey = crypto.createHash('sha256').update(sharedSecret).digest();

  const keyEncryptionCipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
  const encryptedSymmetricKey = Buffer.concat([keyEncryptionCipher.update(symmetricKey), keyEncryptionCipher.final()]);

  const mac = crypto.createHmac('sha256', derivedKey).update(encryptedSymmetricKey).digest();

  const encryptedKeyForStorage: EncryptedKey = {
    iv: iv.toString('hex'),
    ephemPublicKey: Buffer.from(ephemPublicKey).toString('hex'),
    ciphertext: encryptedSymmetricKey.toString('hex'),
    mac: mac.toString('hex')
  };

  const storagestring = JSON.stringify(encryptedKeyForStorage);
  return { encryptedFile, storagestring };
}

export async function decryptSymmetricKey(encryptedKeyString: EncryptedKey): Promise<Buffer> {
  const { iv, ephemPublicKey, ciphertext, mac } = encryptedKeyString;

  // Perform ECDH
  const sharedSecret = secp256k1.getSharedSecret(
    Buffer.from(process.env.PLATFORM_PRIVATE_KEY!, 'hex'),
    Buffer.from(ephemPublicKey, 'hex')
  );
  const derivedKey = crypto.createHash('sha256').update(sharedSecret).digest();

  // Verify MAC
  const computedMac = crypto.createHmac('sha256', derivedKey)
    .update(Buffer.from(ciphertext, 'hex'))
    .digest();

  if (!crypto.timingSafeEqual(computedMac, Buffer.from(mac, 'hex'))) {
    throw new Error('MAC verification failed');
  }

  // Decrypt the symmetric key
  const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, Buffer.from(iv, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(ciphertext, 'hex')), decipher.final()]);
}

export function decryptFile(encryptedFile: Buffer, symmetricKey: Buffer): Buffer {
  const iv = encryptedFile.slice(0, 16);
  const encryptedData = encryptedFile.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
  return Buffer.concat([decipher.update(encryptedData), decipher.final()]);
}