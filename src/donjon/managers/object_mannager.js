import Victor from 'victor';
import GameObject from '../donjon_objects/game_object';
import {Components} from '../core/const';

export default class ObjectManager {
  constructor() {
    throw new Error('This is a static class');
  }

  static initializeObjectPool() {
    /**
     * @static
     * @type {Array.<GameObject>}
     * @private
     */
    this._objects = [];

    this._objectsMap = new Map();
  }

  static createTempPrefabs() {
    /**
     * @static
     * @type {Map}
     * @private
     */
    this._prefabs = new Map();

    let name1 = "Player";
    let obj1 = new GameObject(name1);
    obj1.addComponent(Components.RIGIDBODY);
    obj1.addComponent(Components.CIRCLE_COLLIDER, -24, -24, 24);
    obj1.addComponent(Components.RENDER, 'hero');

    let name2 = "Enemy";
    let obj2 = new GameObject(name2);
    obj2.addComponent(Components.RIGIDBODY);
    obj2.addComponent(Components.BOX_COLLIDER, -24, -24, 48, 48);

    let name3 = "Spawn Area";
    let obj3 = new GameObject(name3);
    obj3.addComponent(Components.CIRCLE_COLLIDER, 0, 0, 48 * 2);

    let name4 = 'Test';
    let obj4 = new GameObject(name4);
    obj4.transform.scale.x = 2.0;
    obj4.addComponent(Components.RIGIDBODY);
    obj4.addComponent(Components.CIRCLE_COLLIDER, -24, -24, 24);
    obj4.addComponent(Components.RENDER, 'hero');

    this._prefabs.set(name1, obj1);
    this._prefabs.set(name2, obj2);
    this._prefabs.set(name3, obj3);
    this._prefabs.set(name4, obj4);
  }

  /**
   *
   *
   * @param objectName {string} name in prefabs.
   * @param position {Victor=} new position to deploy this object.
   * @param parent {GameObject}
   * @return {GameObject} cloned object.
   */
  static instantiate(objectName, position = null, parent = null) {
    let original = this._prefabs.get(objectName);
    if (!objectName) {
      console.log("ERROR: no such object in prefab: " + objectName);
      return null;
    }

    let cloned = GameObject.instantiate(original, position, parent);
    this.addObject(cloned);
    console.log(cloned);
    return cloned;
  }

  /**
   *
   * @param gameObject {GameObject}
   */
  static addObject(gameObject) {
    this._objects.push(gameObject);
    this._objectsMap.set(gameObject._name, gameObject);
  }

  /**
   * @param tag {number}
   * @return {Array.<GameObject>}
   */
  static findGameObjectsWithTag(tag) {

  }

  /**
   *  Finds a GameObject by name and returns it.
   * @param name {string}
   * @return {GameObject}
   */
  static find(name) {
    return this._objectsMap.get(name);
  }

  /**
   * @param tag {number}
   * @return {GameObject}
   */
  static findWithTag(tag) {

  }

  /**
   *  Usually used by client Physics engine to get Rigidbody and Colliders.
   *  And used by client Render engine to get RenderComponent as well.
   *
   * @param type {number} Donjon.Components
   */
  static retrieveAllComponents(type) {
    const retrieved = this._objects.map(obj => obj.getComponents(type));
    return [].concat(...retrieved);
  }
}