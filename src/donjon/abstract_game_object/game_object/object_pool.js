/**
 * @class Object pooling utility.
 */
import GameObject from './game_object';

export default class Pool {

  constructor(size = 0) {
    /**
     * @property {Array} objects
     * @type {Array}
     */
    this.objects = [];
    this.resize(size);
  }

  /**
   * @method resize
   * @param {number} size
   */
  resize(size) {
    const objects = this.objects;

    while (objects.length > size) {
      objects.pop();
    }

    while (objects.length < size) {
      objects.push(this.create());
    }
  }

  /**
   * Get an object from the pool or create a new instance.
   * @method get
   * @return {GameObject}
   */
  get() {
    const objects = this.objects;
    return objects.length ? objects.pop() : this.create();
  }

  /**
   * Clean up and put the object back into the pool for later use.
   * @method release
   * @param {GameObject} object
   */
  release(object) {
    this.destroy(object);
    this.objects.push(object);
  }

  /**
   * @return {GameObject}
   */
  create() {
    return new GameObject();
  }

  /**
   * @param object {GameObject}
   */
  destroy(object) {
    object.getTransform().setPosition();
    object._components = [];
    object.id = -1;
  }
}
