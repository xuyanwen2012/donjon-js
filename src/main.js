import GameObject from './donjon_objects/game_object';
import {Components} from './core/const';
import ObjectManager from './managers/object_mannager';
import Behaviour from "./donjon_components/behaviour";
// let enemyBoss = ObjectManager.instantiate("Enemy", new Victor(6, 6));
// let enemyMinionA = ObjectManager.instantiate("Enemy", new Victor(6, 6), enemyBoss);
// let enemyMinionB = ObjectManager.instantiate("Enemy", new Victor(6, 6), enemyBoss);
//
// console.log(enemyBoss);
//const behaviour = require('../data/scripts/testBehaviour');
import behaviour from '../data/scripts/testBehaviour';

let obj = new GameObject("Robot");
obj.addComponent(Components.RIGIDBODY);
obj.addComponent(Components.CIRCLE_COLLIDER, 1, 2, 3, 4);

const mannager = new ObjectManager();

let player = ObjectManager.instantiate("Player");


let someBehaviour = new Behaviour(null);
Object.assign(someBehaviour, behaviour);

console.log(someBehaviour);

someBehaviour.update();

//GameObject.instantiate(obj);