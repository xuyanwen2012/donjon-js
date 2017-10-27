import Transform from '../donjon_components/comp_transform';
import Victor from 'victor';

/**
 * Base class for all entities in Donjon scenes.
 * @implements {QuadItem}
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

    /** @private @const @type {Object} */
    this.components_ = {};

    /** @private @type {Array} */
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
   * Clones the object original and returns the clone.
   * @param original
   * @param position
   * @param parent
   */
  static instantiate(original, position = new Victor(0, 0), parent = null) {
    const cloned = new GameObject(original.name_);


    const originComps = original.components_;
    for (let comp in originComps) {
      if (originComps.hasOwnProperty(comp)) {
        //console.log(originComps[comp]);
        //newObject.addComponent(originComps[comp]);
        //result += '.' + comp + ' = ' + originComps[comp].name + '\n';
      }
    }
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
   * Adds a component.js class of type componentType to the game object
   * @param type {Function}
   * @param param
   */
  addComponent(type, ...param) {
    const typeName = type.name;
    const comp = this.components_[typeName];
    if (typeof comp === 'object') {
      if (!Array.isArray(comp)) {
        let temp = comp;
        this.components_[typeName] = [];
        this.components_[typeName].push(temp);
      }
      this.components_[typeName].push(new type(this, ...param));
    } else {
      this.components_[typeName] = new type(this, ...param);
    }
  }

  /**
   * @param type
   */
  getComponent(type) {
    let comp = this.components_[type.name];
    if (!comp) {
      throw new Error("Attempted to get a Component that does not exist.");
    }
    return Array.isArray(comp) ? comp[0] : comp;
  }

  /**
   * @param type {Function}
   * @return {Array<Component>}
   */
  getComponents(type) {
    let component = this.components_[type.name];
    if (component) {
      return Array.isArray(component) ? component : [component];
    } else {
      return [];
    }
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
