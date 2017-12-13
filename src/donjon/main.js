import ObjectFactory from "./abstract_game_object/game_object/object_factory";

let factory = new ObjectFactory();
let createdObjs = [];

let prefab = factory.createObject({
  "Transform": {"scale": [1, 1]},
  "GraphicComponent": {"assetName": "HERO_hero1"},
  "Rigidbody": {"mass": 10000},
  "BoxCollider": {"width": 100, "height": 100},
  "CircleCollider": {"radius": 3.1415},
  "Animator": {}
});

function resetFactory() {
  createdObjs.forEach(obj => {
    factory.deleteObject(obj)
  });
}

function countDeltaTime(callback) {
  let dt = Date.now();
  callback();
  return Date.now() - dt;
}

function countAverageTime(num, callback) {
  let sum = 0;
  for (let i = 0; i < num; i++) {
    resetFactory();
    sum += countDeltaTime(callback);
  }
  let avg = sum / num;
  console.log(`Average Runtime of ${num} times is ${avg} ms.`);
}


/*------------------*/
countAverageTime(100, function () {
  for (let i = 0; i < 1000; i++) {
    createdObjs.push(factory.instantiate(prefab));
  }
});