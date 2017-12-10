import ObjectFactory from "../abstract_game_object/donjon_objects/object_factory";

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
   */
  static spawnUnit(position) {
    this._objects.push(this._factory.instantiate(this._prefab, position));
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