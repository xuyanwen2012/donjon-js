/**
 * @static
 * @constant
 * @name Components
 * @memberof Donjon
 * @type {object}
 * @property {number} NULL
 * @property {number} TRANSFORM
 * @property {number} RIGIDBODY
 * @property {number} BOX_COLLIDER
 * @property {number} CIRCLE_COLLIDER
 * @property {number} POLYGON_COLLIDER
 * @property {number} RENDER
 */
export const Components = {
  NULL: 0,
  TRANSFORM: 1,
  RIGIDBODY: 2,
  BOX_COLLIDER: 3,
  CIRCLE_COLLIDER: 4,
  POLYGON_COLLIDER: 5,
  RENDER: 6,
};

/**
 * @static
 * @constant
 * @name Shapes
 * @memberof Donjon
 * @type {object}
 * @property {number} POLYGON
 * @property {number} RECTANGLE
 * @property {number} CIRCLE
 */
export const Shapes = {
  POLYGON: 0,
  RECTANGLE: 1,
  CIRCLE: 2,
};


/**
 * @static
 * @constant
 * @name CollisionDetectionModes
 * @memberof Donjon
 * @type {object}
 * @property {number} DISCRETE
 * @property {number} CONTINUOUS
 */
export const CollisionDetectionModes = {
  DISCRETE: 1,
  CONTINUOUS: 2,
};

/**
 * @static
 * @constant
 * @name RigidBodyTypes
 * @memberof Donjon
 * @type {object}
 * @property {number} DYNAMIC
 * @property {number} KINEMATIC
 * @property {number} STATIC
 */
export const RigidBodyTypes = {
  DYNAMIC: 1,
  KINEMATIC: 2,
  STATIC: 3,
};

/**
 * @static
 * @constant
 * @name SleepModes
 * @memberof Donjon
 * @type {object}
 * @property {number} NEVER_SLEEP
 * @property {number} START_AWAKE
 * @property {number} START_ASLEEP
 */
export const SleepModes = {
  NEVER_SLEEP: 1,
  START_AWAKE: 2,
  START_ASLEEP: 3,
};
