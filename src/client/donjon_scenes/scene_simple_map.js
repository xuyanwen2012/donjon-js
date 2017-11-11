/**
 * @extends SceneBase
 */

class SceneMap extends SceneMapBase {

  // /**
  //  * @override
  //  * @constructor
  //  */
  // constructor() {
  //   super();
  //
  // }

  /**
   * @override
   */
  create() {
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
    $gameObjects.instantiate('Test', new Victor(5, 5));
    $gameObjects.instantiate('Test', new Victor(10, 10));
    console.log("Test Object instantiated.");
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