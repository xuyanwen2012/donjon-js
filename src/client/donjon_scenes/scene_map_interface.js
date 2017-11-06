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
    /** @private @type {SpritesetMap} */
    this.spriteset_ = null;
    /** @private @type {boolean} */
    this.mapLoaded_ = false;
    /** @private @type {number} */
    this.waitCount_ = 0;

  }

  /**
   * Load data map first then Image(super)
   * @protected
   * @return {boolean}
   */
  isReady() {
    if (!this.mapLoaded_ && DataManager.isMapLoaded()) {
      this.onMapLoaded_();
      this.mapLoaded_ = true;
    }
    return this.mapLoaded_ && super.isReady();
  }

  /**
   * Called automatically when map resources are loaded. Generate Spriteset
   * Objects and broadcast 'Spriteset Created' message allowing all
   * already-created render components to create sprites.
   * @protected
   */
  onMapLoaded_() {
    this.createDisplayObjects_();
    //sent out loaded event
    // EventsManager.queueEvent(
    //   new Evnt_SpritesetMapCreated(performance.now(), this.spriteset_));
  }

  /** @private */
  createDisplayObjects_() {
    this.createSpriteset_();
    //other display objects
  }

  /** @private */
  createSpriteset_() {
    this.spriteset_ = new SpritesetMap();
    this.addChild(this.spriteset_);
  }

  /**
   * @override
   */
  create() {
    const mapId = $gameMap.mapId();
    DataManager.loadMapData(mapId);
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
    this.updateWaitCount_();
    super.update();
  }

  /**
   * check if is waiting
   * @return {boolean}
   */
  isBusy() {
    return this.waitCount_ > 0 || super.isBusy();
  }

  /**
   * @return {boolean}
   * @protected
   */
  updateWaitCount_() {
    if (this.waitCount_ > 0) {
      this.waitCount_--;
      return true;
    }
    return false;
  }

  /**
   * @override
   */
  terminate() {
    super.terminate();
    //if (SceneManager.isNextScene(Scene_Map)) {
    ImageManager.clearRequest();
    //}
    $gameScreen.clearZoom();
    //this.removeChild(this._mapNameWindow);
    this.removeChild(this.spriteset_);
  }
}