import Behavior from "./Behavior";
import V2 from "../V2";

class WanderBehavior extends Behavior {
  public _wanderAngle: number;
  constructor(actor, _circleDistance = 6, _strength = 1, _angleChange = Math.PI /4) {
    super(actor);

    this._config = {
      _circleDistance,
      _strength, // aka circle radius for wander circle
      _angleChange,
    }

    this._wanderAngle = actor._rotation;
  }

  // @ts-ignore
  _run(strengthMod) {
    var circleCenter = this._actor._v._copy();
    circleCenter._normalize();
    circleCenter._scale(this._config._circleDistance);

    var displacement = new V2(0, -1);
    displacement._scale(strengthMod || this._config._strength);

    var len = displacement._magnitude();
    displacement.x = Math.cos(this._wanderAngle) * len;
    displacement.y = Math.sin(this._wanderAngle) * len;

    this._wanderAngle += Math.random() * this._config._angleChange - this._config._angleChange * 0.5;

    return V2._add(circleCenter, displacement);
  }
}

export default WanderBehavior;