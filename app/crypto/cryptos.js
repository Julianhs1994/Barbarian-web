import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);  // clave secreta

function encryptUrl(url) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  
    let encrypted = cipher.update(url, 'utf8', 'hex');
    encrypted += cipher.final('hex');
  
    return `${iv.toString('hex')}:${encrypted}`;
  }
  
function decryptUrl(encryptedUrl) {
    const [iv, encryptedText] = encryptedUrl.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), Buffer.from(iv, 'hex'));
  
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
  
    return decrypted;
}
  
export const methodsEnc = {
    encryptUrl,
    decryptUrl
}