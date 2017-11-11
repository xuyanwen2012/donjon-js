import Victor from 'victor';
import {Components} from '../core/const';
import Transform from '../donjon_components/transform';
import Rigidbody from '../donjon_components/rigidbody';
import BoxCollider from '../donjon_components/box_collider';
import CircleCollider from '../donjon_components/circle_collider';
import Behaviour from '../donjon_components/behaviour';
import RenderComponent from "../donjon_components/render";


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
    this._id = 0;//Utils.generateRuntimeId();

    /** @private @type {GameObject} */
    this._parent = null;

    /** @private @type {Array.<GameObject>} */
    this._children = [];

    /** @private @type {number} */
    this._layer = GameObject.Layers.DEFAULT;

    /** @private @type {number} */
    this._tag = GameObject.Tags.UNTAGGED;

    /** @private @type {Transform} */
    this._transform = new Transform(this);

    /** @private @type {String} */
    this._name = name === 'unnamed' ? 'unnamed' + this.id : name;

    /** @private @const @type {Array.<Components>} */
    this._components = [];

    /** @private @type {Array.<Behaviour>} */
    this._behaviours = [];

    /** @private @type {boolean} */
    this._active = true;
  }

  /** @return {number} */
  get id() {
    return this._id;
  }

  /** @return {Transform} */
  get transform() {
    return this._transform;
  }

  /** @return {number} */
  get layer() {
    return this._layer;
  }

  /** @return {number} */
  get tag() {
    return this._tag;
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
      case Components.RENDER:
        return new RenderComponent(targetObject, ...param);
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
    const cloned = new GameObject(original._name);

    //clone each component from prefab
    original._components.forEach(comp =>
      GameObject.instantiateComponent(cloned, comp, comp._type)
    );


    if (position) {
      cloned.transform.setPosition(position);
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
    /* create default component (no param passed) */
    let cloned = this.createComponent(targetObject, type);
    /* clone */
    Object.assign(cloned, origin);
    /* change the ownership from prefab to cloned object */
    cloned.setOwner(targetObject);
    targetObject.addComponent(cloned);
  }

  /**
   * @param parent {GameObject}
   */
  setParent(parent) {
    if (parent instanceof GameObject) {
      this._parent = parent;
      // this.transform.setParent(parent.transform);
    }
  }

  /**
   * @param child {GameObject}
   */
  addChild(child) {
    if (child instanceof GameObject) {
      child.setParent(this);
      this._children.push(child);
    }
  }

  /**
   * [Private]
   * Adds a component.js class of type type to the game object
   *
   *
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

    if (typeof this._components[type] === 'object') {
      if (!Array.isArray(this._components[type])) {
        let temp = this._components[type];
        this._components[type] = [];
        this._components[type].push(temp);
      }
      this._components[type].push(compObj);
    } else {
      this._components[type] = compObj;
    }
  }

  /**
   * @param type {number} Enum to Game Components
   * @return {Array.<Components>}
   */
  getComponent(type) {
    let comp = this._components[type];
    if (!comp) {
      console.error('Attempted to get a Component that does not exist.');
      return null;
    }
    return Array.isArray(comp) ? comp[0] : comp;
  }

  /**
   * @param type {number} Enum to Game Components
   * @return {Array.<Array>}
   */
  getComponents(type) {
    let comp = this._components[type];
    return !comp ? [] : Array.isArray(comp) ? comp : [comp];
  }

  /** @param value {number} */
  setTag(value) {
    this._tag = value
  }

  /** @param active{boolean} */
  setActive(active) {
    this._active = active;
  }

  /**
   * @param tag {number} The tag to compare.
   * @return {boolean} Is this game object tagged with tag ?
   */
  compareTag(tag) {
    return this._tag === tag;
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object or any of its children.
   * @param methodName {string} Name of method to call.
   * @param parameter {object=} Optional parameter value for the method.
   */
  broadcastMessage(methodName, parameter = null) {
    this.sendMessage(methodName, parameter);
    this._children.forEach(behaviour =>
      behaviour[methodName](parameter));
  }

  /**
   * Calls the method named methodName on every MonoBehaviour in this game
   * object.
   * @param methodName {string} Name of method to call.
   * @param value {object=} Optional parameter value for the method.
   */
  sendMessage(methodName, value) {
    this._behaviours.forEach(behaviour =>
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
    if (this._parent !== null) {
      this._parent.sendMessageUpwards(methodName, value);
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
