import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('#canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Create OrbitControls


// Set up post-processing
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const rgbShiftPass = new ShaderPass(RGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.0025;
composer.addPass(rgbShiftPass);
let model;
// Load HDRI environment map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/pond_bridge_night_1k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    
    scene.environment = texture;
    
    // Load GLTF model
    const loader = new GLTFLoader();
    

    loader.load(
      'public/DamagedHelmet.gltf',
      (gltf) => {
        model = gltf.scene;
        scene.add(model);
        
        // Adjust model position if needed
        model.position.set(0, 0, 0);
        
        // Adjust camera position to view the model
        camera.position.set(0, 0, 3.5);
       
      },
      (progress) => {
        console.log(`Loading model... ${(progress.loaded / progress.total * 100)}%`);
      },
      (error) => {
        console.error('An error occurred while loading the model:', error);
      }
    );
}, undefined, (error) => {
    console.error('An error occurred while loading the HDRI:', error);
});

window.addEventListener('mousemove', (e) => {
 
  if(model){
    gsap.to(model.rotation, {
      y: (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.25,
      x: (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.25,
      duration: 0.9,
      ease: "power2.out"
    });
  }
});

function animate(){
  window.requestAnimationFrame(animate);

  
 
  // Render using the composer instead of renderer
  composer.render();
}
animate();


// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

ScrollTrigger.create({
  trigger: ".iteamContainer",
  start: "top 90%",
  end: "top top",
  scrub: 2,
  
  onUpdate: (self) => {
    gsap.to(".iteamContainer", {
      x: () => -200 * self.progress + "%",
      ease: "none",
      overwrite: "auto"
    });
  }
});


window.addEventListener('wheel', (dets) => {
  if(dets.deltaY < 0){
     gsap.to(".iteamContainer img", {
      rotate: "270deg",
     })
  } else{
    gsap.to(".iteamContainer img", {
      rotate: "90deg",
     })
  }
});

ScrollTrigger.create({
  trigger: ".thirdmainpage",
  start: "top 0%", 
  end: "top -100%",
  scrub: 2,
  
  pin: true,
  onUpdate: (self) => {
    const tl = gsap.timeline();
    
    tl.to(".thirdpage", {
      height: "100vh",
      duration: 0.5,
      ease: "none",
      overwrite: "auto"
    }).to(".thirdpage h1", {
      xPercent: -75* self.progress,
     
      ease: "none", 
      overwrite: "auto"
    });
  }
});

