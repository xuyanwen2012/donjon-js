import Component from './component';

export default class Animator extends Component {

  constructor(data) {
    super(data);
    this._stopCount = 0;
    this._pattern = 0;
    this._animationCount = 0;
  }

  copyConstructor(data) {
    this.maxPattern = data.maxPattern || 4;
    this.walkAnime = data.walkAnime || true;
    this.stepAnime = data.stepAnime || false;
  }

  /* ------------------- Game Flow -------------------------- */

  update() {
    this.updateAnimationCount();
    if (this._animationCount >= this.animationWait()) {
      this.updatePattern();
      this._animationCount = 0;
    }
  }

  updateAnimationCount() {
    // if (this.isMoving() && this.hasWalkAnime())
    this._animationCount += 1.5;
    // else if (this.hasStepAnime() || !this.isOriginalPattern())
    //this._animationCount++;
  }

  updatePattern() {
    // if (this._stopCount > 0) {
    //   this.resetPattern();
    // } else {
    this._pattern = (this._pattern + 1) % this.maxPattern;
    // }
  }

  animationWait() {
    // return (9 - this.realMoveSpeed()) * 3;
    return (9 - 3) * 3;
  }

  resetPattern() {
    this._pattern = 0;
  }

  setPattern(pattern) {
    this._pattern = pattern;
  }

  getPattern() {
    return this._pattern;
  }

  /* -------------------Serializable-------------------------- */

  serialize() {

  }

  deserialize(str) {

  }

  /* --------------------Messages--------------------------- */

  onInstantiate() {
    /* Animator must have a GraphicComp */
    this._graphicComp = this._owner.getGraphicComp();
    this._graphicComp.setAnimator(this);
  }

}