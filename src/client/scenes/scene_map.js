//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.

class Scene_Map extends Scene_Base {

  constructor() {
    super();
    this._waitCount = 0;
    this._encounterEffectDuration = 0;
    this._mapLoaded = false;
  }

  create() {
    // this._transfer = $gamePlayer.isTransferring();
    // const mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
    const mapId = $gameMap.mapId();
    DataManager.loadMapData(1);
    console.log("SceneMap:create as following");
    console.log($dataMap);
  }

  isReady() {
    if (!this._mapLoaded && DataManager.isMapLoaded()) {
      this.onMapLoaded();
      this._mapLoaded = true;
    }
    return this._mapLoaded && super.isReady();
  }

  onMapLoaded() {
    // if (this._transfer) {
    //   $gamePlayer.performTransfer();
    // }
    this.createDisplayObjects();
  }

  start() {
    SceneManager.clearStack();
    this.startFadeIn(this.fadeSpeed(), false);
    $gameMap.autoplay();
  }

  update() {
    this.updateMain();
    if (this.isSceneChangeOk()) {
      this.updateScene();
    }
    this.updateWaitCount();
    super.update();
  }

  updateMain() {
    const active = this.isActive();
    $gameMap.update(active);
    // $gamePlayer.update(active);
    // $gameTimer.update(active);
    $gameScreen.update();
  }

  stop() {
    super.stop();
    //$gamePlayer.straighten();
    // if (this.needsSlowFadeOut()) {
    //   this.startFadeOut(this.slowFadeSpeed(), false);
    // } else if (SceneManager.isNextScene(Scene_Map)) {
    //   this.fadeOutForTransfer();
    // }
  }

  isBusy() {
    return ( this._waitCount > 0 || this._encounterEffectDuration > 0 ||
      super.isBusy());
  }

  terminate() {
    if (SceneManager.isNextScene(Scene_Map)) {
      ImageManager.clearRequest();
    }

    $gameScreen.clearZoom();

    this.removeChild(this._fadeSprite);
    this.removeChild(this._spriteset);
  }

  updateWaitCount() {
    if (this._waitCount > 0) {
      this._waitCount--;
      return true;
    }
    return false;
  }

  isSceneChangeOk() {
    return this.isActive();// && !$gameMessage.isBusy();
  }

  updateScene() {

  }

  createDisplayObjects() {
    this.createSpriteset();
  }

  createSpriteset() {
    this._spriteset = new Spriteset_Map();
    console.log("createSpriteset");
    this.addChild(this._spriteset);
  }

}