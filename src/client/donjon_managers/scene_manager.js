/**
 * a static class replacing RMMV SceneManager
 * @static {SceneManager}
 */
class SceneManager {

  /**
   * @constructor
   */
  constructor() {
    throw new Error('This is a static class');
  }

  /**
   * Gets the current time in ms.
   * @return {number|*}
   */
  static getTimeInMs() {
    return performance.now();
  }

  /**
   *
   * @param sceneClass {SceneBase}
   */
  static run(sceneClass) {
    try {
      this.initialize();
      this.goto(sceneClass);
      this.requestUpdate();
    } catch (e) {
      this.catchException(e);
    }

    //Yep Core
    if (Utils.isMobileDevice() ||
      Utils.isMobileSafari() ||
      Utils.isAndroidChrome())
      return;
    let resizeWidth = Graphics.boxWidth - window.innerWidth;
    let resizeHeight = Graphics.boxHeight - window.innerHeight;
    // debug console
    this._openConsole();
    //resize
    window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    window.resizeBy(resizeWidth, resizeHeight);
  }

  static _openConsole() {
    if (Utils.isNwjs() && Utils.isOptionValid('test')) {
      let _debugWindow = require('nw.gui').Window.get().showDevTools();
      _debugWindow.moveTo(0, 0);
      window.focus();
    }
  };

  static debug() {
    console.log(SceneManager._currentTime);
    console.log(this._currentTime);
  }


  static initialize() {
    this.initGraphics();
    this.checkFileAccess();
    this.initAudio();
    this.initInput();
    this.initNwjs();
    this.checkPluginErrors();
    this.setupErrorHandlers();
  }

  static initGraphics() {
    let type = this.preferableRendererType();
    Graphics.initialize(this._screenWidth, this._screenHeight, type);
    Graphics.boxWidth = this._boxWidth;
    Graphics.boxHeight = this._boxHeight;
    Graphics.setLoadingImage('img/system/Loading.png');
    if (Utils.isOptionValid('showfps')) {
      Graphics.showFps();
    }
    if (type === 'webgl') {
      this.checkWebGL();
    }
  }

  static preferableRendererType() {
    if (Utils.isOptionValid('canvas')) {
      return 'canvas';
    } else if (Utils.isOptionValid('webgl')) {
      return 'webgl';
    } else {
      return 'auto';
    }
  }

  static shouldUseCanvasRenderer() {
    return Utils.isMobileDevice();
  }

  static checkWebGL() {
    if (!Graphics.hasWebGL()) {
      throw new Error('Your browser does not support WebGL.');
    }
  }

  static checkFileAccess() {
    if (!Utils.canReadGameFiles()) {
      throw new Error('Your browser does not allow to read local files.');
    }
  }

  static initAudio() {
    let noAudio = Utils.isOptionValid('noaudio');
    if (!WebAudio.initialize(noAudio) && !noAudio) {
      throw new Error('Your browser does not support Web Audio API.');
    }
  }

  static initInput() {
    Input.initialize();
    TouchInput.initialize();
  }

  static initNwjs() {
    if (Utils.isNwjs()) {
      let gui = require('nw.gui');
      let win = gui.Window.get();
      if (process.platform === 'darwin' && !win.menu) {
        let menubar = new gui.Menu({type: 'menubar'});
        let option = {hideEdit: true, hideWindow: true};
        menubar.createMacBuiltin('Game', option);
        win.menu = menubar;
      }
    }
  }

  static checkPluginErrors() {
    PluginManager.checkErrors();
  }

  static setupErrorHandlers() {
    window.addEventListener('error', this.onError.bind(this));
    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  static requestUpdate() {
    if (!this._stopped) {
      requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   *  CHANGED The frame update
   */
  static update() {
    try {
      this.tickStart();
      if (Utils.isMobileSafari()) {
        this.updateInputData();
      }
      this.updateManagers();
      this.updateMain();

      this.tickEnd();
    } catch (e) {
      this.catchException(e);
    }


  }

  static terminate() {
    window.close();
  }

  /**
   * @param e {Error}
   */
  static onError(e) {
    console.error(e.message);
    console.error(e.filename, e.lineno);
    try {
      this.stop();
      Graphics.printError('Error', e.message);
      AudioManager.stopAll();
    } catch (e2) {
    }
  }

  /**
   * @param event
   */
  static onKeyDown(event) {
    if (!event.ctrlKey && !event.altKey) {
      switch (event.keyCode) {
        case 116:   // F5
          if (Utils.isNwjs()) {
            location.reload();
          }
          break;
        case 119:   // F8
          if (Utils.isNwjs() && Utils.isOptionValid('test')) {
            require('nw.gui').Window.get().showDevTools();
          }
          break;
      }
    }
  }

  /**
   *
   * @param e{Error}
   */
  static catchException(e) {
    if (e instanceof Error) {
      Graphics.printError(e.name, e.message);
      console.error(e.stack);
    } else {
      Graphics.printError('UnknownError', e);
    }
    AudioManager.stopAll();
    this.stop();
  }

  static tickStart() {
    Graphics.tickStart();
  }

  static tickEnd() {
    Graphics.tickEnd();
  }

  static updateInputData() {
    Input.update();
    TouchInput.update();
  }

  /**
   * TODO: Make unity still update
   */
  static updateMain() {
    if (Utils.isMobileSafari()) {
      this.changeScene();
      this.updateScene();
    } else {
      let newTime = this.getTimeInMs();
      let fTime = (newTime - this._currentTime) / 1000;
      if (fTime > 0.25) fTime = 0.25;
      this._currentTime = newTime;
      this._accumulator += fTime;

      while (this._accumulator >= this._deltaTime) {
        this.updateInputData();
        this.changeScene();
        this.updateScene();
        this._accumulator -= this._deltaTime;
      }

      this.renderScene();
      //this.renderGizmo;
      //this.renderGUI();
      this.requestUpdate();
    }
  }

  static updateManagers() {
    ImageManager.update();
  }

  /**
   * @static
   * check if can change scene, create the new scene
   */
  static changeScene() {
    if (this.isSceneChanging() && !this.isCurrentSceneBusy()) {
      if (this._scene) {
        this._scene.terminate();
        this._scene.detachReservation();
        this._previousClass = this._scene.constructor;
      }
      this._scene = this._nextScene;
      if (this._scene) {
        this._scene.attachReservation();
        this._scene.create();
        this._nextScene = null;
        this._sceneStarted = false;
        this.onSceneCreate();
      }
      if (this._exiting) {
        this.terminate();
      }
    }
  }

  /**
   * start the scene if not, else update it.
   * @static
   */
  static updateScene() {
    if (this._scene) {
      if (!this._sceneStarted && this._scene.isReady()) {
        this._scene.start();
        this._sceneStarted = true;
        this.onSceneStart();
      }
      if (this.isCurrentSceneStarted()) {
        this._scene.update();
      }
    }
  }

  static renderScene() {
    if (this.isCurrentSceneStarted()) {
      Graphics.render(this._scene);
    } else if (this._scene) {
      this.onSceneLoading();
    }
  }

  static onSceneCreate() {
    Graphics.startLoading();
  }

  static onSceneStart() {
    Graphics.endLoading();
  }

  static onSceneLoading() {
    Graphics.updateLoading();
  }

  static isSceneChanging() {
    return this._exiting || !!this._nextScene;
  }

  static isCurrentSceneBusy() {
    return this._scene && this._scene.isBusy();
  }

  static isCurrentSceneStarted() {
    return this._scene && this._sceneStarted;
  }

  /**
   *
   * @param sceneClass {SceneBase}
   * @return {SceneBase|boolean}
   */
  static isNextScene(sceneClass) {
    return this._nextScene && this._nextScene.constructor === sceneClass;
  }

  /**
   *
   * @param sceneClass
   * @return {boolean}
   */
  static isPreviousScene(sceneClass) {
    return this._previousClass === sceneClass;
  }

  /**
   * @param sceneClass {SceneBase}
   */
  static goto(sceneClass) {
    if (sceneClass) {
      this._nextScene = new sceneClass();
    }
    if (this._scene) {
      this._scene.stop();
    }
  }

  /**
   *
   * @param sceneClass {SceneBase}
   */
  static push(sceneClass) {
    this._stack.push(this._scene.constructor);
    this.goto(sceneClass);
  }

  static pop() {
    if (this._stack.length > 0) {
      this.goto(this._stack.pop());
    } else {
      this.exit();
    }
  }

  static exit() {
    this.goto(null);
    this._exiting = true;
  }

  static clearStack() {
    this._stack = [];
  }

  static stop() {
    this._stopped = true;
  }

  static prepareNextScene() {
    this._nextScene.prepare.apply(this._nextScene, arguments);
  }

  /**
   *
   * @return {Bitmap}
   */
  static snap() {
    return Bitmap.snap(this._scene);
  }

  static snapForBackground() {
    this._backgroundBitmap = this.snap();
    this._backgroundBitmap.blur();
  }

  static backgroundBitmap() {
    return this._backgroundBitmap;
  }

  static resume() {
    this._stopped = false;
    this.requestUpdate();
    if (!Utils.isMobileSafari()) {
      this._currentTime = this.getTimeInMs();
      this._accumulator = 0;
    }
  }

}


/**
 * @type {SceneBase}
 * @private
 */
SceneManager._scene = null;
/**
 * @type {SceneBase}
 * @private
 */
SceneManager._nextScene = null;
/**
 * @type {Array<SceneBase>}
 * @private
 */
SceneManager._stack = [];
SceneManager._stopped = false;
SceneManager._sceneStarted = false;
SceneManager._exiting = false;
SceneManager._previousClass = null;
/**
 * @type {Bitmap}
 * @private
 */
SceneManager._backgroundBitmap = null;
SceneManager._screenWidth = 1280;
SceneManager._screenHeight = 720;
SceneManager._boxWidth = 1280;
SceneManager._boxHeight = 720;
SceneManager._deltaTime = 1.0 / 60.0;
SceneManager._currentTime = SceneManager.getTimeInMs();
SceneManager._accumulator = 0.0;
