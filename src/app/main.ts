import GameScene from "./components/scenes/GameScene";
import TitleScene from "./components/scenes/TitleScene";
import { rndRng } from "./core/utils";
import { tilePregen } from "./components/tiles/tilePregen";
import "./config";
import { WIDTH, HEIGHT } from "./constants";

var _localStorageKey = "mjf_tls";

class _Game {
  public _seed: number;
  public _currentTime: number;
  public _canvas: any;
  public _ctx: any;
  public _scene: any;
  public _started: boolean = false;
  public _paused: boolean = false;
  public _animationFrame: any;
  public _spritesheet: any;

  // screens
  public _$pz: HTMLElement; // pause
  public _$tt: HTMLElement; // title
  public _$gg: HTMLElement; // game over

  public _$k: HTMLElement;
  public _$s: HTMLElement;
  public _$kr: HTMLElement;
  public _$sr: HTMLElement;

  public _storage: Storage = window.localStorage;

  constructor() {
    // console.log(`GAME SEED: ${this.seed}`);

    this._currentTime = performance.now();

    this._canvas = document.getElementById("c");
    this._ctx = this._canvas.getContext("2d");

    this._canvas.width = WIDTH;
    this._canvas.height = HEIGHT;
    this._canvas.oncontextmenu = () => false;

    // screens
    this._$tt = document.getElementById("tt");
    this._$pz = document.getElementById("pz");
    this._$gg = document.getElementById("gg");

    this._$k = document.getElementById("k");
    this._$s = document.getElementById("s");
    this._$kr = document.getElementById("kr");
    this._$sr = document.getElementById("sr");

    // pause the game if the player gets distracted
    window.onblur = () => this._pause();

    window.onkeydown = (e) => {
      switch (e.code) {
        case "KeyP":
          if (this._scene._done) return;
          if (this._paused) {
            this._resume();
          } else {
            this._pause();
          }
          break;
        case "Enter":
          if (!this._started) {
            this._disable();
            this._started = true;
            this._toggleScreens(null, this._$tt);
            this._restart();
          } else if (this._scene._done) {
            this._restart();
          }
          break;
      }
    };

    this._spritesheet = tilePregen();

    // this._spritesheet.onload = () => {
      this._scene = new TitleScene();
      this._enable();
    // };
  }

  _enable() {
    this._animationFrame = requestAnimationFrame(this._animate.bind(this));
  }

  _disable() {
    cancelAnimationFrame(this._animationFrame);
  }

  _animate(time) {
    this._animationFrame = requestAnimationFrame(this._animate.bind(this));

    var dt = Math.max(0, time - this._currentTime);
    this._update(dt);
    this._currentTime = time;
  }

  _toggleScreens(on, off?) {
    if (on) on.style.display = "flex";
    if (off) off.style.display = "none";
  }

  _pause() {
    if (!this._started) return;

    this._disable();
    this._toggleScreens(this._$pz);
    this._paused = true;
  }

  _resume() {
    this._currentTime = performance.now();
    this._enable();
    this._toggleScreens(null, this._$pz);
    this._paused = false;
  }

  _end() {
    this._disable();

    var kills = this._scene._player._kills;
    var time = this._scene._age;

    this._$k.innerText = kills;
    this._$s.innerText = `${(time / 1000).toFixed(0)}s`;

    this._toggleScreens(this._$gg, null);

    var highscore = JSON.parse(
      this._storage.getItem(_localStorageKey) || '{"kills": 0, "time": 0}'
    );

    this._$kr.innerText = `Record: ${highscore.kills}`;
    this._$sr.innerText = `Record: ${(highscore.time / 1000).toFixed(0)}s`;

    if (kills > highscore.kills) {
      highscore.kills = kills;
    }
    if (time > highscore.time) {
      highscore.time = time;
    }

    this._storage.setItem(
      _localStorageKey,
      JSON.stringify(highscore)
    );

  }

  _restart() {
    this._toggleScreens(null, this._$gg);
    this._seed = rndRng(0, 99999);
    this._scene = new GameScene(this._spritesheet);
    setTimeout(() => this._enable(), 50);
  }

  _update(dt) {
    this._scene._update(dt);
    if (this._scene._done) {
      this._end();
    }
    this._draw();
  }

  _draw() {
    var { _ctx, _scene } = this;

    _ctx.clearRect(0, 0, WIDTH, HEIGHT);
    _ctx._fillStyle("rgba(0,0,0,0.85)");
    _ctx._fillRect(0, 0, WIDTH, HEIGHT);

    _ctx.s();
    _scene._draw(_ctx);
    _ctx.r();
  }
}

export var Game = new _Game();
