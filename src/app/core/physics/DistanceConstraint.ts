import V2 from "../V2";
import PointMass from "./PointMass";

class DistanceConstraint {
  public _p1: PointMass;
  public _p2: PointMass;
  public _stiffness: number;
  public _restingDistance: number;

  constructor(p1, p2) {
    this._p1 = p1;
    this._p2 = p2;
    this._stiffness = 0.5;

    // if distance unspecified, use distance between pointmasses
    this._restingDistance = V2._distance(p1._position, p2._position);
  }

  _resolve() {
    var p1vec = this._p1._position,
      p2vec = this._p2._position;

    var delta = V2._subtract(p1vec, p2vec);
    var d = delta._magnitude();

    var restingRatio =
      d === 0 ? this._restingDistance : (this._restingDistance - d) / d;

    var scalarP1 = 0.5 * this._stiffness;
    var scalarP2 = this._stiffness - scalarP1;

    //push/pull based on mass
    var p1VecDiff = V2._scale(delta, scalarP1 * restingRatio);
    if (!this._p1._fixed) {
      p1vec.x += p1VecDiff.x;
      p1vec.y += p1VecDiff.y;
    }

    var p2VecDiff = V2._scale(delta, scalarP2 * restingRatio);
    if (!this._p2._fixed) {
      p2vec.x -= p2VecDiff.x;
      p2vec.y -= p2VecDiff.y;
    }
    return d;
  }

  // _draw(ctx) {
  //   ctx.strokeStyle = "rgba(150,150,150,0.9)";
  //   ctx._beginPath();
  //   ctx.moveTo(this.p1.p.x, this.p1.p.y);
  //   ctx._lineTo(this.p2.p.x, this.p2.p.y);
  //   ctx.stroke();
  // }
}

export default DistanceConstraint;
