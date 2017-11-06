// let renderComp = new RenderComponent();
// renderComp.opacity = 155;
// renderComp.blendMode = PIXI.BLEND_MODES.ADD;
// let compSprite = new SpriteRenderer();
// EventsManager.queueEvent(new Evnt_RequestSpriteRefresh(performance.now()));

function boooooooooooom() {
  let character = $gameMap.test_CreateObject(2, 5);

  let renderComp = character.getComponent(CharacterRenderer);
  renderComp.opacity = 155;
  renderComp.blendMode = PIXI.BLEND_MODES.ADD;

  let compSprite = new SpriteRenderer(renderComp);
  //todo: add to sprite set
  EventsManager.queueEvent(new Evnt_RequestSpriteRefresh(performance.now()));
}

/**
 * @extends {SpriteBase}
 * TODO: Refactor, I think most of the functions could be added to the render
 *   component
 */
class SpriteRenderer extends SpriteBase {
  /**
   * @param renderComponent {!RenderComponent}
   */
  constructor(renderComponent) {
    super();
    /** @private @type {RenderComponent} */
    this._renderComponent = null;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this.setComponent(renderComponent);
  }

  /**
   * @param component{RenderComponent}
   */
  setComponent(component) {
    this._renderComponent = component;
  }

  /** @override */
  update() {
    super.update();
    //check if imaged changed, and reset the bitmap
    this.updateBitmap_();
    //set the frame area base on pattern, direction, etc
    this.updateFrame_();
    //update the position base on the screen x,y,z
    this.updatePosition_();
    //opacity and blend mode
    this.updateOther_();
  }

  /** @override @protected */
  updateVisibility_() {
    super.updateVisibility_();
    if (this._renderComponent.isTransparent()) {
      this.visible = false;
    }
  }

  /** @private */
  updateBitmap_() {
    if (this.isImageChanged_()) {
      this.characterName_ = this._renderComponent.characterName();
      this.characterIndex_ = this._renderComponent.characterIndex();
      this.setCharacterBitmap_();
    }
  }

  /** @private @return {boolean} */
  isImageChanged_() {
    return (this.characterName_ !== this._renderComponent.characterName() ||
      this.characterIndex_ !== this._renderComponent.characterIndex());
  }

  /** @private */
  setCharacterBitmap_() {
    this.bitmap = ImageManager.loadCharacter(this.characterName_);
  }

  /** @private */
  updateFrame_() {
    this.updateCharacterFrame_();
  }

  /** @private */
  updateCharacterFrame_() {
    let pw = this.patternWidth_();
    let ph = this.patternHeight_();
    let sx = (this.characterBlockX_() + this.characterPatternX_()) * pw;
    let sy = (this.characterBlockY_() + this.characterPatternY_()) * ph;
    this.setFrame(sx, sy, pw, ph);
  }

  /** @private @return {number} */
  characterBlockX_() {
    let index = this._renderComponent.characterIndex();
    return index % 12;
  }

  /** @private @return {number} */
  characterBlockY_() {
    let index = this._renderComponent.characterIndex();
    return Math.floor(index / 4) * 4;
  }

  /** @private @return {number} */
  characterPatternX_() {
    return this._renderComponent.pattern();
  }

  /** @private @return {number} */
  characterPatternY_() {
    return (this._renderComponent.direction() - 2) / 2;
  }

  /** @private @return {number} */
  patternWidth_() {
    return this.bitmap.width / 12;
  }

  /** @private @return {number} */
  patternHeight_() {
    return this.bitmap.height / 8;
  }

  /** @private */
  updatePosition_() {
    this.x = this._renderComponent.screenX();
    this.y = this._renderComponent.screenY();
    this.z = this._renderComponent.screenZ();
  }

  /** @private */
  updateOther_() {
    this.opacity = this._renderComponent.opacity;
    this.blendMode = this._renderComponent.blendMode;
  }
}