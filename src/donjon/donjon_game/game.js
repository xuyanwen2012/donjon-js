import Database from './game_database';
import EventEmitter from '../core/event_emitter';
import ObjectManager from '../managers/object_mannager';
import Physics from '../managers/physics';
import GameScreen from './game_screen';
import GameMap from './game_map';
import Input from "../core/input";

/**
 * Server game Object.
 */
export default class Game {

  /**
   *
   */
  constructor() {
    /* Initialize Static Managers */
    EventEmitter.initialize();
    Input.initialize();

    this.database = new Database();

    /**
     * @type {Array.<Manager>}
     */
    this.managers = [
      new Physics(),
      new ObjectManager(),
    ];

    /** @private @type {GameScreen}*/
    this.gameScreen = new GameScreen();

    /** @private @type {GameMap}*/
    this.gameMap = new GameMap();


    this._setupClock();
    Game.log('Game Successfully Initialized.');
  }

  /* -----------------------------Static------------------------------------ */

  /**
   * @param msg {string}
   * @private
   */
  static log(msg) {
    console.log(msg);
  }

  /* -------------------Getter/Setter/Accessor-------------------------- */

  /** @return {GameMap} */
  getMap() {
    return this.gameMap;
  }

  /** @return {GameScreen} */
  getScreen() {
    return this.gameScreen;
  }

  // /** @return {Manager||ObjectManager} */
  // getObjectManager() {
  //   return this.managers[1];
  // }

  /* ----------------------------Game Flow----------------------------------- */

  /**
   * Notify all managers to initialize based on Client's loaded game data.
   * @param dataObjects
   */
  create(dataObjects) {
    this.managers.forEach(manager => manager.create(dataObjects));
  }

  /**
   * After data loaded, Game setup is loaded. Start the game and game clock.
   * Start/Restart the game tick:
   */
  start() {
    if (!this.database.isReady()) {
      throw new Error('Starting game without data.')
    }

    this.gameMap.setup(1, this.database.getMap());

    this.managers.forEach(manager => manager.start());

    /* start tick */
    this._gameClockReal = new Date().getTime();
    Game.log(`Game Started ${this._gameClockReal}`);
  }

  /**
   * Called constantly 60 frame per second.
   */
  fixedUpdate() {
    /* Update Static Class */
    EventEmitter.tick();
    Input.update();

    /* Update Game Instance */
    this.gameMap.update();
    this.gameScreen.update();

    this.managers.forEach(manager => manager.tick(1 / 60.0));

    this._updateClock();
  }

  /**
   * Update is called once per frame. It is the main workhorse function for
   * frame updates.
   */
  update() {
    /* Handle Input */
    //console.log(Input);
    // Input.update();
    // console.log(Input.dir8);
  }

  /**
   *
   */
  stop() {
    this.managers.forEach(manager => manager.stop());
  }

  /**
   *
   */
  terminate() {
    this.gameScreen.clearZoom();
    this.managers.forEach(manager => manager.terminate());
  }

  /* ----------------------------------------------------------------------- */

  _updateClock() {
    this._gameTick++;
    this._gameClockReal += new Date().getTime() - this._gameClockReal;
  }

  _setupClock() {
    /** @private @type {number}*/
    this._gameTick = 0;
    /** @private @type {number}*/
    this._gameClockReal = 0;
  }
}