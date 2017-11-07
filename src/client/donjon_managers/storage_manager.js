/**
 * The static class that manages storage for saving game data.
 */
// import fs from "fs";
//import path from "path";


class StorageManager {
  /** @namespace process.mainModule */
  /**
   * @constructor
   */
  constructor() {
    throw new Error('This is a static class');
  }

  /**
   * @param savefileId {Integer}
   * @param json {json}
   */
  static save(savefileId, json) {
    if (this.isLocalMode()) {
      this.saveToLocalFile(savefileId, json);
    } else {
      this.saveToWebStorage(savefileId, json);
    }
  }

  /**
   * @param savefileId {Integer}
   */
  static load(savefileId) {
    if (this.isLocalMode()) {
      return this.loadFromLocalFile(savefileId);
    } else {
      return this.loadFromWebStorage(savefileId);
    }
  }

  /**
   * @param savefileId {Integer}
   */
  static exists(savefileId) {
    if (this.isLocalMode()) {
      return this.localFileExists(savefileId);
    } else {
      return this.webStorageExists(savefileId);
    }
  }

  static remove(savefileId) {
    if (this.isLocalMode()) {
      this.removeLocalFile(savefileId);
    } else {
      this.removeWebStorage(savefileId);
    }
  }

  /**
   * @param savefileId {Integer}
   */
  static backup(savefileId) {
    if (this.exists(savefileId)) {
      if (this.isLocalMode()) {
        let data = this.loadFromLocalFile(savefileId);
        let compressed = LZString.compressToBase64(data);
        let fs = require('fs');
        let dirPath = this.localFileDirectoryPath();
        let filePath = this.localFilePath(savefileId) + ".bak";
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, compressed);
      } else {
        let data = this.loadFromWebStorage(savefileId);
        let compressed = LZString.compressToBase64(data);
        let key = this.webStorageKey(savefileId) + "bak";
        localStorage.setItem(key, compressed);
      }
    }
  }

  /**
   * @param savefileId
   */
  static backupExists(savefileId) {
    if (this.isLocalMode()) {
      return this.localFileBackupExists(savefileId);
    } else {
      return this.webStorageBackupExists(savefileId);
    }
  }

  static cleanBackup(savefileId) {
    if (this.backupExists(savefileId)) {
      if (this.isLocalMode()) {
        //let dirPath = this.localFileDirectoryPath();
        let fs = require('fs');
        let filePath = this.localFilePath(savefileId);
        fs.unlinkSync(filePath + ".bak");
      } else {
        let key = this.webStorageKey(savefileId);
        localStorage.removeItem(key + "bak");
      }
    }
  }

  static restoreBackup(savefileId) {
    if (this.backupExists(savefileId)) {
      if (this.isLocalMode()) {
        let data = this.loadFromLocalBackupFile(savefileId);
        let compressed = LZString.compressToBase64(data);
        let fs = require('fs');
        let dirPath = this.localFileDirectoryPath();
        let filePath = this.localFilePath(savefileId);
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath);
        }
        fs.writeFileSync(filePath, compressed);
        fs.unlinkSync(filePath + ".bak");
      } else {
        let data = this.loadFromWebStorageBackup(savefileId);
        let compressed = LZString.compressToBase64(data);
        let key = this.webStorageKey(savefileId);
        localStorage.setItem(key, compressed);
        localStorage.removeItem(key + "bak");
      }
    }
  }

  static isLocalMode() {
    return Utils.isNwjs();
  }

  static saveToLocalFile(savefileId, json) {
    let data = LZString.compressToBase64(json);
    let fs = require('fs');
    let dirPath = this.localFileDirectoryPath();
    let filePath = this.localFilePath(savefileId);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    fs.writeFileSync(filePath, data);
  }

  static loadFromLocalFile(savefileId) {
    let data = null;
    let filePath = this.localFilePath(savefileId);
    let fs = require('fs');
    if (fs.existsSync(filePath)) {
      data = fs.readFileSync(filePath, {encoding: 'utf8'});
    }
    return LZString.decompressFromBase64(data);
  }

  /**
   * @param savefileId
   */
  static loadFromLocalBackupFile(savefileId) {
    let data = null;
    let filePath = this.localFilePath(savefileId) + ".bak";
    let fs = require('fs');
    if (fs.existsSync(filePath)) {
      data = fs.readFileSync(filePath, {encoding: 'utf8'});
    }
    return LZString.decompressFromBase64(data);
  }

  /**
   * @param savefileId
   */
  static localFileBackupExists(savefileId) {
    let fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId) + ".bak");
  }

  /**
   * @param savefileId
   */
  static localFileExists(savefileId) {
    let fs = require('fs');
    return fs.existsSync(this.localFilePath(savefileId));
  }

  /**
   * @param savefileId
   */
  static removeLocalFile(savefileId) {
    const filePath = this.localFilePath(savefileId);
    let fs = require('fs');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  static saveToWebStorage(savefileId, json) {
    let key = this.webStorageKey(savefileId);
    let data = LZString.compressToBase64(json);
    localStorage.setItem(key, data);
  }

  /**
   * @param savefileId
   * @return {*}
   */
  static loadFromWebStorage(savefileId) {
    let key = this.webStorageKey(savefileId);
    let data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
  }

  /**
   * @param savefileId
   * @return {*}
   */
  static loadFromWebStorageBackup(savefileId) {
    let key = this.webStorageKey(savefileId) + "bak";
    let data = localStorage.getItem(key);
    return LZString.decompressFromBase64(data);
  }

  /**
   * @param savefileId
   * @return {boolean}
   */
  static webStorageBackupExists(savefileId) {
    let key = this.webStorageKey(savefileId) + "bak";
    return !!localStorage.getItem(key);
  }

  /**
   * @param savefileId
   * @return {boolean}
   */
  static webStorageExists(savefileId) {
    let key = this.webStorageKey(savefileId);
    return !!localStorage.getItem(key);
  }

  /**
   * @param savefileId
   */
  static removeWebStorage(savefileId) {
    let key = this.webStorageKey(savefileId);
    localStorage.removeItem(key);
  }

  static localFileDirectoryPath() {
    let path = require('path');
    const base = path.dirname(process.mainModule.filename);
    return path.join(base, 'save/');
  }

  /**
   * @param savefileId
   */
  static localFilePath(savefileId) {
    let name;
    if (savefileId < 0) {
      name = 'config.rpgsave';
    } else if (savefileId === 0) {
      name = 'global.rpgsave';
    } else {
      name = 'file%1.rpgsave'.format(savefileId);
    }
    return this.localFileDirectoryPath() + name;
  }

  /**
   * @param savefileId
   */
  static webStorageKey(savefileId) {
    if (savefileId < 0) {
      return 'RPG Config';
    } else if (savefileId === 0) {
      return 'RPG Global';
    } else {
      return 'RPG File%1'.format(savefileId);
    }
  }


}