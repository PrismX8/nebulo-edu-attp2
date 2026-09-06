import * as THREE from 'three';
import { gsap } from 'gsap';

let activeCinematicEffect = null;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const PRESETS = {
  prism: {
    bodyClass: 'cinematic-prism-running',
    overlayClass: 'cinematic-effect-overlay cinematic-prism-overlay',
    cardClass: 'cinematic-card cinematic-prism-card',
    accent: 0x67e8f9,
    accentCss: '#67e8f9',
    second: 0xf0abfc,
    name: 'Prism Core',
    duration: 12000,
    particleColor: 0xa5f3fc
  },
  meteor: {
    bodyClass: 'cinematic-meteor-running',
    overlayClass: 'cinematic-effect-overlay cinematic-meteor-overlay',
    cardClass: 'cinematic-card cinematic-meteor-card',
    accent: 0xfb7185,
    accentCss: '#fb7185',
    second: 0xf59e0b,
    name: 'Meteor Shower',
    duration: 11500,
    particleColor: 0xfda4af
  },
  rift: {
    bodyClass: 'cinematic-rift-running',
    overlayClass: 'cinematic-effect-overlay cinematic-rift-overlay',
    cardClass: 'cinematic-card cinematic-rift-card',
    accent: 0x60a5fa,
    accentCss: '#60a5fa',
    second: 0xc084fc,
    name: 'Time Rift',
    duration: 12000,
    particleColor: 0xbfdbfe
  }
};

function visibleMessageNodes() {
  const viewport = document.getElementById('messages-container')?.getBoundingClientRect();
  if (!viewport) return [];
  return [...document.querySelectorAll('#messages-list .msg-row, #messages-list .msg-follow')]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 35 && rect.height > 14 && rect.bottom > viewport.top && rect.top < viewport.bottom;
    })
    .slice(-22);
}

function cardFromNode(node, preset) {
  const rect = node.getBoundingClientRect();
  const card = document.createElement('div');
  card.className = preset.cardClass;
  card.style.left = `${rect.left}px`;
  card.style.top = `${rect.top}px`;
  card.style.width = `${Math.min(rect.width, 430)}px`;
  card.style.minHeight = `${Math.min(rect.height, 92)}px`;
  card.style.setProperty('--accent', preset.accentCss);

  const avatar = document.createElement('div');
  avatar.className = 'cinematic-card-avatar';
  const img = node.querySelector('.msg-avatar img');
  if (img?.src) {
    const avatarImg = document.createElement('img');
    avatarImg.src = img.src;
    avatar.appendChild(avatarImg);
  } else {
    avatar.textContent = String(node.querySelector('.msg-avatar')?.textContent || '?').trim().slice(0, 2);
  }

  const copy = document.createElement('div');
  copy.className = 'cinematic-card-copy';
  const name = document.createElement('div');
  name.className = 'cinematic-card-name';
  const nameNode = node.querySelector('.msg-name, .msg-author, .message-author') || [...node.querySelectorAll('span,strong')].find((el) => String(el.textContent || '').trim().length);
  name.textContent = String(nameNode?.textContent || 'Message').replace(/\s+/g, ' ').trim().slice(0, 32);
  const text = document.createElement('div');
  text.className = 'cinematic-card-text';
  text.textContent = String(node.querySelector('.msg-bubble')?.textContent || node.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 115);
  copy.append(name, text);
  card.append(avatar, copy);

  return { node, rect, card };
}

function addLights(scene, preset) {
  scene.add(new THREE.AmbientLight(0xffffff, .22));
  const key = new THREE.PointLight(preset.accent, 8, 14, 1.4);
  key.position.set(0, 0, 4);
  scene.add(key);
  const rim = new THREE.PointLight(preset.second, 4, 12, 1.6);
  rim.position.set(-3, 2, 2);
  scene.add(rim);
  return { key, rim };
}

function createParticles(scene, preset, count = 760) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 8 + .4;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - .5) * 7;
    velocities.push({
      angle,
      radius,
      speed: .25 + Math.random() * 1.5,
      drift: (Math.random() - .5) * .018
    });
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: preset.particleColor,
    size: .035,
    transparent: true,
    opacity: .62,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(geometry, material);
  scene.add(points);
  return { points, geometry, material, velocities };
}

function buildCore(scene, type, preset) {
  const group = new THREE.Group();
  const mainMaterial = new THREE.MeshStandardMaterial({
    color: preset.accent,
    emissive: preset.accent,
    emissiveIntensity: .9,
    roughness: .24,
    metalness: .48,
    transparent: true,
    opacity: .9
  });
  const secondMaterial = new THREE.MeshStandardMaterial({
    color: preset.second,
    emissive: preset.second,
    emissiveIntensity: .72,
    roughness: .32,
    metalness: .55,
    transparent: true,
    opacity: .72
  });

  if (type === 'prism') {
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 2), mainMaterial);
    crystal.scale.set(1, 1.25, 1);
    group.add(crystal);
    for (let i = 0; i < 5; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.42 + i * .22, .018, 8, 96), secondMaterial.clone());
      ring.rotation.x = Math.PI / 2 + i * .18;
      ring.rotation.y = i * .46;
      group.add(ring);
    }
  } else if (type === 'meteor') {
    const meteor = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), mainMaterial);
    meteor.scale.set(1.2, .94, 1);
    group.add(meteor);
    const fire = new THREE.Mesh(new THREE.SphereGeometry(1.55, 36, 26), new THREE.MeshBasicMaterial({
      color: preset.second,
      transparent: true,
      opacity: .16,
      blending: THREE.AdditiveBlending
    }));
    group.add(fire);
    for (let i = 0; i < 11; i++) {
      const shard = new THREE.Mesh(new THREE.ConeGeometry(.08 + Math.random() * .08, .45 + Math.random() * .6, 8), secondMaterial.clone());
      const a = i / 11 * Math.PI * 2;
      shard.position.set(Math.cos(a) * (1.35 + Math.random() * .25), Math.sin(a) * (1.15 + Math.random() * .25), (Math.random() - .5) * .8);
      shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, a);
      group.add(shard);
    }
  } else {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(.66, 42, 32), mainMaterial);
    group.add(sphere);
    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05 + i * .18, .022, 10, 100), i % 2 ? secondMaterial.clone() : mainMaterial.clone());
      ring.rotation.x = Math.PI / 2 + i * .28;
      ring.rotation.y = i * .52;
      group.add(ring);
    }
    for (let i = 0; i < 12; i++) {
      const tick = new THREE.Mesh(new THREE.BoxGeometry(.035, .32, .035), secondMaterial.clone());
      const a = i / 12 * Math.PI * 2;
      tick.position.set(Math.cos(a) * 1.74, Math.sin(a) * 1.74, 0);
      tick.rotation.z = -a;
      group.add(tick);
    }
  }
  scene.add(group);
  return group;
}

function createShockwave(overlay, preset) {
  const wave = document.createElement('div');
  wave.className = 'cinematic-shockwave';
  wave.style.setProperty('--accent', preset.accentCss);
  overlay.appendChild(wave);
  return wave;
}

function cleanupRenderer(renderer, scene) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose?.();
    if (obj.material) {
      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of materials) {
        for (const value of Object.values(mat)) {
          if (value?.isTexture) value.dispose?.();
        }
        mat.dispose?.();
      }
    }
  });
  renderer.dispose?.();
}

async function startCinematicRoomEffect(type, { durationMs } = {}) {
  const preset = PRESETS[type] || PRESETS.prism;
  if (activeCinematicEffect?.stop) activeCinematicEffect.stop();

  const messages = visibleMessageNodes();
  const overlay = document.createElement('div');
  overlay.className = preset.overlayClass;
  overlay.style.setProperty('--accent', preset.accentCss);
  overlay.innerHTML = '<div class="cinematic-bg-orb"></div><div class="cinematic-vignette"></div><div class="cinematic-flash"></div><div class="cinematic-sparks"></div>';
  document.body.appendChild(overlay);
  document.body.classList.add(preset.bodyClass);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  overlay.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, 0, 8);
  addLights(scene, preset);
  const core = buildCore(scene, type, preset);
  const particles = createParticles(scene, preset);
  const wave = createShockwave(overlay, preset);
  const flash = overlay.querySelector('.cinematic-flash');
  const sparks = overlay.querySelector('.cinematic-sparks');

  const cards = messages.map((node) => cardFromNode(node, preset));
  cards.forEach((item) => {
    overlay.appendChild(item.card);
    item.node.dataset.cinematicEffectHidden = '1';
  });

  const state = { intensity: 0, pull: 0, explode: 0, time: 0, cameraShake: 0 };
  const hiddenNodes = [];
  const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const total = Math.max(8500, Number(durationMs) || preset.duration);
  const scale = total / preset.duration;

  const resize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  };
  addEventListener('resize', resize, { passive: true });

  let raf = 0;
  let alive = true;
  function render(now = 0) {
    if (!alive) return;
    state.time = now * .001;
    core.rotation.x += .006 + state.intensity * .018;
    core.rotation.y += .01 + state.intensity * .026;
    core.rotation.z += type === 'rift' ? .022 + state.pull * .04 : .004 + state.pull * .018;
    const pulse = 1 + Math.sin(state.time * 6.5) * .03 + state.intensity * .22 + state.explode * .35;
    core.scale.setScalar(pulse);
    camera.position.x = (Math.random() - .5) * state.cameraShake;
    camera.position.y = (Math.random() - .5) * state.cameraShake;
    camera.position.z = 8 + Math.sin(state.time * 2) * .08 - state.pull * .55;

    const arr = particles.geometry.attributes.position.array;
    for (let i = 0; i < particles.velocities.length; i++) {
      const v = particles.velocities[i];
      v.angle += (v.speed + state.pull * 4) * .012;
      v.radius = clamp(v.radius + v.drift - state.pull * .007 + state.explode * .045, .08, 12);
      arr[i * 3] = Math.cos(v.angle) * v.radius;
      arr[i * 3 + 1] = Math.sin(v.angle) * v.radius;
      arr[i * 3 + 2] += Math.sin(state.time + i) * .002 + state.explode * .035;
      if (Math.abs(arr[i * 3 + 2]) > 9) arr[i * 3 + 2] *= -.35;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.points.rotation.z += .0015 + state.pull * .012;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(render);
  }

  const stop = () => {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(raf);
    timeline.kill();
    removeEventListener('resize', resize);
    document.body.classList.remove(preset.bodyClass);
    document.querySelectorAll('[data-cinematic-effect-hidden="1"]').forEach((node) => {
      node.style.opacity = '';
      delete node.dataset.cinematicEffectHidden;
    });
    cleanupRenderer(renderer, scene);
    overlay.remove();
    activeCinematicEffect = null;
  };
  activeCinematicEffect = { stop };

  requestAnimationFrame(render);
  requestAnimationFrame(() => {
    gsap.to(overlay, { opacity: 1, duration: .45 });
    gsap.to(sparks, { opacity: .85, duration: .8 });
  });

  cards.forEach((item, index) => {
    const x = innerWidth / 2 - item.rect.left - item.rect.width / 2;
    const y = innerHeight / 2 - item.rect.top - item.rect.height / 2;
    const side = index % 2 ? 1 : -1;
    const spiralX = x * .52 + Math.cos(index) * 160 * side;
    const spiralY = y * .52 + Math.sin(index * 1.7) * 120;
    const popX = (Math.random() - .5) * innerWidth * .8;
    const popY = (Math.random() - .5) * innerHeight * .7;

    timeline
      .set(item.card, { opacity: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, transformPerspective: 900 }, 0)
      .to(item.card, { opacity: 1, duration: .18 }, .08 + index * .018)
      .to(item.node, { opacity: .04, duration: .24, onStart: () => hiddenNodes.push(item.node) }, .18 + index * .014)
      .to(item.card, {
        x: spiralX,
        y: spiralY,
        z: 160 + index * 11,
        rotateX: -16 + Math.random() * 32,
        rotateY: side * (28 + Math.random() * 30),
        rotateZ: side * (6 + Math.random() * 16),
        scale: .92,
        duration: 1.35 * scale,
        ease: 'power3.out'
      }, .55 * scale + index * .035)
      .to(item.card, {
        x: x * .08 + Math.cos(index * .8) * 45,
        y: y * .08 + Math.sin(index * .9) * 38,
        z: 320,
        rotateX: side * 60,
        rotateY: 160 + index * 12,
        rotateZ: 250 * side,
        scale: .35,
        filter: 'brightness(1.4) saturate(1.4) blur(.3px)',
        duration: 2.3 * scale,
        ease: 'power2.in'
      }, 2.05 * scale + index * .035)
      .to(item.card, {
        x: popX,
        y: popY,
        z: 80,
        rotateX: -90 + Math.random() * 180,
        rotateY: Math.random() * 360,
        rotateZ: Math.random() * 260,
        scale: .62,
        opacity: .9,
        duration: .75 * scale,
        ease: 'power4.out'
      }, 6.4 * scale + index * .012)
      .to(item.card, {
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        scale: 1,
        filter: 'brightness(1) saturate(1) blur(0px)',
        duration: 1.75 * scale,
        ease: 'expo.inOut'
      }, 8.6 * scale + index * .028)
      .to(item.card, { opacity: 0, duration: .22, onComplete: () => { item.node.style.opacity = ''; } }, 10.65 * scale + index * .014);
  });

  timeline
    .to(state, { intensity: 1, duration: 1.2 * scale }, .2)
    .to(state, { pull: 1, cameraShake: .05, duration: 2.2 * scale }, 1.8 * scale)
    .to(core.position, { z: 1.2, duration: 1.6 * scale, ease: 'sine.inOut' }, 2.3 * scale)
    .to(wave, { scale: 2.8, opacity: 0, duration: 1.1 * scale, ease: 'power2.out' }, 5.65 * scale)
    .to(state, { explode: 1, cameraShake: .22, duration: .55 * scale, ease: 'power4.out' }, 6.2 * scale)
    .to(flash, { opacity: .92, duration: .12 * scale }, 6.25 * scale)
    .to(flash, { opacity: 0, duration: .9 * scale }, 6.42 * scale)
    .to(core.scale, { x: 2.1, y: 2.1, z: 2.1, duration: .55 * scale, yoyo: true, repeat: 1, ease: 'power2.inOut' }, 6.15 * scale)
    .to(state, { pull: .2, explode: .18, cameraShake: .04, duration: 1.5 * scale }, 7.05 * scale)
    .to(state, { intensity: 0, pull: 0, explode: 0, cameraShake: 0, duration: 1.5 * scale }, 9.4 * scale)
    .to(sparks, { opacity: 0, duration: 1.1 * scale }, 10.1 * scale)
    .to(overlay, { opacity: 0, duration: .7 * scale, onComplete: stop }, 11.15 * scale);
}

export function startPrismCoreEffect(options) {
  return startCinematicRoomEffect('prism', options);
}

export function startMeteorShowerEffect(options) {
  return startCinematicRoomEffect('meteor', options);
}

export function startTimeRiftEffect(options) {
  return startCinematicRoomEffect('rift', options);
}
