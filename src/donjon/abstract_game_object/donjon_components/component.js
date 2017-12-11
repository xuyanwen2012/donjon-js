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
    this._type = 0;
    /* initialize member field through copy constructor */
    this.copyConstructor(data);
  }

  /**
   * Copy constructor
   * @abstract
   * @protected
   * @param data {object} could be a json file
   */
  copyConstructor(data) {
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /** @return {GameObject} */
  get owner() {
    return this._owner;
  }

  /** @return {number} */
  get type() {
    return this._type;
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
  /**
   * Call method  'methodName' on this component.
   * @param methodName
   * @param params
   */
  triggerMessage(methodName, ...params) {
    this[methodName](...params)
  }

  /**
   * [Message] Called when object(owner) is created by ObjectFactory.
   */
  onCreate() {
  }


  onInstantiate(owner) {
    /* Reset ownership of components */
    this.setOwner(owner);
  }

}