import V2 from "./V2";

class GameNode {
  public _children: GameNode[] = [];
  public _position: V2 = new V2();
  public _z: number = 0;
  public _rotation: number = 0;
  public _rv: number = 0;
  public _active: boolean = true;
  public _parent: GameNode;
  public _id: number = Math.floor(Math.random() * 9999);

  _globalPosition() {
    var pos = this._position._copy();
    var parent = this._parent;
    while (parent) {
      pos = V2._rotateAroundOrigin(pos, parent._rotation)
      pos._add(parent._position);
      parent = parent._parent;
    }

    return pos;
  }

  _globalAngle() {
    var r = this._rotation;
    var parent = this._parent;
    while (parent) {
      r += parent._rotation;
      parent = parent._parent;
    }

    return r;
  }

  _globalZ() {
    var r = this._z;
    var parent = this._parent;
    while (parent) {
      r += parent._z;
      parent = parent._parent;
    }

    return r;
  }

  _addChild(child) {
    child._parent = this;
    this._children.push(child);
  }

  _update(dt) {
    this._rotation += this._rv;

    var length = this._children.length;
    while (length--) {
      var child = this._children[length];
      child._update(dt);
      if (!child._active) {
        this._children.splice(length, 1);
        continue;
      }
    }
  }

  _draw(ctx) {
    var length = this._children.length;

    if (length === 0) {
      return;
    }
    ctx.s();
    ctx._translate(this._position.x, this._position.y - this._z);
    ctx.rotate(this._rotation);

    while (length--) {
      this._children[length]._draw(ctx);
    }
    ctx.r();
  }
}

export default GameNode;
