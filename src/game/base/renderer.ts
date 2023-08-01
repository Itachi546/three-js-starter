import * as THREE from "three";
import { Config } from "./configs";
import { World } from "./world";
import {
  BlendFunction,
  EffectComposer,
  EffectPass,
  FXAAEffect,
  RenderPass,
  SelectiveBloomEffect,
  ToneMappingEffect,
  ToneMappingMode,
} from "postprocessing";

export class Renderer {
  instance: THREE.WebGLRenderer;
  private effectComposer: EffectComposer;

  constructor(options: { config: Config }) {
    this.initInstance(options);
  }

  initInstance(options: { config: Config }): void {
    const canvas = document.getElementById("canvas");
    this.instance = new THREE.WebGLRenderer({
      antialias: false,
      canvas,
      stencil: false,
      depth: false,
    });
    this.instance.setSize(window.innerWidth, window.innerHeight);

    this.instance.setClearColor("#010101");
    this.instance.setPixelRatio(options.config.pixelRatio);
    this.instance.setSize(options.config.width, options.config.height);
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.toneMapping = THREE.ACESFilmicToneMapping;
    this.instance.toneMappingExposure = 1.0;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.shadowMap.autoUpdate = true;
  }

  initComposer(world: World) {
    this.effectComposer = new EffectComposer(this.instance, {
      frameBufferType: THREE.HalfFloatType,
    });
    this.effectComposer.addPass(new RenderPass(world.scene, world.camera));

    // Antialiasing
    const fxaaEffect = new FXAAEffect();

    // Bloom
    const bloomEffect = new SelectiveBloomEffect(world.scene, world.camera, {
      blendFunction: BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 0.8,
      luminanceSmoothing: 0.8,
      intensity: 1.0,
    });

    bloomEffect.inverted = true;

    // Tonemapping
    const toneMappingEffect = new ToneMappingEffect({
      mode: ToneMappingMode.ACES_FILMIC,
      resolution: 256,
      whitePoint: 16.0,
      middleGrey: 0.6,
      minLuminance: 0.01,
      averageLuminance: 0.01,
      adaptationRate: 1.0,
    });

    const effectPass = new EffectPass(
      world.camera,
      fxaaEffect,
      toneMappingEffect,
      bloomEffect
    );
    this.effectComposer.addPass(effectPass);
  }

  resize(config: Config) {
    this.instance.setPixelRatio(config.pixelRatio);
    this.instance.setSize(config.width, config.height);
  }

  update() {
    this.effectComposer.render();
  }
}
