import V2 from "../V2";
import WanderBehavior from "./WanderBehavior";
import SeekBehavior from "./SeekBehavior";
import FleeBehavior from "./FleeBehavior";
import GameObject from "../GameObject";
import FlockBehavior from "./FlockBehavior";

class SteeringManager {
  public _actor: GameObject;
  public _force: V2 = new V2();
  public _bWander: WanderBehavior;
  public _bSeek: SeekBehavior;
  public _bFlee: FleeBehavior;
  public _bFlock: FlockBehavior;

  constructor(actor) {
    this._actor = actor;

    this._bWander = new WanderBehavior(actor);
    this._bSeek = new SeekBehavior(actor);
    this._bFlee = new FleeBehavior(actor);
    this._bFlock = new FlockBehavior(actor);
  }

  _wander(strengthMod) {
    this._force.add(this._bWander._run(strengthMod));
  }

  _seek(target, strengthMod) {
    this._force.add(this._bSeek._run(target, strengthMod));
  }

  _flee(target, strengthMod) {
    this._force.add(this._bFlee._run(target, strengthMod));
  }

  _flock(strengthMod?) {
    this._force.add(this._bFlock._run(strengthMod));
  }
}

export default SteeringManager;
