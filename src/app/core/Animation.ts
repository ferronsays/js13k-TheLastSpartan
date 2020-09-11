import V2 from "./V2";

class Animation {
  public _totalFrames: number;
  public _currentFrame: number = 0;
  public _animations: any[] = [];
  public _repeats: boolean;

  constructor(tFrames, config, repeats = true) {
    // duration in frames
    this._totalFrames = tFrames;
    this._repeats = repeats;

    ["body", "head", "sword", "shield", "legL", "legR"].forEach((key) => {
      // component keyframes
      var cKeyFrames = config[key] || [{ f: 0 }, { f: tFrames }];

      for (var i = 1; i < cKeyFrames.length; i++) {
        var prev = cKeyFrames[i - 1];
        var curr = cKeyFrames[i];

        // frame duration
        var fDuration = curr.f - prev.f;

        for (var j = 0; j < fDuration; j++) {
          // interpolation t-value
          var t = j / fDuration;

          var exists = this._animations[prev.f + j];
          var frameData = exists || {};

          // component frame data
          var cFrameData = {} as any;

          // position
          if (prev.hasOwnProperty("p")) {
            // linear interpolate between keyframes
            var nx = prev.p[0] + (curr.p[0] - prev.p[0]) * t;
            var ny = prev.p[1] + (curr.p[1] - prev.p[1]) * t;
            cFrameData._position = new V2(nx, ny);
          } else {
            cFrameData._position = new V2(0, 0);
          }
          // rotation
          if (prev.hasOwnProperty("r")) {
            // linear interpolate between keyframes
            var nv = prev.r + (curr.r - prev.r) * t;
            cFrameData.r = nv;
          } else {
            cFrameData.r = 0;
          }

          frameData[key] = cFrameData;

          if (!exists) {
            this._animations.push(frameData);
          }
        }
      }
    });
  }

  get _current() {
    return this._animations[this._currentFrame];
  }

  get _finished() {
    if (this._repeats) {
      return false;
    }
    return this._currentFrame === this._totalFrames - 1;
  }

  _update() {
    this._currentFrame += 1;

    if (this._currentFrame > this._totalFrames - 1) {
      this._currentFrame = 0;
    }
  }
}

export default Animation;
