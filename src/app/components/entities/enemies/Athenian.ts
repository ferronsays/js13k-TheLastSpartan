import { Game } from "../../../main";
import Hoplite from "../Hoplite";

class Athenian extends Hoplite {
  public _retreatDelayCounter: number = 0;
  public _attackRange = 40;

  constructor(p) {
    super(p);
    this._speed = 5;
    this._maxForce = 1;
    this._maxSpeed = 3000;
    this._visionRange = 550;
    this._damage = 7;
    this._hp = this._maxHp = 50;
    this._color = "#84b9d1";
    this._steering._bWander._config._circleDistance = 0.15;
  }

  _update(dt) {
    if (this._stunDelayCounter > 0 || this._hitResponseCounter > 0) {
      if (this._z <= 4) {
        this._v._scale(.5);
      }
      super._update(dt);
      return;
    }

    var distToPlayer = this._distanceToPlayer();

    if (this._retreatDelayCounter > 0) {
      this._retreatDelayCounter -= dt;
      this._steering._flee(Game._scene._player, 3);
    } else {
      if (distToPlayer < this._visionRange) {
        if (distToPlayer < this._attackRange) {
          this._attack();
          setTimeout(() => {
            this._retreatDelayCounter = 600;
          }, 260); // wait until animation complete (~260ms)
        } else {
          this._steering._seek(Game._scene._player, 3);
        }
      } else {
        this._steering._wander(0.25);
      }

      if (this._steering._force.x > 0) {
        this._facingRight = true;
      } else if (this._steering._force.x < 0) {
        this._facingRight = false;
      }
    }

    this._steering._flock();

    // prevent sliding around
    this._v._scale(0);

    super._update(dt);
  }
}

export default Athenian;
