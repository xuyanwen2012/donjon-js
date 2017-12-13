//-----------------------------------------------------------------------------
import EventEmitter from "../managers/event_emitter";

/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */
export default class Input {


  constructor() {
    throw new Error('This is a static class');
  }

  /**
   * [read-only] The four direction value as a number of the numpad, or 0 for
   * neutral.
   *
   * @static
   * @property dir4
   * @type Number
   */
  static get dir4() {
    return this._dir4;
  }

  /**
   * [read-only] The eight direction value as a number of the numpad, or 0 for
   * neutral.
   *
   * @static
   * @property dir8
   * @type Number
   */
  static get dir8() {
    return this._dir8;
  }

  /**
   * @return {Array.<number>}
   */
  static get dirVic() {
    return this._dirVic;
  }

  /**
   * [read-only] The time of the last input in milliseconds.
   *
   * @static
   * @property date
   * @type Number
   */
  static get date() {
    return this._date;
  }

  /**
   * Initializes the input system.
   *
   * @static
   * @method initialize
   */
  static initialize() {
    this.clear();
    this._setupEventHandlers();
  }

  /**
   * Clears all the input data.
   *
   * @static
   * @method clear
   */
  static clear() {
    this.currentState_ = {};
    this._previousState = {};
    this._latestButton = null;
    this._pressedTime = 0;
    this._dir4 = 0;
    this._dir8 = 0;
    this._dirVic = [0, 0];
    this._preferredAxis = '';
    this._date = 0;
  }

  /**
   * Updates the input data.
   *
   * @static
   * @method update
   */
  static update() {
    if (this.currentState_[this._latestButton]) {
      this._pressedTime++;
    } else {
      this._latestButton = null;
    }
    for (const name in this.currentState_) {
      if (this.currentState_[name] && !this._previousState[name]) {
        this._latestButton = name;
        this._pressedTime = 0;
        this._date = Date.now();
      }
      this._previousState[name] = this.currentState_[name];
    }
    this._updateDirection();
  }

  /**
   * Checks whether a key is currently pressed down.
   *
   * @static
   * @method isPressed
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is pressed
   */
  static isPressed(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isPressed('escape')) {
      return true;
    } else {
      return !!this.currentState_[keyName];
    }
  }

  /**
   * Checks whether a key is just pressed.
   *
   * @static
   * @method isTriggered
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is triggered
   */
  static isTriggered(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
      return true;
    } else {
      return this._latestButton === keyName && this._pressedTime === 0;
    }
  }

  /**
   * Checks whether a key is just pressed or a key repeat occurred.
   *
   * @static
   * @method isRepeated
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is repeated
   */
  static isRepeated(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
      return true;
    } else {
      return (this._latestButton === keyName &&
        (this._pressedTime === 0 ||
          (this._pressedTime >= this.keyRepeatWait &&
            this._pressedTime % this.keyRepeatInterval === 0)));
    }
  }

  /**
   * Checks whether a key is kept depressed.
   *
   * @static
   * @method isLongPressed
   * @param {String} keyName The mapped name of the key
   * @return {Boolean} True if the key is long-pressed
   */
  static isLongPressed(keyName) {
    if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
      return true;
    } else {
      return (this._latestButton === keyName &&
        this._pressedTime >= this.keyRepeatWait);
    }
  }

  /**
   * @static
   * @method _setupEventHandlers
   * @private
   */
  static _setupEventHandlers() {
    let self = this;
    EventEmitter.addListener('onKeyDown', event => {
      self.onKeyDown(event)
    });
    EventEmitter.addListener('onKeyUp', event => {
      self.onKeyUp(event)
    });
    EventEmitter.addListener('onLostFocus', event => {
      self.onLostFocus(event)
    });
  }

  /**
   * @static
   * @method _onKeyDown
   * @param {KeyboardEvent} event
   * @private
   */
  static onKeyDown(event) {
    if (this.shouldPreventDefault(event.keyCode)) {
      event.preventDefault();
    }
    if (event.keyCode === 144) {    // Numlock
      this.clear();
    }
    const buttonName = this.keyMapper[event.keyCode];
    this.currentState_[buttonName] = true;
  }

  /**
   * @static
   * @method shouldPreventDefault
   * @param {Number} keyCode
   * @private
   */
  static shouldPreventDefault(keyCode) {
    switch (keyCode) {
      case 8:     // backspace
      case 33:    // pageup
      case 34:    // pagedown
      case 37:    // left arrow
      case 38:    // up arrow
      case 39:    // right arrow
      case 40:    // down arrow
        return true;
    }
    return false;
  }

  /**
   * @static
   * @method onKeyUp
   * @param {KeyboardEvent} event
   * @private
   */
  static onKeyUp(event) {
    const buttonName = this.keyMapper[event.keyCode];
    if (buttonName) {
      this.currentState_[buttonName] = false;
    }
    if (event.keyCode === 0) {  // For QtWebEngine on OS X
      this.clear();
    }
  }

  /**
   * @static
   * @method onLostFocus
   * @private
   */
  static onLostFocus() {
    this.clear();
  }

  /**
   * @static
   * @method _updateDirection
   * @private
   */
  static _updateDirection() {
    let x = this._signX();
    let y = this._signY();

    this._dir8 = this._makeNumpadDirection(x, y);
    this._dirVic[0] = x;
    this._dirVic[1] = y;

    if (x !== 0 && y !== 0) {
      if (this._preferredAxis === 'x') {
        y = 0;
      } else {
        x = 0;
      }
    } else if (x !== 0) {
      this._preferredAxis = 'y';
    } else if (y !== 0) {
      this._preferredAxis = 'x';
    }

    this._dir4 = this._makeNumpadDirection(x, y);
  }

  /**
   * @static
   * @method _signX
   * @private
   */
  static _signX() {
    let x = 0;

    if (this.isPressed('left')) {
      x--;
    }
    if (this.isPressed('right')) {
      x++;
    }
    return x;
  }

  /**
   * @static
   * @method _signY
   * @private
   */
  static _signY() {
    let y = 0;

    if (this.isPressed('up')) {
      y--;
    }
    if (this.isPressed('down')) {
      y++;
    }
    return y;
  }

  /**
   * @static
   * @method _makeNumpadDirection
   * @param {Number} x
   * @param {Number} y
   * @return {Number}
   * @private
   */
  static _makeNumpadDirection(x, y) {
    if (x !== 0 || y !== 0) {
      return 5 - y * 3 + x;
    }
    return 0;
  }

  /**
   * @static
   * @method _isEscapeCompatible
   * @param {String} keyName
   * @return {Boolean}
   * @private
   */
  static _isEscapeCompatible(keyName) {
    return keyName === 'cancel' || keyName === 'menu';
  }
}

/**
 * The wait time of the key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
Input.keyRepeatWait = 24;

/**
 * The interval of the key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
Input.keyRepeatInterval = 6;

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper = {
  9: 'tab',       // tab
  13: 'ok',       // enter
  16: 'shift',    // shift
  17: 'control',  // control
  18: 'control',  // alt
  27: 'escape',   // escape
  32: 'ok',       // space
  33: 'pageup',   // pageup
  34: 'pagedown', // pagedown
  37: 'left',     // left arrow
  38: 'up',       // up arrow
  39: 'right',    // right arrow
  40: 'down',     // down arrow
  45: 'escape',   // insert
  81: 'pageup',   // Q
  87: 'pagedown', // W
  88: 'escape',   // X
  90: 'ok',       // Z
  96: 'escape',   // numpad 0
  98: 'down',     // numpad 2
  100: 'left',    // numpad 4
  102: 'right',   // numpad 6
  104: 'up',      // numpad 8
  120: 'debug'    // F9
};

/**
 * A hash table to convert from a gamepad button to a mapped key name.
 *
 * @static
 * @property gamepadMapper
 * @type Object
 */
Input.gamepadMapper = {
  0: 'ok',        // A
  1: 'cancel',    // B
  2: 'shift',     // X
  3: 'menu',      // Y
  4: 'pageup',    // LB
  5: 'pagedown',  // RB
  12: 'up',       // D-pad up
  13: 'down',     // D-pad down
  14: 'left',     // D-pad left
  15: 'right',    // D-pad right
};