import EventEmitter from '../managers/event_emitter';
import ObjectManager from '../managers/object_mannager';
import Physics from '../core/physics';

/**
 * Server game Object.
 *
 * var game = Donjon.Game();
 *  ...(load resource, data)
 * game.start();
 * game.pause();
 * game.terminate();
 *
 *
 * @memberOf Donjon
 */
export default class Game {

  constructor() {

    ObjectManager.initializeObjectPool();
    ObjectManager.createTempPrefabs();
    /** @private @type {Physics}*/
    this._physics = new Physics();
  }

  /**
   * Must load all data and assets before calling start()
   * start the game tick.
   */
  start() {
    /* construct game instances from data loaded.  */


    /* construct physics world from game objects */
    this._physics.setup();
  }

  /**
   * called constantly 1/60 fps
   */
  fixedUpdate() {
    /* update game object's fixedUpdate */

    /* update internal physics system, i.e. p2.World */
    this._physics.tick();
  }

  /**
   *
   */
  update() {
    EventEmitter.tick();

  }

  lateUpdate() {

  }

  pause() {

  }

  terminate() {

  }
}