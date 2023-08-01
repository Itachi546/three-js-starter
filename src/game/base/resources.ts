import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";

type ResourceData<T> = {
  name: string;
  type: string;
  data: T;
};

export type ResourceItem = {
  name: string;
  path: string;
  type: string;
};

export type ResourceGroup = {
  name: string;
  items: ResourceItem[];
};

export class ResourceLoader {
  private meshCache: Map<string, ResourceData<any>>;
  private textureCache: Map<string, ResourceData<any>>;
  private loadedGroup: string[];

  private gltfLoader: GLTFLoader;
  private textureLoader: THREE.TextureLoader;

  static instance: ResourceLoader | null;

  constructor() {
    if (ResourceLoader.instance) return;
    ResourceLoader.instance = this;

    this.meshCache = new Map();
    this.textureCache = new Map();
    this.loadedGroup = [];

    this.gltfLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  getMesh(name: string): ResourceData<any> {
    return this.meshCache.get(name);
  }

  getTexture(name: string): ResourceData<any> {
    return this.textureCache.get(name);
  }

  private async loadTexture(name: string, path: string) {
    const texture = await this.textureLoader.loadAsync(path);
    const resource: ResourceData<THREE.Texture> = {
      name,
      type: "texture",
      data: texture,
    };
    this.textureCache.set(name, resource);
  }

  private async loadMesh(name: string, path: string) {
    const mesh = await this.gltfLoader.loadAsync(path);
    const resource: ResourceData<GLTF> = {
      name,
      type: "model",
      data: mesh,
    };
    this.meshCache.set(name, resource);
  }

  async loadResourceGroup(group: ResourceGroup) {
    if (!group) return;
    const loaded = this.loadedGroup.find((name) => name === group.name);
    if (loaded) return;

    this.loadedGroup.push(group.name);

    return Promise.all(
      group.items.map((item: ResourceItem) => {
        if (item.type === "texture")
          return this.loadTexture(item.name, item.path);
        else return this.loadMesh(item.name, item.path);
      })
    );
  }

  dispose() {
    ResourceLoader.instance = null;
  }
}
