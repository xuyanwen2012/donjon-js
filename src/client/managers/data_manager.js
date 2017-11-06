let $dataTilesets = null;
let $dataSystem = null;
let $dataMapInfos = null;
let $dataMap = null;

let $gameSystem = null;
let $gameScreen = null;
let $gameMap = null;

//let $gamePlayer = null;

class DataManager {
  constructor() {
    throw new Error('This is a static class');
  }

  static loadDatabase() {
    for (let i = 0; i < this._databaseFiles.length; i++) {
      const name = this._databaseFiles[i].name;
      const src = this._databaseFiles[i].src;
      this.loadDataFile(name, src);
    }
  }

  static loadDataFile(name, src) {
    const xhr = new XMLHttpRequest();
    const url = `data/${src}`;
    console.log(url);
    xhr.open('GET', url);
    xhr.overrideMimeType('application/json');
    xhr.onload = () => {
      if (xhr.status < 400) {
        window[name] = JSON.parse(xhr.responseText);
        DataManager.onLoad(window[name]);
      }
    };
    xhr.onerror = this._mapLoader || (() => {
      DataManager._errorUrl = DataManager._errorUrl || url;
    });
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
      const filename = 'Map%1.json'.format(mapId.padZero(3));
      this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
      this.loadDataFile('$dataMap', filename);
      console.log($dataMap);
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
      for (const data of array) {
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
    const re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (; ;) {
      const match = re.exec(data.note);
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
      throw new Error(`Failed to load: ${DataManager._errorUrl}`);
    }
  }

  /**
   * TODO: Should Create Donjon.System, Donjon.Screen and Donjon.Map.
   */
  static createDonjonObjects() {
    $gameSystem = new Game_System();
    $gameScreen = new Game_Screen();
    $gameMap = new Game_Map();
    //$gamePlayer = new Game_Player();
  }

  static setupNewGame() {
    this.createDonjonObjects();
    // this.selectSavefileForNewGame();
    // $gameParty.setupStartingMembers();
    // $gamePlayer.reserveTransfer($dataSystem.startMapId,
    //   $dataSystem.startX, $dataSystem.startY);
    //$gamePlayer.reserveTransfer(1, 5, 5);
    Graphics.frameCount = 0;
  }

}

DataManager._errorUrl = null;

DataManager._databaseFiles = [
  {name: '$dataTilesets', src: 'Tilesets.json'},
  {name: '$dataSystem', src: 'System.json'},
  {name: '$dataMapInfos', src: 'MapInfos.json'}
];