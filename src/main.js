import GameObject from './donjon_objects/game_object';
// import Rigidbody from "./donjon_components/rigidbody";
// import BoxCollider from "./donjon_components/box_collider";
import {Components} from './core/const';


let obj = new GameObject("Robot");
obj.addComponent(Components.RIGIDBODY);
obj.addComponent(Components.BOX_COLLIDER, 1, 2, 3, 4);


