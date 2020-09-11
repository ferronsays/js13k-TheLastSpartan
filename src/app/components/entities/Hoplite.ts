import V2 from "../../core/V2";
import GameObject from "../../core/GameObject";
import Animation from "../../core/Animation";
import HopliteHead from "./HopliteHead";
import Sword from "./Sword";
import { CollisionRect } from "../../core/SimpleCollision/index";
import { Game } from "../../main";
import { sfx } from "../../sounds";
import { rndPN, rndRng, waterTile } from "../../core/utils";
import Emitter from "../../core/Emitter";
import {
  idle,
  shieldIdle,
  shieldWalk,
  walk,
  attack,
} from "./hopliteAnimationConfigs";
import Cloth from "../../core/physics/shapes/Cloth";
import BodyPart from "./BodyPart";
import { shadeColor } from "../tiles/BaseTile";
import Leonidus from "./Leonidus";

class Hoplite extends GameObject {
  public _sizeHead: V2 = new V2(16, 18);
  public _sizeBody: V2 = new V2(12, 18);
  public _sizeSword: V2 = new V2(40, 4);
  public _sizeShield: V2 = new V2(20, 20);
  public _sizeLeg: V2 = new V2(4, 8);

  public _stamina: number = 100;

  public _staminaDelayCounter: number = 0;
  public _attackDelay: number = 350;
  public _attackDelayCounter: number = 0;
  public _hitResponseCounter: number = 0;

  public _stunDelayCounter: number = 0;

  public _shieldActive: boolean = false;

  // TODO Giant hitbox innacurate
  public _hitBox: any = new CollisionRect(
    this,
    new V2(-9, -35),
    18,
    45,
    -1,
    true
  );

  public _idleAnim: Animation;
  public _walkAnim: Animation;
  public _attackAnim: Animation;
  public _shieldIdleAnim: Animation;
  public _shieldWalkAnim: Animation;
  public _currentAnim: Animation;

  public _altAttackDelay: number = 500;
  public _altAttackDelayCounter: number = 0;
  public _altAttackAnim: Animation;

  public _specialAttackDelay: number = 500;
  public _specialAttackDelayCounter: number = 0;
  public _specialAttackAnim: Animation;

  public _head: HopliteHead;
  public _sword: Sword;
  public _cloth: Cloth;

  public _facingRight: boolean;
  public _color: any;

  public _walkSoundDelay: number = 0;
  public _kills: number = 0;

  constructor(p) {
    super(p);

    this._speed = 200;
    this._maxSpeed = 200;

    this._zgrav = 0.3;

    // this._nullAnim = new Animation(1, {});
    this._idleAnim = new Animation(20, idle);
    this._shieldIdleAnim = new Animation(20, shieldIdle);
    this._shieldWalkAnim = new Animation(20, shieldWalk);
    this._walkAnim = new Animation(20, walk);
    this._attackAnim = new Animation(16, attack, false);

    // current animation
    this._currentAnim = this._idleAnim;

    this._facingRight = true;

    this._setParts();

    this._setYOff();
  }

  _setParts() {
    this._head = new HopliteHead(
      new V2(0, -this._sizeBody.y - (this._sizeHead.y / 2) * 0.8),
      this._sizeHead,
      false
    );

    this._sword = new Sword(
      new V2(-4, -this._sizeBody.y / 2 + 4),
      this._sizeSword
    );

    this._head._parent = this._sword._parent = this;
  }

  _attack() {
    if (this._attackDelayCounter > 0 || !this._active || ~~this._stamina === 0)
      return;

    this._decrementStamina(5, 600);

    sfx([
      0.1,
      1,
      1123,
      0.15,
      ,
      0.03,
      4,
      0.69,
      ,
      -84.1,
      ,
      0.01,
      ,
      0.8,
      -4,
      -0.1,
      ,
      0.32,
      0.04,
      0.01,
    ]);

    this._currentAnim = this._attackAnim;
    this._attackAnim._currentFrame = 0;

    var dir = this._facingRight ? 1 : -1;

    var enemiesToDamage = Game._scene._collisions._overlapRect(
      new CollisionRect(
        this,
        new V2(
          dir * (this._sizeBody.x / 2 + 10 + (this._facingRight ? 0 : 36)),
          -30
        ),
        36,
        20
      )
    );

    enemiesToDamage.forEach((enemy) => {
      enemy._object._hitBy(this);
    });

    this._attackDelayCounter = this._attackDelay;
  }

  _gibPart(part: BodyPart, z, zv, rvDivisor) {
    part._setYOff();
    part._z = z;
    part._zv = zv;
    part._v = V2._fromAngle(Math.random() * Math.PI);
    part._rv = rndPN() / rvDivisor;
    part._shouldRenderShadow = true;
  }

  _destroy() {
    this._hitBox._active = false;

    var newHead = new HopliteHead(
      this._position._copy(),
      this._sizeHead,
      false
    );
    newHead._bleed();
    newHead._lifeSpan = 300000;

    var newSword = new Sword(this._position._copy(), this._sizeSword);
    newSword._lifeSpan = 30000;

    this._gibPart(newSword as BodyPart, 40, rndRng(0.5, 1.5), 4);

    this._gibPart(newHead as any, 40, rndRng(1, 4), 5);

    Game._scene._addParticle(newHead);
    Game._scene._addParticle(newSword);

    super._destroy();
  }

  _hitBy(from, alt, special = false) {
    var dX = V2._subtract(this._position, from._position)._normalize().x;

    if (from instanceof Leonidus) {
      Game._scene._cam._shake = 50;
    }

    var hpDiff = alt || special ? from._damage/3 : from._damage;
    var blood = alt || special ? false : true;
    if (
      this._shieldActive &&
      this._stamina > 0 &&
      ((dX < 0 && this._facingRight) || (dX > 0 && !this._facingRight))
    ) {
      hpDiff = 0;
      blood = false;
      this._decrementStamina(from._damage * 1.5, 1000);
    }

    this._a.x += this._shieldActive ? 0 : dX * 10;
    this._zv += special ? 5 : 3;
    this._hp = Math.max(0, this._hp - hpDiff);

    if (this._hp === 0) {
      from._kills += 1;
    }

    this._hitResponseCounter = 200;

    this._stunDelayCounter += alt ? 2000 : special ? 1200 : 0;

    sfx(
      hpDiff
        ? /* hit */ [
            ,
            1,
            287,
            ,
            ,
            0.03,
            2,
            1.88,
            -6.4,
            -27,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            0.39,
            0.04,
            0.39,
          ]
        : /* clang */ [
            ,
            ,
            456,
            ,
            ,
            0.14,
            ,
            1.76,
            ,
            6.5,
            ,
            ,
            ,
            1.8,
            -0.6,
            0.3,
            0.11,
            0.53,
            0.05,
            0.23,
          ]
    );

    var hitParticles = new Emitter();
    Object.assign(hitParticles, {
      _position: new V2(0, -this._sizeBody.y / 2),
      _addToScene: true,
      _color: blood ? "#db0000" : "#FFDA00",
      _zv: blood ? 1 : 3,
      _zvVariance: 2,
      _maxParticles: blood ? 12 : 4,
      _size: 12,
      _particleLifetime: 2000,
      _particleLifetimeVariance: 1000,
      _speed: blood ? 0.25 : 20,
      _speedVariance: blood ? 0.2 : 6,
      _rVariance: Math.PI * 2,
      _duration: 0,
      _zStart: this._sizeBody.y,
    });

    this._addChild(hitParticles);
  }

  _setAnimation() {
    if (
      !(
        [
          this._altAttackAnim,
          this._attackAnim,
          this._specialAttackAnim,
        ].includes(this._currentAnim) && !this._currentAnim.finished
      )
    ) {
      if (this._v._magnitude() > 0.1) {
        if (this._shieldActive) {
          this._currentAnim = this._shieldWalkAnim;
        } else {
          this._currentAnim = this._walkAnim;
        }
      } else {
        if (this._shieldActive) {
          this._currentAnim = this._shieldIdleAnim;
        } else {
          this._currentAnim = this._idleAnim;
        }
      }
    }
  }

  _decrementStamina(amt, delay) {
    this._stamina = Math.max(0, this._stamina - amt);
    this._staminaDelayCounter = Math.max(this._staminaDelayCounter, delay);
  }

  _update(dt) {
    this._staminaDelayCounter = Math.max(this._staminaDelayCounter - dt, 0);
    this._attackDelayCounter = Math.max(this._attackDelayCounter - dt, 0);
    this._hitResponseCounter = Math.max(this._hitResponseCounter - dt, 0);
    this._stunDelayCounter = Math.max(this._stunDelayCounter - dt, 0);

    if (this._staminaDelayCounter === 0) {
      this._stamina = Math.min(100, this._stamina + 1);
    }

    super._update(dt);

    this._setAnimation();

    this._currentAnim._update();

    if (this._currentAnim === this._walkAnim && this._walkSoundDelay < 0) {
      var volume = Math.max(
        0,
        1 -
          V2._subtract(
            this._position,
            Game._scene._player._position
          )._magnitude() /
            300
      );

      var tileIsWater = waterTile(this._currentTileType);

      volume > 0.2 &&
        this._z <= 4 &&
        sfx(
          tileIsWater
            ? [
                volume,
                ,
                60,
                0.01,
                ,
                0.07,
                ,
                2.47,
                -0.4,
                50.8,
                100,
                0.02,
                ,
                -0.2,
                0.1,
                ,
                0.02,
                ,
                0.04,
                0.29,
              ]
            : [
                volume,
                0.1,
                346,
                ,
                ,
                0.06,
                ,
                2.23,
                ,
                -2.8,
                140,
                ,
                0.01,
                ,
                ,
                ,
                0.21,
                0.25,
                ,
                0.04,
              ],
          true
        );
      this._walkSoundDelay = 160;
    }

    this._walkSoundDelay -= dt;
  }

  _draw(ctx) {
    if (
      Game._scene._inViewport(
        V2._add(this._position, new V2(0, -this._verticalOffset))
      )
    ) {
      super._draw(ctx);

      var colorOverride = this._hitResponseCounter > 0 ? "#fff" : undefined;

      colorOverride =
        Math.sin(this._stunDelayCounter * 0.02) > 0 ? "#1520a6" : colorOverride;

      var bodyColor = colorOverride || "#E0AC69";

      var anim = this._currentAnim.current;

      ctx.s();
      ctx.lineWidth = 1;

      // cape
      if (this._cloth) {
        this._cloth._draw(ctx, this._color);
      }

      var tileIsWater = waterTile(this._currentTileType);

      ctx._translate(
        this._position.x,
        this._position.y -
          (tileIsWater ? 0 : this._sizeLeg.y) -
          this._verticalOffset
      );

      // shadow
      if (!tileIsWater || this._z > 10) {
        ctx._fillStyle("rgba(0,0,0,0.5");
        ctx._fillRect(-this._sizeHead.x / 2, 5 + this._z, this._sizeHead.x, 6);
      }

      if (!this._facingRight) {
        ctx.scale(-1, 1);
      }

      // shield
      ctx.s();
      ctx._fillStyle(colorOverride || "#A87D37");
      ctx.rotate(anim.shield.r);
      ctx._fillRect(
        -this._sizeShield.x / 2 + 4 + anim.shield._position.x,
        -this._sizeShield.y -
          this._sizeBody.y * 0.1 +
          anim.shield._position.y -
          (tileIsWater ? 8 : 0),
        this._sizeShield.x,
        this._sizeShield.y
      );
      ctx.r();

      // feet color
      ctx._fillStyle(colorOverride || "#D0814E");

      // legs
      if (!tileIsWater || this._z > this._sizeLeg.y) {
        // left
        ctx.s();
        ctx._translate(-this._sizeLeg.x / 2 - this._sizeBody.x / 3, -2);
        ctx.rotate(anim.legL.r);
        ctx._fillRect(0, this._sizeLeg.y, this._sizeLeg.x, this._sizeLeg.y / 3);
        ctx.r();

        // right
        ctx.s();
        ctx._translate(-this._sizeLeg.x / 2 + this._sizeBody.x / 3, -2);
        ctx.rotate(anim.legR.r);
        ctx._fillRect(0, this._sizeLeg.y, this._sizeLeg.x, this._sizeLeg.y / 3);
        ctx.r();
      }

      // body
      ctx.s(); // body save
      ctx.rotate(anim.body.r);
      ctx._fillStyle(bodyColor);
      ctx._fillRect(
        -this._sizeBody.x / 2 + anim.body._position.x,
        -this._sizeBody.y + anim.body._position.y,
        this._sizeBody.x,
        this._sizeBody.y * 0.6
      );
      if (!tileIsWater || this._z > this._sizeBody.y * 0.45) {
        // skirt
        ctx._fillStyle(colorOverride || shadeColor(this._color, 10));
        ctx._fillRect(
          -this._sizeBody.x / 2 + anim.body._position.x,
          -this._sizeBody.y * 0.4 + anim.body._position.y,
          this._sizeBody.x,
          this._sizeBody.y * 0.45
        );
      }

      // head
      this._head._draw(ctx, anim.head, colorOverride);
      ctx.r(); // body restore

      // sword
      this._sword._draw(ctx, anim.sword, colorOverride, tileIsWater);
      ctx.r();
    }
  }
}

export default Hoplite;
