import * as THREE from 'three';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let activeDigitalEarthquake = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function collectRealChatElements() {
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
  const elements = [];
  for (const selector of selectors) {
    for (const node of document.querySelectorAll(selector)) {
      if (seen.has(node) || node.closest('.digital-earthquake-overlay')) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 12) continue;
      const isMessage = node.matches('.msg-row,.msg-follow');
      const visible = isMessage && viewport
        ? rect.bottom > viewport.top && rect.top < viewport.bottom
        : rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      if (!visible) continue;
      seen.add(node);
      elements.push({ node, rect, kind: selector.includes('members') ? 'member' : selector.includes('section') ? 'sidebar' : selector.includes('header') ? 'panel' : selector.includes('compose') ? 'panel' : 'message' });
    }
  }
  return elements.slice(0, 34);
}

function fallbackCanvas(snapshot) {
  const scale = Math.min(devicePixelRatio || 1, 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(80, Math.round(snapshot.rect.width * scale));
  canvas.height = Math.max(40, Math.round(snapshot.rect.height * scale));
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  const w = canvas.width / scale;
  const h = canvas.height / scale;
  ctx.fillStyle = 'rgba(28,16,8,.96)';
  ctx.strokeStyle = 'rgba(255,176,72,.72)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#fff1cf';
  ctx.font = '600 11px Inter, Arial, sans-serif';
  const text = String(snapshot.node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120);
  ctx.fillText(text || 'UI', 10, Math.min(24, h - 10));
  return canvas;
}

async function captureNode(snapshot) {
  try {
    return await html2canvas(snapshot.node, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: false,
      logging: false,
      scale: Math.min(devicePixelRatio || 1, 1.45),
      width: Math.ceil(snapshot.rect.width),
      height: Math.ceil(snapshot.rect.height),
      windowWidth: innerWidth,
      windowHeight: innerHeight
    });
  } catch {
    return fallbackCanvas(snapshot);
  }
}

function screenToWorld(rect, camera, z = 0) {
  const distance = camera.position.z - z;
  const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * distance;
  const worldWidth = worldHeight * camera.aspect;
  return {
    x: ((rect.left + rect.width / 2) / innerWidth - .5) * worldWidth,
    y: (.5 - (rect.top + rect.height / 2) / innerHeight) * worldHeight,
    perPixel: worldHeight / innerHeight
  };
}

function createCrackLines(count = 135) {
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const branch = i % 5;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() ** .72 * 5.8;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * .62;
    const len = .15 + Math.random() * .62;
    const a2 = angle + (Math.random() - .5) * 1.8 + branch * .08;
    positions[i * 6] = x;
    positions[i * 6 + 1] = y;
    positions[i * 6 + 2] = -1.1 + Math.random() * .6;
    positions[i * 6 + 3] = x + Math.cos(a2) * len;
    positions[i * 6 + 4] = y + Math.sin(a2) * len;
    positions[i * 6 + 5] = positions[i * 6 + 2];
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xffb04a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  return { lines: new THREE.LineSegments(geometry, material), material, geometry };
}

function createParticles(count = 1850) {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() ** .55 * 7;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * .62;
    positions[i * 3 + 2] = (Math.random() - .5) * 6;
    velocities[i * 3] = Math.cos(angle) * (.015 + Math.random() * .06);
    velocities[i * 3 + 1] = Math.sin(angle) * (.015 + Math.random() * .06);
    velocities[i * 3 + 2] = (Math.random() - .5) * .045;
    seeds[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({ color: 0xd08a3a, size: .032, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true });
  return { points: new THREE.Points(geometry, material), geometry, material, positions, velocities, seeds };
}

function createVortex() {
  const geometry = new THREE.PlaneGeometry(7.5, 7.5, 1, 1);
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPower: { value: 0 } },
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `
      varying vec2 vUv;uniform float uTime;uniform float uPower;
      void main(){
        vec2 p=vUv-.5;p.y*=1.18;
        float r=length(p);float a=atan(p.y,p.x);
        float spiral=sin(a*8.0-r*46.0+uTime*8.0)*.5+.5;
        float ring=smoothstep(.42,.06,r);
        float core=exp(-r*12.0);
        float rays=pow(spiral,8.0)*smoothstep(.5,.04,r);
        vec3 color=mix(vec3(.24,.10,.02),vec3(1.0,.72,.28),core+rays*.8);
        float alpha=(rays*.42+core*.92+ring*.08)*uPower;
        gl_FragColor=vec4(color,alpha);
      }`
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -.6;
  return { mesh, material };
}

function createDebris(count = 105) {
  const group = new THREE.Group();
  const debris = [];
  for (let i = 0; i < count; i++) {
    const geo = new THREE.TetrahedronGeometry(.055 + Math.random() * .19, 0);
    const mat = new THREE.MeshBasicMaterial({ color: Math.random() > .55 ? 0xd08a3a : 0x2b170a, transparent: true, opacity: 0, wireframe: Math.random() > .72 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set((Math.random() - .5) * 10, (Math.random() - .5) * 6, (Math.random() - .5) * 5);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    group.add(mesh);
    debris.push(mesh);
  }
  return { group, debris };
}

function createDomCracks(overlay) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('digital-earthquake-crack-svg');
  svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  const roots = [
    [innerWidth * .56, innerHeight * .36],
    [innerWidth * .71, innerHeight * .47],
    [innerWidth * .38, innerHeight * .57],
    [innerWidth * .84, innerHeight * .24]
  ];
  roots.forEach(([sx, sy], rootIndex) => {
    for (let branch = 0; branch < 9; branch++) {
      let x = sx;
      let y = sy;
      const points = [`${x},${y}`];
      let angle = (rootIndex * 1.7 + branch * .72) + (Math.random() - .5) * .8;
      for (let step = 0; step < 7; step++) {
        const length = 22 + Math.random() * 58;
        angle += (Math.random() - .5) * .8;
        x += Math.cos(angle) * length;
        y += Math.sin(angle) * length;
        points.push(`${clamp(x, 0, innerWidth)},${clamp(y, 0, innerHeight)}`);
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      path.setAttribute('points', points.join(' '));
      path.setAttribute('pathLength', '1');
      path.style.setProperty('--delay', `${.45 + Math.random() * 1.2}s`);
      path.style.setProperty('--width', `${1 + Math.random() * 2.6}`);
      svg.appendChild(path);
    }
  });
  overlay.appendChild(svg);
  return svg;
}

function disposeMaterial(material) {
  if (!material) return;
  for (const key of Object.keys(material)) {
    const value = material[key];
    if (value?.isTexture) value.dispose();
  }
  material.dispose?.();
}

function disposeScene(scene, composer, renderer) {
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach(disposeMaterial);
    else disposeMaterial(object.material);
  });
  composer?.dispose?.();
  renderer.dispose();
  renderer.forceContextLoss?.();
}

export async function startDigitalEarthquakeEffect({ durationMs = 12000 } = {}) {
  activeDigitalEarthquake?.stop?.();
  const snapshots = collectRealChatElements().map((item) => ({
    ...item,
    opacity: item.node.style.opacity,
    visibility: item.node.style.visibility,
    transform: item.node.style.transform,
    filter: item.node.style.filter
  }));
  if (!snapshots.length) return null;

  const overlay = document.createElement('div');
  overlay.className = 'digital-earthquake-overlay';
  overlay.innerHTML = `<div class="digital-earthquake-fog"></div><div class="digital-earthquake-vignette"></div><div class="digital-earthquake-flash"></div><div class="digital-earthquake-dust"></div>`;
  document.body.appendChild(overlay);
  const crackSvg = createDomCracks(overlay);
  document.body.classList.add('digital-earthquake-running');

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

  const canvases = await Promise.all(snapshots.map(captureNode));
  if (!overlay.isConnected) return null;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x120906, .058);
  const camera = new THREE.PerspectiveCamera(44, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, 0, 10.8);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  overlay.prepend(renderer.domElement);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.35));
  composer.setSize(innerWidth, innerHeight);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 1.22, .72, .38);
  composer.addPass(bloom);

  scene.add(new THREE.AmbientLight(0xffa94a, .2));
  const energy = new THREE.PointLight(0xff9f35, 0, 15, 1.65);
  energy.position.z = 2.2;
  scene.add(energy);
  const cracks3d = createCrackLines();
  scene.add(cracks3d.lines);
  const particles = createParticles();
  scene.add(particles.points);
  const vortex = createVortex();
  vortex.mesh.scale.setScalar(.2);
  scene.add(vortex.mesh);
  const debrisPack = createDebris();
  scene.add(debrisPack.group);
  const shockwaves = [0, 1, 2, 3].map((index) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(.72, .018, 10, 110),
      new THREE.MeshBasicMaterial({ color: index === 0 ? 0xfff0c8 : 0xd08a3a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    mesh.position.z = .55;
    mesh.scale.setScalar(.1);
    scene.add(mesh);
    return mesh;
  });

  const pieces = snapshots.map((snapshot, index) => {
    const canvas = canvases[index];
    const texture = new THREE.CanvasTexture(canvas);
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
    mesh.renderOrder = 30 + index;
    const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffb04a, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(width * 1.015, height * 1.06)), edgeMaterial);
    edge.position.z = -.02;
    object.add(edge, mesh);
    scene.add(object);
    const angle = Math.atan2(loc.y, loc.x) + (Math.random() - .5) * .9;
    const distance = 2 + Math.random() * 3.8 + (snapshot.kind === 'panel' ? .7 : 0);
    const chaos = new THREE.Vector3(loc.x + Math.cos(angle) * distance, loc.y + Math.sin(angle) * distance, (Math.random() - .5) * 4.2);
    const explode = new THREE.Vector3(loc.x + Math.cos(angle) * (distance + 4.2), loc.y + Math.sin(angle) * (distance + 3.2), (Math.random() - .5) * 6.2);
    const orbitRadius = Math.max(.7, Math.hypot(chaos.x, chaos.y));
    return {
      snapshot,
      object,
      mesh,
      material,
      edgeMaterial,
      start: new THREE.Vector3(loc.x, loc.y, 0),
      chaos,
      explode,
      orbitRadius,
      orbitAngle: Math.atan2(chaos.y, chaos.x),
      rotationSeed: Math.random() * Math.PI * 2,
      state: { expose: 0, wobble: 0, break: 0, chaos: 0, orbit: 0, explode: 0, reassemble: 0, heal: 0 }
    };
  });

  let stopped = false;
  let frame = 0;
  let previous = performance.now();
  const sceneState = { shake: 0, rumble: 0, particleBurst: 0, debris: 0, vortex: 0, dust: 0 };

  function updatePiece(piece, index, time) {
    const s = piece.state;
    const breakP = smooth(s.break);
    const chaosP = smooth(s.chaos);
    const orbitP = smooth(s.orbit);
    const explodeP = smooth(s.explode);
    const reassembleP = smooth(s.reassemble);
    let x = mix(piece.start.x, piece.chaos.x, breakP);
    let y = mix(piece.start.y, piece.chaos.y, breakP);
    let z = mix(piece.start.z, piece.chaos.z, breakP);
    const orbitAngle = piece.orbitAngle + orbitP * Math.PI * 4.2 + index * .21;
    const orbitRadius = mix(piece.orbitRadius, 1.2 + (index % 5) * .18, orbitP);
    x = mix(x, Math.cos(orbitAngle) * orbitRadius, orbitP);
    y = mix(y, Math.sin(orbitAngle) * orbitRadius * .68, orbitP);
    z = mix(z, Math.sin(orbitAngle * 1.6) * 1.8, orbitP);
    x = mix(x, piece.explode.x, explodeP);
    y = mix(y, piece.explode.y, explodeP);
    z = mix(z, piece.explode.z, explodeP);
    x = mix(x, piece.start.x, reassembleP);
    y = mix(y, piece.start.y, reassembleP);
    z = mix(z, piece.start.z, reassembleP);
    const wobble = s.wobble * Math.sin(time * 36 + index * 1.7);
    piece.object.position.set(x + wobble * .06, y + wobble * .035, z);
    piece.object.rotation.set(
      mix((Math.sin(piece.rotationSeed) * 1.2) * Math.max(breakP, chaosP, explodeP), 0, reassembleP),
      mix((Math.cos(piece.rotationSeed) * 1.4) * Math.max(breakP, chaosP, explodeP), 0, reassembleP),
      mix((piece.rotationSeed + orbitP * 2.8) * Math.max(breakP, chaosP, explodeP), 0, reassembleP)
    );
    const scale = mix(1, .72 + (index % 4) * .08, Math.max(chaosP, explodeP));
    piece.object.scale.setScalar(mix(scale, 1, reassembleP));
    piece.material.opacity = s.expose * (1 - s.heal);
    piece.edgeMaterial.opacity = s.expose * (.16 + Math.max(breakP, chaosP, orbitP) * .55) * (1 - s.heal);
  }

  function render(now) {
    if (stopped) return;
    const dt = Math.min(.04, (now - previous) / 1000 || .016);
    previous = now;
    const time = now / 1000;
    vortex.material.uniforms.uTime.value = time;
    vortex.material.uniforms.uPower.value = sceneState.vortex;
    vortex.mesh.rotation.z += dt * (1.1 + sceneState.vortex * 3.4);
    vortex.mesh.scale.setScalar(.25 + sceneState.vortex * 1.05);
    cracks3d.lines.rotation.z += dt * .08;
    cracks3d.lines.scale.setScalar(1 + sceneState.rumble * .05);
    pieces.forEach((piece, index) => updatePiece(piece, index, time));
    const pos = particles.positions;
    for (let i = 0; i < particles.seeds.length; i++) {
      const base = i * 3;
      const swirl = Math.atan2(pos[base + 1], pos[base]) + dt * (sceneState.vortex * 1.8 + .12);
      const radius = Math.hypot(pos[base], pos[base + 1]) * (1 - sceneState.vortex * dt * .05) + sceneState.particleBurst * particles.velocities[base] * 5;
      pos[base] = Math.cos(swirl) * radius + particles.velocities[base] * sceneState.dust;
      pos[base + 1] = Math.sin(swirl) * radius * .78 + particles.velocities[base + 1] * sceneState.dust;
      pos[base + 2] += particles.velocities[base + 2] * (1 + sceneState.particleBurst * 8);
    }
    particles.geometry.attributes.position.needsUpdate = true;
    debrisPack.debris.forEach((mesh, index) => {
      mesh.material.opacity = sceneState.debris * (.28 + (index % 3) * .12);
      mesh.rotation.x += dt * (.5 + index % 4);
      mesh.rotation.y += dt * (.35 + index % 5);
      mesh.position.multiplyScalar(1 + sceneState.particleBurst * dt * .24);
    });
    if (sceneState.shake > 0 || sceneState.rumble > 0) {
      const amount = sceneState.shake + sceneState.rumble * .025;
      camera.position.x = (Math.random() - .5) * amount;
      camera.position.y = (Math.random() - .5) * amount;
      camera.rotation.z = (Math.random() - .5) * amount * .08;
    } else {
      camera.position.x *= .82;
      camera.position.y *= .82;
      camera.rotation.z *= .82;
    }
    composer.render();
    frame = requestAnimationFrame(render);
  }
  frame = requestAnimationFrame(render);

  const flash = overlay.querySelector('.digital-earthquake-flash');
  const dust = overlay.querySelector('.digital-earthquake-dust');
  const timeline = gsap.timeline({ defaults: { overwrite: 'auto' } });
  timeline.to(overlay, { opacity: 1, duration: .35, ease: 'power2.out' }, 0);
  timeline.to(sceneState, { rumble: 1, duration: 1.2, ease: 'sine.inOut' }, 0);
  timeline.to(particles.material, { opacity: .44, duration: 1.2, ease: 'sine.out' }, .15);
  timeline.to(crackSvg, { opacity: 1, duration: .4, ease: 'sine.out' }, .55);
  timeline.to(cracks3d.material, { opacity: .72, duration: 1.5, ease: 'power2.in' }, 1.05);
  timeline.to(sceneState, { shake: .18, duration: 1, ease: 'power1.inOut' }, 2.45);
  pieces.forEach((piece, index) => {
    timeline.to(piece.state, { wobble: 1, duration: .55, ease: 'sine.inOut' }, 2.35 + (index % 8) * .018);
    timeline.to(piece.state, { expose: 1, duration: .18, ease: 'none' }, 3.1 + (index % 8) * .015);
    timeline.call(() => { if (piece.snapshot.node.isConnected) piece.snapshot.node.style.opacity = '0'; }, null, 3.1 + (index % 8) * .015);
    timeline.to(piece.state, { break: 1, duration: 1.5, ease: 'back.out(1.25)' }, 3.45 + (index % 8) * .026);
    timeline.to(piece.state, { chaos: 1, duration: 1.2, ease: 'sine.inOut' }, 4.35 + (index % 6) * .03);
    timeline.to(piece.state, { orbit: 1, duration: 2, ease: 'power2.inOut' }, 5.0 + (index % 9) * .018);
    timeline.to(piece.state, { explode: 1, duration: .8, ease: 'expo.out' }, 7.05 + (index % 7) * .012);
    timeline.to(piece.state, { reassemble: 1, duration: 2, ease: 'power3.inOut' }, 9.0 + (index % 7) * .018);
    timeline.to(piece.state, { heal: 1, duration: .8, ease: 'sine.inOut' }, 10.65);
  });
  timeline.to(sceneState, { shake: .05, duration: .8, ease: 'sine.out' }, 3.4);
  timeline.to(sceneState, { vortex: 1, duration: 2, ease: 'power2.inOut' }, 5.0);
  timeline.to(energy, { intensity: 12, duration: 1.6, ease: 'power2.in' }, 5.2);
  timeline.to(debrisPack.group.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1.6, ease: 'sine.inOut' }, 4.6);
  timeline.to(sceneState, { debris: 1, duration: 1.1, ease: 'sine.out' }, 4.1);
  timeline.to(sceneState, { particleBurst: 1.25, shake: .32, duration: .18, ease: 'none' }, 7.05);
  timeline.to(flash, { opacity: 1, duration: .08, ease: 'none' }, 7.05);
  timeline.to(flash, { opacity: 0, duration: .72, ease: 'power3.out' }, 7.13);
  shockwaves.forEach((ring, index) => {
    timeline.to(ring.material, { opacity: .85 - index * .14, duration: .08, ease: 'none' }, 7.05 + index * .08);
    timeline.to(ring.scale, { x: 8 + index * 1.4, y: 8 + index * 1.4, z: 8 + index * 1.4, duration: 1.15, ease: 'expo.out' }, 7.05 + index * .08);
    timeline.to(ring.material, { opacity: 0, duration: .85, ease: 'sine.out' }, 7.35 + index * .08);
  });
  timeline.to(sceneState, { particleBurst: .2, dust: 1, shake: .02, duration: 1.2, ease: 'sine.out' }, 7.85);
  timeline.to(dust, { opacity: .46, duration: .5, ease: 'sine.out' }, 7.9);
  timeline.to(dust, { opacity: 0, duration: 1.3, ease: 'sine.inOut' }, 9.1);
  timeline.to(sceneState, { vortex: 0, debris: 0, rumble: 0, shake: 0, duration: 1.35, ease: 'sine.inOut' }, 9.1);
  timeline.to(cracks3d.material, { opacity: 0, duration: 1, ease: 'sine.inOut' }, 10.6);
  timeline.to(crackSvg, { opacity: 0, duration: .9, ease: 'sine.inOut' }, 10.65);
  timeline.call(() => {
    snapshots.forEach(({ node, opacity, visibility, transform, filter }) => {
      if (!node.isConnected) return;
      node.style.opacity = opacity;
      node.style.visibility = visibility;
      node.style.transform = transform;
      node.style.filter = filter;
    });
    hiddenDuringEffect.forEach(([node, opacity]) => { if (node.isConnected) node.style.opacity = opacity; });
  }, null, 10.9);
  timeline.to(pieces.map((piece) => piece.material), { opacity: 0, duration: .35, ease: 'sine.inOut' }, 10.95);
  timeline.to(pieces.map((piece) => piece.edgeMaterial), { opacity: 0, duration: .35, ease: 'sine.inOut' }, 10.95);
  timeline.to(overlay, { opacity: 0, duration: .75, ease: 'sine.inOut' }, 11.35);

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
    document.body.classList.remove('digital-earthquake-running');
    disposeScene(scene, composer, renderer);
    overlay.remove();
    if (activeDigitalEarthquake?.stop === stop) activeDigitalEarthquake = null;
  }
  timeline.call(stop, null, 12.15);
  const requested = clamp((Number(durationMs) || 12000) / 1000, 10.8, 15);
  timeline.timeScale(12.15 / requested);
  activeDigitalEarthquake = { stop };
  return { active: true };
}
