import { Game } from "../main";
import V2 from "./V2";
import GameObject from "./GameObject";
import { rndPN } from "./utils";
import Particle from "./Particle";

class Emitter extends GameObject {
  public _positionVariance: V2 = new V2();
  public _zStart: number = 0;
  public _zv: number = 0;
  public _zvVariance: number = 0;
  public _zgrav: number;

  // rotation variance
  public _rVariance: number = 0;

  public _maxParticles: number = 0;

  public _speed: number = 0;
  public _speedVariance: number = 0;

  public _size: number = 0;
  public _sizeVariance: number = 0;

  public _endSize: number = 0;
  public _endSizeVariance: number = 0;

  public _particleLifetime: number = 0;
  public _particleLifetimeVariance: number = 0;

  public _color: string = "#fff";

  public _emitCounter: number = 0;

  public _elapsedTime: number = 0;

  public _duration: number = -1;

  public _addToScene: boolean = false;

  public _particles: Particle[] = [];

  _update(dt) {
    //explosion case
    if (this._duration === 0) {
      while (this._particles.length < this._maxParticles) {
        this.emit();
      }
    }

    super._update(dt);

    this._particles = this._particles.filter((p) => p._active);

    var emissionRate = this._maxParticles / this._particleLifetime;

    if (this._active && emissionRate > 0) {
      var rate = 1 / emissionRate;

      this._emitCounter += dt;

      while (
        this._particles.length < this._maxParticles &&
        this._emitCounter > rate
      ) {
          this.emit();
          this._emitCounter -= rate;
      }
      this._elapsedTime += dt;

      if (this._duration !== -1 && this._duration < this._elapsedTime) {
        this._destroy();
      }
    }
  }

  emit() {
    var pVariance = this._positionVariance._copy()._scale(rndPN());

    if (this._addToScene) {
      pVariance = V2._rotateAroundOrigin(pVariance, this._globalAngle());
    }

    var rPos = this._addToScene
      ? this._globalPosition()
      : this._position._copy();
    rPos.x += pVariance.x;
    rPos.y += pVariance.y;

    var baseAngle = this._addToScene ? this._globalAngle() : this._rotation;
    var rAngle = baseAngle + this._rVariance * rndPN();
    var rSpeed = this._speed + this._speedVariance * rndPN();

    var rDir = new V2(Math.cos(rAngle), Math.sin(rAngle))._scale(rSpeed);

    var rSize = this._size + this._sizeVariance * rndPN();
    rSize = rSize < 0 ? 0 : ~~rSize;

    var rEndSize = this._endSize + this._endSizeVariance * rndPN();
    rEndSize = rEndSize < 0 ? 0 : ~~rEndSize;

    var rDeltaZ = this._zv + this._zvVariance * rndPN();
    rDeltaZ = rDeltaZ < 0 ? 0 : ~~rDeltaZ;

    var rLife =
      this._particleLifetime + this._particleLifetimeVariance * rndPN();

    var rDeltaSize = (rEndSize - rSize) / rLife;

    var particle = new Particle(
      rPos,
      this._zStart,
      rDeltaZ,
      rDir,
      rSize,
      rDeltaSize,
      rLife,
      this._color
    );

    if (this._zgrav !== undefined) {
      particle._zgrav = this._zgrav;
    }

    if (this._addToScene) {
      particle._z = this._globalZ();
      Game._scene._addParticle(particle);
    } else {
      this._addChild(particle);
    }

    this._particles.push(particle);
  }
}

export default Emitter;
