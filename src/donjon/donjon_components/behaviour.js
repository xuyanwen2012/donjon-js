import Component from "./component";

/**
 * @interface
 */
export default class Behaviour extends Component {

  /**
   * set the owner when construct the component.js
   * @param owner {GameObject}
   */
  constructor(owner) {
    super(owner);

  }

  /**
   * Awake is called when the script instance is being loaded.
   */
  awake() {
  }

  /**
   * Start is called on the frame when a script is enabled just before any
   * of the Update methods is called the first time.
   */
  start() {
  }

  /**
   * This function is called every fixed frame rate frame, if the behaviour is
   * enabled.
   */
  fixedUpdate() {
  }


  update() {
  }

}