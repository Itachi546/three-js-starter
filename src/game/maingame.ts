import { Renderer } from "./base/renderer";
import { Config } from "./base/configs";
import { World } from "./base/world";

export default class MainGame {
  world: World;
  renderer: Renderer;
  config: Config;

  static instance: MainGame | null;

  constructor() {
    if (MainGame.instance) return MainGame.instance;
    MainGame.instance = this;

    this.initConfigs();
    this.initRenderer();
    this.initListeners();
    this.initScene();
    this.update();
  }

  update() {
    this.world.update();
    if (this.renderer) this.renderer.update();

    window.requestAnimationFrame(() => {
      this.update();
    });
  }

  initConfigs() {
    this.config = {
      pixelRatio: Math.min(Math.max(window.devicePixelRatio, 1), 2),
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  initRenderer() {
    this.renderer = new Renderer({ config: this.config });
  }

  initScene() {
    this.world = new World({ config: this.config });
    // @TODO move it somewhere else
    this.renderer.initComposer(this.world);
  }

  initListeners() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
    this.config.width = window.innerWidth;
    this.config.height = window.innerHeight;
    if (this.world) this.world.resize(this.config);
    if (this.renderer) this.renderer.resize(this.config);
  }

  dispose() {
    MainGame.instance = null;
  }
}
