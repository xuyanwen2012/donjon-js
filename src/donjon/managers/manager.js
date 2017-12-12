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
  setup() {
  }

  /** @abstract */
  tick(dt) {
  }

  /** @abstract */
  terminate() {
  }

  /* -----------------------------Messages------------------------------------ */

}