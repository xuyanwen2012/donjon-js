import Pool from './pool';
import GameObject from './game_object';

export default class ObjectPool extends Pool {

  constructor(size = 0) {
    super(size);
  }

  create() {
    return new GameObject();
  }

  /**
   * @param object {GameObject}
   */
  destroy(object) {
    object.getTransform().setPosition(); //reset position
    object._components = [];
    object.id = GameObject.DEFAULT_ID;
  }
}