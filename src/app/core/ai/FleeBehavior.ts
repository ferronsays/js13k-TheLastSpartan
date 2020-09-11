import SeekBehavior from "./SeekBehavior";

class FleeBehavior extends SeekBehavior {
  constructor(actor) {
    super(actor);

    this._config = {
      _strength: 2,
    };
  }

  _run(target, strengthMod) {
    return super._run(target, strengthMod)._scale(-1);
  }
}

export default FleeBehavior;
