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
    $gameMap.setup(this._newMapId, $dataMap); //setup map data before construct

    $game.database.setMapInfos($dataMapInfos);
    $game.database.setSystem($dataSystem);
    $game.database.setTilesets($dataTilesets);
    $game.database.setMap($dataMap);

    /* temp objects */
    $gameObjects.spawnUnit([1, 1]);

    for (let i = 0; i < 100; i++) {
      $gameObjects.spawnUnit([5 + Math.random() * 10, 5 + Math.random() * 10]);
    }

    $game.start();
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

  }

  /**
   * @private
   */
  updateMain() {
    /* update donjon game */
    $game.fixedUpdate();
  }
}