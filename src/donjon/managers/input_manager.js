import ObjectManager from "./object_mannager";
// import EventEmitter from "./event_emitter";

export default class InputManager {
  constructor() {
    throw new Error('This is a static class');
  }

  static initialize() {
    // EventEmitter.addListener('');
  }

  static debug_tick() {
    const player = ObjectManager.find('Player');
    player.transform.translate({x: 0.05, y: 0.05});
  }
}