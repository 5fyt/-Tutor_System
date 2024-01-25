import * as CryptoJS from 'crypto-js';
export class AESCipher {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  // 加密函数
  encrypt(plaintext: string) {
    const encrypted = CryptoJS.AES.encrypt(plaintext, this.key).toString();
    return encrypted;
  }

  // 解密函数（可选）
  decrypt(encryptedText: string) {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, this.key).toString(CryptoJS.enc.Utf8);
    return decrypted;
  }
}
