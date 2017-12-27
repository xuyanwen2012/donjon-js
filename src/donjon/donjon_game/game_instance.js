/**
 * @implements {InterfaceGameFlow}
 */
export default class GameInstance {
  constructor() {
  }

  /** @abstract */
  create() {
  }

  /** @abstract */
  start() {
  }

  /** @abstract */
  tick(dt) {
  }

  /** @abstract */
  stop() {
  }

  /** @abstract */
  terminate() {
  }
}