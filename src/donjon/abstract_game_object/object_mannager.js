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

    // temp
    let jsonSource = {
      'GraphicComponent': {
        'assetName': 'hero'
      },
      'Rigidbody': {
        'mass': 2
      },
    };
    this._prefab = this._factory.createObject(jsonSource);
  }

  initializeListeners() {

  }

  /* ------------------Public functional method-------------------------- */

  /**
   * @param position {Array.<number>}
   * @return {GameObject}
   */
  spawnUnit(position) {
    const gameObject = this._factory.instantiate(this._prefab, position);
    this._objects.push(gameObject);

    /* send out spawn event. */
    EventEmitter.queueEvent('onUnitSpawn', gameObject);
    return gameObject;
  }

  /* ----------------------------Game Flow----------------------------------- */

  setup() {
    //temp
    this.spawnUnit([5, 5]);
  }

  terminate() {
    this._objects.forEach(obj =>
      this._factory.deleteObject(obj), this)
  }

  tick(dt) {

  }
}