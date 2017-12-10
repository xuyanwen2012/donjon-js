import {Components} from '../../core/const';

/**
 * @abstract
 * @implements {Serializable}
 */
export default class Component {
  constructor(data) {
    /**
     * @type {GameObject}
     * @protected
     */
    this._owner = null;

    /**
     * @type {number}
     * @protected
     */
    this._type = Components.NULL;

    /* initialize member field through copy constructor */
    this.copyConstructor(data);
  }

  /** @return {GameObject} */
  get owner() {
    return this._owner;
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /** @return {number} */
  get type() {
    return this._type;
  }

  /**
   * Copy constructor
   * @abstract
   * @protected
   * @param data {object} could be a json file
   */
  copyConstructor(data) {
  }

  /** @param owner {GameObject} */
  setOwner(owner) {
    this._owner = owner;
  }

  /* -------------------Serializable-------------------------- */

  /** @abstract */
  serialize() {
  }

  /** @abstract */
  deserialize(str) {
  }

  /* --------------------Messages--------------------------- */
  triggerMessage(methodName, ...params) {
    this[methodName](...params)
  }

  /**
   * [Message] Called when object(owner) is created by ObjectFactory.
   */
  onCreate() {
  }

  /**
   * [Message] Called after object is Instantiated (cloned) by ObjectFactory.
   * @param owner {GameObject} ownership to change.
   */
  onInstantiate(owner) {
    /* Reset ownership of components */
    this.setOwner(owner);
  }
}