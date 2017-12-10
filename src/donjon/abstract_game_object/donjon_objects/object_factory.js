/**
 *
 */
import GameObject from './game_object';
import {
  BoxCollider,
  GraphicComponent,
  Rigidbody,
  Transform
} from '../donjon_components/index';

export default class ObjectFactory {
  constructor() {
    /**
     * String to Class Map
     *
     * @type {Map<string, function>}
     * @private
     */
    this._creatorsMap = new Map([
      ['Transform', Transform],
      ['GraphicComponent', GraphicComponent],
      ['BoxCollider', BoxCollider],
      ['Rigidbody', Rigidbody]
    ]);

    this._objectCountMap = new Map();
  }

  /** @return {number} generate unique runtime Id for game objects */
  static generateRunTimeId() {
    return ++this._lastId;
  }

  /**
   * @private
   * @param key{string} type of component, defined in _creatorsMap.
   * @param data{object} parameters to component key
   * @return {Component} instance of type key component, copy constructed.
   */
  _createComponent(key, data) {
    if (this._creatorsMap.has(key)) {
      let creator = this._creatorsMap.get(key);
      return new creator(data);
    }
    console.log(`no such component: ${key}`);
    return null;
  }

  /**
   * @param origin
   * @return {Component}
   * @private
   */
  _cloneComponent(origin) {
    return this._createComponent(origin.constructor.name, origin);
  }

  /**
   * Construct an GameObject instance from 'source' json object.
   *
   * @param source {object} json object describing the object components.
   * @return {GameObject} pointer to initialized instance of objects.
   */
  createObject(source) {
    /* Create empty game object */
    const object = new GameObject();
    const objectKeys = Object.keys(source);

    /* Check Transform data, create default if does not exist. */
    if (objectKeys.indexOf('Transform') === -1) {
      const defaultTransform = this._createComponent('Transform', {});
      object.addComponent(defaultTransform);
    }

    /* Loop through keys(Components) from source json */
    objectKeys.map(key => {
      let component = this._createComponent(key, source[key]);
      if (component) {
        object.addComponent(component);
      }
    });

    /* Fire event::onCreate */
    object.sendMessage('onCreate');
    return object;
  }

  /**
   * make a clone of object 'origin', optional to change position
   *
   * @param origin {GameObject}
   * @param position {Array.<number>=} new position to deploy this object.
   * @return {GameObject} a clone of 'origin' prefab
   */
  instantiate(origin, position = null) {
    const cloned = new GameObject();

    cloned._transform = this._cloneComponent(origin.getTransform());
    origin._components.forEach(ori_comp =>
        cloned.addComponent(this._cloneComponent(ori_comp))
      , this);

    /* Assign new position, if applies */
    if (position) {
      cloned._transform.setPosition(position);
    }
    /* Set unique id */
    cloned.id = ObjectFactory.generateRunTimeId();

    /* Fire event::onInstantiate */
    cloned.sendMessage('onInstantiate', cloned);
    return cloned;
  }
}
/** @private @type {number}*/
ObjectFactory._lastId = 0;