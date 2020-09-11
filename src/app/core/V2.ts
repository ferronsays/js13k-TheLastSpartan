class V2 {
  public x: number;
  public y: number;

  static _add(a, b) {
    return new V2(a.x + b.x, a.y + b.y);
  }

  static _subtract(a, b) {
    return new V2(a.x - b.x, a.y - b.y);
  }

  static _scale(a, b) {
    return b instanceof V2
      ? new V2(a.x * b.x, a.y * b.y)
      : new V2(a.x * b, a.y * b);
  }

  // static dot(a, b) {
  //   return a.x * b.x + a.y * b.y;
  // }

  // static cross(a, b) {
  //   return a.x * b.y - a.y * b.x;
  // }

  // static equals(a, b) {
  //   return a.x === b.x && a.y === b.y;
  // }

  // static midPoint(a, b) {
  //   return V2._scale(V2._add(a, b), 0.5);
  // }

  static _distance(a, b) {
    return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
  }

  static _fromAngle(r) {
    return new V2(Math.cos(r), Math.sin(r));
  }

  // Rotates a vector around the origin. Shorthand for a rotation matrix
  static _rotateAroundOrigin(v, a) {
    return new V2(
      v.x * Math.cos(a) - v.y * Math.sin(a),
      v.x * Math.sin(a) + v.y * Math.cos(a)
    );
  }

  // Rotates a vector around a given point.
  // static _rotateAroundPoint(v, cp, a) {
  //   var v2 = V2._subtract(v, cp);
  //   return V2._add(
  //     cp,
  //     new V2(
  //       v2.x * Math.cos(a) - v2.y * Math.sin(a),
  //       v2.x * Math.sin(a) + v2.y * Math.cos(a)
  //     )
  //   );
  // }

  //
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  _copy() {
    return new V2(this.x, this.y);
  }

  // get magnitude of a vector
  _magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // lenSquared() {
  //   return this.x * this.x + this.y * this.y;
  // }

  // get the normal of a vector
  // normal() {
  //   return new V2(-this.y, this.x);
  // }

  // get a point along v2-v1, t is % along line
  // towards(v, t) {
  //   var dVec = v._subtract(this);
  //   var m = dVec.len();

  //   return this.add(dVec._normalize()._scale(t * m));
  // }

  // angle(v) {
  //   return Math.atan2(this.x * v.y - this.y * v.x, this.x * v.x + this.y * v.y);
  // }

  // angle2(vLeft, vRight) {
  //   return vLeft._subtract(this).angle(vRight._subtract(this));
  // }

  _normalize() {
    var m = this._magnitude();

    return m > 0 ? this._scale(1 / m) : this;
  }

  _limit(max) {
    if (this._magnitude() > max) {
      this._normalize();

      return this._scale(max);
    }

    return this;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  _subtract(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  // _negative() {
  //   return this._scale(-1);
  // }

  _scale(sc) {
    this.x *= sc;
    this.y *= sc;

    return this;
  }

  _floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  _reset() {
    this.x = 0;
    this.y = 0;
    return this;
  }
}

export default V2;
