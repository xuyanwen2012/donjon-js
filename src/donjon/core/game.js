import Database from './game_database';
import EventEmitter from '../managers/event_emitter';
import ObjectManager from '../managers/object_mannager';
import Physics from './physics';
import GameScreen from '../donjon_objects/game_screen';
import DonjonMap from '../donjon_objects/donjon_map';

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
    ObjectManager.initialize();
    ObjectManager.createTempPrefabs(); // temp

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

    this.log('Game Successfully Initialized.');
  }

  /** @return {DonjonMap} */
  get gameMap() {
    return this._gameMap;
  }

  /** @return {GameScreen} */
  get gameScreen() {
    return this._gameScreen;
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

    /* construct game instances from data loaded.  */
    this._gameMap.setup(1, this.database.getMap());

    /* construct physics world from game objects */
    this._physics.setup();

    /* Board cast 'start' message to all objects */

    /* start tick */
    this._gameClockReal = new Date().getTime();
    this.log(`Game Started ${this._gameClockReal}`);
  }

  /**
   * FixedUpdate is often called more frequently than Update. It can be
   * called multiple times per frame, if the frame rate is low and it may
   * not be called between frames at all if the frame rate is high. All
   * physics calculations and updates occur immediately after FixedUpdate.
   * When applying movement calculations inside FixedUpdate, you do not need
   * to multiply your values by Time.deltaTime. This is because FixedUpdate
   * is called on a reliable timer, independent of the frame rate.
   */
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
   * LateUpdate is called once per frame, after Update has finished. Any
   * calculations that are performed in Update will have completed when
   * LateUpdate begins.
   */
  lateUpdate() {


  }

  pause() {

  }

  /**
   * Stop the game tick
   */
  terminate() {

  }

  /**
   * @param msg {string}
   * @private
   */
  log(msg) {
    console.log(msg);
  }
}