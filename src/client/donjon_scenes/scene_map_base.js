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
    this._spriteset = null;
    /** @private @type {boolean} */
    this._mapLoaded = false;
    /** @private @type {number} */
    this._waitCount = 0;

    /*  */
    let self = this;
    Donjon.EventEmitter.addListener('onUnitSpawn', obj => {
      self.onUnitSpawn(obj)
    });
  }

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


  onUnitSpawn(object) {
    console.log('SceneMapBase::onUnitSpawn');
    if (this._spriteset) {
      this._spriteset.addCharacter(object);
    }
  }

  /**
   * Called automatically when map resources are loaded. Generate Spriteset
   * Objects and broadcast 'Spriteset Created' message allowing all
   * already-created render components to create sprites.
   * @protected
   */
  onMapLoaded() {
    this.createDisplayObjects();
  }

  /** @private */
  createDisplayObjects() {
    this.createSpriteset();
    //other display objects
  }

  /** @private */
  createSpriteset() {
    this._spriteset = new SpritesetMap();
    this.addChild(this._spriteset);
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
    this.updateWaitCount();
    super.update();
  }

  /**
   * check if is waiting
   * @return {boolean}
   */
  isBusy() {
    return this._waitCount > 0 || super.isBusy();
  }

  /**
   * @return {boolean}
   * @protected
   */
  updateWaitCount() {
    if (this._waitCount > 0) {
      this._waitCount--;
      return true;
    }
    return false;
  }

  /**
   * @override
   */
  terminate() {
    super.terminate();
    ImageManager.clearRequest();
    $gameScreen.clearZoom();
    this.removeChild(this._spriteset);
  }
}