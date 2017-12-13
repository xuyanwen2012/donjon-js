import ObjectFactory from './game_object/object_factory';
import EventEmitter from '../managers/event_emitter';
import Manager from '../managers/manager';

export default class ObjectManager extends Manager {

  constructor() {
    super();
    /**
     * @static
     * @type {Array.<GameObject>}
     * @private
     */
    this._objects = [];

    this._factory = new ObjectFactory();
  }

  initializeListeners() {
    let self = this;
    EventEmitter.addListener('onDataFileLoaded', data =>
      self.createPrefabObjects(data));
  }

  /**
   * @private
   * @param rawJson {[{fileName}]}
   */
  createPrefabObjects(rawJson) {
    if (rawJson[0].fileName === 'GameObjects') {
      /* default extractor */
      let extractor = new Extractor(rawJson);
      this._prefabs = [null];

      /* iterate over Json objects */
      let next = extractor.getNext();
      while (next) {
        this._prefabs.push(this._factory.createObject(next));
        next = extractor.getNext();
      }
    }
  }

  /* ------------------Public functional method-------------------------- */

  /**
   * @param id {number}
   * @param position {Array.<number>=}
   * @return {GameObject}
   */
  spawnUnit(id, position) {
    const gameObject = this._factory.instantiate(this._prefabs[id], position);
    this._objects.push(gameObject);

    /* send out spawn event. */
    EventEmitter.queueEvent('onUnitSpawn', gameObject);
    return gameObject;
  }

  /* ----------------------------Game Flow----------------------------------- */

  /**
   * Should read map data, and deploy units accordingly.
   */
  setup() {
    //temp
    this.spawnUnit(1, [5, 5]);
    this.spawnUnit(2, [7, 7]);
    this.spawnUnit(2, [8.5, 8.5]);
  }

  tick(dt) {
    this._objects.forEach(obj => obj.update());
  }

  terminate() {
    this._objects.forEach(obj =>
      this._factory.deleteObject(obj), this)
  }
}

class Extractor {
  /**
   * @param rawJson {[{fileName, length}]}
   */
  constructor(rawJson) {
    this.raw = rawJson;
    this.length = rawJson[0].length;
    this.index = 1;
  }

  getNext() {
    if (this.index <= this.length) {
      let item = this.raw[this.index];
      this.index++;
      return item.data;
    }
    return null;
  }
}