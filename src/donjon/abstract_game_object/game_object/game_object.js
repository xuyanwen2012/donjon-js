import {Components} from '../../core/const';
import Transform from '../components/transform';

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
    if (comp.getType() === Components.TRANSFORM) {
      this._transform = comp;
    } else {
      this._components[comp.getType()] = comp; // 'type' as index
    }
  }

  /**
   * @param type {number} enum of Components
   * @return
   */
  getComponent(type) {
    if (this._components[type]) {
      return this._components[type];
    }
    return null;
  }

  /**
   *
   * @return {GraphicComponent}
   */
  getGraphicComp() {
    return this.getComponent(Components.GRAPHIC);
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

  /* ------------------- Game Flow -------------------------- */

  update() {
    this._components.forEach(component =>
      component.update());
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