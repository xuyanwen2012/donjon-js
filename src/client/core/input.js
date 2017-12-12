//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @namespace $game
 * @class ClientInput
 */
class ClientInput {

  constructor() {
    throw new Error('This is a static class');
  }

  static initialize() {
    this.wrapNwjsAlert();
    this.setupEventHandlers();
  }

  /**
   * @static
   * @method _setupEventHandlers
   * @private
   */
  static setupEventHandlers() {
    document.addEventListener('keydown', event =>
      Donjon.EventEmitter.emit('onKeyDown', event)
    );
    document.addEventListener('keyup', event =>
      Donjon.EventEmitter.emit('onKeyUp', event)
    );
    window.addEventListener('blur', event =>
      Donjon.EventEmitter.emit('onLostFocus', event)
    );
  }

  static wrapNwjsAlert() {
    if (Utils.isNwjs()) {
      let _alert = window.alert;
      window.alert = function () {
        let gui = require('nw.gui');
        let win = gui.Window.get();
        _alert.apply(this, arguments);
        win.focus();
        Input.clear();
      };
    }
  }
}