//Importacion de librerias y requerimientos
global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");
const canvasSketch = require("canvas-sketch");


//Settings de la visualizacion en general
const settings = {
  animate: true,
  context: "webgl",
  scaleToView: true
};

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;


const sketch = ({ context }) => {
  // Renderizacion del proyecto
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
    alpha: true,
  });
  renderer.setClearColor("#331157", 1);

  // Creacion de camara
  const camera = new THREE.PerspectiveCamera(100, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
  camera.position.set(30, 5, 35);

  // Creacion de controles de orbita
  const controls = new THREE.OrbitControls(camera, context.canvas);
  controls.target.set(30, 0, 0);

  //Asignacion de texturas
  const loader = new THREE.TextureLoader();
  const sunTexture = loader.load("assets/splash.jpg");
  const mercuryTexture = loader.load("assets/jack.jpg");
  const venusTexture = loader.load("assets/berries.jpg");
  const earthTexture = loader.load("assets/lemons.jpg");
  const marsTexture = loader.load("assets/carrots.jpg");
  const jupiterTexture = loader.load("assets/halfDonut.jpg");
  const saturnTexture = loader.load("assets/figs.jpeg");
  const uranusTexture = loader.load("assets/cabbage.jpg");
  const neptuneTexture = loader.load("assets/cookies.jpg");
  const plutoTexture = loader.load("assets/donut.jpg");

  //Uso de mesh para asignarle un tipo de material a los planetas
  const sunMaterial = new THREE.MeshStandardMaterial({ map: sunTexture });
  const mercuryMaterial = new THREE.MeshStandardMaterial({ map: mercuryTexture });
  const venusMaterial = new THREE.MeshStandardMaterial({ map: venusTexture });
  const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture});
  const marsMaterial = new THREE.MeshStandardMaterial({ map: marsTexture });
  const jupiterMaterial = new THREE.MeshStandardMaterial({ map: jupiterTexture });
  const saturnMaterial = new THREE.MeshStandardMaterial({ map: saturnTexture });
  const uranusMaterial = new THREE.MeshStandardMaterial({ map: uranusTexture });
  const neptuneMaterial = new THREE.MeshStandardMaterial({ map: neptuneTexture });
  const plutoMaterial = new THREE.MeshStandardMaterial({ map: plutoTexture });

  //Creacion de las figuras para ser utilizadas
  const scene = new THREE.Scene();
  const sunShape = new THREE.TorusKnotBufferGeometry(
    3.5, 1.5, 64, 8, 2, 3);
  const weirdBowlShape = new THREE.CylinderBufferGeometry(
    6.4, 1.1,3.2,50,2,false,Math.PI*0.00,Math.PI*1.50);
  const pyramidShape = new THREE.TetrahedronBufferGeometry(1);
  function klein(v, u, target) {
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;
    let x;
    let z;
    if (u < Math.PI) {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
        z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
        x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
        z = -8 * Math.sin(u);
    }
    const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    target.set(x, y, z).multiplyScalar(0.75);
  }
  const wormHornShape = new THREE.ParametricBufferGeometry(
    klein, 25,25);

  //Asignaciones de material y figura de cada objeto (planetas y sol)
  const sunMesh = new THREE.Mesh(sunShape, sunMaterial);
  sunMesh.position.set(0, 0, 0);
  sunMesh.scale.setScalar(2);
  scene.add(sunMesh);

  const mercuryGroup = new THREE.Group();
  const mercuryMesh = new THREE.Mesh(wormHornShape, mercuryMaterial);
  createPlanet(scene, mercuryMesh, mercuryGroup, 25, 0.5);

  const venusGroup = new THREE.Group();
  const venusMesh = new THREE.Mesh(pyramidShape, venusMaterial);
  createPlanet(scene, venusMesh, venusGroup, 28, 0.9);

  const earthGroup = new THREE.Group();
  const earthMesh = new THREE.Mesh(weirdBowlShape, earthMaterial);
  createPlanet(scene, earthMesh, earthGroup, 31, 0.2);

  const marsGroup = new THREE.Group();
  const marsMesh = new THREE.Mesh(wormHornShape, marsMaterial);
  createPlanet(scene, marsMesh, marsGroup, 34, 0.5);

  const jupiterGroup = new THREE.Group();
  const jupiterMesh = new THREE.Mesh(pyramidShape, jupiterMaterial);
  createPlanet(scene, jupiterMesh, jupiterGroup, 42, 3.5);

  const saturnGroup = new THREE.Group();
  const saturnMesh = new THREE.Mesh(wormHornShape, saturnMaterial);
  createPlanet(scene, saturnMesh, saturnGroup, 50, 0.8);

  const uranusGroup = new THREE.Group();
  const uranusMesh = new THREE.Mesh(pyramidShape, uranusMaterial);
  createPlanet(scene, uranusMesh, uranusGroup, 56, 1.7);

  const neptuneGroup = new THREE.Group();
  const neptuneMesh = new THREE.Mesh(wormHornShape, neptuneMaterial);
  createPlanet(scene, neptuneMesh, neptuneGroup, 60, 0.6);

  const plutoGroup = new THREE.Group();
  const plutoMesh = new THREE.Mesh(pyramidShape, plutoMaterial);
  createPlanet(scene, plutoMesh, plutoGroup, 64, 0.5);

  //Efecto de iluminacion 
  const light = new THREE.PointLight("white", 2.0);
  light.position.set(0, 0, 0);
  scene.add(light);

  createSpotlights(scene);

  return {
    //Renderizacion de las ortibitas/los movimientos de los objetos
    render({ time }) {
      sunMesh.rotation.y = time * 0.05

      mercuryGroup.rotation.z = time * 1.5;
      mercuryMesh.rotation.z = time * 0.20;

      venusGroup.rotation.y = time * 1.35;
      venusMesh.rotation.y = time * 0.18;

      earthGroup.rotation.x = time * 1.3;
      earthMesh.rotation.x = time * 0.15;

      marsGroup.rotation.z = time * 1.2;
      marsMesh.rotation.z = time * 0.2;

      jupiterGroup.rotation.y = time * 1.05;
      jupiterMesh.rotation.y = time * 0.05;

      saturnGroup.rotation.z = time * 1.03;
      saturnMesh.rotation.z = time * 0.25;

      uranusGroup.rotation.y = time * 1.02;
      uranusMesh.rotation.y = time * 0.25;

      neptuneGroup.rotation.z = time * 1.015;
      neptuneMesh.rotation.z = time * 0.25;

      plutoGroup.rotation.y = time * 1.005;
      plutoMesh.rotation.y = time * 0.2;

      controls.update();
      renderer.render(scene, camera);
    },
    // Limpieza para reloads
    unload() {
      controls.dispose();
      renderer.dispose();
    }
  };
};

//Funcion para la creacion de los planetas 
function createPlanet(scene, mesh, group, x, scale) {
  mesh.position.set(x, 0, 0);
  mesh.scale.setScalar(scale);
  group.add(mesh);
  scene.add(group);
}

//Funcion para la creacion del spotlight
function createSpotlights(scene) {
  var color = 0xFFFFFF;
  var intensity = 5;
  var distance = 25;
  var angle = Math.PI/7;

  new Array(6).fill('').forEach((item, i) => {
    var spotlight = new THREE.SpotLight(color, intensity, distance, angle);
    var value = i % 2 === 0 ? 25 : -25;

    spotlight.position.set(
      i < 2 ? value : 0,
      i >= 2 && i < 4 ? value : 0,
      i >= 4 ? value : 0
    );
    scene.add( spotlight );
  });
}

canvasSketch(sketch, settings);
