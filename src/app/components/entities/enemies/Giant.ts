import V2 from "../../../core/V2";
import Athenian from "./Athenian";

class Giant extends Athenian {
  constructor(p) {
    super(p);
    this._speed = 3;
    this._maxForce = 0.5;
    this._maxSpeed = 1500;
    this._visionRange = 700;
    this._damage = 24;
    this._hp = this._maxHp = 200;
    this._attackRange = 60;

    this._sizeBody = new V2(24, 36);
    this._sizeHead = new V2(28, 36);
    this._sizeLeg = new V2(8, 8);
    this._sizeSword = new V2(60, 6);
    this._sizeShield = new V2(40, 40);

    this._setParts();
  }
}

export default Giant;
