/**
 * Can parse from json, can convert to json
 *
 * Create a prefab object, store it in object pool.
 * Instantiate the Object when used it.
 *
 *
 */
import {Components} from '../../core/const';

/**
 * @implements {Serializable}
 */
export default class GameObject {
  constructor() {
    /**
     * the id value -1 means the object is created but not GameObject.instantiated.
     *
     * @type {number} run time id
     */
    this.id = -1;
    this._transform = null;
    this._components = [];
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /**
   * @param component {Component} add to self
   */
  addComponent(component) {
    component.setOwner(this);
    if (component.type === Components.TRANSFORM) {
      this._transform = component;
    } else {
      this._components[component.type] = component; // 'type' as index
    }
  }

  /**
   * @param type {number} enum of Components
   * @return {Component ||object} Component of type type, null if not found.
   */
  getComponent(type) {
    return this._components[type] || null;
  }

  /**
   * @return {Transform}
   */
  getTransform() {
    return this._transform;
  }

  /* -------------------Serializable-------------------------- */

  serialize() {
    let str = this._transform.serialize();
    let compsLabel = this._transform.type;
    this._components.forEach(comp => {
      compsLabel += comp.type;
      str += (' ' + comp.serialize());
    });
    return `${this.id}: ${compsLabel} ${str}`;
  }

  deserialize(str) {

  }

  /* --------------------Messages--------------------------- */

  /**
   * Calls the method named 'methodName' on every Components in this GameObject.
   * @param params
   */
  sendMessage(...params) {
    this._transform.triggerMessage(...params);
    this._components.forEach(component =>
      component.triggerMessage(...params));
  }

}