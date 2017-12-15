/**
 * @abstract
 * @implements {InterfaceGameFlow}
 */
export default class Manager {

  constructor() {
    /* Setup listeners. */
    this.initializeListeners();
    /* Send out Ready event.*/

  }

  /** @abstract */
  initializeListeners() {
  }

  /* ----------------------------Game Flow----------------------------------- */

  /** @abstract */
  create(dataObjects) {
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

  /* -----------------------------Messages------------------------------------ */
}