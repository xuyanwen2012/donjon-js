/**
 * A Container represents a collection of display objects.
 * It is the base class of all display objects that act as a container for
 * other objects.
 * @abstract
 * @extends {Stage} SceneBase
 */
class SceneBase extends Stage {
  /**
   * @constructor
   */
  constructor() {
    super();
    /** @private @type {boolean} */
    this.active_ = false;

    /** @private @type {number} */
    this.fadeSign_ = 0;

    /** @private @type {number} */
    this.fadeDuration_ = 0;

    /**
     * @type {ScreenSprite} a sprite that is covering all other sprite on screen
     * @private
     */
    this.fadeSprite_ = null;

    /** @private @type {WindowLayer} */
    this.windowLayer_ = null;

    /** @private @type {number} */
    this.imageReservationId_ = Utils.generateRuntimeId();
  }

  /**
   * Attach a reservation to the reserve queue.
   */
  attachReservation() {
    ImageManager.setDefaultReservationId(this.imageReservationId_);
  }

  /**
   * Remove the reservation from the Reserve queue.
   */
  detachReservation() {
    ImageManager.releaseReservation(this.imageReservationId_);
  }

  /** @abstract */
  create() {
  }

  terminate() {
    this.removeChild(this.fadeSprite_);
    this.removeChild(this.windowLayer_);
  }

  /**
   * @return {boolean}
   */
  isActive() {
    return this.active_;
  }

  /**
   * @return {boolean} if ImageManager is ready
   */
  isReady() {
    return ImageManager.isReady();
  }

  /**
   *
   */
  start() {
    this.active_ = true;
  }

  /**
   * Handle fading update and update all children
   */
  update() {
    EventsManager.tick();
    this.updateFade_();
    this.updateChildren_();
    AudioManager.checkErrors();
  }

  stop() {
    this.active_ = false;
  }

  /**
   * @return {boolean}
   */
  isBusy() {
    return this.fadeDuration_ > 0;
  }

  createWindowLayer() {
    let width = Graphics.boxWidth;
    let height = Graphics.boxHeight;
    let x = (Graphics.width - width) / 2;
    let y = (Graphics.height - height) / 2;
    this.windowLayer_ = new WindowLayer();
    this.windowLayer_.move(x, y, width, height);
    this.addChild(this.windowLayer_);
  }

  /**
   *
   * @param window{Window}
   */
  addWindow(window) {
    this.windowLayer_.addChild(window);
  }

  /**
   * @param duration {Number}
   * @param white {Boolean}
   */
  startFadeIn(duration, white = false) {
    this.createFadeSprite_(white);
    this.fadeSign_ = 1;
    this.fadeDuration_ = duration || 30;
    this.fadeSprite_.opacity = 255;
  }

  /**
   * @param duration {Number}
   * @param white {Boolean}
   */
  startFadeOut(duration, white = false) {
    this.createFadeSprite_(white);
    this.fadeSign_ = -1;
    this.fadeDuration_ = duration || 30;
    this.fadeSprite_.opacity = 0;
  }

  /**
   * @private
   * @param white {Boolean}
   */
  createFadeSprite_(white) {
    if (!this.fadeSprite_) {
      this.fadeSprite_ = new ScreenSprite();
      this.addChild(this.fadeSprite_);
    }
    if (white) {
      this.fadeSprite_.setWhite();
    } else {
      this.fadeSprite_.setBlack();
    }
  }

  /** @private */
  updateFade_() {
    if (this.fadeDuration_ > 0) {
      let d = this.fadeDuration_;
      if (this.fadeSign_ > 0) {
        this.fadeSprite_.opacity -= this.fadeSprite_.opacity / d;
      } else {
        this.fadeSprite_.opacity += (255 - this.fadeSprite_.opacity) / d;
      }
      this.fadeDuration_--;
    }
  }

  /**
   * the children includes {PIXI.DisplayObject}
   * @protected
   */
  updateChildren_() {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.update) {
        child.update();
      }
    }
  }

  popScene() {
    SceneManager.pop();
  }

  checkGameover() {
    // if ($gameParty.isAllDead()) {
    //     SceneManager.goto(Scene_Gameover);
    // }
  }

  fadeOutAll() {
    const time = this.slowFadeSpeed() / 60;
    AudioManager.fadeOutBgm(time);
    AudioManager.fadeOutBgs(time);
    AudioManager.fadeOutMe(time);
    this.startFadeOut(this.slowFadeSpeed());
  }

  fadeSpeed() {
    return 24;
  }

  slowFadeSpeed() {
    return this.fadeSpeed() * 2;
  }
}