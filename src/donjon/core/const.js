/**
 * bitwise mask and constant
 *
 * @constant
 * @type {object}
 * @property {number} NULL
 * @property {number} TRANSFORM
 * @property {number} GRAPHIC
 * @property {number} CIRCLE_COLLIDER
 * @property {number} BOX_COLLIDER
 */
export const Components = {
  NULL: 1,
  TRANSFORM: 2,
  GRAPHIC: 3,
  RIGIDBODY: 4,
  CIRCLE_COLLIDER: 5,
  BOX_COLLIDER: 6,
};

/**
 * @interface
 */
export class Serializable {
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