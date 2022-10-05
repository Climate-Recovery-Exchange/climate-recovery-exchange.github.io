

document.addEventListener("DOMContentLoaded", function() {
  initConsole();
  initGlobe();
});

const initConsole = () => {
  console.warn = (e) => {
    var err = new Error( "trace");
    var stack = err.stack;
    debounce(function() {
      if(!stack) try {
        throw err;
      }
      catch(err) {
          stack = err.stack;
      }
      if(stack) {
        stack = stack.split('\n').slice(1,3).join('\n');
        console.info('⚠️ Warning from\n%s\n%s', stack, '🟨');
      }
    }, 1000);
  }  
}

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
}


const initGlobe = () => {
  const threeConfig = {
    animateIn: false,
    antialias: true,
    powerPreference: 'low-power',
  };
  const world = Globe(threeConfig)(document.getElementById('globeViz'))
    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
    .width(window.innerWidth)
    .height(window.innerHeight * 4);
  // Styling
  world
    .showAtmosphere(true)
    .atmosphereColor("lightskyblue")
    .atmosphereAltitude("0.15");

  // Add clouds sphere
  const CLOUDS_IMG_URL = '/images/clouds.png'; // from https://github.com/turban/webgl-earth
  const CLOUDS_ALT = 0.004;
  const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame
  
  new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
    const clouds = new THREE.Mesh(
      new THREE.SphereBufferGeometry(world.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
      new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
    );
    world.scene().add(clouds);
    // Auto-rotate
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;
    world.controls().enableZoom = false;
    world.controls().enablePan = true;
    world.pointOfView({ lat: 0, lng: 0, altitude: 2.5 })
    (function rotateClouds() {
      clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
      requestAnimationFrame(rotateClouds);
    })();
  });
  window.addEventListener('resize', (event) => {
    world
      .width(window.innerWidth)
      .height(window.innerHeight * 4);
  });
}
