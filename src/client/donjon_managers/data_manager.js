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
  static get databaseFiles() {
    return [
      {name: '$dataTilesets', src: 'Tilesets.json'},
      {name: '$dataSystem', src: 'System.json'},
      {name: '$dataMapInfos', src: 'MapInfos.json'},
    ]
  }

  static loadDatabase() {
    for (let i = 0; i < this.databaseFiles.length; i++) {
      let name = this.databaseFiles[i].name;
      let src = this.databaseFiles[i].src;
      this.loadDataFile(name, src);
    }
  }

  /**
   * @param name {string}
   * @param src {string}
   */
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
    for (let i = 0; i < this.databaseFiles.length; i++) {
      if (!window[this.databaseFiles[i].name]) {
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
      SceneBoot.loadSystemImages();
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
    $game = new Donjon.Game();
  }

  static setupNewGame() {
    this.createGameObjects();
    Graphics.frameCount = 0;
  }

}

DataManager._errorUrl = null;
