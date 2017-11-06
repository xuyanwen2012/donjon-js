/**
 * The static class that manages the database and game objects.
 */
class DataManager {

  /**
   * @constructor
   */
  constructor() {
    throw new Error("This is a static class");
  }

  /**
   * @type {Array}
   * @private
   */
  static get _databaseFiles() {
    return [
      {name: '$dataTilesets', src: 'Tilesets.json'},
      {name: '$dataSystem', src: 'System.json'},
      {name: '$dataMapInfos', src: 'MapInfos.json'},
      //custom data
      // {name: '$dataArmors', src: 'Donjon_Armors.json'},
      // {name: '$dataWeapons', src: 'Donjon_Weapons.json'},
      // {name: '$dataBattlers', src: 'Donjon_Battlers.json'},
      // {name: '$dataSourceConfig', src: 'Donjon_SourceConfig.json'},
      // {name: '$dataAnimations', src: 'Donjon_Animations.json'}
    ]
  }

  static loadDatabase() {
    for (let i = 0; i < this._databaseFiles.length; i++) {
      let name = this._databaseFiles[i].name;
      let src = this._databaseFiles[i].src;
      this.loadDataFile(name, src);
    }
  }

  static loadDataFile(name, src) {
    let xhr = new XMLHttpRequest();
    let url = 'data/' + src;
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = function () {
      if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        DataManager.onLoad(window[name]);
      }
    };
    xhr.onerror = this._mapLoader || function () {
      DataManager._errorUrl = DataManager._errorUrl || url;
    };
    window[name] = null;
    xhr.send();
  }

  static isDatabaseLoaded() {
    this.checkError();
    for (let i = 0; i < this._databaseFiles.length; i++) {
      if (!window[this._databaseFiles[i].name]) {
        return false;
      }
    }
    return true;
  }

  static loadMapData(mapId) {
    if (mapId > 0) {
      let filename = 'Map%1.json'.format(mapId.padZero(3));
      this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
      this.loadDataFile('$dataMap', filename);
    } else {
      this.makeEmptyMap();
    }
  }

  static makeEmptyMap() {
    $dataMap = {};
    $dataMap.data = [];
    $dataMap.events = [];
    $dataMap.width = 100;
    $dataMap.height = 100;
    $dataMap.scrollType = 3;
  }

  static isMapLoaded() {
    this.checkError();
    return !!$dataMap;
  }

  static onLoad(object) {
    let array;
    if (object === $dataMap) {
      this.extractMetadata(object);
      array = object.events;
    } else {
      array = object;
    }
    if (Array.isArray(array)) {
      for (let i = 0; i < array.length; i++) {
        let data = array[i];
        if (data && data.note !== undefined) {
          this.extractMetadata(data);
        }
      }
    }
    if (object === $dataSystem) {
      Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
      Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
      Scene_Boot.loadSystemImages();
    }
  }

  static extractMetadata(data) {
    let re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (; ;) {
      let match = re.exec(data.note);
      if (match) {
        if (match[2] === ':') {
          data.meta[match[1]] = match[3];
        } else {
          data.meta[match[1]] = true;
        }
      } else {
        break;
      }
    }
  }

  static checkError() {
    if (DataManager._errorUrl) {
      throw new Error('Failed to load: ' + DataManager._errorUrl);
    }
  }

  static createGameObjects() {
    //$gameTemp = new Game_Temp();
    $gameSystem = new GameSystem();
    $gameScreen = new GameScreen();
    /**
     * @type {GameMap}
     */
    $gameMap = new GameMap();
  }


  static setupNewGame() {
    this.createGameObjects();
    this.selectSavefileForNewGame();
    // $gameParty.setupStartingMembers();
    // $gamePlayer.reserveTransfer($dataSystem.startMapId,
    //     $dataSystem.startX, $dataSystem.startY);
    Graphics.frameCount = 0;
  }

  static loadGlobalInfo() {
    let json;
    try {
      json = StorageManager.load(0);
    } catch (e) {
      console.error(e);
      return [];
    }
    if (json) {
      let globalInfo = JSON.parse(json);
      for (let i = 1; i <= this.maxSavefiles(); i++) {
        if (!StorageManager.exists(i)) {
          delete globalInfo[i];
        }
      }
      return globalInfo;
    } else {
      return [];
    }
  }

  static saveGlobalInfo(info) {
    StorageManager.save(0, JSON.stringify(info));
  }

  static isThisGameFile(savefileId) {
    let globalInfo = this.loadGlobalInfo();
    if (globalInfo && globalInfo[savefileId]) {
      if (StorageManager.isLocalMode()) {
        return true;
      } else {
        let savefile = globalInfo[savefileId];
        return (savefile.globalId === this._globalId &&
          savefile.title === $dataSystem.gameTitle);
      }
    } else {
      return false;
    }
  }

  static isAnySavefileExists() {
    let globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
      for (let i = 1; i < globalInfo.length; i++) {
        if (this.isThisGameFile(i)) {
          return true;
        }
      }
    }
    return false;
  }

  static latestSavefileId() {
    let globalInfo = this.loadGlobalInfo();
    let savefileId = 1;
    let timestamp = 0;
    if (globalInfo) {
      for (let i = 1; i < globalInfo.length; i++) {
        if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
          timestamp = globalInfo[i].timestamp;
          savefileId = i;
        }
      }
    }
    return savefileId;
  }

  static loadAllSavefileImages() {
    let globalInfo = this.loadGlobalInfo();
    if (globalInfo) {
      for (let i = 1; i < globalInfo.length; i++) {
        if (this.isThisGameFile(i)) {
          let info = globalInfo[i];
          this.loadSavefileImages(info);
        }
      }
    }
  }

  static loadSavefileImages(info) {
    if (info.characters) {
      for (let i = 0; i < info.characters.length; i++) {
        ImageManager.reserveCharacter(info.characters[i][0]);
      }
    }
    if (info.faces) {
      for (let j = 0; j < info.faces.length; j++) {
        ImageManager.reserveFace(info.faces[j][0]);
      }
    }
  }

  static maxSavefiles() {
    return 20;
  }

  static saveGame(savefileId) {
    try {
      StorageManager.backup(savefileId);
      return this.saveGameWithoutRescue(savefileId);
    } catch (e) {
      console.error(e);
      try {
        StorageManager.remove(savefileId);
        StorageManager.restoreBackup(savefileId);
      } catch (e2) {
      }
      return false;
    }
  }

  static loadGame(savefileId) {
    try {
      return this.loadGameWithoutRescue(savefileId);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  static loadSavefileInfo(savefileId) {
    let globalInfo = this.loadGlobalInfo();
    return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
  }

  static lastAccessedSavefileId() {
    return this._lastAccessedId;
  }

  static saveGameWithoutRescue(savefileId) {
    let json = JsonEx.stringify(this.makeSaveContents());
    if (json.length >= 200000) {
      console.warn('Save data too big!');
    }
    StorageManager.save(savefileId, json);
    this._lastAccessedId = savefileId;
    let globalInfo = this.loadGlobalInfo() || [];
    globalInfo[savefileId] = this.makeSavefileInfo();
    this.saveGlobalInfo(globalInfo);
    return true;
  }

  static loadGameWithoutRescue(savefileId) {
    let globalInfo = this.loadGlobalInfo();
    if (this.isThisGameFile(savefileId)) {
      let json = StorageManager.load(savefileId);
      this.createGameObjects();
      this.extractSaveContents(JsonEx.parse(json));
      this._lastAccessedId = savefileId;
      return true;
    } else {
      return false;
    }
  }

  static selectSavefileForNewGame() {
    let globalInfo = this.loadGlobalInfo();
    this._lastAccessedId = 1;
    if (globalInfo) {
      let numSavefiles = Math.max(0, globalInfo.length - 1);
      if (numSavefiles < this.maxSavefiles()) {
        this._lastAccessedId = numSavefiles + 1;
      } else {
        let timestamp = Number.MAX_VALUE;
        for (let i = 1; i < globalInfo.length; i++) {
          if (!globalInfo[i]) {
            this._lastAccessedId = i;
            break;
          }
          if (globalInfo[i].timestamp < timestamp) {
            timestamp = globalInfo[i].timestamp;
            this._lastAccessedId = i;
          }
        }
      }
    }
  }

  /**
   * @return {{}}
   */
  static makeSavefileInfo() {
    let info = {};
    info.globalId = this._globalId;
    info.title = $dataSystem.gameTitle;
    //info.characters = $gameParty.charactersForSavefile();
    //info.faces = $gameParty.facesForSavefile();
    info.playtime = $gameSystem.playtimeText();
    info.timestamp = Date.now();
    return info;
  }

  /**
   * @return {{}}
   */
  static makeSaveContents() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    const contents = {};
    contents.system = $gameSystem;
    contents.screen = $gameScreen;
    contents.map = $gameMap;
    return contents;
  }

  /**
   * @param contents
   */
  static extractSaveContents(contents) {
    $gameSystem = contents.system;
    $gameScreen = contents.screen;
    $gameMap = contents.map;
  }

}

DataManager._lastAccessedId = 1;
DataManager._errorUrl = null;
DataManager._globalId = 'RPGMV';