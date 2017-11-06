/**
 * @extends SceneBase
 */
class SceneMap extends SceneMapBase {

  /**
   * @override
   * @constructor
   */
  constructor() {
    super();

  }

  /**
   * @override
   */
  create() {
    //const mapId = $gamePlayer.isTransferring() ? $gamePlayer.newMapId() :
    // $gameMap.mapId(); console.log("map id: "+ mapId +"
    // $gamePlayer.newMapId() = "+ $gamePlayer.newMapId() + ",$gameMap.mapId()
    // = "+$gameMap.mapId());

    DataManager.loadMapData(1);
  }

  /**
   * @protected
   * @override
   */
  onMapLoaded_() {
    //$gamePlayer.performTransfer();
    $gameMap.setup(this._newMapId); //setup map data before construct objects
    super.onMapLoaded_();
  }

  // start() {
  //   super.start();
  // }

  /**
   * called constantly
   */
  update() {
    this.updateMain_();
    super.update();
  }

  /**
   * @return {boolean}
   * @private
   */
  isSceneChangeOk_() {
    return this.isActive();
  }

  updateScene_() {
    // this.checkGameover();
    // if (!SceneManager.isSceneChanging()) {
    //   this.updateTransferPlayer();
    // }
    // if (!SceneManager.isSceneChanging()) {
    //   this.updateEncounter();
    // }
    // if (!SceneManager.isSceneChanging()) {
    //   this.updateCallMenu();
    // }
    // if (!SceneManager.isSceneChanging()) {
    //   this.updateCallDebug();
    // }
  }

  /**
   * @private
   */
  updateMain_() {
    const active = this.isActive();
    $gameMap.update(active);
    //$gamePlayer.update(active);
    $gameScreen.update();
  }
}