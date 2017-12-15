/**
 * @interface
 */
class Serializable {
  /**
   * @abstract
   * @return {string}
   */
  serialize() {
  }

  /**
   * @abstract
   * @param str {string}
   * @return object
   */
  deserialize(str) {
  }
}

/**
 * @interface
 */
class InterfaceGameFlow {
  /** @abstract */
  create() {
  }

  /** @abstract */
  start() {
  }

  /** @abstract */
  tick(dt) {
  }

  /** @abstract */
  stop() {
  }

  /** @abstract */
  terminate() {
  }
}