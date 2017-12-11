import Pool from './object_pool';
import GameObject from './game_object';
import {
  BoxCollider,
  GraphicComponent,
  Rigidbody,
} from '../donjon_components/index';

/**
 *
 */
export default class ObjectFactory {

  constructor() {
    /**
     * String to Class Map
     *
     * @type {Map<string, function>}
     * @private
     */
    this._creatorsMap = new Map([
      ['GraphicComponent', GraphicComponent],
      ['BoxCollider', BoxCollider],
      ['Rigidbody', Rigidbody]
    ]);

    /**
     *
     * @type {Pool}
     * @private
     */
    this._objectPool = new Pool(500);


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
   * @return {Component || {}} instance of type key component, copy constructed.
   */
  _createComponent(key, data) {
    if (this._creatorsMap.has(key)) {
      let creator = this._creatorsMap.get(key);
      //TODO: use object pool
      /* _create a new object of type creator */
      return new creator(data);
    }
    console.log(`No such component: ${key}`);
    return {};
  }

  /**
   * @param origin
   * @return {Component}
   * @private
   */
  _cloneComponent(origin) {
    //console.log(origin.constructor.name);
    return this._createComponent(origin.constructor.name, origin);
  }

  /**
   * @param trans
   * @param origin_trans
   * @private
   */
  _cloneTransform(trans, origin_trans) {
    trans.setPosition(origin_trans.position);
    trans.setScale(origin_trans.scale)
  }

  /**
   * Construct an GameObject instance from 'source' json object.
   *
   * @param source {object} json object describing the object components.
   * @return {GameObject} pointer to initialized instance of objects.
   */
  createObject(source) {
    /* Create empty game object */
    const object = this._objectPool.create();
    const objectKeys = Object.keys(source);

    /* Set Transform data, if applies. */
    const index = objectKeys.indexOf('Transform');
    if (index !== -1) {
      this._cloneTransform(object.getTransform(), source['Transform']);
      objectKeys.splice(index, 1);
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
   * Make a clone of object 'origin', optional to change position.
   * Use this to create game entities.
   *
   * @param origin {GameObject}
   * @param position {Array.<number>=} new position to deploy this object.
   * @return {GameObject} a clone of 'origin' prefab
   */
  instantiate(origin, position = null) {
    /* Create from object pool */
    const cloned = this._objectPool.get();
    cloned.id = ObjectFactory.generateRunTimeId();

    /* Clone transform and each components */
    this._cloneTransform(cloned._transform, origin.getTransform());
    origin._components.forEach(ori_comp =>
        cloned.addComponent(this._cloneComponent(ori_comp))
      , this);

    /* Fire event::onInstantiate */
    cloned.sendMessage('onInstantiate', cloned, position);
    return cloned;
  }

  /**
   * @param object{GameObject}
   */
  deleteObject(object) {
    this._objectPool.release(object);
  }
}

/** @private @type {number}*/
ObjectFactory._lastId = 0;