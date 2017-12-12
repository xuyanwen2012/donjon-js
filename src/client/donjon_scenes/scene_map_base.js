/**
 * @abstract
 * @extends {SceneBase}
 */
class SceneMapBase extends SceneBase {
  /**
   * @override
   */
  constructor() {
    super();
    /** @type {SpritesetMap} */
    this._spriteset = null;
    /** @type {boolean} */
    this._mapLoaded = false;
    /** @private @type {number} */
    this._waitCount = 0;
  }

  /* --------------------Status Getter--------------------------- */

  /**
   * Load data map first then Image(super)
   * @protected
   * @return {boolean}
   */
  isReady() {
    if (!this._mapLoaded && DataManager.isMapLoaded()) {
      this.onMapLoaded();
      this._mapLoaded = true;
    }
    return this._mapLoaded && super.isReady();
  }

  /**
   * check if is waiting
   * @return {boolean}
   */
  isBusy() {
    return this._waitCount > 0 || super.isBusy();
  }

  /* --------------------Messages--------------------------- */

  /**
   * Called automatically when map resources are loaded. Generate Spriteset
   * Objects and broadcast 'Spriteset Created' message allowing all
   * already-created render components to create sprites.
   * @protected
   */
  onMapLoaded() {
    console.log('SceneMapBase::onMapLoaded');
    this.createDisplayObjects();
  }


  /*----------------------------------------------------------------*/

  /** @private */
  createDisplayObjects() {
    this.createSpriteset();
  }

  /** @private */
  createSpriteset() {
    this._spriteset = new SpritesetMap();
    this.addChild(this._spriteset);
  }

  /**
   * @return {boolean}
   * @private
   */
  updateWaitCount() {
    if (this._waitCount > 0) {
      this._waitCount--;
      return true;
    }
    return false;
  }

  /* --------------------Client Game Flow--------------------------- */

  /**
   * @override
   */
  create() {
    DataManager.loadMapData(1);
  }

  /**
   * does not include load map data
   */
  start() {
    super.start();
    SceneManager.clearStack();
  }

  /**
   * @override
   */
  update() {
    this.updateWaitCount();
    super.update();
  }

  stop() {
    super.stop();
  }

  /**
   * @override
   */
  terminate() {
    super.terminate();
    ImageManager.clearRequest();
    this.removeChild(this._spriteset);
  }
}