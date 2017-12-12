//import p2 from 'p2';
import EventEmitter from '../managers/event_emitter';

import Manager from '../managers/manager';
import {Components} from '../core/const';

/**
 *
 */
export default class Physics extends Manager {

  constructor() {
    super();
  }

  initializeListeners() {
    let self = this;
    EventEmitter.addListener('onUnitSpawn', (unit) => {
      self.onUnitSpawn(unit)
    })
  }

  /* --------------------Messages--------------------------- */

  onUnitSpawn(gameObject) {
    const rigidbody = gameObject.getComponent(Components.RIGIDBODY);
    if (rigidbody) {
      this.addRigidbody(rigidbody);
    }
  }

  /**
   * Construct p2.Body from RigidbodyComponent
   *
   * @param rigidbody {Rigidbody}
   */
  addRigidbody(rigidbody) {

  }

  /**
   * Create
   */
  setup() {

  }

  tick(dt) {
    /* internal step */
    //this._world.step(dt);

    // /* update game object's position */
    // this._bodyPairs.forEach(pair => {
    //   pair[0].owner.transform.setPosition(pair[1].position)
    // })
  }

  terminate() {
  }
}