import ObjectFactory from "../abstract_game_object/donjon_objects/object_factory";
import EventEmitter from "./event_emitter";

export default class ObjectManager {

  constructor() {
    throw new Error('This is a static class');
  }

  static initialize() {
    /**
     * @static
     * @type {Array.<GameObject>}
     * @private
     */
    this._objects = [];
    this._prefab = null;
    this._factory = new ObjectFactory();
  }

  static createTempPrefabs() {

    let jsonSource = {
      "GraphicComponent": {
        "assetName": "hero"
      },
    };

    this._prefab = this._factory.createObject(jsonSource);

  }

  /**
   * @param position {Array.<number>}
   * @return {GameObject}
   */
  static spawnUnit(position) {
    const gameObject = this._factory.instantiate(this._prefab, position);
    this._objects.push(gameObject);

    /* send out spawn event. */
    EventEmitter.queueEvent('onUnitSpawn', gameObject);
    return gameObject;
  }


  /**
   *  Usually used by client Physics engine to get Rigidbody and Colliders.
   *  And used by client Render engine to get RenderComponent as well.
   *
   * @param type {number} Donjon.Components
   */
  static retrieveAllComponents(type) {
    const retrieved = this._objects.map(obj => obj.getComponent(type));
    return [].concat(...retrieved);
  }
}