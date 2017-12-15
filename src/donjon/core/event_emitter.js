/**
 *
 */
export default class EventEmitter {

  constructor() {
    throw new Error('This is a static class');
  }

  static initialize() {
    this.listeners.clear();
    EventEmitter.queuedEvents = [[], []];
  }

  /**
   * Subscribe to an event.
   *
   * @param name {string} the name of the event to subscribe to.
   * @param callback {function} the function to call when event is emitted.
   */
  static addListener(name, callback) {
    this.listeners.has(name) || this.listeners.set(name, []);
    this.listeners.get(name).push(callback);
  }

  /**
   * Trigger a named event
   *
   * @param name{string} the event name to emit
   * @param args any number of arguments to pass to the event subscribers
   * @return {boolean}
   */
  static emit(name, ...args) {
    const listeners = this.listeners.get(name);
    if (listeners && listeners.length) {
      listeners.forEach(listener => listener(...args));
      return true;
    }
    return false;
  }

  /**
   *
   * @param name {string} the event name to queue
   * @param args
   */
  static queueEvent(name, ...args) {
    if (this.listeners.has(name)) {
      this.queuedEvents[this.currentQueue].push([name, ...args]);
    }
  }

  /**
   *
   * @param name {string} the name of the event to un subscribe from
   * @param callback {function} the function used when binding to the event
   * @return {boolean}
   */
  static removeListener(name, callback) {
    const listeners = this.listeners.get(name);
    let index;

    if (listeners && listeners.length) {
      index = listeners.reduce((i, listener, index) => {
        return (typeof callback === 'function' || false) &&
        listener === callback ? (i = index) : i;
      }, -1);

      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(name, listeners);
        return true;
      }
    }
    return false;
  }

  /**
   *
   */
  static tick() {
    //swap queue
    let queueToProcess = this.currentQueue;
    this.currentQueue = (this.currentQueue + 1) % this.MAX;

    //process
    this.queuedEvents[queueToProcess].forEach(arr =>
      this.emit(...arr)
    );

    //clean up old processed queue
    this.queuedEvents[queueToProcess] = [];
  }
}

/**
 * @static
 * @private
 * @type {Map}
 */
EventEmitter.listeners = new Map();
/**
 * @static
 * @private
 * @type {[[],[]]}
 */
EventEmitter.queuedEvents = [[], []];
/**
 * @static
 * @private
 * @type {number}
 */
EventEmitter.currentQueue = 0;
/**
 * @static
 * @private
 * @type {number}
 */
EventEmitter.MAX = 2;