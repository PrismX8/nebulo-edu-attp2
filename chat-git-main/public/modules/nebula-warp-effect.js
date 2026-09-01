import * as THREE from 'three';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

let activeNebulaWarp = null;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function collectElements() {
  const viewport = document.getElementById('messages-container')?.getBoundingClientRect();
  const selectors = [
    '#messages-list .msg-row',
    '#messages-list .msg-follow',
    '#members-list .member-item',
    '#members-list > *',
    '#section-list .sb-item',
    '#channel-header',
    '#compose-area'
  ];
  const seen = new Set();
  const items = [];
  for (const selector of selectors) {
    for (const node of document.querySelectorAll(selector)) {
      if (seen.has(node) || node.closest('.nebula-warp-overlay')) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 12) continue;
      const isMessage = node.matches('.msg-row,.msg-follow');
      const visible = isMessage && viewport
        ? rect.bottom > viewport.top && rect.top < viewport.bottom
        : rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      if (!visible) continue;
      seen.add(node);
      items.push({ node, rect, kind: selector.includes('members') ? 'member' : selector.includes('section') ? 'sidebar' : selector.includes('header') || selector.includes('compose') ? 'panel' : 'message' });
    }
  }
  return items.slice(0, 36);
}

function fallbackCanvas(item) {
  const scale = Math.min(devicePixelRatio || 1, 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(90, Math.round(item.rect.width * scale));
  canvas.height = Math.max(42, Math.round(item.rect.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  const w = canvas.width / scale;
  const h = canvas.height / scale;
  ctx.fillStyle = 'rgba(20,9,38,.96)';
  ctx.strokeStyle = 'rgba(213,105,255,.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#f8ddff';
  ctx.font = '600 11px Inter, Arial, sans-serif';
  ctx.fillText(String(item.node.textContent || 'UI').replace(/\s+/g, ' ').trim().slice(0, 110), 10, Math.min(24, h - 10));
  return canvas;
}

async function capture(item) {
  try {
    return await html2canvas(item.node, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scale: Math.min(devicePixelRatio || 1, 1.45),
      width: Math.ceil(item.rect.width),
      height: Math.ceil(item.rect.height),
      windowWidth: innerWidth,
      windowHeight: innerHeight
    });
  } catch {
    return fallbackCanvas(item);
  }
}

function screenToWorld(rect, camera, z = 0) {
  const dist = camera.position.z - z;
  const worldH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * dist;
  const worldW = worldH * camera.aspect;
  return {
    x: ((rect.left + rect.width / 2) / innerWidth - .5) * worldW,
    y: (.5 - (rect.top + rect.height / 2) / innerHeight) * worldH,
    perPixel: worldH / innerHeight
  };
}

function createNebulaField(count = 2600) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() ** .55 * 9.2;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = Math.sin(a) * r * .62;
    positions[i * 3 + 2] = -4 + Math.random() * 8;
    velocities[i * 3] = Math.cos(a) * (.015 + Math.random() * .07);
    velocities[i * 3 + 1] = Math.sin(a) * (.015 + Math.random() * .07);
    velocities[i * 3 + 2] = (Math.random() - .5) * .055;
    seeds[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xd86cff, size: .025, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
  return { points: new THREE.Points(geometry, material), geometry, material, positions, velocities, seeds };
}

function createLightStreaks(count = 520) {
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.2 + Math.random() ** .55 * 9;
    const len = .18 + Math.random() * (.4 + r * .15);
    const curl = .15 + r * .018;
    positions[i * 6] = Math.cos(a) * r;
    positions[i * 6 + 1] = Math.sin(a) * r * .64;
    positions[i * 6 + 2] = (Math.random() - .5) * 5;
    positions[i * 6 + 3] = Math.cos(a - curl) * Math.max(.25, r - len);
    positions[i * 6 + 4] = Math.sin(a - curl) * Math.max(.25, r - len) * .64;
    positions[i * 6 + 5] = positions[i * 6 + 2] * .85;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xb95cff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  return { lines: new THREE.LineSegments(geometry, material), geometry, material };
}

function createNebulaShader() {
  const geometry = new THREE.PlaneGeometry(10, 10, 1, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPower: { value: 0 }, uCore: { value: 0 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      varying vec2 vUv;uniform float uTime;uniform float uPower;uniform float uCore;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){
        vec2 p=vUv-.5;p.y*=1.05;
        float r=length(p);float a=atan(p.y,p.x);
        float n=noise(vec2(a*3.0+uTime*.25,r*9.0-uTime*.7));
        float spiral=sin(a*5.5-r*34.0+uTime*3.0+n*1.4)*.5+.5;
        float arms=pow(spiral,5.0)*smoothstep(.7,.02,r);
        float core=exp(-r*(9.0-uCore*5.5));
        vec3 violet=vec3(.48,.08,1.0), pink=vec3(1.0,.2,.78), blue=vec3(.08,.42,1.0);
        vec3 color=mix(violet,pink,core+.25*n)+blue*arms*.55;
        float alpha=(arms*.38+core*.88+smoothstep(.75,.05,r)*.06)*uPower;
        gl_FragColor=vec4(color,alpha);
      }`
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -1.2;
  return { mesh, material };
}

function createDistortionPass() {
  return new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uStrength: { value: 0 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      uniform sampler2D tDiffuse;uniform float uTime;uniform float uStrength;varying vec2 vUv;
      void main(){
        vec2 p=vUv-.5;
        float r=length(p);
        float twist=sin(r*20.0-uTime*5.0)*uStrength*.018;
        float ca=cos(twist),sa=sin(twist);
        vec2 q=vec2(ca*p.x-sa*p.y,sa*p.x+ca*p.y)+.5;
        gl_FragColor=texture2D(tDiffuse,q);
      }`
  });
}

function createDebris(count = 90) {
  const group = new THREE.Group();
  const debris = [];
  for (let i = 0; i < count; i++) {
    const mesh = new THREE.Mesh(
      new THREE.TetrahedronGeometry(.04 + Math.random() * .15, 0),
      new THREE.MeshBasicMaterial({ color: Math.random() > .5 ? 0xb95cff : 0x24113a, transparent: true, opacity: 0, wireframe: Math.random() > .72 })
    );
    mesh.position.set((Math.random() - .5) * 10, (Math.random() - .5) * 6, (Math.random() - .5) * 6);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    debris.push(mesh);
  }
  return { group, debris };
}

function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const v = material[key];
    if (v?.isTexture) v.dispose();
  }
  material.dispose?.();
}

function disposeScene(scene, composer, renderer) {
  scene.traverse((obj) => {
    obj.geometry?.dispose?.();
    if (Array.isArray(obj.material)) obj.material.forEach(disposeMaterial);
    else disposeMaterial(obj.material);
  });
  composer?.dispose?.();
  renderer.dispose();
  renderer.forceContextLoss?.();
}

export async function startNebulaWarpEffect({ durationMs = 14000 } = {}) {
  activeNebulaWarp?.stop?.();
  const snapshots = collectElements().map((item) => ({
    ...item,
    opacity: item.node.style.opacity,
    visibility: item.node.style.visibility,
    transform: item.node.style.transform,
    filter: item.node.style.filter
  }));
  if (!snapshots.length) return null;

  const overlay = document.createElement('div');
  overlay.className = 'nebula-warp-overlay';
  overlay.innerHTML = `<div class="nebula-warp-edge"></div><div class="nebula-warp-vignette"></div><div class="nebula-warp-flash"></div><div class="nebula-warp-rain"></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('nebula-warp-running');

  const hiddenDuringEffect = new Set();
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return;
        if (node.matches?.('#messages-list .msg-row,#messages-list .msg-follow,#members-list .member-item,#members-list > *')) {
          hiddenDuringEffect.add([node, node.style.opacity]);
          node.style.opacity = '0';
        }
      });
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  const canvases = await Promise.all(snapshots.map(capture));
  if (!overlay.isConnected) return null;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x06000d, .045);
  const camera = new THREE.PerspectiveCamera(44, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, 0, 10.9);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.16;
  overlay.prepend(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.35, .72, .38);
  composer.addPass(bloom);
  const distortion = createDistortionPass();
  composer.addPass(distortion);

  scene.add(new THREE.AmbientLight(0x8a38ff, .18));
  const energy = new THREE.PointLight(0xf078ff, 0, 16, 1.55);
  energy.position.z = 2.1;
  scene.add(energy);
  const stars = createNebulaField();
  scene.add(stars.points);
  const streaks = createLightStreaks();
  streaks.lines.position.z = -.7;
  scene.add(streaks.lines);
  const nebula = createNebulaShader();
  nebula.mesh.scale.setScalar(.25);
  scene.add(nebula.mesh);
  const debris = createDebris();
  scene.add(debris.group);
  const warpRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.05, .045, 16, 140),
    new THREE.MeshBasicMaterial({ color: 0xe27cff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  warpRing.rotation.x = .45;
  warpRing.position.z = .35;
  scene.add(warpRing);
  const shockwaves = [0, 1, 2, 3].map((index) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(.82, .018, 10, 120),
      new THREE.MeshBasicMaterial({ color: index === 0 ? 0xffffff : 0xd86cff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.position.z = .52;
    mesh.scale.setScalar(.1);
    scene.add(mesh);
    return mesh;
  });

  const pieces = snapshots.map((snapshot, index) => {
    const texture = new THREE.CanvasTexture(canvases[index]);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    const loc = screenToWorld(snapshot.rect, camera, 0);
    const width = Math.max(.08, snapshot.rect.width * loc.perPixel);
    const height = Math.max(.04, snapshot.rect.height * loc.perPixel);
    const object = new THREE.Group();
    object.position.set(loc.x, loc.y, 0);
    const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 2, 2), material);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xd86cff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(width * 1.02, height * 1.08)), edgeMaterial);
    edge.position.z = -.02;
    object.add(edge, mesh);
    scene.add(object);
    const start = new THREE.Vector3(loc.x, loc.y, 0);
    const warpX = innerWidth > 760 ? 3.3 : 1.8;
    const angle = Math.atan2(start.y, start.x - warpX) + (Math.random() - .5) * .7;
    const floatTarget = new THREE.Vector3(start.x + (Math.random() - .5) * 1.4, start.y + (Math.random() - .5) * .9, (Math.random() - .5) * 2.2);
    const pulled = new THREE.Vector3(mix(start.x, warpX, .78), mix(start.y, 0, .72), (Math.random() - .5) * 2.6);
    const orbitRadius = .9 + (index % 7) * .18;
    const explode = new THREE.Vector3(start.x + Math.cos(angle) * (4 + Math.random() * 3), start.y + Math.sin(angle) * (3 + Math.random() * 2.2), (Math.random() - .5) * 6);
    return { snapshot, object, material, edgeMaterial, start, floatTarget, pulled, explode, orbitRadius, orbitAngle: Math.atan2(start.y, start.x - warpX), seed: Math.random() * Math.PI * 2, state: { show: 0, float: 0, pull: 0, dissolve: 0, orbit: 0, core: 0, explode: 0, rebuild: 0, heal: 0 } };
  });

  let stopped = false;
  let frame = 0;
  let previous = performance.now();
  const state = { shake: 0, vortex: 0, starWarp: 0, explosion: 0, rain: 0, distortion: 0 };

  function updatePiece(piece, index, time) {
    const s = piece.state;
    const fp = smooth(s.float);
    const pp = smooth(s.pull);
    const op = smooth(s.orbit);
    const cp = smooth(s.core);
    const ep = smooth(s.explode);
    const rp = smooth(s.rebuild);
    let x = mix(piece.start.x, piece.floatTarget.x, fp);
    let y = mix(piece.start.y, piece.floatTarget.y, fp);
    let z = mix(piece.start.z, piece.floatTarget.z, fp);
    x = mix(x, piece.pulled.x, pp);
    y = mix(y, piece.pulled.y, pp);
    z = mix(z, piece.pulled.z, pp);
    const a = piece.orbitAngle + op * Math.PI * 5.4 + index * .24;
    x = mix(x, Math.cos(a) * piece.orbitRadius, op);
    y = mix(y, Math.sin(a) * piece.orbitRadius * .66, op);
    z = mix(z, Math.sin(a * 1.7) * 1.35, op);
    x = mix(x, Math.cos(a) * .48, cp);
    y = mix(y, Math.sin(a) * .34, cp);
    z = mix(z, .35, cp);
    x = mix(x, piece.explode.x, ep);
    y = mix(y, piece.explode.y, ep);
    z = mix(z, piece.explode.z, ep);
    x = mix(x, piece.start.x, rp);
    y = mix(y, piece.start.y, rp);
    z = mix(z, piece.start.z, rp);
    const wobble = Math.sin(time * 4 + piece.seed) * (.08 + state.vortex * .05) * (fp + pp + op) * (1 - rp);
    piece.object.position.set(x + wobble, y + wobble * .45, z);
    piece.object.rotation.set(mix(Math.sin(piece.seed) * 1.2 * Math.max(fp, pp, op, ep), 0, rp), mix(Math.cos(piece.seed) * 1.45 * Math.max(fp, pp, op, ep), 0, rp), mix(piece.seed * Math.max(fp, pp, op, ep) + op * 2.4, 0, rp));
    const dissolve = s.dissolve * (1 - rp);
    piece.object.scale.set(mix(1, .55, dissolve), mix(1, .22, dissolve), 1);
    piece.material.opacity = s.show * (1 - s.heal) * (1 - dissolve * .55);
    piece.edgeMaterial.opacity = s.show * (.2 + Math.max(pp, op, cp) * .55) * (1 - s.heal);
  }

  function render(now) {
    if (stopped) return;
    const dt = Math.min(.04, (now - previous) / 1000 || .016);
    previous = now;
    const time = now / 1000;
    nebula.material.uniforms.uTime.value = time;
    nebula.material.uniforms.uPower.value = state.vortex;
    nebula.material.uniforms.uCore.value = state.starWarp;
    nebula.mesh.rotation.z += dt * (state.vortex * 1.6 + .12);
    nebula.mesh.scale.setScalar(.25 + state.vortex * 1.1 + state.starWarp * .35);
    warpRing.rotation.z += dt * (2 + state.vortex * 3);
    warpRing.scale.setScalar(.5 + state.vortex * 1.45);
    streaks.lines.rotation.z -= dt * (.1 + state.vortex * .38);
    pieces.forEach((piece, index) => updatePiece(piece, index, time));
    const pos = stars.positions;
    for (let i = 0; i < stars.seeds.length; i++) {
      const base = i * 3;
      const a = Math.atan2(pos[base + 1], pos[base]) + dt * (.2 + state.vortex * 1.8);
      const r = Math.hypot(pos[base], pos[base + 1]) * (1 - state.starWarp * dt * .1) + state.explosion * stars.velocities[base] * 8;
      pos[base] = Math.cos(a) * r + stars.velocities[base] * state.rain;
      pos[base + 1] = Math.sin(a) * r * .74 + stars.velocities[base + 1] * state.rain;
      pos[base + 2] += stars.velocities[base + 2] * (1 + state.explosion * 12);
    }
    stars.geometry.attributes.position.needsUpdate = true;
    debris.debris.forEach((mesh, index) => {
      mesh.material.opacity = (.08 + state.vortex * .25 + state.explosion * .45) * (1 - state.rain * .35);
      mesh.rotation.x += dt * (.6 + index % 5);
      mesh.rotation.y += dt * (.4 + index % 6);
      mesh.position.multiplyScalar(1 + state.explosion * dt * .25);
    });
    distortion.uniforms.uTime.value = time;
    distortion.uniforms.uStrength.value = state.distortion;
    if (state.shake > 0) {
      camera.position.x = (Math.random() - .5) * state.shake;
      camera.position.y = (Math.random() - .5) * state.shake;
      camera.rotation.z = (Math.random() - .5) * state.shake * .08;
    } else {
      camera.position.x *= .82; camera.position.y *= .82; camera.rotation.z *= .82;
    }
    composer.render();
    frame = requestAnimationFrame(render);
  }
  frame = requestAnimationFrame(render);

  const flash = overlay.querySelector('.nebula-warp-flash');
  const rain = overlay.querySelector('.nebula-warp-rain');
  const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
  timeline.to(overlay, { opacity: 1, duration: .5, ease: 'sine.out' }, 0);
  timeline.to(stars.material, { opacity: .42, duration: 1.2, ease: 'sine.out' }, .45);
  timeline.to(streaks.material, { opacity: .22, duration: 1.2, ease: 'sine.out' }, .7);
  pieces.forEach((piece, index) => {
    timeline.to(piece.state, { show: 1, duration: .22, ease: 'none' }, 1.55 + (index % 8) * .018);
    timeline.call(() => { if (piece.snapshot.node.isConnected) piece.snapshot.node.style.opacity = '0'; }, null, 1.55 + (index % 8) * .018);
    timeline.to(piece.state, { float: 1, duration: 1.2, ease: 'back.out(1.1)' }, 1.65 + (index % 7) * .025);
    timeline.to(piece.state, { pull: 1, duration: 1.8, ease: 'power2.inOut' }, 2.9 + (index % 7) * .018);
    timeline.to(piece.state, { dissolve: .85, duration: 1.5, ease: 'power2.in' }, 4.45 + (index % 8) * .018);
    timeline.to(piece.state, { orbit: 1, duration: 2, ease: 'power2.inOut' }, 5.55 + (index % 9) * .014);
    timeline.to(piece.state, { core: 1, duration: 1.5, ease: 'power3.in' }, 7.15 + (index % 8) * .012);
    timeline.to(piece.state, { explode: 1, duration: .8, ease: 'expo.out' }, 8.55 + (index % 7) * .01);
    timeline.to(piece.state, { dissolve: 0, rebuild: 1, duration: 2, ease: 'power3.inOut' }, 10.0 + (index % 7) * .016);
    timeline.to(piece.state, { heal: 1, duration: .8, ease: 'sine.inOut' }, 12.1);
  });
  timeline.to(state, { vortex: .45, distortion: .25, duration: 1.2, ease: 'sine.out' }, .55);
  timeline.to(state, { vortex: 1, starWarp: .55, shake: .045, distortion: .48, duration: 1.8, ease: 'power2.inOut' }, 2.8);
  timeline.to(energy, { intensity: 8, duration: 2, ease: 'power2.in' }, 4.6);
  timeline.to(warpRing.material, { opacity: .75, duration: 1.2, ease: 'sine.out' }, 5.4);
  timeline.to(state, { starWarp: 1, shake: .075, duration: 1.5, ease: 'power3.inOut' }, 7.15);
  timeline.to(state, { explosion: 1, shake: .26, distortion: .7, duration: .16, ease: 'none' }, 8.55);
  timeline.to(flash, { opacity: 1, duration: .08, ease: 'none' }, 8.55);
  timeline.to(flash, { opacity: 0, duration: .75, ease: 'power3.out' }, 8.63);
  shockwaves.forEach((ring, index) => {
    timeline.to(ring.material, { opacity: .82 - index * .13, duration: .08, ease: 'none' }, 8.55 + index * .08);
    timeline.to(ring.scale, { x: 8 + index * 1.5, y: 8 + index * 1.5, z: 8 + index * 1.5, duration: 1.15, ease: 'expo.out' }, 8.55 + index * .08);
    timeline.to(ring.material, { opacity: 0, duration: .85, ease: 'sine.out' }, 8.86 + index * .08);
  });
  timeline.to(state, { explosion: .2, rain: 1, shake: .02, distortion: .18, duration: 1.5, ease: 'sine.out' }, 9.35);
  timeline.to(rain, { opacity: .55, duration: .45, ease: 'sine.out' }, 9.35);
  timeline.to(rain, { opacity: 0, duration: 1.4, ease: 'sine.inOut' }, 10.55);
  timeline.to(state, { vortex: .25, starWarp: 0, shake: 0, distortion: 0, duration: 1.6, ease: 'sine.inOut' }, 10.55);
  timeline.to(warpRing.material, { opacity: 0, duration: .9, ease: 'sine.inOut' }, 11.3);
  timeline.to(stars.material, { opacity: 0, duration: 1.1, ease: 'sine.inOut' }, 12.0);
  timeline.to(streaks.material, { opacity: 0, duration: .9, ease: 'sine.inOut' }, 12.0);
  timeline.call(() => {
    snapshots.forEach(({ node, opacity, visibility, transform, filter }) => {
      if (!node.isConnected) return;
      node.style.opacity = opacity;
      node.style.visibility = visibility;
      node.style.transform = transform;
      node.style.filter = filter;
    });
    hiddenDuringEffect.forEach(([node, opacity]) => { if (node.isConnected) node.style.opacity = opacity; });
  }, null, 12.65);
  timeline.to(pieces.map((piece) => piece.material), { opacity: 0, duration: .35, ease: 'sine.inOut' }, 12.7);
  timeline.to(pieces.map((piece) => piece.edgeMaterial), { opacity: 0, duration: .35, ease: 'sine.inOut' }, 12.7);
  timeline.to(overlay, { opacity: 0, duration: .55, ease: 'sine.inOut' }, 13.1);

  const resize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
    renderer.setSize(innerWidth, innerHeight);
    composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
    composer.setSize(innerWidth, innerHeight);
  };
  addEventListener('resize', resize);

  function stop() {
    if (stopped) return;
    stopped = true;
    timeline.kill();
    cancelAnimationFrame(frame);
    removeEventListener('resize', resize);
    observer.disconnect();
    snapshots.forEach(({ node, opacity, visibility, transform, filter }) => {
      if (!node.isConnected) return;
      node.style.opacity = opacity;
      node.style.visibility = visibility;
      node.style.transform = transform;
      node.style.filter = filter;
    });
    hiddenDuringEffect.forEach(([node, opacity]) => { if (node.isConnected) node.style.opacity = opacity; });
    document.body.classList.remove('nebula-warp-running');
    disposeScene(scene, composer, renderer);
    overlay.remove();
    if (activeNebulaWarp?.stop === stop) activeNebulaWarp = null;
  }
  timeline.call(stop, null, 13.75);
  const requested = clamp((Number(durationMs) || 14000) / 1000, 12, 17);
  timeline.timeScale(13.75 / requested);
  activeNebulaWarp = { stop };
  return { active: true };
}
