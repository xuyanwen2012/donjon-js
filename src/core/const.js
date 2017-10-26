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
