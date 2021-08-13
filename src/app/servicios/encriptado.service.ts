import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class EncriptadoService {

  constructor() { }
  key ='clave';
  encrip=true;
  private encript(text: string, key: string) {


    
    var iv = CryptoJS.lib.WordArray.random(16);// the reason to be 16, please read on `encryptMethod` property.
    //key = 'sfloserv2021@';
    var salt = CryptoJS.lib.WordArray.random(256);
    var iterations = 999;
    var encryptMethodLength = 64;// example: AES number is 256 / 4 = 64
    var hashKey = CryptoJS.PBKDF2(key, salt, { 'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength / 8), 'iterations': iterations });

    var encrypted = CryptoJS.AES.encrypt(text, hashKey, { 'mode': CryptoJS.mode.CBC, 'iv': iv });
    var encryptedString = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);


    var output = {
      'ciphertext': encryptedString,
      'iv': CryptoJS.enc.Hex.stringify(iv),
      'salt': CryptoJS.enc.Hex.stringify(salt),
      'iterations': iterations
    };

    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(output)));


  }
  private decrypt(encryptedString:any, key: string) {
    var json = JSON.parse(CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(encryptedString)));
    //key = 'sfloserv2021@';
    var salt = CryptoJS.enc.Hex.parse(json.salt);
    var iv = CryptoJS.enc.Hex.parse(json.iv);

    var encrypted = json.ciphertext;// no need to base64 decode.

    var iterations = parseInt(json.iterations);
    if (iterations <= 0) {
      iterations = 999;
    }
    var encryptMethodLength = (64);// example: AES number is 256 / 4 = 64
    var hashKey = CryptoJS.PBKDF2(key, salt, { 'hasher': CryptoJS.algo.SHA512, 'keySize': (encryptMethodLength / 8), 'iterations': iterations });

    var decrypted = CryptoJS.AES.decrypt(encrypted, hashKey, { 'mode': CryptoJS.mode.CBC, 'iv': iv });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }// decrypt
  encriptar(text: string) {


    var textEncrip;
    if(this.encrip){
      textEncrip=  this.encript(text, this.key)
    }else{
      textEncrip=text;
    }
    return textEncrip;


    // return this.encript(text,this.key);
  }
  desencriptar(text: string, isString: boolean) {
    var textDecrip;
    if(this.encrip){
      textDecrip = this.decrypt(text, this.key);
    }else{
      textDecrip = text;
    }
  
    if (isString) {
      return textDecrip;
    } else {
      return JSON.parse(textDecrip);
    }

  }
}
