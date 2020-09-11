import V2 from "../V2";

class PointMass {
  public _previousPosition: V2;
  public _position: V2;
  public _a: V2 = new V2();

  public _mass: number = 1;

  public _fixed: boolean;

  constructor(x, y, fixed = false) {
    this._position = new V2(x, y);

    this._previousPosition = this._position._copy();
    this._fixed = fixed;
  }

  _update(delta) {
    if (this._fixed) return;

    // var x = this._position.x;
    // var y = this._position.y;
    var pCopy = this._position._copy();

    this._a._scale(delta * delta);

    var fric = 0.015;

    // this._position.x = (2 - fric) * x - (1 - fric) * this._previousPosition.x + this._a.x;
    // this._position.y = (2 - fric) * y - (1 - fric) * this._previousPosition.y + this._a.y;

    this._position
      ._scale(2 - fric)
      ._subtract(this._previousPosition._copy()._scale(1 - fric))
      ._add(this._a);

    this._a._reset();

    this._previousPosition = pCopy;

    // this._previousPosition.x = x;
    // this._previousPosition.y = y;
  }

  // resolveConstraints() {
  //   var i = this.constraints.length;
  //   while (i--) this.constraints[i].resolve();

  //   // this._position.x > boundsx ? this._position.x = 2 * boundsx - this._position.x : 1 > this._position.x && (this._position.x = 2 - this._position.x);
  //   // this._position.y < 1 ? this._position.y = 2 - this._position.y : this._position.y > boundsy && (this._position.y = 2 * boundsy - this._position.y);
  // };

  // enforceBounds(x, y, w, h) {
  //   this._position.x = Math.max(x + 1, Math.min(w - 1, this._position.x));
  //   this._position.y = Math.max(y + 1, Math.min(h - 1, this._position.y));

  //   if (this._position.y >= h - 1)
  //     this._position.x -= (this._position.x - this._previousPosition.x + this._a.x);
  // }

  // attachElastic(pointmass, length, stiff, tear) {
  //   this.constraints.push(
  //     new ElasticConstraint(this, pointmass, length, stiff, tear)
  //   );
  // };

  // attachDistance(pointmass, length) {
  //   var constraint = new DistanceConstraint(this, pointmass, length);
  //   this.constraints.push(constraint);
  //   return constraint;
  // };

  // move(mV) {
  //   if (this._fixed) return;

  //   this._position._add(mV);
  // }

  _addForce(fV) {
    // acceleration = (1/mass) * force
    // or
    // acceleration = force / mass
    this._a._add(fV);
  }

  // removeAllConstraints() {
  //   this.constraints = [];
  // }

  // destroy() {
  //   this.removeAllConstraints();

  //   // TODO ???
  //   var i = this._positionhysics.points.length;
  //   while (i--) {
  //     if (points[i] == this) {
  //       points.splice(i, 1);
  //       this == null;
  //     }
  //   }
  // }

  // _draw(ctx) {
  //   ctx._beginPath();
  //   ctx.arc(this._positionosition.x, this._positionosition.y, 1, 0, 2 * Math.PI, 0);
  //   ctx.fillStyle = "#000";
  //   ctx.fill();
  // };
}

export default PointMass;
