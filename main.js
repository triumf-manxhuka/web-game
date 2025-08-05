import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.152.0/examples/jsm/controls/PointerLockControls.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Pointer lock controls
const controls = new PointerLockControls(camera, document.body);

const instructions = document.getElementById('instructions');
instructions.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  instructions.style.display = 'none';
});
controls.addEventListener('unlock', () => {
  instructions.style.display = '';
});

// Floor
const floorGeometry = new THREE.PlaneGeometry(200, 200);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x444444 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = - Math.PI / 2;
scene.add(floor);

// Basic lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Simple environment blocks
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

for(let i = 0; i < 10; i++) {
  const box = new THREE.Mesh(boxGeometry, boxMaterial);
  box.position.set(
    (Math.random() - 0.5) * 50,
    1,
    (Math.random() - 0.5) * 50
  );
  scene.add(box);
}

// Player movement variables
const move = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

const speed = 10; // units per second

// Keyboard input
function onKeyDown(event) {
  switch(event.code) {
    case 'ArrowUp':
    case 'KeyW':
      move.forward = true;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      move.left = true;
      break;
    case 'ArrowDown':
    case 'KeyS':
      move.backward = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      move.right = true;
      break;
  }
}

function onKeyUp(event) {
  switch(event.code) {
    case 'ArrowUp':
    case 'KeyW':
      move.forward = false;
      break;
    case 'ArrowLeft':
    case 'KeyA':
      move.left = false;
      break;
    case 'ArrowDown':
    case 'KeyS':
      move.backward = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      move.right = false;
      break;
  }
}

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = clock.getDelta();

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    direction.z = Number(move.forward) - Number(move.backward);
    direction.x = Number(move.right) - Number(move.left);
    direction.normalize();

    if (move.forward || move.backward) velocity.z -= direction.z * speed * delta;
    if (move.left || move.right) velocity.x -= direction.x * speed * delta;

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
  }

  renderer.render(scene, camera);
}

animate();
