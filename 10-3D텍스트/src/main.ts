import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import fontData from './assets/fonts/jamsil.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';
import Holographic from './assets/textures/holographic.jpeg';
import Gradient from './assets/textures/gradient.jpeg';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import {
  UnrealBloomPass,
} from 'three/examples/jsm/postprocessing/UnrealBloomPass';

window.addEventListener('load', () => {
  init();
});

async function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  renderer.shadowMap.enabled = true;
  const gui = new GUI();

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    500
  );
  camera.position.set(0, 1, 5);

  /** controls **/
  new OrbitControls(camera, renderer.domElement);

  /** font **/
  const fontLoader = new FontLoader();
  const font = fontLoader.parse(fontData);

  const textGeometry = new TextGeometry('HELLO WORLD', {
    font,
    size: 0.5,
    height: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });

  // const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00c896 });
  const textMaterial = new THREE.MeshPhongMaterial();

  const text = new THREE.Mesh(textGeometry, textMaterial);

  text.castShadow = true;

  textGeometry.computeBoundingBox();

  // textGeometry.translate(
  //   -(
  //     (textGeometry.boundingBox?.max.x || 0) -
  //     (textGeometry.boundingBox?.min.x || 0)
  //   ) * 0.5,
  //   -(
  //     (textGeometry.boundingBox?.max.y || 0) -
  //     (textGeometry.boundingBox?.min.y || 0)
  //   ) * 0.5,
  //   -(
  //     (textGeometry.boundingBox?.max.z || 0) -
  //     (textGeometry.boundingBox?.min.z || 0)
  //   ) * 0.5,
  // );

  textGeometry.center();

  /** texture */
  const textureLoader = new THREE.TextureLoader();

  const textTexture = await textureLoader.loadAsync(Holographic);
  const spotlightTexture = await textureLoader.loadAsync(Gradient);

  textMaterial.map = textTexture;

  scene.add(text);

  /** Plane */
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.position.z = -10;
  plane.receiveShadow = true;

  scene.add(plane);

  /** SpotLight */
  const spotLight = new THREE.SpotLight(
    0xffffff,
    25,
    30,
    Math.PI * 0.15,
    0.2,
    0.5
  );

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.radius = 10;
  spotLight.map = spotlightTexture;

  spotLight.position.set(0, 0, 3);
  spotLight.target.position.set(0, 0, -3);

  // const spotLightHelpder = new THREE.SpotLightHelper(spotLight);

  // scene.add(spotLightHelpder);

  scene.add(spotLight, spotLight.target);

  const spotLightFolder = gui.addFolder('Spotlight');

  spotLightFolder
    .add(spotLight, 'angle')
    .min(0)
    .max(Math.PI / 2)
    .step(0.01);

  spotLightFolder
    .add(spotLight.position, 'z')
    .min(1)
    .max(10)
    .step(0.01)
    .name('position.z');

  spotLightFolder.add(spotLight, 'distance').min(1).max(30).step(0.01);

  spotLightFolder.add(spotLight, 'decay').min(0).max(10).step(0.01);

  spotLightFolder.add(spotLight, 'penumbra').min(0).max(1).step(0.01);

  spotLightFolder
    .add(spotLight.shadow, 'radius')
    .min(1)
    .max(20)
    .step(0.01)
    .name('shadow radius');

  window.addEventListener('mousemove', (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 5;
    const y = -((e.clientY / window.innerHeight - 0.5) * 5);

    spotLight.target.position.set(x, y, -3);
  });

  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);

  scene.add(ambientLight);

  // /** point light */
  // const pointLight = new THREE.PointLight(0xffffff, 5);
  // pointLight.distance = 10;
  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  // pointLight.position.set(3, 0, 2);

  // scene.add(pointLight);

  // gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1);

  /** Effects */
  const renderPass = new RenderPass(scene, camera);
  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);

  const unrealBloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.2,
    1,
    0
  );

  composer.addPass(unrealBloomPass);

  const unrealBloomPassFolder = gui.addFolder('UnrealBloomPass');

  unrealBloomPassFolder.add(unrealBloomPass, 'strength').min(0).max(3).step(0.01);
  unrealBloomPassFolder.add(unrealBloomPass, 'radius').min(0).max(1).step(0.01);
  unrealBloomPassFolder.add(unrealBloomPass, 'threshold').min(0).max(3).step(0.01);


  const render = () => {
    composer.render();

    // spotLightHelpder.update();
    requestAnimationFrame(render);
  };

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  render();

  window.addEventListener('resize', handleResize);
}
