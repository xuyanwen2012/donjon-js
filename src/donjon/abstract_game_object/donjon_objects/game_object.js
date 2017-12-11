import {Components} from '../../core/const';
import Transform from '../donjon_components/transform';

/**
 * @implements {Serializable}
 */
export default class GameObject {

  constructor(id = -1) {
    /**
     * the id value -1 means the object is created but not GameObject.instantiated.
     *
     * @type {number} run time id
     */
    this.id = id;
    this._transform = new Transform();
    this._components = [];
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /**
   * @param comp {Component} add to self
   */
  addComponent(comp) {
    comp.setOwner(this);
    if (comp.type === Components.TRANSFORM) {
      this._transform = comp;
    } else {
      this._components[comp.type] = comp; // 'type' as index
    }
  }

  /**
   * @param type {number} enum of Components
   * @return {object} Component of type type, null if not found.
   */
  getComponent(type) {
    if (this._components[type]) {
      return this._components[type];
    }
    console.log(`Could not get component type: ${type}.`);
    return {};
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