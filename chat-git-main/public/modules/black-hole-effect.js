import * as THREE from 'three';
import { gsap } from 'gsap';
import html2canvas from 'html2canvas';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

let activeBlackHoleEffect = null;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const mix = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function visibleMessages() {
  const viewport = document.getElementById('messages-container')?.getBoundingClientRect();
  if (!viewport) return [];
  return [...document.querySelectorAll('#messages-list .msg-row, #messages-list .msg-follow')]
    .filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.width > 40 && rect.height > 14 && rect.bottom > viewport.top && rect.top < viewport.bottom;
    })
    .slice(-12);
}

function fallbackCardCanvas(node, width, height) {
  const scale = Math.min(devicePixelRatio || 1, 1.5);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(320, Math.round(width * scale));
  canvas.height = Math.max(80, Math.round(height * scale));
  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  const w = canvas.width / scale;
  const h = canvas.height / scale;
  ctx.fillStyle = 'rgba(8,22,15,.96)';
  ctx.strokeStyle = 'rgba(76,255,126,.65)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.roundRect(1, 1, w - 2, h - 2, 12); ctx.fill(); ctx.stroke();
  const avatar = node.querySelector('.msg-avatar');
  const name = [...node.querySelectorAll('.msg-reply-target')].find((item) => item.tagName === 'SPAN')?.textContent || 'Message';
  const timestamp = node.querySelector('time,.msg-time,[data-time]')?.textContent || '';
  const text = node.querySelector('.msg-bubble')?.textContent || node.textContent || '';
  ctx.fillStyle = '#20e86b'; ctx.beginPath(); ctx.arc(27, h / 2, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#06180c'; ctx.font = '800 11px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(avatar?.textContent || name).trim().slice(0, 2).toUpperCase(), 27, h / 2);
  ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#baffcd'; ctx.font = '700 11px Arial'; ctx.fillText(String(name).trim().slice(0, 38), 52, 24);
  if (timestamp) { ctx.fillStyle = '#4d8b62'; ctx.font = '9px Arial'; ctx.fillText(String(timestamp).trim(), Math.min(w - 70, 52 + ctx.measureText(String(name)).width + 8), 24); }
  ctx.fillStyle = '#e5ffec'; ctx.font = '11px Arial'; ctx.fillText(String(text).trim().replace(/\s+/g, ' ').slice(0, 105), 52, 43);
  return canvas;
}

async function captureMessage(node, rect) {
  try {
    return await html2canvas(node, {
      backgroundColor:null,
      useCORS:true,
      allowTaint:false,
      logging:false,
      scale:Math.min(devicePixelRatio || 1, 1.5),
      width:Math.ceil(rect.width),
      height:Math.ceil(rect.height),
      windowWidth:innerWidth,
      windowHeight:innerHeight
    });
  } catch {
    return fallbackCardCanvas(node, rect.width, rect.height);
  }
}

function createAccretionDisk() {
  const geometry = new THREE.PlaneGeometry(7.2, 7.2, 1, 1);
  const material = new THREE.ShaderMaterial({
    transparent:true,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    uniforms:{ uTime:{value:0},uIntensity:{value:0},uCollapse:{value:0} },
    vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader:`
      varying vec2 vUv;uniform float uTime;uniform float uIntensity;uniform float uCollapse;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      void main(){
        vec2 p=vUv-.5; p.y*=1.34;
        float r=length(p); float a=atan(p.y,p.x);
        float warpA=.5+.5*sin(a*11.0-r*82.0-uTime*7.2);
        float warpB=.5+.5*sin(a*19.0+r*126.0+uTime*9.5);
        float turbulent=noise(vec2(a*5.0+uTime*.9,r*62.0-uTime*4.4));
        float inner=.105-uCollapse*.055; float outer=.46-uCollapse*.12;
        float ring=smoothstep(inner,inner+.038,r)*(1.0-smoothstep(outer-.045,outer,r));
        float hot=exp(-abs(r-(inner+.032))*68.0);
        float filaments=(pow(warpA,8.0)+pow(warpB,11.0)*.7)*(.35+turbulent*.85)*ring;
        vec3 green=mix(vec3(.002,.075,.015),vec3(.04,.68,.17),clamp(filaments+hot*.55,0.0,1.0));
        float alpha=(ring*(.12+filaments*.62)+hot*.48)*uIntensity;
        gl_FragColor=vec4(green*(.68+hot*.75),alpha);
      }`
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -.3;
  return { mesh, material };
}

function createLensShell() {
  const geometry = new THREE.SphereGeometry(1.23, 64, 42);
  const material = new THREE.ShaderMaterial({
    transparent:true, depthWrite:false, side:THREE.BackSide, blending:THREE.AdditiveBlending,
    uniforms:{uTime:{value:0},uOpacity:{value:0}},
    vertexShader:`varying vec3 vNormal;varying vec3 vView;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);vNormal=normalize(normalMatrix*normal);vView=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,
    fragmentShader:`varying vec3 vNormal;varying vec3 vView;uniform float uTime;uniform float uOpacity;void main(){float fres=pow(1.0-abs(dot(vNormal,vView)),2.5);float wave=.72+.28*sin(uTime*8.0+fres*18.0);gl_FragColor=vec4(.08,.95,.3,fres*wave*uOpacity);}`
  });
  return { mesh:new THREE.Mesh(geometry,material), material };
}

function createDiskParticles(count = 1650) {
  const positions = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const radii = new Float32Array(count);
  const angles = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = .95 + Math.pow(Math.random(), .7) * 3.25;
    const a = Math.random() * Math.PI * 2;
    radii[i] = r; angles[i] = a; seeds[i] = Math.random();
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = Math.sin(a) * r * .42;
    positions[i * 3 + 2] = (Math.random() - .5) * .3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({color:0x48ff78,size:.026,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,sizeAttenuation:true});
  return {points:new THREE.Points(geometry,material),geometry,material,positions,seeds,radii,angles};
}

function createGravityStreaks(count = 620) {
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.35 + Math.pow(Math.random(), .58) * 8.8;
    const length = .2 + Math.random() * (.28 + radius * .13);
    const curl = .08 + radius * .009;
    const innerRadius = Math.max(1.12, radius - length);
    const innerAngle = angle - curl;
    positions[i * 6] = Math.cos(angle) * radius;
    positions[i * 6 + 1] = Math.sin(angle) * radius * .72;
    positions[i * 6 + 2] = (Math.random() - .5) * 2.5;
    positions[i * 6 + 3] = Math.cos(innerAngle) * innerRadius;
    positions[i * 6 + 4] = Math.sin(innerAngle) * innerRadius * .72;
    positions[i * 6 + 5] = positions[i * 6 + 2] * .82;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material = new THREE.LineBasicMaterial({color:0x08b53b,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  return {lines:new THREE.LineSegments(geometry,material),geometry,material};
}

function createAccretionFilaments(count = 430) {
  const positions = new Float32Array(count * 6);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.08 + Math.pow(Math.random(), .72) * 3.15;
    const length = .07 + Math.random() * .23;
    const innerAngle = angle - (.06 + radius * .035);
    const innerRadius = radius - length;
    positions[i * 6] = Math.cos(angle) * radius;
    positions[i * 6 + 1] = Math.sin(angle) * radius * .46;
    positions[i * 6 + 2] = (Math.random() - .5) * .2;
    positions[i * 6 + 3] = Math.cos(innerAngle) * innerRadius;
    positions[i * 6 + 4] = Math.sin(innerAngle) * innerRadius * .46;
    positions[i * 6 + 5] = positions[i * 6 + 2];
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material = new THREE.LineBasicMaterial({color:0x2cff69,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
  return {lines:new THREE.LineSegments(geometry,material),geometry,material};
}

function createStarField(count = 420) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - .5) * 20;
    positions[i * 3 + 1] = (Math.random() - .5) * 12;
    positions[i * 3 + 2] = -2 - Math.random() * 10;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const material = new THREE.PointsMaterial({color:0x24ff65,size:.022,transparent:true,opacity:.38,blending:THREE.AdditiveBlending,depthWrite:false});
  return new THREE.Points(geometry,material);
}

function screenToWorld(rect, camera, z = 0) {
  const distance = camera.position.z - z;
  const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * distance;
  const worldWidth = worldHeight * camera.aspect;
  const x = ((rect.left + rect.width / 2) / innerWidth - .5) * worldWidth;
  const y = (.5 - (rect.top + rect.height / 2) / innerHeight) * worldHeight;
  return {x,y,worldWidth,worldHeight,perPixel:worldHeight/innerHeight};
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
  composer?.dispose?.(); renderer.dispose(); renderer.forceContextLoss?.();
}

export async function startBlackHoleEffect({durationMs = 15000} = {}) {
  activeBlackHoleEffect?.stop?.();
  const nodes = visibleMessages();
  const snapshots = nodes.map((node) => ({node,rect:node.getBoundingClientRect(),opacity:node.style.opacity}));
  const overlay = document.createElement('div');
  overlay.className = 'black-hole-effect-overlay';
  overlay.innerHTML = `<div class="black-hole-effect-fog"></div><div class="black-hole-effect-vignette"></div><div class="black-hole-effect-flash"></div><div class="black-hole-effect-hud" aria-label="Black hole effect progress"><b>0%</b><i><span></span></i></div>`;
  document.body.appendChild(overlay);
  document.body.classList.add('black-hole-effect-running');
  const progressText = overlay.querySelector('.black-hole-effect-hud b');
  const progressBar = overlay.querySelector('.black-hole-effect-hud i span');
  const flash = overlay.querySelector('.black-hole-effect-flash');

  const canvases = await Promise.all(snapshots.map(({node,rect}) => captureMessage(node,rect)));
  if (!overlay.isConnected) return null;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000401,.048);
  const camera = new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.1,100);
  camera.position.set(0,0,10.5);
  const renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.35));
  renderer.setSize(innerWidth,innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  overlay.prepend(renderer.domElement);
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(devicePixelRatio||1,1.35));
  composer.setSize(innerWidth,innerHeight);
  composer.addPass(new RenderPass(scene,camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth,innerHeight),.78,.55,.68);
  composer.addPass(bloom);

  scene.add(new THREE.AmbientLight(0x1aff5c,.18));
  const blackHole = new THREE.Group();
  blackHole.scale.setScalar(.04);
  scene.add(blackHole);
  const disk = createAccretionDisk(); blackHole.add(disk.mesh);
  const lens = createLensShell(); blackHole.add(lens.mesh);
  const core = new THREE.Mesh(new THREE.SphereGeometry(1.1,64,42),new THREE.MeshBasicMaterial({color:0x000000,toneMapped:false}));
  core.position.z = .58; core.renderOrder=12; blackHole.add(core);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.02,.045,16,96),new THREE.MeshBasicMaterial({color:0x8dffa6,transparent:true,opacity:0,blending:THREE.AdditiveBlending}));
  rim.position.z=.65; rim.renderOrder=13; blackHole.add(rim);
  const diskParticles = createDiskParticles(); blackHole.add(diskParticles.points);
  const filaments = createAccretionFilaments(); filaments.lines.position.z=.12; blackHole.add(filaments.lines);
  const stars = createStarField(); scene.add(stars);
  const gravityStreaks = createGravityStreaks(); gravityStreaks.lines.position.z=-.5; scene.add(gravityStreaks.lines);
  const energyLight = new THREE.PointLight(0x35ff71,0,13,1.8); energyLight.position.z=2.5; scene.add(energyLight);
  const shockwaves = [0,1,2].map((index) => {
    const mesh = new THREE.Mesh(new THREE.TorusGeometry(1.1,.026,12,96),new THREE.MeshBasicMaterial({color:index===0?0xd9ffe2:0x3dff75,transparent:true,opacity:0,blending:THREE.AdditiveBlending}));
    mesh.scale.setScalar(.15); mesh.position.z=.6; scene.add(mesh); return mesh;
  });

  const cards = snapshots.map((snapshot,index) => {
    const canvas = canvases[index];
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace=THREE.SRGBColorSpace; texture.minFilter=THREE.LinearFilter; texture.generateMipmaps=false;
    const loc = screenToWorld(snapshot.rect,camera,0);
    const width = snapshot.rect.width*loc.perPixel;
    const height = snapshot.rect.height*loc.perPixel;
    const geometry = new THREE.PlaneGeometry(width,height);
    const material = new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:1,side:THREE.DoubleSide,depthWrite:false,toneMapped:false});
    const object = new THREE.Group();
    object.position.set(loc.x,loc.y,0);
    const glowMaterial = new THREE.LineBasicMaterial({color:0x25ff68,transparent:true,opacity:.42,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false});
    const glow = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(width*1.025,height*1.12)),glowMaterial);
    glow.position.z=-.025;
    const mesh = new THREE.Mesh(geometry,material);
    mesh.renderOrder=20+index;
    object.add(glow,mesh); scene.add(object);
    const trailGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(loc.x,loc.y,0),new THREE.Vector3(0,0,0)]);
    const trailMaterial = new THREE.LineBasicMaterial({color:0x45ff78,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
    const trail = new THREE.Line(trailGeometry,trailMaterial); scene.add(trail);
    const startRadius=Math.max(.75,Math.hypot(loc.x,loc.y));
    const startAngle=Math.atan2(loc.y,loc.x);
    const burstAngle=startAngle+(index%2?-.42:.42);
    return {object,mesh,material,glowMaterial,trail,trailMaterial,trailGeometry,start:new THREE.Vector3(loc.x,loc.y,0),startRadius,startAngle,burstTarget:new THREE.Vector3(Math.cos(burstAngle)*(startRadius+2.5),Math.sin(burstAngle)*(startRadius+1.9),(index%3-1)*1.65),state:{lift:0,orbit:0,burst:0,restore:0}};
  });

  snapshots.forEach(({node}) => {node.style.opacity='0';});
  let stopped=false,frame=0,previous=performance.now(),frozen=false,exploded=false;
  const sceneState={diskSpeed:.55,shake:0,starBurst:0};
  const updateCard = (card,index,time) => {
    const s=card.state;
    if(s.burst>0||s.restore>0){
      const burst=smooth(s.burst),restore=smooth(s.restore);
      let x=mix(0,card.burstTarget.x,burst),y=mix(0,card.burstTarget.y,burst),z=mix(.6,card.burstTarget.z,burst);
      x=mix(x,card.start.x,restore);y=mix(y,card.start.y,restore);z=mix(z,card.start.z,restore);
      card.object.position.set(x,y,z);
      card.object.rotation.set(mix((index%2?-.35:.35),0,restore),mix((index%3-1)*.42,0,restore),mix((index%2?-.24:.24),0,restore));
      const scale=mix(.12,1,Math.min(1,burst*1.7));card.object.scale.set(scale,scale,scale);
      card.material.opacity=Math.min(1,burst*2.5);
      card.glowMaterial.opacity=card.material.opacity*.34;
      return;
    }
    const p=s.orbit;
    if(p<=0){
      card.object.position.set(card.start.x,card.start.y,s.lift*.72);
      card.object.rotation.set(s.lift*(index%2?-.08:.08),s.lift*(index%3-1)*.11,s.lift*(index%2?-.035:.035));
      return;
    }
    const turn=card.startAngle+p*Math.PI*4.95+index*.68;
    const radius=Math.max(.018,card.startRadius*Math.pow(1-p,1.72));
    const sink=clamp((p-.9)/.1,0,1);
    card.object.position.set(Math.cos(turn)*radius*(1-sink*.82),Math.sin(turn)*radius*(1-sink*.82),Math.sin(turn*1.7)*1.15*(1-p)+.35*p*(1-sink*.55));
    const stretch=clamp((p-.53)/.43,0,1);
    const tangent=turn+Math.PI/2;
    const readable=Math.sin(tangent)*.46;
      card.object.rotation.set(.08*Math.sin(turn),p*.42,readable);
      card.object.scale.set((1+stretch*4.7)*(1-sink*.88),(1-stretch*.72)*(1-sink*.78),1);
      card.material.opacity=1-smooth(clamp((p-.94)/.06,0,1));
      card.glowMaterial.opacity=card.material.opacity*(.25+stretch*.52);
      card.trailMaterial.opacity=.12+stretch*.78;
    const trailPos=card.trailGeometry.attributes.position;
    trailPos.setXYZ(0,card.object.position.x,card.object.position.y,card.object.position.z);
    trailPos.setXYZ(1,0,0,.2);trailPos.needsUpdate=true;
  };
  const render=(now)=>{
    if(stopped)return;
    const dt=Math.min(.04,(now-previous)/1000||.016);previous=now;
    if(!frozen){
      disk.material.uniforms.uTime.value=now/1000;
      lens.material.uniforms.uTime.value=now/1000;
      disk.mesh.rotation.z+=dt*sceneState.diskSpeed;
      filaments.lines.rotation.z-=dt*sceneState.diskSpeed*.72;
      gravityStreaks.lines.rotation.z-=dt*(.08+sceneState.diskSpeed*.055);
      gravityStreaks.lines.scale.setScalar(1+sceneState.starBurst*.42);
      lens.mesh.rotation.y+=dt*.34;
      const pos=diskParticles.positions;
      for(let i=0;i<diskParticles.radii.length;i++){
        diskParticles.angles[i]+=dt*sceneState.diskSpeed*(1.45/diskParticles.radii[i]);
        const r=diskParticles.radii[i]*(1-sceneState.starBurst*.76);
        const a=diskParticles.angles[i];
        pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r*.42;pos[i*3+2]=Math.sin(a*3+i)*.12;
      }
      diskParticles.geometry.attributes.position.needsUpdate=true;
      cards.forEach((card,index)=>updateCard(card,index,now/1000));
    }
    if(sceneState.shake>0){camera.position.x=(Math.random()-.5)*sceneState.shake;camera.position.y=(Math.random()-.5)*sceneState.shake;}else{camera.position.x*=.82;camera.position.y*=.82;}
    composer.render();frame=requestAnimationFrame(render);
  };
  frame=requestAnimationFrame(render);

  const setPercent=(value)=>{if(progressText)progressText.textContent=`${Math.max(0,Math.min(100,Math.round(value)))}%`;};
  const timeline=gsap.timeline({defaults:{overwrite:'auto'}});
  timeline.to(overlay,{opacity:1,duration:.6,ease:'power2.out'},0);
  timeline.to(progressBar,{width:'100%',duration:13.5,ease:'none',onUpdate(){setPercent(this.progress()*100);}},0);
  cards.forEach((card,index)=>timeline.to(card.state,{lift:1,duration:.72,ease:'back.out(1.35)'},.85+index*.045));
  timeline.to(blackHole.scale,{x:1,y:1,z:1,duration:1.25,ease:'back.out(1.6)'},1.2);
  timeline.to(disk.material.uniforms.uIntensity,{value:.82,duration:1.1,ease:'power2.out'},1.15);
  timeline.to(lens.material.uniforms.uOpacity,{value:.78,duration:.9},1.3);
  timeline.to(rim.material,{opacity:.58,duration:.8},1.4);
  timeline.to(diskParticles.material,{opacity:.8,duration:1},1.2);
  timeline.to(filaments.material,{opacity:.5,duration:1},1.25);
  timeline.to(gravityStreaks.material,{opacity:.2,duration:1.2},1.35);
  timeline.to(energyLight,{intensity:5,duration:1},1.3);
  cards.forEach((card,index)=>timeline.to(card.state,{orbit:1,duration:4.25-index*.045,ease:'power2.in'},2.05+index*.055));
  timeline.to(sceneState,{diskSpeed:2.1,duration:3.4,ease:'power2.in'},2.2);
  timeline.to(gravityStreaks.material,{opacity:.42,duration:1.4,ease:'power2.in'},4.15);
  timeline.to(filaments.material,{opacity:.72,duration:1.2,ease:'power2.in'},4.3);
  timeline.to(sceneState,{shake:.045,duration:1.4,ease:'power2.in'},4.8);
  timeline.to(disk.material.uniforms.uCollapse,{value:1,duration:1.1,ease:'power3.in'},5.65);
  timeline.to(blackHole.scale,{x:.54,y:.54,z:.54,duration:.82,ease:'power4.in'},6.15);
  timeline.to(sceneState,{diskSpeed:5.4,starBurst:.72,shake:.1,duration:.85,ease:'power4.in'},6.0);
  timeline.to(energyLight,{intensity:15,duration:.68,ease:'power4.in'},6.15);
  timeline.call(()=>{frozen=true;},null,6.88);
  timeline.call(()=>{frozen=false;},null,7.18);
  timeline.call(()=>{exploded=true;blackHole.visible=false;cards.forEach((card)=>{card.object.visible=true;card.material.opacity=0;card.glowMaterial.opacity=0;card.state.orbit=0;card.state.burst=.001;});},null,7.2);
  timeline.to(flash,{opacity:1,duration:.07,ease:'none'},7.18);
  timeline.to(flash,{opacity:0,duration:.72,ease:'power3.out'},7.25);
  shockwaves.forEach((ring,index)=>{timeline.to(ring.material,{opacity:.72-index*.16,duration:.08},7.2+index*.12);timeline.to(ring.scale,{x:7+index*1.2,y:7+index*1.2,z:7+index*1.2,duration:1.25,ease:'power3.out'},7.2+index*.12);timeline.to(ring.material,{opacity:0,duration:.9,ease:'power2.out'},7.38+index*.12);});
  timeline.to(sceneState,{shake:.2,duration:.08,yoyo:true,repeat:5,ease:'none'},7.18);
  timeline.to(gravityStreaks.scale,{x:3.2,y:3.2,z:3.2,duration:1.15,ease:'expo.out'},7.18);
  timeline.to(gravityStreaks.material,{opacity:1,duration:.08,ease:'none'},7.18);
  timeline.to(gravityStreaks.material,{opacity:0,duration:1.1,ease:'power2.out'},7.4);
  cards.forEach((card,index)=>timeline.to(card.state,{burst:1,duration:1.05,ease:'expo.out'},7.28+index*.025));
  cards.forEach((card,index)=>timeline.to(card.state,{restore:1,duration:2.15,ease:'power2.inOut'},8.55+index*.025));
  timeline.to(sceneState,{shake:0,duration:.6,ease:'sine.out'},8.1);
  timeline.call(()=>snapshots.forEach(({node,opacity})=>{if(node.isConnected)node.style.opacity=opacity;}),null,11.15);
  timeline.to(cards.map((card)=>card.material),{opacity:0,duration:.4,ease:'sine.inOut'},11.12);
  timeline.to(cards.map((card)=>card.glowMaterial),{opacity:0,duration:.36,ease:'sine.inOut'},11.1);
  timeline.call(()=>setPercent(100),null,11.2);
  timeline.to(overlay,{opacity:0,duration:.85,ease:'sine.inOut'},11.65);

  const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.35));composer.setSize(innerWidth,innerHeight);composer.setPixelRatio(Math.min(devicePixelRatio||1,1.35));};
  addEventListener('resize',resize);
  function stop(){
    if(stopped)return;stopped=true;timeline.kill();cancelAnimationFrame(frame);removeEventListener('resize',resize);
    snapshots.forEach(({node,opacity})=>{if(node.isConnected)node.style.opacity=opacity;});
    document.body.classList.remove('black-hole-effect-running');disposeScene(scene,composer,renderer);overlay.remove();
    if(activeBlackHoleEffect?.stop===stop)activeBlackHoleEffect=null;
  }
  timeline.call(stop,null,12.58);
  const requested=clamp((Number(durationMs)||15000)/1000,12.58,19);
  timeline.timeScale(12.58/requested);
  activeBlackHoleEffect={stop};
  return {active:true};
}
