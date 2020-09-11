import GameObject from "../GameObject";

class Behavior {
  public _actor: GameObject;
  public _config: any;

  constructor(actor) {
    this._actor = actor;
    this._config = {};
  }

  // turnToFace(vec) {
  //   var desiredAngle = this.getAngleToPoint(vec);

  //   var difference = wrapAngle(desiredAngle - this.actor.direction);

  //   difference = clamp(difference, -this.actor._turnSpeed, this.actor._turnSpeed);
  //   this.actor.r = wrapAngle(this.actor.r + difference);
  // }

  // turnAwayFrom(vec) {
  //   var desiredAngle = this.getAngleToPoint(vec);
  //   desiredAngle -= Math.PI;

  //   var difference = wrapAngle(desiredAngle - this.actor.r);

  //   difference = clamp(difference, -this.actor._turnSpeed, this.actor._turnSpeed);
  //   this.actor.r = wrapAngle(this.actor.r + difference);
  // }

  // getAngleToPoint(point) {
  //   var x = point.x - this.actor.p.x;
  //   var y = point.y - this.actor.p.y;

  //   return Math.atan2(y, x);
  // }
}

export default Behavior;