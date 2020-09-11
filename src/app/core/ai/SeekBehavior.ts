import V2 from "../V2";
import Behavior from "./Behavior";

class SeekBehavior extends Behavior {
  constructor(actor) {
    super(actor);

    this._config = {
      _strength: 2,
    };
  }

  // @ts-ignore
  _run(target, strengthMod) {
    var desiredVelocity = V2._subtract(target._position, this._actor._position)
      ._normalize()
      ._scale(strengthMod || this._config._strength);

    return desiredVelocity;
  }
}

export default SeekBehavior;
