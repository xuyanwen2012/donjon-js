import GameObject from './donjon_objects/game_object';
// import Rigidbody from "./donjon_components/rigidbody";
// import BoxCollider from "./donjon_components/box_collider";
import {Components} from './core/const';
import ObjectManager from './mannagers/object_mannager';

let obj = new GameObject("Robot");
obj.addComponent(Components.RIGIDBODY);
obj.addComponent(Components.CIRCLE_COLLIDER, 1, 2, 3, 4);

const mannager = new ObjectManager();


//GameObject.instantiate(obj);