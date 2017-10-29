import Victor from 'victor';
import {Components} from '../core/const';
import Transform from '../donjon_components/transform';
import Rigidbody from '../donjon_components/rigidbody';
import BoxCollider from '../donjon_components/box_collider';
import CircleCollider from '../donjon_components/circle_collider';


/**
 * Do not manually create object of Components, use addComponent() to do so.
 *
 */
export default class GameObject {

  /**
   * @param name {String=} The name that the GameObject is created with.
   * @param other {GameObject=}
   */
  constructor(name = 'unnamed', other = null) {
    /** @private @type{number} */
    this.id_ = 0;//Utils.generateRuntimeId();

    /** @private @type {GameObject} */
    this.parent_ = null;

    /** @private @type {Array.<GameObject>} */
    this.children_ = [];

    /** @private @type {number} */
    this.layer_ = GameObject.Layers.DEFAULT;

    /** @private @type {number} */
    this.tag_ = GameObject.Tags.UNTAGGED;

    /** @private @type {Transform} */
    this.transform_ = new Transform(this);

    /** @private @type {String} */
    this.name_ = name === 'unnamed' ? 'unnamed' + this.id : name;

    /** @private @const @type {Array.<Components>} */
    this.components_ = [];

    /** @private @type {Array.<Behaviour>} */
    this.behaviours_ = [];

    /** @private @type {boolean} */
    this.active_ = true;
  }

  /** @return {number} */
  get id() {
    return this.id_
  }

  /** @return {Transform} */
  get transform() {
    return this.transform_
  }

  /** @return {number} */
  get layer() {
    return this.layer_
  }

  /** @return {number} */
  get tag() {
    return this.tag_
  }

  /**
   *
   * @param object {GameObject}
   * @param componentType {number}
   * @param param
   */
  static createComponent(object, componentType, ...param) {
    let comp;
    switch (componentType) {
      case Components.RIGIDBODY:
        comp = new Rigidbody(object, ...param);
        break;
      case Components.BOX_COLLIDER:
        comp = new BoxCollider(object, ...param);
        break;
      case Components.CIRCLE_COLLIDER:
        comp = new CircleCollider(object, ...param);
        break;
      default:
        console.log("Cannot create Component: " + componentType);
    }
    return comp;
  }

  /**
   * Clones the object original and returns the clone.
   * @param original
   * @param position
   * @param parent
   */
  static instantiate(original, position = new Victor(0, 0), parent = null) {
    //const cloned = new GameObject(original.name_);

    //let cloned = JsonEx.makeDeepCopy(original)

    //console.log(cloned);
    //

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
  }

  /** @param value {number} */
  setTag(value) {
    this.tag_ = value
  }

  /**
   * @param tag {number}
   * @return {GameObject}
   */
  static findWithTag(tag) {
  }

  /**
   * @param parent {GameObject}
   */
  setParent(parent) {
    if (parent instanceof GameObject) {
      this.parent_ = parent;
      this.transform.setParent(parent.transform);
    }
  }

  /**
   * @param child {GameObject}
   */
  addChild(child) {
    if (child instanceof GameObject) {
      child.setParent(this);
      this.children_.push(child);
    }
  }

  /**
   * Adds a component.js class of type type to the game object
   * @param type {number} Enum to Game Components
   * @param param
   */
  addComponent(type, ...param) {
    let compObj = GameObject.createComponent(this, type, ...param);

    if (typeof this.components_[type] === 'object') {
      if (!Array.isArray(this.components_[type])) {
        let temp = this.components_[type];
        this.components_[type] = [];
        this.components_[type].push(temp);
      }
      this.components_[type].push(compObj);
    } else {
      this.components_[type] = compObj;
    }

    this.components_.forEach(
      comp => console.log(comp.constructor.name)
    );
  }

  /**
   * @param type {number} Enum to Game Components
   */
  getComponent(type) {
    let comp = this.components_[type];
    if (!comp) {
      throw new Error('Attempted to get a Component that does not exist.');
    }
    return Array.isArray(comp) ? comp[0] : comp;
  }

  /** @param active{boolean} */
  setActive(active) {
    this.active_ = active;
  }

  /**
   * @param tag {number} The tag to compare.
   * @return {boolean} Is this game object tagged with tag ?
   */
  compareTag(tag) {
    return this.tag_ === tag;
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object or any of its children.
   * @param methodName {string} Name of method to call.
   * @param parameter {object=} Optional parameter value for the method.
   */
  broadcastMessage(methodName, parameter = null) {
    this.sendMessage(methodName, parameter);
    for (let behaviour of this.children_) {
      behaviour[methodName](parameter);
    }
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object.
   * @param methodName {string} Name of method to call.
   * @param value {object=} Optional parameter value for the method.
   */
  sendMessage(methodName, value) {
    for (let behaviour of this.behaviours_) {
      behaviour[methodName](value);
    }
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object and on every ancestor of the behaviour.
   * @param methodName {string} Name of method to call.
   * @param value {object=} Optional parameter value for the method.
   */
  sendMessageUpwards(methodName, value = null) {
    this.sendMessage(methodName, value);
    if (this.parent_ !== null) {
      this.parent_.sendMessageUpwards(methodName, value);
    }
  }

  /**
   * Note: update should only update the status of object itself.
   * To reduce performance cost, do not update all components.
   */
  update() {

  }

}

/** @const @enum {number} */
GameObject.Layers = {
  DEFAULT: 1,
};

/** @const @enum {number} */
GameObject.Tags = {
  UNTAGGED: 1,
  RESPAWN: 2,
  PLAYER: 3,
};
