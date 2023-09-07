import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import fontData from './assets/fonts/jamsil.json';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

window.addEventListener('load', () => {
  init();
});

function init() {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

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
  camera.position.z = 5;

  /** controls **/
  new OrbitControls(camera, renderer.domElement);

  const fontLoader = new FontLoader();

  const font = fontLoader.parse(fontData);

  const textGeometry = new TextGeometry('HELLO WORLD', {
    font,
    size: 0.5,
    height: 0.1,
  });

  const textMaterial = new THREE.MeshPhongMaterial({ color: 0x00c896});

  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);

  /** AmbientLight */
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);

  scene.add(ambientLight);

  /** point light */
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.distance = 10;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5);
  pointLight.position.set(3, 0, 2);

  scene.add(pointLight, pointLightHelper);

  gui.add(pointLight.position, 'x').min(-3).max(3).step(0.1);

  const render = () => {
    renderer.render(scene, camera);
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
