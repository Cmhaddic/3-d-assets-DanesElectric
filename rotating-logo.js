import * as THREE from 'https://unpkg.com/three@0.180.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.180.0/examples/jsm/loaders/GLTFLoader.js';

class RotatingLogo extends HTMLElement {

  connectedCallback() {

    this.style.display = 'block';
    this.style.width = '100%';
    this.style.height = '100%';
    this.style.minHeight = '300px';
    this.style.background = 'transparent';

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

    renderer.domElement.style.pointerEvents = 'none';

    this.appendChild(renderer.domElement);


    // EVEN LIGHTING
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const front = new THREE.DirectionalLight(0xffffff, 2);
    front.position.set(0, 2, 5);
    scene.add(front);

    const back = new THREE.DirectionalLight(0xffffff, 2);
    back.position.set(0, 2, -5);
    scene.add(back);

    const left = new THREE.DirectionalLight(0xffffff, 1.5);
    left.position.set(-5, 0, 2);
    scene.add(left);

    const right = new THREE.DirectionalLight(0xffffff, 1.5);
    right.position.set(5, 0, 2);
    scene.add(right);


    // LOAD MODEL
    const loader = new GLTFLoader();

    let model;

    loader.load(
      'https://cmhaddic.github.io/3-d-assets-DanesElectric/Dane%27s_Logo.glb',

      (gltf) => {

        model = gltf.scene;

        // CENTER MODEL
        const box = new THREE.Box3().setFromObject(model);

        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);

        // SCALE MODEL TO FIT
        const maxSize = Math.max(size.x, size.y, size.z);
        const scale = 2.5 / maxSize;

        model.scale.setScalar(scale);

        // MAKE MATERIALS FULLY VISIBLE
        model.traverse((child) => {

          if (child.isMesh) {

            child.material.side = THREE.DoubleSide;
            child.material.transparent = false;
            child.material.opacity = 1;
            child.material.needsUpdate = true;

          }

        });

        scene.add(model);

      },

      undefined,

      (error) => {
        console.error('Model failed to load:', error);
      }
    );


    // AUTOMATIC ROTATION
    const animate = () => {

      requestAnimationFrame(animate);

      if (model) {
        model.rotation.y += 0.006;
      }

      renderer.render(scene, camera);
    };

    animate();


    // RESPONSIVE
    const resize = () => {

      const width = this.clientWidth;
      const height = this.clientHeight;

      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    new ResizeObserver(resize).observe(this);

  }
}

customElements.define('rotating-logo', RotatingLogo);
