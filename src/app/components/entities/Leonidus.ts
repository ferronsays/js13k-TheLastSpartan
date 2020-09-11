import InputController from "../../core/InputController";
import Hoplite from "./Hoplite";
import Cloth from "../../core/physics/shapes/Cloth";
import Animation from "../../core/Animation";
import { altAttack, specialAttack } from "./hopliteAnimationConfigs";
import { Game } from "../../main";
import { CollisionRect } from "../../core/SimpleCollision/index";
import V2 from "../../core/V2";
import { sfx } from "../../sounds";
import Emitter from "../../core/Emitter";

class Leonidus extends Hoplite {
  public _healDelayCounter: number = 0;
  public _timeSinceLastJump: number = 0;

  constructor(p) {
    super(p);

    this._maxForce = 4;
    this._damage = 25;
    this._head._headdress = true;
    this._color = "#990000";
    this._hp = this._maxHp = 100;
    this._cloth = new Cloth(p.x, p.y - this._sizeBody.y, 26, 37.5, 13);

    this._altAttackAnim = new Animation(16, altAttack, false);
    this._specialAttackAnim = new Animation(36, specialAttack, false);
  }

  _hitBy(from, alt) {
    this._healDelayCounter = 1000;
    super._hitBy(from, alt);
  }

  _specialAttack() {
    if (
      this._timeSinceLastJump > 1000 ||
      this._specialAttackDelayCounter > 0 ||
      !this._active ||
      ~~this._stamina === 0
    )
      return;

    this._decrementStamina(50, 600);

    this._maxSpeed = 2000;
    this._maxForce = 2000;

    setTimeout(() => {
      this._zv = -14;
      Game._scene._tileMap &&
        Game._scene._tileMap._impulseAt(this._currentTile._isoPosition);

      var enemiesToDamage = Game._scene._collisions._overlapRect(
        new CollisionRect(this, new V2(-100, -100), 200, 200)
      );

      enemiesToDamage.forEach((enemy) => {
        enemy._object._hitBy(this, false, true);
      });

      Game._scene._cam._shake = 100;

      sfx([
        ,
        ,
        463,
        ,
        ,
        0.45,
        2,
        0.38,
        -3.9,
        ,
        ,
        ,
        ,
        1.2,
        ,
        0.1,
        0.1,
        0.72,
        0.02,
      ]);
    }, 200);

    this._currentAnim = this._specialAttackAnim;
    this._specialAttackAnim._currentFrame = 0;

    this._specialAttackDelayCounter = this._specialAttackDelay;
    this._attackDelayCounter = this._attackDelay;
  }

  _bashAttack() {
    if (
      this._altAttackDelayCounter > 0 ||
      !this._active ||
      ~~this._stamina === 0
    )
      return;

    this._decrementStamina(10, 600);

    this._maxSpeed = 2000;
    this._a.x += this._facingRight ? 5 : -5;

    sfx([
      ,
      0.5,
      310,
      0.04,
      0.01,
      0.13,
      ,
      0.29,
      -3.2,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      0.74,
      0.02,
    ]);

    // only do the smoke trail in the game scene
    if (Game._scene._tileMap) {
      var smoke = new Emitter();
      Object.assign(smoke, {
        _rotation: -Math.PI / 2,
        _addToScene: true,
        _color: "rgba(205,190,171,0.8)",
        _maxParticles: 40,
        _endSize: 12,
        _endSizeVariance: 6,
        _particleLifetime: 600,
        _particleLifetimeVariance: 200,
        _zgrav: 0,
        _duration: 360,
      });

      this._addChild(smoke);
    }

    this._currentAnim = this._altAttackAnim;
    this._altAttackAnim._currentFrame = 0;

    var dir = this._facingRight ? 1 : -1;

    var enemiesToDamage = Game._scene._collisions._overlapRect(
      new CollisionRect(
        this,
        new V2(
          dir * (this._sizeBody.x / 2 + 10 + (this._facingRight ? 0 : 48)),
          -24
        ),
        48,
        12
      )
    );

    enemiesToDamage.forEach((enemy) => {
      enemy._object._hitBy(this, true);
      if (enemy._object instanceof Hoplite) {
        this._decrementStamina(10, 600);
      }
    });

    this._altAttackDelayCounter = this._altAttackDelay;
  }

  _update(dt) {
    this._timeSinceLastJump += dt;
    this._healDelayCounter = Math.max(this._healDelayCounter - dt, 0);
    this._altAttackDelayCounter = Math.max(this._altAttackDelayCounter - dt, 0);
    this._specialAttackDelayCounter = Math.max(
      this._specialAttackDelayCounter - dt,
      0
    );

    if (this._healDelayCounter === 0 && this._stamina === 100) {
      this._hp = Math.min(this._maxHp, this._hp + 0.2);
    }

    var isBashing = this._currentAnim === this._altAttackAnim;

    if (!isBashing) {
      if (InputController._KeyW) {
        this._a.y -= 3;
      }

      if (InputController._KeyA) {
        this._a.x -= 3;
        this._facingRight = false;
      }

      if (InputController._KeyS) {
        this._a.y += 3;
      }

      if (InputController._KeyD) {
        this._a.x += 3;
        this._facingRight = true;
      }

      if (InputController._KeyK) {
        this._shieldActive = true;
        this._maxForce = 2.5;
        if (InputController._KeyJ) {
          this._bashAttack();
        }
      } else {
        this._shieldActive = false;
        this._maxForce = 4;

        if (InputController._KeyJ) {
          if (this._z > 20) {
            this._specialAttack();
          } else {
            this._attack();
          }
        }
      }
    }

    // Jump
    if (InputController._Space && this._stamina > 0 && this._z === 0) {
      this._timeSinceLastJump = 0;
      this._zv = 6;
      this._decrementStamina(5, 600);
      sfx([
        0.5,
        1,
        377,
        0.03,
        0.09,
        ,
        ,
        0.86,
        2.7,
        ,
        -50,
        ,
        ,
        ,
        ,
        ,
        ,
        0.57,
        0.06,
      ]);
    }

    // redeclare as it could have changed
    isBashing = this._currentAnim === this._altAttackAnim;

    if (!isBashing) {
      this._v._scale(0);
      // limit to a max
      this._a._normalize()._scale(3);
      this._maxSpeed = this._shieldActive ? 100 : 200;
      this._zgrav = 0.3;
      this._maxForce = 4;
    }

    this._cloth._update(
      dt,
      this._position.x,
      this._position.y -
        this._sizeBody.y -
        this._sizeLeg.y -
        this._verticalOffset
    );

    super._update(dt);
  }
}

export default Leonidus;
