import GameObject from './donjon_objects/game_object';
import {Components} from './core/const';
import ObjectManager from './mannagers/object_mannager';
import Victor from 'victor';

let obj = new GameObject("Robot");
obj.addComponent(Components.RIGIDBODY);
obj.addComponent(Components.CIRCLE_COLLIDER, 1, 2, 3, 4);

const mannager = new ObjectManager();

let player = ObjectManager.instantiate("Player");

let enemyBoss = ObjectManager.instantiate("Enemy", new Victor(6, 6));
let enemyMinionA = ObjectManager.instantiate("Enemy", new Victor(6, 6), enemyBoss);
let enemyMinionB = ObjectManager.instantiate("Enemy", new Victor(6, 6), enemyBoss);

console.log(enemyBoss);


//GameObject.instantiate(obj);