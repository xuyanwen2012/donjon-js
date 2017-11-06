/**
 *
 */
class ConfigManager {
  /**
   * @constructor
   */
  constructor() {
    throw new Error('This is a static class');
  }

  /**
   * @return {number}
   */
  static get bgmVolume() {
    return AudioManager._bgmVolume;
  }

  // noinspection JSAnnotator
  /**
   * @param value {Integer}
   */
  static set bgmVolume(value) {
    AudioManager.bgmVolume = value;
  }


  static get bgsVolume() {
    return AudioManager._bgsVolume;
  }

  // noinspection JSAnnotator
  /**
   * @param value {Integer}
   */
  static set bgsVolume(value) {
    AudioManager.bgsVolume = value;
  }

  static get meVolume() {
    return AudioManager._meVolume;
  }

  // noinspection JSAnnotator
  /**
   * @param value {Integer}
   */
  static set meVolume(value) {
    AudioManager.meVolume = value;
  }

  static load() {
    let json;
    let config = {};
    try {
      json = StorageManager.load(-1);
    } catch (e) {
      console.error(e);
    }
    if (json) {
      config = JSON.parse(json);
    }
    this.applyData(config);
  }

  static save() {
    StorageManager.save(-1, JSON.stringify(this.makeData()));
  }

  /**
   * @return {{}}
   */
  static makeData() {
    const config = {};
    config.alwaysDash = this.alwaysDash;
    config.commandRemember = this.commandRemember;
    config.bgmVolume = this.bgmVolume;
    config.bgsVolume = this.bgsVolume;
    config.meVolume = this.meVolume;
    config.seVolume = this.seVolume;
    return config;
  }

  /**
   * @param config
   */
  static applyData(config) {
    this.alwaysDash = this.readFlag(config, 'alwaysDash');
    this.commandRemember = this.readFlag(config, 'commandRemember');
    this.bgmVolume = this.readVolume(config, 'bgmVolume');
    this.bgsVolume = this.readVolume(config, 'bgsVolume');
    this.meVolume = this.readVolume(config, 'meVolume');
    this.seVolume = this.readVolume(config, 'seVolume');
  }

  /**
   * @param config {{}}
   * @param name {String}
   * @return {boolean}
   */
  static readFlag(config, name) {
    return !!config[name];
  }

  /**
   * @param config {{}}
   * @param name {String}
   * @return {Number}
   */
  static readVolume(config, name) {
    const value = config[name];
    if (value !== undefined) {
      return Number(value).clamp(0, 100);
    } else {
      return 100;
    }
  }


}

ConfigManager.alwaysDash = false;
ConfigManager.commandRemember = false;
