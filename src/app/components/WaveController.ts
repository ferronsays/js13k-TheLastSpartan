// import GameNode from "../core/GameNode";
// import Spawner from "./Spawner";

// class WaveController extends GameNode {
//   public _currentWaveIndex: number = 0;
//   public _waveIncrementEnemies: number;
//   public _currentWave: Spawner;

//   public _budgetPerWave: number = 10;
//   public _budgetPerWaveIncrement: number = 1.5;

//   public _spawnDelay: number = 3000;
//   public _spawnDelayIncrement: number = 0.9;

//   public _bigProbability: number = 0;
//   public _bigProbabilityIncrement: number = .05;

//   _nextWave() {
//     this._currentWaveIndex++;
//     if (this._currentWaveIndex > 1) {
//       this._budgetPerWave = ~~(
//         this._budgetPerWave * this._budgetPerWaveIncrement
//       );
//       this._spawnDelay = ~~(this._spawnDelay * this._spawnDelayIncrement);
//       this._bigProbability = Math.max(.5, this._bigProbability + this._bigProbabilityIncrement)
//     }

//     this._currentWave = new Spawner(
//       this._currentWaveIndex,
//       this._budgetPerWave,
//       this._spawnDelay,
//       this._bigProbability,
//       this._parent
//     );
//     this._addChild(this._currentWave);
//   }

//   _update(dt) {
//     if (!this._currentWave) {
//       this._nextWave();
//     }

//     if (
//       this._currentWave._budget <= 0 &&
//       this._currentWave._entities.length === 0
//     ) {
//       this._currentWave._active = false;
//       this._nextWave();
//     }

//     super._update(dt);
//   }
// }

// export default WaveController;
