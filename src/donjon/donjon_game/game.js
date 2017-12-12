import Database from './game_database';
import EventEmitter from '../managers/event_emitter';
import ObjectManager from '../abstract_game_object/object_mannager';
import Physics from '../physics/physics';
import GameScreen from './game_screen';
import DonjonMap from './game_map';

/**
 * Server game Object.
 */
export default class Game {

  /**
   *
   */
  constructor() {
    /* setup game managers */
    this.database = new Database();
    this._objectManager = new ObjectManager();

    /* game instances */
    /** @private @type {Physics}*/
    this._physics = new Physics();

    /** @private @type {GameScreen}*/
    this._gameScreen = new GameScreen();

    /** @private @type {DonjonGameMap}*/
    this._gameMap = new DonjonMap();

    /* game status */
    /** @private @type {number}*/
    this._gameTick = 0;
    /** @private @type {number}*/
    this._gameClockReal = 0;

    Game.log('Game Successfully Initialized.');
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /**
   * @param msg {string}
   * @private
   */
  static log(msg) {
    console.log(msg);
  }

  /** @return {DonjonMap} */
  getMap() {
    return this._gameMap;
  }

  /** @return {GameScreen} */
  getScreen() {
    return this._gameScreen;
  }

  /* ----------------------------Game Flow----------------------------------- */

  /** @return {ObjectManager} */
  getObjectManager() {
    return this._objectManager;
  }

  create() {

  }

  fixedUpdate() {
    EventEmitter.tick();

    /* update game object's fixedUpdate */
    this._gameMap.update();
    this._gameScreen.update();

    /* update internal physics system, i.e. p2.World */
    this._physics.tick(1 / 60.0);

    this._gameTick++;
    this._gameClockReal += new Date().getTime() - this._gameClockReal;
  }

  /**
   * Update is called once per frame. It is the main workhorse function for
   * frame updates.
   */
  update() {
    /* Handle Input */
  }

  /**
   * Must load all data and assets before calling start()
   * Start/Restart the game tick:
   * For objects added to the scene, the Start function will be called on
   * all  scripts before Update, etc are called for any of them. Naturally,
   * this cannot be enforced when an object is instantiated during game play.
   */
  start() {
    if (!this.database.isReady()) {
      throw new Error('Starting game without data.')
    }

    /*------------temp---*/
    this._objectManager.spawnUnit([5, 5]);

    this._gameMap.setup(1, this.database.getMap());
    this._physics.setup();

    /* start tick */
    this._gameClockReal = new Date().getTime();
    Game.log(`Game Started ${this._gameClockReal}`);

  }

  pause() {

  }

  /**
   * Stop the game tick
   */
  terminate() {
    this._gameScreen.clearZoom();
    /* terminate managers */
    this._physics.terminate();
    this._objectManager.terminate();
  }
}