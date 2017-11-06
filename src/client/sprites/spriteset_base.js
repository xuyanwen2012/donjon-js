//-----------------------------------------------------------------------------
// Spriteset_Base
//
// The superclass of Spriteset_Map.

class Spriteset_Base extends Sprite {

  constructor() {
    super();
    this.setFrame(0, 0, Graphics.width, Graphics.height);
    this._tone = [0, 0, 0, 0];
    this.opaque = true;
    this.createLowerLayer();
    this.createToneChanger();
    this.createUpperLayer();
    this.update();
  }

  createLowerLayer() {
    this.createBaseSprite();
  }

  createUpperLayer() {
    this.createScreenSprites();
  }

  update() {
    super.update();
    this.updateScreenSprites();
    this.updateToneChanger();
    this.updatePosition();
  }

  createBaseSprite() {
    this._baseSprite = new Sprite();
    this._baseSprite.setFrame(0, 0, this.width, this.height);
    this._blackScreen = new ScreenSprite();
    this._blackScreen.opacity = 255;
    this.addChild(this._baseSprite);
    this._baseSprite.addChild(this._blackScreen);
  }

  createToneChanger() {
    if (Graphics.isWebGL()) {
      this.createWebGLToneChanger();
    } else {
      this.createCanvasToneChanger();
    }
  }

  createWebGLToneChanger() {
    const margin = 48;
    const width = Graphics.width + margin * 2;
    const height = Graphics.height + margin * 2;
    this._toneFilter = new ToneFilter();
    this._baseSprite.filters = [this._toneFilter];
    this._baseSprite.filterArea = new Rectangle(-margin, -margin, width, height);
  }

  createCanvasToneChanger() {
    this._toneSprite = new ToneSprite();
    this.addChild(this._toneSprite);
  }

  createScreenSprites() {
    this._flashSprite = new ScreenSprite();
    this._fadeSprite = new ScreenSprite();
    this.addChild(this._flashSprite);
    this.addChild(this._fadeSprite);
  }

  updateScreenSprites() {
    const color = $gameScreen.flashColor();
    this._flashSprite.setColor(color[0], color[1], color[2]);
    this._flashSprite.opacity = color[3];
    this._fadeSprite.opacity = 255 - $gameScreen.brightness();
  }

  updateToneChanger() {
    const tone = $gameScreen.tone();
    if (!this._tone.equals(tone)) {
      this._tone = tone.clone();
      if (Graphics.isWebGL()) {
        this.updateWebGLToneChanger();
      } else {
        this.updateCanvasToneChanger();
      }
    }
  }

  updateWebGLToneChanger() {
    const tone = this._tone;
    this._toneFilter.reset();
    this._toneFilter.adjustTone(tone[0], tone[1], tone[2]);
    this._toneFilter.adjustSaturation(-tone[3]);
  }

  updateCanvasToneChanger() {
    const tone = this._tone;
    this._toneSprite.setTone(tone[0], tone[1], tone[2], tone[3]);
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