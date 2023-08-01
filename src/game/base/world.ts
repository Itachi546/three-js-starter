import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Config } from "./configs";
import { ResourceLoader } from "./resources";
import { ASSETS_ALL } from "../assets";
import MainGame from "../maingame";

export class World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  resourceLoader: ResourceLoader;
  cube: THREE.Mesh;

  constructor(options: { config: Config }) {
    this.initScene(options);
    this.initLights();
    this.initResources();
  }

  initResources(): void {
    this.resourceLoader = new ResourceLoader();
    this.resourceLoader.loadResourceGroup(ASSETS_ALL).then(() => {});
  }

  initScene(options: { config: Config }): void {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      options.config.width / options.config.height,
      0.1,
      100.0
    );

    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );

    this.scene.add(this.cube);

    this.camera.position.set(0.0, 3.0, 3.0);
    this.controls = new OrbitControls(
      this.camera,
      MainGame.instance.renderer.instance.domElement
    );
    this.controls.enableDamping = true;
  }

  initLights(): void {
    // Hemisphere Light
    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.2);
    this.scene.add(hemisphereLight);

    // Directional Light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(2.5, 7.0, 2.0);
    directionalLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    directionalLight.shadow.bias = -0.000008;

    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  resize(config: Config) {
    this.camera.aspect = config.width / config.height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
