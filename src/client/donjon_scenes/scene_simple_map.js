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
  onMapLoaded() {
    //$gamePlayer.performTransfer();
    $gameMap.setup(this._newMapId, $dataMap); //setup map data before construct
    // objects
    super.onMapLoaded();
  }

  // start() {
  //   super.start();
  // }

  /**
   * called constantly
   */
  update() {
    this.updateMain();
    super.update();
  }

  /**
   * @return {boolean}
   * @private
   */
  isSceneChangeOk() {
    return this.isActive();
  }

  updateScene() {
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
  updateMain() {
    const active = this.isActive();
    $gameMap.update(active);
    //$gamePlayer.update(active);
    $gameScreen.update();
  }
}