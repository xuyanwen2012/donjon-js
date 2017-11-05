import Victor from 'victor';
import GameObject from '../donjon_objects/game_object';
import {Components} from "../core/const";

const fs = require("fs");

export default class ObjectManager {


  constructor() {

    ObjectManager.createTempPrefabs();

  }


  static createTempPrefabs() {
    this.prefabs_ = new Map();

    let name1 = "Player";
    let obj1 = new GameObject(name1);
    obj1.addComponent(Components.RIGIDBODY);
    obj1.addComponent(Components.CIRCLE_COLLIDER, -24, -24, 24);

    let name2 = "Enemy";
    let obj2 = new GameObject(name2);
    obj2.addComponent(Components.RIGIDBODY);
    obj2.addComponent(Components.BOX_COLLIDER, -24, -24, 48, 48);

    let name3 = "Spawn Area";
    let obj3 = new GameObject(name3);
    obj3.addComponent(Components.CIRCLE_COLLIDER, 0, 0, 48 * 2);

    this.prefabs_.set(name1, obj1);
    this.prefabs_.set(name2, obj2);
    this.prefabs_.set(name3, obj3);
    console.log("Down Creating Prefabs");
  }

  static createObjectPool() {

  }

  /**
   *
   *
   * @param objectName {string} name in prefabs.
   * @param position {Victor=} new position to deploy this object.
   * @return {GameObject} cloned object.
   */
  static instantiate(objectName, position = null) {
    let original = this.prefabs_.get(objectName);
    if (!objectName) {
      console.log("ERROR: no such object in prefab: " + objectName);
      return null;
    }
    return GameObject.instantiate(original, position);
  }


}