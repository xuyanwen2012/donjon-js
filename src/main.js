import GameObject from './donjon_objects/game_object';
import Rigidbody from "./donjon_components/rigidbody";
import BoxCollider from "./donjon_components/box_collider";

let obj = new GameObject("Robot");
obj.addComponent(Rigidbody);
obj.addComponent(BoxCollider, 1, 2, 3, 4);


// let cloned = JSON.parse(JSON.stringify(obj));
//let cloned = GameObject.instantiate(obj);
// const collider = obj.getComponent(Collider);
// console.log(collider.attachedRigidbody);
// if (collider.attachedRigidbody) {
//
// }


// console.log(cloned);
// if (cloned instanceof GameObject) {
//   console.log("cloned is a instance of GameObject");
// } else {
//   console.log("cloned is NOT A instance of GameObject");
// }
// if (obj instanceof GameObject) {
//   console.log("obj is a instance of GameObject");
// } else {
//   console.log("obj is NOT A instance of GameObject");
// }

