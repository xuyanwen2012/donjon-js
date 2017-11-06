/**
 * @extends Sprite
 */
class SpritesetBase extends Sprite {

  /**
   * @constructor
   */
  constructor() {
    super();
    this.setFrame(0, 0, Graphics.width, Graphics.height);

    /** @protected @type {Array<Sprite>} */
    this.spriteToAddBuffer_ = [];

    /** @protected @type {[number,number,number,number]} */
    this.tone_ = [0, 0, 0, 0];

    /** @type {boolean} */
    this.opaque = true;

    /** @protected @type {Sprite} */
    this.baseSprite_ = null;

    /** @protected @type {ScreenSprite} */
    this.blackScreen_ = null;

    /** @protected @type {ScreenSprite} */
    this.flashSprite_ = null;

    /** @protected @type {ScreenSprite} */
    this.fadeSprite_ = null;

    /** @protected @type {ToneFilter} */
    this.toneFilter_ = null;

    /** @protected @type {ToneSprite} */
    this.toneSprite_ = null;

    this.createLowerLayer_(); //Base screen, black screen;
    this.createToneChanger_();
    this.createUpperLayer_(); //Flash, fade, timer...
    this.update();
  }

  createLowerLayer_() {
    this.createBaseSprite_();
  }

  createUpperLayer_() {
    //this.createTimer();
    this.createScreenSprites_();
  }

  update() {
    super.update();
    this.updateScreenSprites();
    this.updateToneChanger();
    this.updatePosition();
  }

  /** @protected */
  createBaseSprite_() {
    this.baseSprite_ = new Sprite();
    this.baseSprite_.setFrame(0, 0, this.width, this.height);
    this.blackScreen_ = new ScreenSprite();
    this.blackScreen_.opacity = 255;
    this.addChild(this.baseSprite_);
    this.baseSprite_.addChild(this.blackScreen_);
  }

  /** @private */
  createToneChanger_() {
    if (Graphics.isWebGL()) {
      this.createWebGLToneChanger_();
    } else {
      this.createCanvasToneChanger_();
    }
  }

  /**
   * @private
   */
  createWebGLToneChanger_() {
    const margin = 48;
    const width = Graphics.width + margin * 2;
    const height = Graphics.height + margin * 2;
    this.toneFilter_ = new ToneFilter();
    this.baseSprite_.filters = [this.toneFilter_];
    this.baseSprite_.filterArea = new Rectangle(-margin, -margin, width, height);
  }

  /**
   * @private
   */
  createCanvasToneChanger_() {
    this.toneSprite_ = new ToneSprite();
    this.addChild(this.toneSprite_);
  }

  /**
   * @private
   */
  createScreenSprites_() {
    this.flashSprite_ = new ScreenSprite();
    this.fadeSprite_ = new ScreenSprite();
    this.addChild(this.flashSprite_);
    this.addChild(this.fadeSprite_);
  }

  updateScreenSprites() {
    const color = $gameScreen.flashColor();
    this.flashSprite_.setColor(color[0], color[1], color[2]);
    this.flashSprite_.opacity = color[3];
    this.fadeSprite_.opacity = 255 - $gameScreen.brightness();
  }

  updateToneChanger() {
    const tone = $gameScreen.tone();
    if (!this.tone_.equals(tone)) {
      this.tone_ = tone.clone();
      if (Graphics.isWebGL()) {
        this.updateWebGLToneChanger_();
      } else {
        this.updateCanvasToneChanger_();
      }
    }
  }

  updateWebGLToneChanger_() {
    const tone = this.tone_;
    this.toneFilter_.reset();
    this.toneFilter_.adjustTone(tone[0], tone[1], tone[2]);
    this.toneFilter_.adjustSaturation(-tone[3]);
  }

  updateCanvasToneChanger_() {
    const tone = this.tone_;
    this.toneSprite_.setTone(tone[0], tone[1], tone[2], tone[3]);
  }

  updatePosition() {
    const screen = $gameScreen;
    const scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX() * (scale - 1));
    this.y = Math.round(-screen.zoomY() * (scale - 1));
    this.x += Math.round(screen.shake());
  }
}