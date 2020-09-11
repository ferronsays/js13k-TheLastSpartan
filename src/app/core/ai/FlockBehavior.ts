import Behavior from "./Behavior";
import V2 from "../V2";
import { Game } from "../../main";
import Hoplite from "../../components/entities/Hoplite";

class FlockBehavior extends Behavior {
  constructor(actor) {
    super(actor);

    this._config = {
      _separationWeight: 5,
      // _alignmentWeight: 1,
      _cohesionWeight: 0.75,
      _desiredSeparation: 75,
      _neighborRadius: 300, // TODO match vision range?
      _strength: 1,
    };
  }

  // @ts-ignore
  _run(strengthMod) {
    return this._flock(Game._scene._spawner._entities)
      ._normalize()
      ._scale(strengthMod || this._config._strength);
  }

  _flock(neighbors) {
    var separation = this._separate(neighbors)._scale(
      this._config._separationWeight
    );
    // var alignment = this._align(neighbors)._scale(
    //   this._config._alignmentWeight
    // );
    var cohesion = this._cohere(neighbors)._scale(this._config._cohesionWeight);

    return (
      separation
        // .add(alignment)
        .add(cohesion)
    );
  }

  // _align(neighbors) {
  //   return new V2();
  // }

  _cohere(neighbors) {
    var sum = new V2(0, 0);
    var count = 0;

    neighbors.forEach((boid: Hoplite) => {
      var d = V2._distance(this._actor._position, boid._position);
      if (d > 0 && d < this._config._neighborRadius) {
        sum.add(boid._position);
        count++;
      }
    });

    if (count > 0) sum._scale(1 / count);

    var desired = V2._subtract(sum, this._actor._position);
    var len = desired._magnitude();

    if (len < 100) desired._scale(len / 100);

    return desired._normalize()._limit(0.05);
  }

  _separate(neighbors) {
    var mean = new V2();
    var count = 0;

    neighbors.forEach((boid: Hoplite) => {
      var d = V2._distance(this._actor._position, boid._position);
      if (d > 0 && d < this._config._desiredSeparation) {
        mean.add(
          V2._subtract(this._actor._position, boid._position)
            ._normalize()
            ._scale(1 / d)
        );
        count++;
      }
    });

    if (count > 0) mean._scale(1 / count);

    return mean;
  }
}

export default FlockBehavior;
