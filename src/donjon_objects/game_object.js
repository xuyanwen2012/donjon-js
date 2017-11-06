import Victor from 'victor';
import {Components} from '../core/const';
import Transform from '../donjon_components/transform';
import Rigidbody from '../donjon_components/rigidbody';
import BoxCollider from '../donjon_components/box_collider';
import CircleCollider from '../donjon_components/circle_collider';


/**
 * Do NOT manually create instance of GameObject. Use following instead:
 *
 *  ObjectManager.instantiate("name 1");
 *  ObjectManager.instantiate("name 2", new Victor(2.0,5.0));
 *
 */
export default class GameObject {

  /**
   * @param name {String=} The name that the GameObject is created with.
   */
  constructor(name = 'unnamed') {
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
   * @param targetObject {GameObject}
   * @param script {Object}
   */
  static createBehaviour(targetObject, script) {
    const behaviour = new Behaviour(targetObject);
    console.log("===========");
    console.log(script);
    console.log("===========");
    Object.assign(behaviour, script);
    return behaviour;
  };

  /**
   *
   * @param targetObject {GameObject}
   * @param componentType {number}
   * @param param
   * @return {Component}
   */
  static createComponent(targetObject, componentType, ...param) {
    switch (componentType) {
      case Components.RIGIDBODY:
        return new Rigidbody(targetObject, ...param);
      case Components.BOX_COLLIDER:
        return new BoxCollider(targetObject, ...param);
      case Components.CIRCLE_COLLIDER:
        return new CircleCollider(targetObject, ...param);
      default:
        console.log("Cannot create Component: " + componentType);
    }
  }

  /**
   * Clones the object original and returns the clone.
   *
   * @param original {GameObject}
   * @param position {Victor=}
   * @param parent {GameObject=}
   */
  static instantiate(original, position = null, parent = null) {
    //create empty object
    const cloned = new GameObject(original.name_);

    //clone each component from prefab
    original.components_.forEach(comp =>
      GameObject.instantiateComponent(cloned, comp, comp.type_)
    );

    if (position) {
      cloned.transform.setPositon(position);
    }
    if (parent) {
      parent.addChild(cloned);
    }
    return cloned;
  }

  /**
   * Clone and assign a component to the targetObject. This action will make
   * a clone of the origin and alter the owner to new Object. Used for prefabs
   * only. Do NOT use this on a existing game object.
   *
   * @param targetObject {GameObject}
   * @param origin {Component}
   * @param type {number}
   */
  static instantiateComponent(targetObject, origin, type) {
    //create empty component (no params passed)
    let cloned = this.createComponent(targetObject, type);
    Object.assign(cloned, origin);
    targetObject.addComponent(cloned);
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
   * @param type {number || Component} Enum to Game Components, or you can
   * simply pass an instance of Component.
   * @param param
   */
  addComponent(type, ...param) {
    let compObj;
    if (typeof type === 'number') {
      compObj = GameObject.createComponent(this, type, ...param);
    } else {
      compObj = type;
      type = compObj.type;
    }

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
  }

  /**
   * @param type {number} Enum to Game Components
   */
  getComponent(type) {
    let comp = this.components_[type];
    if (!comp) {
      console.error('Attempted to get a Component that does not exist.');
      return null;
    }
    return Array.isArray(comp) ? comp[0] : comp;
  }

  /** @param value {number} */
  setTag(value) {
    this.tag_ = value
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
    this.children_.forEach(behaviour =>
      behaviour[methodName](parameter));
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object.
   * @param methodName {string} Name of method to call.
   * @param value {object=} Optional parameter value for the method.
   */
  sendMessage(methodName, value) {
    this.behaviours_.forEach(behaviour =>
      behaviour[methodName](value));
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
