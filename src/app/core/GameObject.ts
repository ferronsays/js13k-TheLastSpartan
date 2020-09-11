import V2 from "./V2";
import GameNode from "./GameNode";
import { Game } from "../main";
import SteeringManager from "./ai/SteeringManager";
import { c2i, walkTile, i2c } from "./utils";
import { CollisionRect } from "./SimpleCollision/index";
import BaseTile from "../components/tiles/BaseTile";
import { mapDim } from "../constants";

class GameObject extends GameNode {
  public _v: V2 = new V2();
  public _a: V2 = new V2();
  public _zv: number = 0;
  public _zgrav: number = 0.098;
  public _speed: number = 10;
  public _maxSpeed: number = 100;
  public _maxForce: number = 1;
  public _maxHp: number = Infinity;
  public _hp: number;
  public _damage: number;
  public _lifeSpan: number = -1;
  public _age: number = 0;
  public _hitBox: CollisionRect;
  public _steering: SteeringManager;
  public _visionRange: number = 100;
  public _tileYOffset: number = 0;
  // TODO just use tile and get type from it?
  public _currentTile: BaseTile;
  public _currentTileType: number;
  public _calcSlide: boolean = true;
  public _opacity: number = 1;

  get _verticalOffset() {
    return this._tileYOffset + this._z;
  }

  constructor(p = new V2()) {
    super();
    this._position = p;
    this._steering = new SteeringManager(this);
  }

  _addChild(child) {
    child._parent = this;
    this._children.push(child);
  }

  _destroy() {
    this._active = false;

    if (this._hitBox) {
      this._hitBox._destroy();
    }

    this._parent = undefined;
  }

  _update(dt) {
    if (!this._active) return;

    this._age += dt;

    if (
      this._hp <= 0 ||
      (this._lifeSpan && this._lifeSpan !== -1 && this._age >= this._lifeSpan)
    ) {
      this._destroy();
      return;
    }

    var tt = dt / 1000;

    var previousPosition = this._position._copy();

    this._a.add(this._steering._force._limit(this._maxForce));

    this._v.add(this._a)._limit(this._maxSpeed * tt);
    this._position.add(this._v);

    this._a._reset();
    this._steering._force._reset();

    this._zv -= this._zgrav;
    this._z = Math.max(0, this._z + this._zv);
    if (this._z === 0) {
      // TODO should probably have an acc value so this hack isn't necessary
      this._zv = 0;
      this._rv = 0;
    }

    this._calcSlide && this._slide(previousPosition, this._position);

    this._setYOff();

    super._update(dt);
  }

  _getTile(isoP): BaseTile {
    if (
      !Game._scene._tileMap || 
      Game._scene._tileMap._map.length === 0 ||
      isoP.x >= mapDim ||
      isoP.x < 0 ||
      isoP.y >= mapDim ||
      isoP.y < 0
    ) {
      return null;
    }
    return Game._scene._tileMap._map[isoP.y][isoP.x];
  }

  _distanceToPlayer(): number {
    return V2._distance(this._position, Game._scene._player._position);
  }

  _slide(curr, next) {
    var currC = c2i(curr);
    var nextC = c2i(next);

    // TODO performance measure
    var nTile = this._getTile(nextC._copy()._floor());
    if (nTile && walkTile(nTile._tileType)) {
      return;
    }

    var newP = currC._copy();

    // get the vector that represents the change in pos
    var diffVec = V2._subtract(nextC, currC);

    // check x
    var xVec = diffVec._copy();
    xVec.y = 0;
    var tile = this._getTile(V2._add(currC, xVec)._floor());
    if (tile && walkTile(tile._tileType)) {
      newP.add(xVec);
    }

    // check y
    var yVec = diffVec._copy();
    yVec.x = 0;
    tile = this._getTile(V2._add(currC, yVec)._floor());
    if (tile && walkTile(tile._tileType)) {
      newP.add(yVec);
    }

    this._position = i2c(newP);
  }

  _setYOff() {
    var currentTilePos = c2i(this._globalPosition())._floor();
    var tile = this._getTile(currentTilePos);

    if (tile) {
      var diff = tile._height - this._tileYOffset;
      if (diff < 0 && walkTile(tile)) {
        // dropping down
        this._z += this._tileYOffset - tile._height;
      }
      this._tileYOffset = tile._height;
      this._currentTileType = tile._tileType;
      this._currentTile = tile;

      if (diff > 0) this._z = Math.max(0, this._z - diff);
    }
  }
}

export default GameObject;
