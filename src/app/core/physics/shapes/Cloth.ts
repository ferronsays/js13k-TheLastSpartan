import V2 from "../../V2";
import Perlin from "../../Perlin";
import _PointMass from "../PointMass";
import _DistanceConstraint from "../DistanceConstraint";

class Cloth {
  public _points: any[];
  public _constraints: any[];
  public _segsY: number;
  public _segsX: number;

  public _fixedDeltaTime = 16;
  public _constraintAccuracy = 5;

  public _gravity: V2;

  // xstart, ystart, w, h, dim
  constructor(sX, sY, w, h, dim) {
    this._gravity = new V2(0, 0.25);

    this._points = [];
    this._constraints = [];

    this._segsY = Math.ceil(h / dim);
    this._segsX = Math.ceil(w / dim);

    for (var y = 0; y < this._segsY; y++) {
      for (var x = 0; x < this._segsX; x++) {
        var p = new _PointMass(sX + x * dim, sY + y * dim, y === 0);

        if (x) {
          this._constraints.push(
            new _DistanceConstraint(p, this._points[this._points.length - 1])
          );
        }

        if (y) {
          this._constraints.push(
            new _DistanceConstraint(
              p,
              this._points[x + this._segsX * (y - 1)]
            )
          );
        }

        this._points.push(p);
      }
    }
  }

  _update(dt, x, y) {
    // break up the elapsed time into manageable chunks
    var timeSteps = Math.floor(dt /* + this.leftOverDeltaTime */ / this._fixedDeltaTime);

    // store however much time is leftover for the next frame
    // this.leftOverDeltaTime = dt - timeSteps * this._fixedDeltaTime;

    // _update physics
    for (var i = 0; i < timeSteps; i++) {
      // _update each PointMass's position
      for (var j = 0; j < this._points.length; j++) {
        var pm = this._points[j];
        // pm.enforceBounds(0, 0, WIDTH, HEIGHT);

        pm._addForce(this._gravity);
        pm._update(1 / timeSteps);
      }

      // solve the cs multiple times
      // the more it's solved, the more accurate.
      for (var k = 0; k < this._constraintAccuracy; k++) {
        this._constraints.forEach((constraint) => constraint._resolve());

        // for (var p = 0; p < this._points.length; p++) {
        //   this._points[p].resolvecs();
        // }
      }
    }

    this._points[0]._position = new V2(x - 5, y);
    this._points[1]._position = new V2(x + 5, y);

    var r =
      Perlin._simplex3(x / 1000, (y - 50) / 1000, performance.now() / 2200) *
        Math.PI -
      Math.PI / 2;
    var heading = new V2(Math.cos(r), Math.sin(r))._normalize()._scale(0.1);

    this._points.map((p) => p._addForce(heading));
  }

  _draw(ctx, color) {
    var x, y;
    for (y = 1; y < this._segsY; ++y) {
      for (x = 1; x < this._segsX; ++x) {
        ctx._beginPath();

        var i1 = (y - 1) * this._segsX + x - 1;
        var i2 = y * this._segsX + x;

        ctx.moveTo(this._points[i1]._position.x, this._points[i1]._position.y);
        ctx._lineTo(this._points[i1 + 1]._position.x, this._points[i1 + 1]._position.y);

        ctx._lineTo(this._points[i2]._position.x, this._points[i2]._position.y);
        ctx._lineTo(this._points[i2 - 1]._position.x, this._points[i2 - 1]._position.y);

        ctx._fillStyle(color);

        ctx.fill();
      }
    }
  }
}

export default Cloth;
