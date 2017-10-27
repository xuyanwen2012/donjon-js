import GameObject from './donjon_objects/game_objects';
import Rigidbody from "./donjon_components/comp_rigidbody";
import Collider from "./donjon_components/comp_collider";

let obj = new GameObject("Robot");
obj.addComponent(Rigidbody);
obj.addComponent(Collider);
const rigidbody = obj.getComponent(Rigidbody);
const collider = obj.getComponent(Collider);
collider.attachToRigidbody(rigidbody);

// let cloned = JSON.parse(JSON.stringify(obj));
let cloned = GameObject.instantiate(obj);


console.log(cloned);
if (cloned instanceof GameObject) {
  console.log("cloned is a instance of GameObject");
} else {
  console.log("cloned is NOT A instance of GameObject");
}
if (obj instanceof GameObject) {
  console.log("obj is a instance of GameObject");
} else {
  console.log("obj is NOT A instance of GameObject");
}

