export default class Database {

  constructor() {
    this.dataMapInfos = null;
    this.dataSystem = null;
    this.dataTilesets = null;
    this.dataMap = null;
  }

  isReady() {
    return this.dataMapInfos && this.dataSystem &&
      this.dataTilesets && this.dataMap;
  }

  setMapInfos(data) {
    this.dataMapInfos = data;
  }

  setSystem(data) {
    this.dataSystem = data;
  }

  setTilesets(data) {
    this.dataTilesets = data;
  }

  setMap(data) {
    this.dataMap = data;
  }

  getMapInfos() {
    return this.dataMapInfos;
  }

  getSystem() {
    return this.dataSystem;
  }

  getTilesets() {
    return this.dataTilesets;
  }

  getMap() {
    return this.dataMap;
  }

  makeEmptyMap() {
    this.dataMap = {};
    this.dataMap.data = [];
    this.dataMap.events = [];
    this.dataMap.width = 100;
    this.dataMap.height = 100;
    this.dataMap.scrollType = 3;
  }
}