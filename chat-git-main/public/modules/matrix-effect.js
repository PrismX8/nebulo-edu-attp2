import * as THREE from 'three';
import { gsap } from 'gsap';

let activeMatrixEffect = null;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
const ease = (t) => t * t * (3 - 2 * t);

function createFallbackAvatar(username) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(180, 130, 20, 256, 256, 360);
  gradient.addColorStop(0, '#1d6b42');
  gradient.addColorStop(.55, '#102c25');
  gradient.addColorStop(1, '#050908');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = 'rgba(91,255,144,.25)';
  ctx.lineWidth = 2;
  for (let x = 18; x < 512; x += 25) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
  }
  const initials = String(username || 'UBG').trim().split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'U';
  ctx.fillStyle = '#d8ffe6';
  ctx.font = '700 190px Inter,Arial,sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#00ff66';
  ctx.shadowBlur = 32;
  ctx.fillText(initials, 256, 270);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

async function loadAvatarTexture(avatarUrl, username) {
  if (!avatarUrl) return createFallbackAvatar(username);
  try {
    const texture = await new THREE.TextureLoader().setCrossOrigin('anonymous').loadAsync(avatarUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  } catch {
    return createFallbackAvatar(username);
  }
}

function createGlyphAtlas() {
  const glyphs = '01ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソ';
  const cols = 8;
  const rows = Math.ceil(glyphs.length / cols);
  const cell = 64;
  const canvas = document.createElement('canvas');
  canvas.width = cols * cell;
  canvas.height = rows * cell;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '700 42px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < glyphs.length; i++) {
    const x = (i % cols) * cell + cell / 2;
    const y = Math.floor(i / cols) * cell + cell / 2;
    ctx.shadowColor = '#21ff72';
    ctx.shadowBlur = 10;
    ctx.fillStyle = i % 7 === 0 ? '#e5ffeb' : '#55ff88';
    ctx.fillText(glyphs[i], x, y + 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return { texture, cols, rows, count:glyphs.length };
}

function createGlyphCloud(count, atlas, radius = 2.1) {
  const positions = new Float32Array(count * 3);
  const source = new Float32Array(count * 3);
  const sphere = new Float32Array(count * 3);
  const burst = new Float32Array(count * 3);
  const glyph = new Float32Array(count);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * radius;
    const a = Math.random() * Math.PI * 2;
    source[i * 3] = Math.cos(a) * r;
    source[i * 3 + 1] = Math.sin(a) * r;
    source[i * 3 + 2] = (Math.random() - .5) * .2;
    const phi = Math.acos(1 - 2 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const sr = 1.38 + (Math.random() - .5) * .2;
    sphere[i * 3] = Math.sin(phi) * Math.cos(theta) * sr;
    sphere[i * 3 + 1] = Math.cos(phi) * sr;
    sphere[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * sr;
    const length = 5 + Math.random() * 7;
    const bx = sphere[i * 3];
    const by = sphere[i * 3 + 1];
    const bz = sphere[i * 3 + 2];
    const magnitude = Math.max(.15, Math.hypot(bx, by, bz));
    burst[i * 3] = bx / magnitude * length + (Math.random() - .5) * 1.8;
    burst[i * 3 + 1] = by / magnitude * length + (Math.random() - .5) * 1.8;
    burst[i * 3 + 2] = bz / magnitude * length + (Math.random() - .5) * 2.5;
    positions.set(source.subarray(i * 3, i * 3 + 3), i * 3);
    glyph[i] = Math.floor(Math.random() * atlas.count);
    seed[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const material = new THREE.ShaderMaterial({
    transparent:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    uniforms:{
      uAtlas:{ value:atlas.texture }, uCols:{ value:atlas.cols }, uRows:{ value:atlas.rows },
      uOpacity:{ value:0 }, uPointSize:{ value:19 }, uGlow:{ value:1 }, uTime:{ value:0 }
    },
    vertexShader:`
      attribute float aGlyph; attribute float aSeed; varying float vGlyph; varying float vSeed;
      uniform float uPointSize; uniform float uTime;
      void main(){
        vGlyph=aGlyph; vSeed=aSeed;
        vec3 p=position;
        p.z += sin(uTime*2.0+aSeed*24.0)*0.025;
        vec4 mv=modelViewMatrix*vec4(p,1.0);
        gl_PointSize=uPointSize*(7.2/max(1.0,-mv.z))*(.72+aSeed*.55);
        gl_Position=projectionMatrix*mv;
      }`,
    fragmentShader:`
      varying float vGlyph; varying float vSeed; uniform sampler2D uAtlas;
      uniform float uCols; uniform float uRows; uniform float uOpacity; uniform float uGlow;
      void main(){
        float col=mod(vGlyph,uCols); float row=floor(vGlyph/uCols);
        vec2 uv=vec2((col+gl_PointCoord.x)/uCols,1.0-(row+1.0-gl_PointCoord.y)/uRows);
        vec4 tex=texture2D(uAtlas,uv);
        float flicker=.72+.28*sin(vSeed*53.0);
        gl_FragColor=vec4(tex.rgb*uGlow,tex.a*uOpacity*flicker);
      }`
  });
  const points = new THREE.Points(geometry, material);
  return { points, geometry, material, positions, source, sphere, burst, seed };
}

function createRain(atlas) {
  const count = 420;
  const positions = new Float32Array(count * 3);
  const glyph = new Float32Array(count);
  const seed = new Float32Array(count);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 17;
    positions[i * 3 + 1] = (Math.random() - .5) * 12;
    positions[i * 3 + 2] = -1.5 - Math.random() * 8;
    glyph[i] = Math.floor(Math.random() * atlas.count);
    seed[i] = Math.random();
    speeds[i] = .55 + Math.random() * 1.65;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aGlyph', new THREE.BufferAttribute(glyph, 1));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  const material = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, blending:THREE.AdditiveBlending,
    uniforms:{ uAtlas:{value:atlas.texture},uCols:{value:atlas.cols},uRows:{value:atlas.rows},uOpacity:{value:.34},uPointSize:{value:13} },
    vertexShader:`attribute float aGlyph;attribute float aSeed;varying float vGlyph;varying float vSeed;uniform float uPointSize;void main(){vGlyph=aGlyph;vSeed=aSeed;vec4 mv=modelViewMatrix*vec4(position,1.0);gl_PointSize=uPointSize*(7.0/max(1.0,-mv.z));gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying float vGlyph;varying float vSeed;uniform sampler2D uAtlas;uniform float uCols;uniform float uRows;uniform float uOpacity;void main(){float c=mod(vGlyph,uCols);float r=floor(vGlyph/uCols);vec2 uv=vec2((c+gl_PointCoord.x)/uCols,1.0-(r+1.0-gl_PointCoord.y)/uRows);vec4 t=texture2D(uAtlas,uv);gl_FragColor=vec4(t.rgb,t.a*uOpacity*(.35+vSeed*.65));}`
  });
  return { points:new THREE.Points(geometry,material),geometry,material,positions,speeds };
}

function createAvatarMaterial(texture) {
  return new THREE.ShaderMaterial({
    transparent:true,
    side:THREE.DoubleSide,
    uniforms:{ uTexture:{value:texture},uDissolve:{value:0},uTime:{value:0},uGlow:{value:0},uCollapse:{value:0} },
    vertexShader:`varying vec2 vUv;uniform float uTime;uniform float uDissolve;uniform float uCollapse;void main(){vUv=uv;vec3 p=position;p.xy*=1.0-uCollapse*.68;p.z+=sin((p.y+uTime)*18.0)*uDissolve*.025;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,
    fragmentShader:`
      varying vec2 vUv; uniform sampler2D uTexture; uniform float uDissolve; uniform float uTime; uniform float uGlow;
      float hash(vec2 p){return fract(sin(dot(floor(p*82.0),vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 p=vUv-.5; float circle=1.0-smoothstep(.485,.505,length(p));
        float n=hash(vUv+floor(uTime*9.0)*.001);
        float edge=smoothstep(uDissolve-.08,uDissolve,n)-smoothstep(uDissolve,uDissolve+.075,n);
        if(n<uDissolve||circle<.01) discard;
        vec4 avatar=texture2D(uTexture,vUv);
        vec3 green=vec3(.05,1.0,.28);
        vec3 color=mix(avatar.rgb,avatar.rgb*vec3(.48,1.22,.62),uDissolve*.48)+green*(edge*1.6+uGlow*.42);
        gl_FragColor=vec4(color,avatar.a*circle);
      }`
  });
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

export async function startMatrixEffect({ avatarUrl = null, username = 'User', durationMs = 14000 } = {}) {
  activeMatrixEffect?.stop?.();
  const overlay = document.createElement('div');
  overlay.className = 'matrix-3d-overlay';
  overlay.innerHTML = `<div class="matrix-3d-fog"></div><div class="matrix-3d-scan"></div><div class="matrix-3d-vignette"></div><div class="matrix-3d-hud"><span>MATRIX // AVATAR DECOMPOSITION</span><strong>Identity acquired</strong></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('matrix-3d-running');

  const label = overlay.querySelector('.matrix-3d-hud strong');
  const texture = await loadAvatarTexture(avatarUrl, username);
  if (!overlay.isConnected) return null;
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000502, .065);
  const camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, .1, 100);
  camera.position.set(0, 0, 8.4);
  const renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.55));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  overlay.prepend(renderer.domElement);

  const atlas = createGlyphAtlas();
  const avatarMaterial = createAvatarMaterial(texture);
  const avatar = new THREE.Mesh(new THREE.CircleGeometry(2.12, 96), avatarMaterial);
  avatar.position.z = .15;
  scene.add(avatar);
  const frame = new THREE.Mesh(new THREE.TorusGeometry(2.2, .035, 12, 96), new THREE.MeshBasicMaterial({color:0x34ff75,transparent:true,opacity:.65,blending:THREE.AdditiveBlending}));
  scene.add(frame);
  const cloud = createGlyphCloud(innerWidth < 700 ? 620 : 980, atlas, 2.05);
  cloud.points.position.z = .4;
  scene.add(cloud.points);
  const rain = createRain(atlas);
  scene.add(rain.points);
  const core = new THREE.PointLight(0x24ff69, 5, 12, 1.8);
  core.position.set(0, 0, 2.2);
  scene.add(core, new THREE.AmbientLight(0x2cff70, .35));

  const state = { reveal:0, sphere:0, sphereScale:1, burst:0, reform:0, brightness:1, rain:.34, spin:0 };
  let stopped = false;
  let animationFrame = 0;
  let previous = performance.now();
  const render = (now) => {
    if (stopped) return;
    const dt = Math.min(.04, (now - previous) / 1000 || .016);
    previous = now;
    const time = now / 1000;
    avatarMaterial.uniforms.uTime.value = time;
    cloud.material.uniforms.uTime.value = time;
    cloud.material.uniforms.uOpacity.value = state.reveal;
    cloud.material.uniforms.uGlow.value = state.brightness;
    rain.material.uniforms.uOpacity.value = state.rain;
    core.intensity = 4 + state.brightness * 5;
    const p = cloud.positions;
    const spinCos = Math.cos(state.spin);
    const spinSin = Math.sin(state.spin);
    for (let i = 0; i < cloud.seed.length; i++) {
      const k = i * 3;
      const sourceX = cloud.source[k];
      const sourceY = cloud.source[k + 1];
      const sourceZ = cloud.source[k + 2];
      const spiralAngle = state.sphere * (5.5 + cloud.seed[i] * 3.0);
      const spiralRadius = 1 - state.sphere * .48;
      let x = mix(sourceX, cloud.sphere[k], ease(state.sphere));
      let y = mix(sourceY, cloud.sphere[k + 1], ease(state.sphere));
      let z = mix(sourceZ, cloud.sphere[k + 2], ease(state.sphere));
      const ca = Math.cos(spiralAngle), sa = Math.sin(spiralAngle);
      const sx = x * ca - y * sa;
      const sy = x * sa + y * ca;
      x = sx * spiralRadius * state.sphereScale;
      y = sy * spiralRadius * state.sphereScale;
      z *= state.sphereScale;
      const rx = x * spinCos - z * spinSin;
      const rz = x * spinSin + z * spinCos;
      x = mix(rx, cloud.burst[k], ease(state.burst));
      y = mix(y, cloud.burst[k + 1], ease(state.burst));
      z = mix(rz, cloud.burst[k + 2], ease(state.burst));
      if (state.reform > 0) {
        const back = ease(state.reform);
        x = mix(x, sourceX, back); y = mix(y, sourceY, back); z = mix(z, sourceZ, back);
      }
      p[k] = x; p[k + 1] = y; p[k + 2] = z;
    }
    cloud.geometry.attributes.position.needsUpdate = true;
    if (state.sphere > .82 && state.burst < .1) state.spin += dt * 1.1;
    const rainPos = rain.positions;
    for (let i = 0; i < rain.speeds.length; i++) {
      rainPos[i * 3 + 1] -= rain.speeds[i] * dt;
      if (rainPos[i * 3 + 1] < -6) rainPos[i * 3 + 1] = 6;
    }
    rain.geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
    animationFrame = requestAnimationFrame(render);
  };
  animationFrame = requestAnimationFrame(render);

  const stage = (text) => { label.textContent = text; };
  const timeline = gsap.timeline({ defaults:{ overwrite:'auto' } });
  timeline.to(overlay, {opacity:1,duration:.45,ease:'power2.out'}, 0);
  timeline.from(avatar.scale, {x:.78,y:.78,duration:.65,ease:'back.out(1.5)'}, .1);
  timeline.call(() => stage('Edge interference detected'), null, .8);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:.08,duration:.7,ease:'sine.inOut'}, .8);
  timeline.to(avatarMaterial.uniforms.uGlow, {value:.45,duration:.5,yoyo:true,repeat:2}, .9);
  timeline.call(() => stage('Code leakage initiated'), null, 1.55);
  timeline.to(state, {reveal:.22,duration:.9,ease:'power2.out'}, 1.5);
  timeline.call(() => stage('Avatar fragmentation: 25%'), null, 2.25);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:.27,duration:1,ease:'power2.inOut'}, 2.1);
  timeline.to(state, {reveal:.5,duration:.8,ease:'sine.out'}, 2.15);
  timeline.call(() => stage('Avatar fragmentation: 50%'), null, 3.15);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:.53,duration:1,ease:'power2.inOut'}, 3.05);
  timeline.to(state, {reveal:.78,duration:.8,ease:'sine.out'}, 3.1);
  timeline.call(() => stage('Identity structure collapsing'), null, 4.05);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:.82,duration:.9,ease:'power3.in'}, 4.0);
  timeline.to(avatarMaterial.uniforms.uCollapse, {value:.58,duration:.9,ease:'power3.in'}, 4.05);
  timeline.to(state, {reveal:1,sphere:.58,duration:1.25,ease:'power3.inOut'}, 4.05);
  timeline.call(() => stage('Matrix code sphere formed'), null, 5.15);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:1,duration:.45,ease:'power4.in'}, 5.05);
  timeline.to(frame.material, {opacity:0,duration:.4}, 5.05);
  timeline.to(state, {sphere:1,duration:1.05,ease:'power3.inOut'}, 5.1);
  timeline.call(() => stage('Code sphere absorbing particles'), null, 6.0);
  timeline.to(state, {sphereScale:.86,brightness:1.65,duration:1.1,ease:'sine.inOut'}, 6.0);
  timeline.call(() => stage('Maximum code density'), null, 7.0);
  timeline.to(state, {sphereScale:.34,brightness:3.2,rain:.16,duration:.72,ease:'power4.in'}, 6.95);
  timeline.to(core, {intensity:26,duration:.65,ease:'power4.in'}, 7.0);
  timeline.call(() => stage('SYSTEM OVERFLOW'), null, 7.7);
  timeline.to(state, {burst:1,sphereScale:1,brightness:2.3,duration:.68,ease:'expo.out'}, 7.68);
  timeline.to(overlay.querySelector('.matrix-3d-fog'), {opacity:.9,duration:.08,yoyo:true,repeat:1}, 7.66);
  timeline.call(() => stage('Reconstructing identity'), null, 8.65);
  timeline.to(state, {reform:1,brightness:1.4,rain:.28,duration:2.05,ease:'power3.inOut'}, 8.55);
  timeline.to(avatarMaterial.uniforms.uCollapse, {value:0,duration:1.5,ease:'power2.out'}, 9.2);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:.22,duration:1.55,ease:'power2.out'}, 9.25);
  timeline.to(frame.material, {opacity:.65,duration:.75}, 10.0);
  timeline.call(() => stage('Identity restored'), null, 10.55);
  timeline.to(avatarMaterial.uniforms.uDissolve, {value:0,duration:.75,ease:'sine.out'}, 10.5);
  timeline.to(state, {reveal:0,duration:.65,ease:'sine.inOut'}, 10.55);
  timeline.to(avatarMaterial.uniforms.uGlow, {value:1,duration:.22,yoyo:true,repeat:1,ease:'power2.out'}, 11.0);
  timeline.to(state, {rain:0,duration:.9,ease:'sine.inOut'}, 11.25);
  timeline.to(overlay, {opacity:0,duration:.8,ease:'sine.inOut'}, 11.85);

  const resize = () => { camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.55)); };
  addEventListener('resize', resize);
  function stop() {
    if (stopped) return;
    stopped = true;
    timeline.kill();
    cancelAnimationFrame(animationFrame);
    removeEventListener('resize', resize);
    document.body.classList.remove('matrix-3d-running');
    texture.dispose?.(); atlas.texture.dispose?.();
    disposeScene(scene, renderer);
    overlay.remove();
    if (activeMatrixEffect?.stop === stop) activeMatrixEffect = null;
  }
  timeline.call(stop, null, 12.72);
  const requested = clamp((Number(durationMs) || 14000) / 1000, 12.72, 18);
  timeline.timeScale(12.72 / requested);
  activeMatrixEffect = { stop };
  return activeMatrixEffect;
}
