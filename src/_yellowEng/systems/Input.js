export default class Input {
  static Events = {
    keyDown: "keydown",
    keyUp: "keyup",
    mouseDown: "mousedown",
    mouseUp: "mouseup",
  };
  static MousePostion = {
    x: 0,
    y: 0,
  };
  static #lookupTable = {};

  static GetKeyUp(key) {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.keyUp) return true;
    return false;
  }
  static GetKeyDown(key) {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.keyDown) return true;
    return false;
  }
  static GetMouseUp(key = "mouseLeft") {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.mouseUp) return true;
    return false;
  }
  static GetMouseDown(key = "mouseLeft") {
    let data = Input.#lookupTable[key];
    if (data == Input.Events.mouseDown) return true;
    return false;
  }
  static GetMousemove() {
    let event = Input.#lookupTable["mousemove"];
    if (!event) return null;
    return event;
  }
  static handleKeyDown(event) {
    Input.#lookupTable[event.key] = Input.Events.keyDown;
  }
  static handleKeyUp(event) {
    Input.#lookupTable[event.key] = Input.Events.keyUp;
  }
  static handleMouseDown(event) {
    // right-click
    if (event.button === 2) {
      Input.#lookupTable["mouseRight"] = Input.Events.mouseDown;
      return;
    }
    // left-click
    Input.#lookupTable["mouseLeft"] = Input.Events.mouseDown;
  }
  static handleMouseUp(event) {
    // right-click
    if (event.button === 2) {
      Input.#lookupTable["mouseRight"] = Input.Events.mouseUp;
      return;
    }
    // left-click
    Input.#lookupTable["mouseLeft"] = Input.Events.mouseUp;
  }
  static handleMouseMove(event) {
    Input.#lookupTable["mousemove"] = event;
    Input.MousePostion.x = (event.clientX / window.innerWidth) * 2 - 1;
    Input.MousePostion.y = -(event.clientY / window.innerHeight) * 2 + 1;

  }
  static setUpEventListeners() {
    window.addEventListener("keydown", Input.handleKeyDown);
    window.addEventListener("keyup", Input.handleKeyUp);
    window.addEventListener("mousedown", Input.handleMouseDown);
    window.addEventListener("mouseup", Input.handleMouseUp);
    window.addEventListener("mousemove", Input.handleMouseMove);
  }
  static removeEventListeners() {
    window.removeEventListener("keydown", Input.handleKeyDown);
    window.removeEventListener("keyup", Input.handleKeyUp);
    window.removeEventListener("mousedown", Input.handleMouseDown);
    window.removeEventListener("mouseup", Input.handleMouseUp);
    window.removeEventListener("mousemove", Input.handleMouseMove);
  }
  //Update clears all pressed inputs 
  static update(detaTime) {
    let keys = Object.keys(Input.#lookupTable);
    for (let key of keys) {
      if (Input.#lookupTable[key] == Input.Events.keyUp) {
        delete Input.#lookupTable[key];
      }
    }
    if (Input.#lookupTable["mouse"] == Input.Events.mouseUp) {
      delete Input.#lookupTable["mouse"];
    }
    delete Input.#lookupTable["mousemove"];
  }
}
