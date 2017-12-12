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
    /*  */
    let self = this;
    Donjon.EventEmitter.addListener('onUnitSpawn', obj => {
      self.onUnitSpawn(obj)
    });
  }

  /**
   * @override
   */
  create() {
    DataManager.loadMapData(1);
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

  /* --------------------Messages--------------------------- */

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

    super.onMapLoaded();
  }

  onUnitSpawn(object) {
    console.log('SceneMapBase::onUnitSpawn');
    if (this._spriteset) {
      this._spriteset.addCharacter(object);
    }
  }

  /* --------------------Game Flow--------------------------- */

  start() {
    super.start();
    $game.start();
  }

  /**
   * called constantly
   */
  update() {
    $game.fixedUpdate();
    super.update();
  }

  terminate() {
    super.terminate();
    $game.terminate();
  }
}