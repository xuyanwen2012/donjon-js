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
    //$gameObjects.instantiate('Player', new Victor(4.75, 5));

    for (var i = 0; i < 100; i++) {
      //$gameObjects.instantiate('Test', new Victor(5 + Math.randomInt(10),
      // 5 + Math.randomInt(10)));

      $gameObjects.instantiate('Test', [5 + Math.random() * 10, 5 + Math.random() * 10]);
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
    //const active = this.isActive();
    //const delta_time = 1.0 / 60.0;

    /* update donjon game */
    $game.fixedUpdate();

    // const player = $gameObjects.find('Player');
    // if (player)
    //   player.transform.translate(new Victor(delta_time, delta_time));
  }
}