import { i2c, inRng } from "./utils";
import { Camera } from "./Camera";
import { WIDTH, HEIGHT } from "../constants";
import V2 from "./V2";
import { SimpleCollision } from "./SimpleCollision/index";
import GameObject from "./GameObject";
import Leonidus from "../components/entities/Leonidus";
import TileMap from "../components/TileMap";

export default class Scene extends GameObject {
  public _collisions: any = new SimpleCollision();
  public _cam: Camera;
  public _tileMap: TileMap;
  public _player: Leonidus;

  public _done: boolean;

  constructor() {
    super();

    this._cam = new Camera(WIDTH, HEIGHT);

    this._cam._lookat = i2c(new V2(5, 5));
  }

  _update(dt) {
    this._cam._update(dt);

    this._collisions._update(dt);

    super._update(dt);
  }

  _addParticle(p) {
    this._addChild(p);
  }

  _inViewport(p) {
    return (
      inRng(
        p.x,
        this._cam._vpRect._left - 100 /*- obj.radius*/,
        this._cam._vpRect._right + 100 /*+ obj.radius*/
      ) &&
      inRng(
        p.y,
        this._cam._vpRect._top - 100 /*- obj.radius*/,
        this._cam._vpRect._bottom + 100 /*+ obj.radius*/
      )
    );
  }
}
