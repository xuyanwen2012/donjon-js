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