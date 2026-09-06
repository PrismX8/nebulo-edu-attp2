import * as THREE from 'three';
import { gsap } from 'gsap';

let activeVaultEffect = null;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function visibleMessageNodes() {
  const viewport = document.getElementById('messages-container')?.getBoundingClientRect();
  if (!viewport) return [];
  return [...document.querySelectorAll('#messages-list .msg-row, #messages-list .msg-follow')]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 30 && rect.height > 12 && rect.bottom > viewport.top && rect.top < viewport.bottom;
    })
    .slice(-20);
}

function messageCardFromNode(node) {
  const card = document.createElement('div');
  card.className = 'vault-message-card';
  const avatar = document.createElement('div');
  avatar.className = 'vault-message-avatar';
  const sourceImage = node.querySelector('.msg-avatar img');
  if (sourceImage?.src) {
    const image = document.createElement('img');
    image.src = sourceImage.src;
    avatar.appendChild(image);
  } else {
    avatar.textContent = String(node.querySelector('.msg-avatar')?.textContent || '?').trim().slice(0, 2);
  }
  const copy = document.createElement('div');
  copy.className = 'vault-message-copy';
  const name = document.createElement('div');
  name.className = 'vault-message-name';
  const nameNode = [...node.querySelectorAll('.msg-reply-target')].find((item) => item.tagName === 'SPAN');
  name.textContent = String(nameNode?.textContent || 'Message').trim();
  const text = document.createElement('div');
  text.className = 'vault-message-text';
  text.textContent = String(node.querySelector('.msg-bubble')?.textContent || node.textContent || '').trim().slice(0, 100);
  copy.append(name, text);
  card.append(avatar, copy);
  return card;
}

function metallicMaterial(color, roughness = .42, metalness = .9) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildVault(scene) {
  const vault = new THREE.Group();
  const shellMaterial = metallicMaterial(0x252b36, .5, .94);
  const edgeMaterial = metallicMaterial(0x6a7383, .3, 1);
  const insetMaterial = metallicMaterial(0x161b25, .58, .9);
  const purpleMaterial = new THREE.MeshStandardMaterial({
    color:0x5b278f, emissive:0x7e22ce, emissiveIntensity:.72, roughness:.3, metalness:.58
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(2.35, 2.35, 1.55, 64), shellMaterial);
  body.rotation.x = Math.PI / 2;
  body.position.z = -.55;
  vault.add(body);

  const base = new THREE.Mesh(new THREE.BoxGeometry(5.25, .65, 2.3), shellMaterial);
  base.position.set(0, -2.35, -.45);
  vault.add(base);

  // The frame remains fixed while the thick circular door swings from a real hinge.
  const outerRing = new THREE.Mesh(new THREE.TorusGeometry(1.92, .25, 18, 80), edgeMaterial);
  outerRing.position.z = .32;
  vault.add(outerRing);
  const frameLip = new THREE.Mesh(new THREE.TorusGeometry(1.5, .11, 14, 72), insetMaterial);
  frameLip.position.z = .43;
  vault.add(frameLip);
  const portalRing = new THREE.Mesh(new THREE.TorusGeometry(1.14, .12, 14, 72), purpleMaterial);
  portalRing.position.z = .39;
  vault.add(portalRing);

  const doorPivot = new THREE.Group();
  doorPivot.position.set(-2.02, 0, .12);
  const front = new THREE.Group();
  front.position.x = 2.02;
  const door = new THREE.Mesh(new THREE.CylinderGeometry(1.67, 1.67, .34, 64), edgeMaterial);
  door.rotation.x = Math.PI / 2;
  door.position.z = .42;
  front.add(door);
  const inset = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, .4, 64), insetMaterial);
  inset.rotation.x = Math.PI / 2;
  inset.position.z = .64;
  front.add(inset);

  const reinforcement = new THREE.Mesh(new THREE.TorusGeometry(1.42, .1, 14, 64), shellMaterial);
  reinforcement.position.z = .75;
  front.add(reinforcement);

  for (let i = 0; i < 8; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(.13, 1.42, .15), edgeMaterial);
    spoke.position.z = .88;
    spoke.rotation.z = i * Math.PI / 4;
    front.add(spoke);
  }
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .34, 32), shellMaterial);
  hub.rotation.x = Math.PI / 2;
  hub.position.z = .93;
  front.add(hub);
  const hubRing = new THREE.Mesh(new THREE.TorusGeometry(.52, .08, 12, 48), edgeMaterial);
  hubRing.position.z = 1.09;
  front.add(hubRing);

  for (let i = 0; i < 18; i++) {
    const angle = i / 18 * Math.PI * 2;
    const bolt = new THREE.Mesh(new THREE.SphereGeometry(.075, 12, 10), edgeMaterial);
    bolt.position.set(Math.cos(angle) * 1.43, Math.sin(angle) * 1.43, .83);
    front.add(bolt);
  }
  doorPivot.add(front);
  vault.add(doorPivot);

  // Heavy hinge barrels and brackets make the object read as a mechanical vault.
  for (const y of [-.92, .92]) {
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(.52, .42, .66), edgeMaterial);
    bracket.position.set(-2.02, y, .31);
    vault.add(bracket);
    const hinge = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .72, 20), shellMaterial);
    hinge.position.set(-2.14, y, .52);
    vault.add(hinge);
  }

  const lockingHandle = new THREE.Group();
  lockingHandle.position.z = 1.15;
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .82, 12), edgeMaterial);
    // CylinderGeometry points along Y. Rotate both its orientation and center
    // around the hub so all five arms share the door's exact center.
    arm.position.set(-Math.sin(angle) * .39, Math.cos(angle) * .39, 0);
    arm.rotation.z = angle;
    lockingHandle.add(arm);
  }
  const handleHub = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .25, 24), edgeMaterial);
  handleHub.rotation.x = Math.PI / 2;
  lockingHandle.add(handleHub);
  front.add(lockingHandle);

  const coreMaterial = new THREE.MeshBasicMaterial({ color:0xe9d5ff, transparent:true, opacity:.92 });
  const core = new THREE.Mesh(new THREE.SphereGeometry(.25, 28, 22), coreMaterial);
  core.position.z = .45;
  core.scale.setScalar(.72);
  vault.add(core);

  const crackMaterial = new THREE.LineBasicMaterial({ color:0xd946ef, transparent:true, opacity:0 });
  const cracks = new THREE.Group();
  for (let branch = 0; branch < 15; branch++) {
    const points = [];
    const angle = branch / 15 * Math.PI * 2 + (branch % 3) * .08;
    for (let step = 0; step < 7; step++) {
      const radius = .26 + step * .245;
      const jitter = step ? (Math.sin(branch * 8.4 + step * 4.1) * .08) : 0;
      points.push(new THREE.Vector3(
        Math.cos(angle + jitter) * radius,
        Math.sin(angle + jitter) * radius,
        1.015 + step * .002
      ));
    }
    cracks.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), crackMaterial));
  }
  front.add(cracks);

  const debris = new THREE.Group();
  debris.visible = false;
  const debrisPieces = [];
  for (let i = 0; i < 44; i++) {
    const geometry = i % 3 === 0
      ? new THREE.IcosahedronGeometry(.11 + Math.random() * .18, 0)
      : new THREE.BoxGeometry(.12 + Math.random() * .22, .1 + Math.random() * .28, .1 + Math.random() * .2);
    const piece = new THREE.Mesh(geometry, i % 4 === 0 ? purpleMaterial.clone() : edgeMaterial.clone());
    const angle = Math.random() * Math.PI * 2;
    const radius = .35 + Math.random() * 1.7;
    piece.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, .65 + Math.random() * .35);
    piece.userData.target = new THREE.Vector3(
      piece.position.x * (2.2 + Math.random() * 2.5),
      piece.position.y * (2.2 + Math.random() * 2.5),
      1.8 + Math.random() * 3.8
    );
    debris.add(piece);
    debrisPieces.push(piece);
  }
  scene.add(debris);

  const particleCount = 720;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = .08 + Math.random() * 1.8;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = .85 + (Math.random() - .5) * .7;
    velocities.push(new THREE.Vector3(
      (Math.random() - .5) * .085,
      (Math.random() - .5) * .085,
      .025 + Math.random() * .12
    ));
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color:0xc084fc, size:.035, transparent:true, opacity:.72,
    blending:THREE.AdditiveBlending, depthWrite:false
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  const energyLight = new THREE.PointLight(0xa855f7, 7, 11, 1.5);
  energyLight.position.set(0, 0, 2.2);
  scene.add(energyLight);

  scene.add(vault);
  return { vault, front, doorPivot, lockingHandle, portalRing, core, coreMaterial, crackMaterial, debris, debrisPieces, particles, particleMaterial, particleGeometry, velocities, energyLight };
}

function disposeScene(scene, renderer) {
  scene.traverse((object) => {
    object.geometry?.dispose?.();
    if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose?.());
    else object.material?.dispose?.();
  });
  renderer.dispose();
  renderer.forceContextLoss?.();
}

export function startVaultEffect({ durationMs = 14000 } = {}) {
  activeVaultEffect?.stop?.();
  if (!gsap || !THREE?.WebGLRenderer) return null;

  const sourceNodes = visibleMessageNodes();
  const overlay = document.createElement('div');
  overlay.className = 'vault-effect-overlay';
  overlay.innerHTML = `<div class="vault-effect-vignette"></div><div class="vault-effect-energy"></div>
    <div class="vault-message-layer"></div><div class="vault-impact-flash"></div>
    <div class="vault-effect-hud"><div class="vault-effect-kicker">3D Vault Message Effect</div><div class="vault-effect-stage-label">Vault unlocking</div><div class="vault-effect-progress"><span></span></div></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('vault-effect-running');

  const layer = overlay.querySelector('.vault-message-layer');
  const stageLabel = overlay.querySelector('.vault-effect-stage-label');
  const energy = overlay.querySelector('.vault-effect-energy');
  const flash = overlay.querySelector('.vault-impact-flash');
  const progress = overlay.querySelector('.vault-effect-progress span');
  const originals = [];
  const cards = sourceNodes.map((node, index) => {
    const rect = node.getBoundingClientRect();
    const card = messageCardFromNode(node);
    layer.appendChild(card);
    const width = clamp(rect.width * .72, 150, 310);
    card.style.width = `${width}px`;
    card.style.left = '0';
    card.style.top = '0';
    gsap.set(card, { x:rect.left, y:rect.top, opacity:1, scale:1, rotationZ:0, rotationY:0, z:0, transformPerspective:900 });
    originals.push({ node, opacity:node.style.opacity });
    node.style.opacity = '0';
    return { node, card, rect, index, width };
  });

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03050b, .055);
  const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, .05, 10.2);
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  overlay.prepend(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x8390b6, 1.15));
  const keyLight = new THREE.DirectionalLight(0xcbd5ff, 3.4);
  keyLight.position.set(-4, 6, 8);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x7c3aed, 4.2);
  rimLight.position.set(5, 1, 4);
  scene.add(rimLight);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color:0x070914, roughness:.28, metalness:.48 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2.7;
  scene.add(floor);

  const vaultParts = buildVault(scene);
  vaultParts.vault.scale.setScalar(innerWidth < 700 ? .72 : .9);
  vaultParts.vault.position.y = -.2;
  vaultParts.vault.rotation.y = -.1;
  vaultParts.debris.scale.copy(vaultParts.vault.scale);
  vaultParts.debris.position.copy(vaultParts.vault.position);

  let explosionActive = false;
  let stopped = false;
  let animationFrame = 0;
  const clock = new THREE.Clock();
  const render = () => {
    if (stopped) return;
    const delta = Math.min(.035, clock.getDelta());
    vaultParts.particles.rotation.z += delta * (explosionActive ? .5 : 1.35);
    if (!explosionActive) {
      vaultParts.particles.scale.multiplyScalar(.9982);
      if (vaultParts.particles.scale.x < .38) vaultParts.particles.scale.setScalar(1);
    } else {
      const position = vaultParts.particleGeometry.attributes.position;
      for (let i = 0; i < position.count; i++) {
        position.array[i * 3] += vaultParts.velocities[i].x;
        position.array[i * 3 + 1] += vaultParts.velocities[i].y;
        position.array[i * 3 + 2] += vaultParts.velocities[i].z;
      }
      position.needsUpdate = true;
      vaultParts.particleMaterial.opacity *= .993;
    }
    vaultParts.core.rotation.y += delta * 2.4;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  };
  render();

  const setStage = (text) => { stageLabel.textContent = text; };
  const timeline = gsap.timeline({ defaults:{ overwrite:'auto' } });
  timeline.to(overlay, { opacity:1, duration:.38, ease:'power2.out' }, 0);
  timeline.from(vaultParts.vault.scale, { x:.25, y:.25, z:.25, duration:.9, ease:'back.out(1.4)' }, .05);
  timeline.to(progress, { width:'100%', duration:12.55, ease:'none' }, .1);
  timeline.to(vaultParts.lockingHandle.rotation, { z:Math.PI * 1.6, duration:.85, ease:'power2.inOut' }, .58);
  timeline.to(vaultParts.doorPivot.rotation, { y:-1.72, duration:1.08, ease:'power3.inOut' }, 1.05);
  timeline.to(energy, { opacity:1, scale:1.35, duration:1.25, ease:'sine.out' }, 1.35);
  timeline.to(vaultParts.energyLight, { intensity:15, duration:1.4, ease:'power2.in' }, 1.35);

  // Project the real Three.js portal center into CSS pixels. The vault has a
  // perspective rotation and sits slightly below center, so viewport center
  // is not the visual center of its opening.
  vaultParts.vault.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const portalWorld = vaultParts.core.getWorldPosition(new THREE.Vector3());
  const portalScreen = portalWorld.clone().project(camera);
  const centerX = (portalScreen.x * .5 + .5) * innerWidth;
  const centerY = (-portalScreen.y * .5 + .5) * innerHeight;
  cards.forEach(({ card, rect, index, width }) => {
    const startCenterX = rect.left + width / 2;
    const startCenterY = rect.top + Math.min(rect.height, 52) / 2;
    const baseAngle = Math.atan2(startCenterY - centerY, startCenterX - centerX);
    for (let step = 1; step <= 6; step++) {
      const progressStep = step / 6;
      const angle = baseAngle + progressStep * Math.PI * 3.6;
      const startRadius = Math.hypot(startCenterX - centerX, startCenterY - centerY);
      const radius = startRadius * (1 - progressStep);
      const targetX = centerX + Math.cos(angle) * radius - startCenterX;
      const targetY = centerY + Math.sin(angle) * radius - startCenterY;
      timeline.to(card, {
        x:rect.left + targetX, y:rect.top + targetY, z:progressStep * 210,
        rotationZ:progressStep * 470, rotationY:progressStep * 110,
        scale:1 - progressStep * .72, duration:.48, ease:'sine.inOut'
      }, 2.02 + index * .045 + (step - 1) * .43);
    }
    timeline.to(card, { opacity:0, scale:.015, duration:.24, ease:'power4.in' }, 4.48 + index * .045);
  });

  timeline.call(() => setStage('Messages spiral into vault'), null, 1.78);
  timeline.call(() => setStage('Messages disappear inside'), null, 3.75);
  timeline.call(() => setStage('Vault seals'), null, 5.25);
  timeline.to(vaultParts.doorPivot.rotation, { y:0, duration:.82, ease:'power3.inOut' }, 5.28);
  timeline.to(vaultParts.lockingHandle.rotation, { z:Math.PI * 3.2, duration:.58, ease:'power2.inOut' }, 5.92);
  timeline.call(() => setStage('Vault shakes and cracks'), null, 6.18);
  timeline.to(vaultParts.crackMaterial, { opacity:1, duration:.72, ease:'power3.in' }, 6.28);
  timeline.to(vaultParts.vault.position, { x:'+=.1', duration:.055, repeat:21, yoyo:true, ease:'none' }, 6.25);
  timeline.to(vaultParts.vault.rotation, { z:'+=.045', duration:.065, repeat:17, yoyo:true, ease:'none' }, 6.34);
  timeline.to(vaultParts.core.scale, { x:3.2, y:3.2, z:3.2, duration:1.12, ease:'power3.in' }, 6.38);
  timeline.to(vaultParts.energyLight, { intensity:30, duration:1.05, ease:'power4.in' }, 6.42);

  timeline.call(() => {
    setStage('Vault explodes');
    explosionActive = true;
    vaultParts.debris.visible = true;
    vaultParts.vault.visible = false;
    vaultParts.core.visible = false;
  }, null, 7.58);
  timeline.to(flash, { opacity:1, duration:.08, ease:'none' }, 7.56);
  timeline.to(flash, { opacity:0, duration:.7, ease:'power3.out' }, 7.64);
  timeline.to(energy, { opacity:.12, scale:2.4, duration:.65, ease:'power3.out' }, 7.58);
  vaultParts.debrisPieces.forEach((piece, index) => {
    const target = piece.userData.target;
    timeline.to(piece.position, { x:target.x, y:target.y, z:target.z, duration:1.15 + Math.random() * .45, ease:'power3.out' }, 7.57 + index * .003);
    timeline.to(piece.rotation, { x:Math.random() * 8, y:Math.random() * 8, z:Math.random() * 8, duration:1.35, ease:'power2.out' }, 7.57);
  });

  timeline.call(() => setStage('Messages burst out'), null, 7.72);
  cards.forEach(({ card, rect, index, width }) => {
    const angle = index / Math.max(1, cards.length) * Math.PI * 2 + (index % 3) * .12;
    const radius = Math.min(innerWidth, innerHeight) * (.29 + (index % 4) * .035);
    const startCenterX = rect.left + width / 2;
    const startCenterY = rect.top + Math.min(rect.height, 52) / 2;
    const burstX = centerX + Math.cos(angle) * radius - startCenterX;
    const burstY = centerY + Math.sin(angle) * radius - startCenterY;
    timeline.set(card, { x:centerX - width / 2, y:centerY - Math.min(rect.height, 52) / 2, z:0, rotationZ:0, rotationY:0, opacity:0, scale:.03 }, 7.66);
    timeline.to(card, {
      x:rect.left + burstX, y:rect.top + burstY, z:90,
      rotationZ:(Math.random()-.5)*46, rotationY:(Math.random()-.5)*48,
      scale:.82, opacity:1, duration:1.25, ease:'power3.out'
    }, 7.7 + index * .025);
    timeline.to(card, {
      x:rect.left, y:rect.top, z:0, rotationZ:0, rotationY:0,
      scale:1, opacity:1, duration:2.15, ease:'power2.inOut'
    }, 9.12 + index * .02);
  });
  timeline.call(() => setStage('Messages return to chat'), null, 9.18);
  timeline.to(vaultParts.debris.scale, { x:.2, y:.2, z:.2, duration:1.3, ease:'power2.inOut' }, 10.15);
  timeline.call(() => originals.forEach(({ node, opacity }) => { if (node.isConnected) node.style.opacity = opacity; }), null, 11.82);
  timeline.to(cards.map(({ card }) => card), { opacity:0, duration:.4, ease:'sine.inOut' }, 11.76);
  timeline.to(overlay, { opacity:0, duration:.7, ease:'sine.inOut' }, 12.05);

  const resize = () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  };
  addEventListener('resize', resize);

  function stop() {
    if (stopped) return;
    stopped = true;
    timeline.kill();
    cancelAnimationFrame(animationFrame);
    removeEventListener('resize', resize);
    originals.forEach(({ node, opacity }) => { if (node.isConnected) node.style.opacity = opacity; });
    document.body.classList.remove('vault-effect-running');
    disposeScene(scene, renderer);
    overlay.remove();
    if (activeVaultEffect?.stop === stop) activeVaultEffect = null;
  }

  timeline.call(stop, null, 12.78);
  const requestedSeconds = clamp(Number(durationMs || 14000) / 1000, 12.78, 18);
  timeline.timeScale(12.78 / requestedSeconds);
  activeVaultEffect = { stop };
  return activeVaultEffect;
}
