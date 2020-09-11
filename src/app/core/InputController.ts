class InputController {
  public _KeyW: boolean;
  public _KeyA: boolean;
  public _KeyS: boolean;
  public _KeyD: boolean;
  public _KeyJ: boolean;
  public _KeyK: boolean;
  public _Space: boolean;

  constructor() {

    var listener = (flag) => (e) => {
      if(e.which === 1) {
        this._KeyJ = flag;
      } else if (e.which === 3) {
        e.preventDefault();
        this._KeyK = flag;
      }

      switch (e.code) {
        case "KeyD": //d
          this._KeyD = flag;
          break;
        case "KeyS": //s
          this._KeyS = flag;
          break;
        case "KeyA": //a
          this._KeyA = flag;
          break;
        case "KeyW": //w
          this._KeyW = flag;
          break;
        case "Space": //space
          this._Space = flag;
          break;
        case "KeyJ": //j
          this._KeyJ = flag;
          break;
        case "KeyK": //k
          this._KeyK = flag;
          break;
      }
    }
    
    window.addEventListener("keydown", listener(true));
    window.addEventListener("keyup", listener(false));
    window.addEventListener("mousedown", listener(true));
    window.addEventListener("mouseup", listener(false));
  }

  // init(canvas) {
  //   function getMousePos(canvas, evt) {
  //     var rect = canvas.getBoundingClientRect();
  //     return {
  //       x: evthis.clientX - recthis.left,
  //       y: evthis.clientY - recthis.top,
  //     };
  //   }

  //   canvas.addEventListener(
  //     "mousemove",
  //     (evt) => {
  //       this.mousePosition = getMousePos(canvas, evt);
  //     },
  //     false
  //   );

  //   canvas.addEventListener("mousedown", (evt) => {
  //     this.mouseDown = true;
  //   });

  //   canvas.addEventListener("mouseup", (evt) => {
  //     this.mouseDown = false;
  //   });
  // }
}

export default new InputController();
