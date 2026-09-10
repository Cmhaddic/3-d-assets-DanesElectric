import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

class RotatingLogo extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.minHeight = '300px';

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      35,
      this.clientWidth / this.clientHeight,
      0.01,
      1000
    );

    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(this.clientWidth, this.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.appendChild(renderer.domElement);

    // EVEN LIGHTING
    scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 3));

    const frontLight = new THREE.DirectionalLight(0xffffff, 2);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(0, 2, -5);
    scene.add(backLight);

    const leftLight = new THREE.DirectionalLight(0xffffff, 1.5);
    leftLight.position.set(-5, 0, 2);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rightLight.position.set(5, 0, 2);
    scene.add(rightLight);

    let model;

    const loader = new GLTFLoader();

    loader.load(
      "https://raw.githubusercontent.com/Cmhaddic/3-d-assets-DanesElectric/main/Dane%27s_Logo.glb",

      (gltf) => {
        model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh && child.material) {
            const materials = Array.isArray(child.material)
              ? child.material
              : [child.material];

            materials.forEach((material) => {
              material.transparent = false;
              material.opacity = 1;
              material.side = THREE.DoubleSide;
              material.needsUpdate = true;
            });
          }
        });

        // CENTER MODEL
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        // AUTO SCALE
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 2.2 / maxDimension;
        model.scale.setScalar(scale);

        scene.add(model);
      },

      undefined,

      (error) => {
        console.error('GLB failed to load:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);

      if (model) {
        model.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };

    animate();

    const resize = () => {
      const width = this.clientWidth;
      const height = this.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    new ResizeObserver(resize).observe(this);
  }
}

customElements.define('rotating-logo', RotatingLogo);
