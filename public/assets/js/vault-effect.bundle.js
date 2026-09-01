var VaultEffectRuntime=(()=>{var Xf=Object.defineProperty;var iv=Object.getOwnPropertyDescriptor;var sv=Object.getOwnPropertyNames;var rv=Object.prototype.hasOwnProperty;var $m=(r,t)=>{for(var e in t)Xf(r,e,{get:t[e],enumerable:!0})},av=(r,t,e,n)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of sv(t))!rv.call(r,i)&&i!==e&&Xf(r,i,{get:()=>t[i],enumerable:!(n=iv(t,i))||n.enumerable});return r};var ov=r=>av(Xf({},"__esModule",{value:!0}),r);var Pw={};$m(Pw,{startVaultEffect:()=>Rw});var Zp={};$m(Zp,{ACESFilmicToneMapping:()=>Wa,AddEquation:()=>Wi,AddOperation:()=>up,AdditiveAnimationBlendMode:()=>vf,AdditiveBlending:()=>Ga,AgXToneMapping:()=>hf,AlphaFormat:()=>_f,AlwaysCompare:()=>bp,AlwaysDepth:()=>Fo,AlwaysStencilFunc:()=>Jh,AmbientLight:()=>yr,AnimationAction:()=>Yl,AnimationClip:()=>Rs,AnimationLoader:()=>mu,AnimationMixer:()=>Cu,AnimationObjectGroup:()=>Au,AnimationUtils:()=>pu,ArcCurve:()=>al,ArrayCamera:()=>Hl,ArrowHelper:()=>Ku,AttachedBindMode:()=>Yh,Audio:()=>Xl,AudioAnalyser:()=>wu,AudioContext:()=>za,AudioListener:()=>Tu,AudioLoader:()=>Su,AxesHelper:()=>Qu,BackSide:()=>ln,BasicDepthPacking:()=>gp,BasicShadowMap:()=>c_,BatchedMesh:()=>Qo,BezierInterpolant:()=>Dl,Bone:()=>Ma,BooleanKeyframeTrack:()=>wi,Box2:()=>Bu,Box3:()=>Ge,Box3Helper:()=>Ju,BoxGeometry:()=>kn,BoxHelper:()=>Zu,BufferAttribute:()=>oe,BufferGeometry:()=>Ht,BufferGeometryLoader:()=>Vl,ByteType:()=>df,Cache:()=>oi,Camera:()=>xr,CameraHelper:()=>Yu,CanvasTexture:()=>uu,CapsuleGeometry:()=>nl,CatmullRomCurve3:()=>ol,CineonToneMapping:()=>lf,CircleGeometry:()=>il,ClampToEdgeWrapping:()=>mn,Clock:()=>ka,Color:()=>bt,ColorKeyframeTrack:()=>Ua,ColorManagement:()=>ie,Compatibility:()=>K_,CompressedArrayTexture:()=>cu,CompressedCubeTexture:()=>hu,CompressedTexture:()=>dr,CompressedTextureLoader:()=>gu,ConeGeometry:()=>ba,ConstantAlphaFactor:()=>lp,ConstantColorFactor:()=>ap,Controls:()=>tf,CubeCamera:()=>Gl,CubeDepthTexture:()=>el,CubeReflectionMapping:()=>di,CubeRefractionMapping:()=>Qi,CubeTexture:()=>Es,CubeTextureLoader:()=>_u,CubeUVReflectionMapping:()=>Sr,CubicBezierCurve:()=>Ta,CubicBezierCurve3:()=>ll,CubicInterpolant:()=>Pl,CullFaceBack:()=>nf,CullFaceFront:()=>Wd,CullFaceFrontBack:()=>l_,CullFaceNone:()=>Hd,Curve:()=>An,CurvePath:()=>hl,CustomBlending:()=>qd,CustomToneMapping:()=>cf,CylinderGeometry:()=>wn,Cylindrical:()=>Fu,Data3DTexture:()=>ar,DataArrayTexture:()=>rr,DataTexture:()=>Tn,DataTextureLoader:()=>xu,DataUtils:()=>Qh,DecrementStencilOp:()=>C_,DecrementWrapStencilOp:()=>P_,DefaultLoadingManager:()=>Pp,DepthFormat:()=>li,DepthStencilFormat:()=>ji,DepthTexture:()=>Ti,DetachedBindMode:()=>fp,DirectionalLight:()=>Ds,DirectionalLightHelper:()=>qu,DiscreteInterpolant:()=>Il,DodecahedronGeometry:()=>sl,DoubleSide:()=>ui,DstAlphaFactor:()=>ep,DstColorFactor:()=>ip,DynamicCopyUsage:()=>X_,DynamicDrawUsage:()=>z_,DynamicReadUsage:()=>G_,EdgesGeometry:()=>rl,EllipseCurve:()=>pr,EqualCompare:()=>yp,EqualDepth:()=>Bo,EqualStencilFunc:()=>N_,EquirectangularReflectionMapping:()=>Xa,EquirectangularRefractionMapping:()=>qa,Euler:()=>Jn,EventDispatcher:()=>En,ExternalTexture:()=>Sa,ExtrudeGeometry:()=>pl,FileLoader:()=>$n,Float16BufferAttribute:()=>su,Float32BufferAttribute:()=>Et,FloatType:()=>rn,Fog:()=>Xo,FogExp2:()=>cr,FramebufferTexture:()=>lu,FrontSide:()=>bi,Frustum:()=>Yi,FrustumArray:()=>Ko,GLBufferAttribute:()=>Lu,GLSL1:()=>Y_,GLSL3:()=>yf,GreaterCompare:()=>Mp,GreaterDepth:()=>ko,GreaterEqualCompare:()=>Lc,GreaterEqualDepth:()=>zo,GreaterEqualStencilFunc:()=>B_,GreaterStencilFunc:()=>F_,GridHelper:()=>Wu,Group:()=>sn,HTMLTexture:()=>fu,HalfFloatType:()=>mi,HemisphereLight:()=>Nl,HemisphereLightHelper:()=>Hu,IcosahedronGeometry:()=>_r,ImageBitmapLoader:()=>Mu,ImageLoader:()=>Ps,ImageUtils:()=>Wo,IncrementStencilOp:()=>A_,IncrementWrapStencilOp:()=>R_,InstancedBufferAttribute:()=>qi,InstancedBufferGeometry:()=>kl,InstancedInterleavedBuffer:()=>Du,InstancedMesh:()=>$o,Int16BufferAttribute:()=>nu,Int32BufferAttribute:()=>iu,Int8BufferAttribute:()=>jh,IntType:()=>Jl,InterleavedBuffer:()=>ur,InterleavedBufferAttribute:()=>bs,Interpolant:()=>Ki,InterpolateBezier:()=>Zh,InterpolateDiscrete:()=>ha,InterpolateLinear:()=>Go,InterpolateSmooth:()=>Ro,InterpolationSamplingMode:()=>$_,InterpolationSamplingType:()=>J_,InvertStencilOp:()=>I_,KeepStencilOp:()=>gs,KeyframeTrack:()=>_n,LOD:()=>Yo,LatheGeometry:()=>ml,Layers:()=>or,LessCompare:()=>vp,LessDepth:()=>Oo,LessEqualCompare:()=>Dc,LessEqualDepth:()=>ys,LessEqualStencilFunc:()=>U_,LessStencilFunc:()=>L_,Light:()=>hi,LightProbe:()=>Bl,Line:()=>Bn,Line3:()=>zu,LineBasicMaterial:()=>Ve,LineCurve:()=>Ea,LineCurve3:()=>cl,LineDashedMaterial:()=>Rl,LineLoop:()=>jo,LineSegments:()=>zn,LinearFilter:()=>Me,LinearInterpolant:()=>Na,LinearMipMapLinearFilter:()=>p_,LinearMipMapNearestFilter:()=>d_,LinearMipmapLinearFilter:()=>pi,LinearMipmapNearestFilter:()=>Ya,LinearSRGBColorSpace:()=>fa,LinearToneMapping:()=>af,LinearTransfer:()=>da,Loader:()=>$e,LoaderUtils:()=>Ba,LoadingManager:()=>Fa,LoopOnce:()=>dp,LoopPingPong:()=>mp,LoopRepeat:()=>pp,MOUSE:()=>a_,Material:()=>He,MaterialBlending:()=>h_,MaterialLoader:()=>zl,MathUtils:()=>s0,Matrix2:()=>Ou,Matrix3:()=>Yt,Matrix4:()=>Gt,MaxEquation:()=>$d,Mesh:()=>$t,MeshBasicMaterial:()=>On,MeshDepthMaterial:()=>Da,MeshDistanceMaterial:()=>La,MeshLambertMaterial:()=>Al,MeshMatcapMaterial:()=>Cl,MeshNormalMaterial:()=>wl,MeshPhongMaterial:()=>Tl,MeshPhysicalMaterial:()=>bl,MeshStandardMaterial:()=>Ei,MeshToonMaterial:()=>El,MinEquation:()=>Jd,MirroredRepeatWrapping:()=>ca,MixOperation:()=>hp,MultiplyBlending:()=>rf,MultiplyOperation:()=>Ha,NearestFilter:()=>Pe,NearestMipMapLinearFilter:()=>f_,NearestMipMapNearestFilter:()=>u_,NearestMipmapLinearFilter:()=>br,NearestMipmapNearestFilter:()=>ff,NeutralToneMapping:()=>uf,NeverCompare:()=>xp,NeverDepth:()=>Uo,NeverStencilFunc:()=>D_,NoBlending:()=>fi,NoColorSpace:()=>Ri,NoNormalPacking:()=>S_,NoToneMapping:()=>Kn,NormalAnimationBlendMode:()=>Ic,NormalBlending:()=>vs,NormalGAPacking:()=>T_,NormalRGPacking:()=>b_,NotEqualCompare:()=>Sp,NotEqualDepth:()=>Vo,NotEqualStencilFunc:()=>O_,NumberKeyframeTrack:()=>ws,Object3D:()=>ce,ObjectLoader:()=>yu,ObjectSpaceNormalMap:()=>_p,OctahedronGeometry:()=>Pa,OneFactor:()=>Qd,OneMinusConstantAlphaFactor:()=>cp,OneMinusConstantColorFactor:()=>op,OneMinusDstAlphaFactor:()=>np,OneMinusDstColorFactor:()=>sp,OneMinusSrcAlphaFactor:()=>No,OneMinusSrcColorFactor:()=>tp,OrthographicCamera:()=>Is,PCFShadowMap:()=>Va,PCFSoftShadowMap:()=>Xd,PMREMGenerator:()=>Oc,Path:()=>mr,PerspectiveCamera:()=>Re,Plane:()=>si,PlaneGeometry:()=>Ji,PlaneHelper:()=>$u,PointLight:()=>vr,PointLightHelper:()=>Gu,Points:()=>fr,PointsMaterial:()=>Ts,PolarGridHelper:()=>Xu,PolyhedronGeometry:()=>Zi,PositionalAudio:()=>Eu,PropertyBinding:()=>fe,PropertyMixer:()=>ql,QuadraticBezierCurve:()=>wa,QuadraticBezierCurve3:()=>Aa,Quaternion:()=>Ze,QuaternionKeyframeTrack:()=>As,QuaternionLinearInterpolant:()=>Ll,R11_EAC_Format:()=>lc,RED_GREEN_RGTC2_Format:()=>to,RED_RGTC1_Format:()=>Cc,REVISION:()=>Gd,RG11_EAC_Format:()=>ja,RGBADepthPacking:()=>v_,RGBAFormat:()=>an,RGBAIntegerFormat:()=>tc,RGBA_ASTC_10x10_Format:()=>Sc,RGBA_ASTC_10x5_Format:()=>vc,RGBA_ASTC_10x6_Format:()=>yc,RGBA_ASTC_10x8_Format:()=>Mc,RGBA_ASTC_12x10_Format:()=>bc,RGBA_ASTC_12x12_Format:()=>Tc,RGBA_ASTC_4x4_Format:()=>uc,RGBA_ASTC_5x4_Format:()=>fc,RGBA_ASTC_5x5_Format:()=>dc,RGBA_ASTC_6x5_Format:()=>pc,RGBA_ASTC_6x6_Format:()=>mc,RGBA_ASTC_8x5_Format:()=>gc,RGBA_ASTC_8x6_Format:()=>_c,RGBA_ASTC_8x8_Format:()=>xc,RGBA_BPTC_Format:()=>Ec,RGBA_ETC2_EAC_Format:()=>oc,RGBA_PVRTC_2BPPV1_Format:()=>sc,RGBA_PVRTC_4BPPV1_Format:()=>ic,RGBA_S3TC_DXT1_Format:()=>$a,RGBA_S3TC_DXT3_Format:()=>Ka,RGBA_S3TC_DXT5_Format:()=>Qa,RGBDepthPacking:()=>y_,RGBFormat:()=>xf,RGBIntegerFormat:()=>m_,RGB_BPTC_SIGNED_Format:()=>wc,RGB_BPTC_UNSIGNED_Format:()=>Ac,RGB_ETC1_Format:()=>rc,RGB_ETC2_Format:()=>ac,RGB_PVRTC_2BPPV1_Format:()=>nc,RGB_PVRTC_4BPPV1_Format:()=>ec,RGB_S3TC_DXT1_Format:()=>Ja,RGDepthPacking:()=>M_,RGFormat:()=>ts,RGIntegerFormat:()=>jl,RawShaderMaterial:()=>Ia,Ray:()=>Xi,Raycaster:()=>Nu,RectAreaLight:()=>Ol,RedFormat:()=>Ql,RedIntegerFormat:()=>Za,ReinhardToneMapping:()=>of,RenderTarget:()=>_a,RenderTarget3D:()=>Ru,RepeatWrapping:()=>la,ReplaceStencilOp:()=>w_,ReverseSubtractEquation:()=>Zd,RingGeometry:()=>gl,SIGNED_R11_EAC_Format:()=>cc,SIGNED_RED_GREEN_RGTC2_Format:()=>Pc,SIGNED_RED_RGTC1_Format:()=>Rc,SIGNED_RG11_EAC_Format:()=>hc,SRGBColorSpace:()=>Je,SRGBTransfer:()=>he,Scene:()=>hr,ShaderChunk:()=>ee,ShaderLib:()=>gi,ShaderMaterial:()=>gn,ShadowMaterial:()=>Sl,Shape:()=>Si,ShapeGeometry:()=>_l,ShapePath:()=>ju,ShapeUtils:()=>Zn,ShortType:()=>pf,Skeleton:()=>Jo,SkeletonHelper:()=>Vu,SkinnedMesh:()=>Zo,Source:()=>ai,Sphere:()=>ke,SphereGeometry:()=>$i,Spherical:()=>Uu,SphericalHarmonics3:()=>Oa,SplineCurve:()=>Ca,SpotLight:()=>Fl,SpotLightHelper:()=>ku,Sprite:()=>qo,SpriteMaterial:()=>ya,SrcAlphaFactor:()=>Lo,SrcAlphaSaturateFactor:()=>rp,SrcColorFactor:()=>jd,StaticCopyUsage:()=>W_,StaticDrawUsage:()=>pa,StaticReadUsage:()=>V_,StereoCamera:()=>bu,StreamCopyUsage:()=>q_,StreamDrawUsage:()=>k_,StreamReadUsage:()=>H_,StringKeyframeTrack:()=>Ai,SubtractEquation:()=>Yd,SubtractiveBlending:()=>sf,TOUCH:()=>o_,TangentSpaceNormalMap:()=>Ci,TetrahedronGeometry:()=>xl,Texture:()=>Ie,TextureLoader:()=>vu,TextureUtils:()=>ef,Timer:()=>Wl,TimestampQuery:()=>Z_,TorusGeometry:()=>ci,TorusKnotGeometry:()=>vl,Triangle:()=>ri,TriangleFanDrawMode:()=>x_,TriangleStripDrawMode:()=>__,TrianglesDrawMode:()=>g_,TubeGeometry:()=>yl,UVMapping:()=>Zl,Uint16BufferAttribute:()=>xa,Uint32BufferAttribute:()=>va,Uint8BufferAttribute:()=>tu,Uint8ClampedBufferAttribute:()=>eu,Uniform:()=>Pu,UniformsGroup:()=>Iu,UniformsLib:()=>xt,UniformsUtils:()=>Cp,UnsignedByteType:()=>xn,UnsignedInt101111Type:()=>gf,UnsignedInt248Type:()=>Er,UnsignedInt5999Type:()=>mf,UnsignedIntType:()=>Vn,UnsignedShort4444Type:()=>$l,UnsignedShort5551Type:()=>Kl,UnsignedShortType:()=>Tr,VSMShadowMap:()=>Mr,Vector2:()=>Q,Vector3:()=>I,Vector4:()=>de,VectorKeyframeTrack:()=>Cs,VideoFrameTexture:()=>ou,VideoTexture:()=>tl,WebGL3DRenderTarget:()=>Kh,WebGLArrayRenderTarget:()=>$h,WebGLCoordinateSystem:()=>bn,WebGLCubeRenderTarget:()=>Bc,WebGLRenderTarget:()=>on,WebGLRenderer:()=>zc,WebGLUtils:()=>V0,WebGPUCoordinateSystem:()=>Ms,WebXRController:()=>lr,WireframeGeometry:()=>Ml,WrapAroundEnding:()=>ua,ZeroCurvatureEnding:()=>_s,ZeroFactor:()=>Kd,ZeroSlopeEnding:()=>xs,ZeroStencilOp:()=>E_,createCanvasElement:()=>Tp,error:()=>Rt,getConsoleFunction:()=>t0,log:()=>ga,setConsoleFunction:()=>j_,warn:()=>ft,warnOnce:()=>Ho});var Gd="184",a_={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},o_={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hd=0,nf=1,Wd=2,l_=3,c_=0,Va=1,Xd=2,Mr=3,bi=0,ln=1,ui=2,fi=0,vs=1,Ga=2,sf=3,rf=4,qd=5,h_=6,Wi=100,Yd=101,Zd=102,Jd=103,$d=104,Kd=200,Qd=201,jd=202,tp=203,Lo=204,No=205,ep=206,np=207,ip=208,sp=209,rp=210,ap=211,op=212,lp=213,cp=214,Uo=0,Fo=1,Oo=2,ys=3,Bo=4,zo=5,ko=6,Vo=7,Ha=0,hp=1,up=2,Kn=0,af=1,of=2,lf=3,Wa=4,cf=5,hf=6,uf=7,Yh="attached",fp="detached",Zl=300,di=301,Qi=302,Xa=303,qa=304,Sr=306,la=1e3,mn=1001,ca=1002,Pe=1003,ff=1004,u_=1004,br=1005,f_=1005,Me=1006,Ya=1007,d_=1007,pi=1008,p_=1008,xn=1009,df=1010,pf=1011,Tr=1012,Jl=1013,Vn=1014,rn=1015,mi=1016,$l=1017,Kl=1018,Er=1020,mf=35902,gf=35899,_f=1021,xf=1022,an=1023,li=1026,ji=1027,Ql=1028,Za=1029,ts=1030,jl=1031,m_=1032,tc=1033,Ja=33776,$a=33777,Ka=33778,Qa=33779,ec=35840,nc=35841,ic=35842,sc=35843,rc=36196,ac=37492,oc=37496,lc=37488,cc=37489,ja=37490,hc=37491,uc=37808,fc=37809,dc=37810,pc=37811,mc=37812,gc=37813,_c=37814,xc=37815,vc=37816,yc=37817,Mc=37818,Sc=37819,bc=37820,Tc=37821,Ec=36492,wc=36494,Ac=36495,Cc=36283,Rc=36284,to=36285,Pc=36286,dp=2200,pp=2201,mp=2202,ha=2300,Go=2301,Ro=2302,Zh=2303,_s=2400,xs=2401,ua=2402,Ic=2500,vf=2501,g_=0,__=1,x_=2,gp=3200,v_=3201,y_=3202,M_=3203,Ci=0,_p=1,Ri="",Je="srgb",fa="srgb-linear",da="linear",he="srgb",S_="",b_="rg",T_="ga",E_=0,gs=7680,w_=7681,A_=7682,C_=7683,R_=34055,P_=34056,I_=5386,D_=512,L_=513,N_=514,U_=515,F_=516,O_=517,B_=518,Jh=519,xp=512,vp=513,yp=514,Dc=515,Mp=516,Sp=517,Lc=518,bp=519,pa=35044,z_=35048,k_=35040,V_=35045,G_=35049,H_=35041,W_=35046,X_=35050,q_=35042,Y_="100",yf="300 es",bn=2e3,Ms=2001,Z_={COMPUTE:"compute",RENDER:"render"},J_={PERSPECTIVE:"perspective",LINEAR:"linear",FLAT:"flat"},$_={NORMAL:"normal",CENTROID:"centroid",SAMPLE:"sample",FIRST:"first",EITHER:"either"},K_={TEXTURE_COMPARE:"depthTextureCompare"};function lv(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}var cv={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function aa(r,t){return new cv[r](t)}function Q_(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function ma(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function Tp(){let r=ma("canvas");return r.style.display="block",r}var Km={},Ss=null;function j_(r){Ss=r}function t0(){return Ss}function ga(...r){let t="THREE."+r.shift();Ss?Ss("log",t,...r):console.log(t,...r)}function e0(r){let t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=r[1];e&&e.isStackTrace?r[0]+=" "+e.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function ft(...r){r=e0(r);let t="THREE."+r.shift();if(Ss)Ss("warn",t,...r);else{let e=r[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...r)}}function Rt(...r){r=e0(r);let t="THREE."+r.shift();if(Ss)Ss("error",t,...r);else{let e=r[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...r)}}function Ho(...r){let t=r.join(" ");t in Km||(Km[t]=!0,ft(...r))}function n0(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var i0={[Uo]:Fo,[Oo]:ko,[Bo]:Vo,[ys]:zo,[Fo]:Uo,[ko]:Oo,[Vo]:Bo,[zo]:ys},En=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let s=0,a=i.length;s<a;s++)i[s].call(this,t);t.target=null}}},tn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Qm=1234567,ir=Math.PI/180,sr=180/Math.PI;function Fn(){let r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(tn[r&255]+tn[r>>8&255]+tn[r>>16&255]+tn[r>>24&255]+"-"+tn[t&255]+tn[t>>8&255]+"-"+tn[t>>16&15|64]+tn[t>>24&255]+"-"+tn[e&63|128]+tn[e>>8&255]+"-"+tn[e>>16&255]+tn[e>>24&255]+tn[n&255]+tn[n>>8&255]+tn[n>>16&255]+tn[n>>24&255]).toLowerCase()}function zt(r,t,e){return Math.max(t,Math.min(e,r))}function Ep(r,t){return(r%t+t)%t}function hv(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function uv(r,t,e){return r!==t?(e-r)/(t-r):0}function Po(r,t,e){return(1-e)*r+e*t}function fv(r,t,e,n){return Po(r,t,1-Math.exp(-e*n))}function dv(r,t=1){return t-Math.abs(Ep(r,t*2)-t)}function pv(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function mv(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function gv(r,t){return r+Math.floor(Math.random()*(t-r+1))}function _v(r,t){return r+Math.random()*(t-r)}function xv(r){return r*(.5-Math.random())}function vv(r){r!==void 0&&(Qm=r);let t=Qm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function yv(r){return r*ir}function Mv(r){return r*sr}function Sv(r){return(r&r-1)===0&&r!==0}function bv(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function Tv(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function Ev(r,t,e,n,i){let s=Math.cos,a=Math.sin,o=s(e/2),l=a(e/2),c=s((t+n)/2),h=a((t+n)/2),f=s((t-n)/2),u=a((t-n)/2),d=s((n-t)/2),p=a((n-t)/2);switch(i){case"XYX":r.set(o*h,l*f,l*u,o*c);break;case"YZY":r.set(l*u,o*h,l*f,o*c);break;case"ZXZ":r.set(l*f,l*u,o*h,o*c);break;case"XZX":r.set(o*h,l*p,l*d,o*c);break;case"YXY":r.set(l*d,o*h,l*p,o*c);break;case"ZYZ":r.set(l*p,l*d,o*h,o*c);break;default:ft("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function pn(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function jt(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var s0={DEG2RAD:ir,RAD2DEG:sr,generateUUID:Fn,clamp:zt,euclideanModulo:Ep,mapLinear:hv,inverseLerp:uv,lerp:Po,damp:fv,pingpong:dv,smoothstep:pv,smootherstep:mv,randInt:gv,randFloat:_v,randFloatSpread:xv,seededRandom:vv,degToRad:yv,radToDeg:Mv,isPowerOfTwo:Sv,ceilPowerOfTwo:bv,floorPowerOfTwo:Tv,setQuaternionFromProperEuler:Ev,normalize:jt,denormalize:pn},Q=class r{static{r.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*i+t.x,this.y=s*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ze=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3],u=s[a+0],d=s[a+1],p=s[a+2],_=s[a+3];if(f!==_||l!==u||c!==d||h!==p){let m=l*u+c*d+h*p+f*_;m<0&&(u=-u,d=-d,p=-p,_=-_,m=-m);let g=1-o;if(m<.9995){let x=Math.acos(m),v=Math.sin(x);g=Math.sin(g*x)/v,o=Math.sin(o*x)/v,l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+_*o}else{l=l*g+u*o,c=c*g+d*o,h=h*g+p*o,f=f*g+_*o;let x=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=x,c*=x,h*=x,f*=x}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,s,a){let o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=s[a],u=s[a+1],d=s[a+2],p=s[a+3];return t[e]=o*p+h*f+l*d-c*u,t[e+1]=l*p+h*u+c*f-o*d,t[e+2]=c*p+h*d+o*u-l*f,t[e+3]=h*p-o*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),f=o(s/2),u=l(n/2),d=l(i/2),p=l(s/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:ft("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+o+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(s-c)*d,this._z=(a-i)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(s+c)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(s-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-i)/d,this._x=(s+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(zt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+a*o+i*c-s*l,this._y=i*h+a*l+s*o-n*c,this._z=s*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,s=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,s=-s,a=-a,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},I=class r{static{r.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(jm.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(jm.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),h=2*(o*e-s*i),f=2*(s*n-a*e);return this.x=e+l*c+a*f-o*h,this.y=n+l*h+o*c-s*f,this.z=i+l*f+s*h-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-s*o,this.y=s*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return qf.copy(this).projectOnVector(t),this.sub(qf)}reflect(t){return this.sub(qf.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(zt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},qf=new I,jm=new Ze,Yt=class r{static{r.prototype.isMatrix3=!0}constructor(t,e,n,i,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,l,c)}set(t,e,n,i,s,a,o,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=o,h[3]=e,h[4]=s,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],p=n[8],_=i[0],m=i[3],g=i[6],x=i[1],v=i[4],M=i[7],E=i[2],S=i[5],w=i[8];return s[0]=a*_+o*x+l*E,s[3]=a*m+o*v+l*S,s[6]=a*g+o*M+l*w,s[1]=c*_+h*x+f*E,s[4]=c*m+h*v+f*S,s[7]=c*g+h*M+f*w,s[2]=u*_+d*x+p*E,s[5]=u*m+d*v+p*S,s[8]=u*g+d*M+p*w,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*a*h-e*o*c-n*s*h+n*o*l+i*s*c-i*a*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=h*a-o*c,u=o*l-h*s,d=c*s-a*l,p=e*f+n*u+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/p;return t[0]=f*_,t[1]=(i*c-h*n)*_,t[2]=(o*n-i*a)*_,t[3]=u*_,t[4]=(h*e-i*l)*_,t[5]=(i*s-o*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*s)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,a,o){let l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Yf.makeScale(t,e)),this}rotate(t){return this.premultiply(Yf.makeRotation(-t)),this}translate(t,e){return this.premultiply(Yf.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Yf=new Yt,tg=new Yt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),eg=new Yt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function wv(){let r={enabled:!0,workingColorSpace:fa,spaces:{},convert:function(i,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===he&&(i.r=Hi(i.r),i.g=Hi(i.g),i.b=Hi(i.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===he&&(i.r=oa(i.r),i.g=oa(i.g),i.b=oa(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ri?da:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,a){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Ho("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Ho("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[fa]:{primaries:t,whitePoint:n,transfer:da,toXYZ:tg,fromXYZ:eg,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:t,whitePoint:n,transfer:he,toXYZ:tg,fromXYZ:eg,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),r}var ie=wv();function Hi(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function oa(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var kr,Wo=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{kr===void 0&&(kr=ma("canvas")),kr.width=t.width,kr.height=t.height;let i=kr.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=kr}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ma("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let a=0;a<s.length;a++)s[a]=Hi(s[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Hi(e[n]/255)*255):e[n]=Hi(e[n]);return{data:e,width:t.width,height:t.height}}else return ft("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Av=0,ai=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Av++}),this.uuid=Fn(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?s.push(Zf(i[a].image)):s.push(Zf(i[a]))}else s=Zf(i);n.url=s}return e||(t.images[this.uuid]=n),n}};function Zf(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Wo.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(ft("Texture: Unable to serialize Texture."),{})}var Cv=0,Jf=new I,Ie=class r extends En{constructor(t=r.DEFAULT_IMAGE,e=r.DEFAULT_MAPPING,n=mn,i=mn,s=Me,a=pi,o=an,l=xn,c=r.DEFAULT_ANISOTROPY,h=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cv++}),this.uuid=Fn(),this.name="",this.source=new ai(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Q(0,0),this.repeat=new Q(1,1),this.center=new Q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Yt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Jf).x}get height(){return this.source.getSize(Jf).y}get depth(){return this.source.getSize(Jf).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){ft(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){ft(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Zl)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case la:t.x=t.x-Math.floor(t.x);break;case mn:t.x=t.x<0?0:1;break;case ca:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case la:t.y=t.y-Math.floor(t.y);break;case mn:t.y=t.y<0?0:1;break;case ca:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ie.DEFAULT_IMAGE=null;Ie.DEFAULT_MAPPING=Zl;Ie.DEFAULT_ANISOTROPY=1;var de=class r{static{r.prototype.isVector4=!0}constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],_=l[2],m=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-_)<.01&&Math.abs(p-m)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+_)<.1&&Math.abs(p+m)<.1&&Math.abs(c+d+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(c+1)/2,M=(d+1)/2,E=(g+1)/2,S=(h+u)/4,w=(f+_)/4,y=(p+m)/4;return v>M&&v>E?v<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(v),i=S/n,s=w/n):M>E?M<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(M),n=S/i,s=y/i):E<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(E),n=w/s,i=y/s),this.set(n,i,s,e),this}let x=Math.sqrt((m-p)*(m-p)+(f-_)*(f-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(m-p)/x,this.y=(f-_)/x,this.z=(u-h)/x,this.w=Math.acos((c+d+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=zt(this.x,t.x,e.x),this.y=zt(this.y,t.y,e.y),this.z=zt(this.z,t.z,e.z),this.w=zt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=zt(this.x,t,e),this.y=zt(this.y,t,e),this.z=zt(this.z,t,e),this.w=zt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(zt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},_a=class extends En{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Me,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new de(0,0,t,e),this.scissorTest=!1,this.viewport=new de(0,0,t,e),this.textures=[];let i={width:t,height:e,depth:n.depth},s=new Ie(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){let e={minFilter:Me,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new ai(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}},on=class extends _a{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},rr=class extends Ie{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},$h=class extends on{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new rr(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}},ar=class extends Ie{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Pe,this.minFilter=Pe,this.wrapR=mn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Kh=class extends on{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new ar(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}},Gt=class r{static{r.prototype.isMatrix4=!0}constructor(t,e,n,i,s,a,o,l,c,h,f,u,d,p,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,a,o,l,c,h,f,u,d,p,_,m)}set(t,e,n,i,s,a,o,l,c,h,f,u,d,p,_,m){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=s,g[5]=a,g[9]=o,g[13]=l,g[2]=c,g[6]=h,g[10]=f,g[14]=u,g[3]=d,g[7]=p,g[11]=_,g[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();let e=this.elements,n=t.elements,i=1/Vr.setFromMatrixColumn(t,0).length(),s=1/Vr.setFromMatrixColumn(t,1).length(),a=1/Vr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){let u=a*h,d=a*f,p=o*h,_=o*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+p*c,e[5]=u-_*c,e[9]=-o*l,e[2]=_-u*c,e[6]=p+d*c,e[10]=a*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,p=c*h,_=c*f;e[0]=u+_*o,e[4]=p*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*h,e[9]=-o,e[2]=d*o-p,e[6]=_+u*o,e[10]=a*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,p=c*h,_=c*f;e[0]=u-_*o,e[4]=-a*f,e[8]=p+d*o,e[1]=d+p*o,e[5]=a*h,e[9]=_-u*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let u=a*h,d=a*f,p=o*h,_=o*f;e[0]=l*h,e[4]=p*c-d,e[8]=u*c+_,e[1]=l*f,e[5]=_*c+u,e[9]=d*c-p,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let u=a*l,d=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=_-u*f,e[8]=p*f+d,e[1]=f,e[5]=a*h,e[9]=-o*h,e[2]=-c*h,e[6]=d*f+p,e[10]=u-_*f}else if(t.order==="XZY"){let u=a*l,d=a*c,p=o*l,_=o*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+_,e[5]=a*h,e[9]=d*f-p,e[2]=p*f-d,e[6]=o*h,e[10]=_*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Rv,t,Pv)}lookAt(t,e,n){let i=this.elements;return Nn.subVectors(t,e),Nn.lengthSq()===0&&(Nn.z=1),Nn.normalize(),cs.crossVectors(n,Nn),cs.lengthSq()===0&&(Math.abs(n.z)===1?Nn.x+=1e-4:Nn.z+=1e-4,Nn.normalize(),cs.crossVectors(n,Nn)),cs.normalize(),sh.crossVectors(Nn,cs),i[0]=cs.x,i[4]=sh.x,i[8]=Nn.x,i[1]=cs.y,i[5]=sh.y,i[9]=Nn.y,i[2]=cs.z,i[6]=sh.z,i[10]=Nn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],p=n[2],_=n[6],m=n[10],g=n[14],x=n[3],v=n[7],M=n[11],E=n[15],S=i[0],w=i[4],y=i[8],T=i[12],R=i[1],P=i[5],U=i[9],z=i[13],k=i[2],D=i[6],F=i[10],L=i[14],W=i[3],q=i[7],et=i[11],lt=i[15];return s[0]=a*S+o*R+l*k+c*W,s[4]=a*w+o*P+l*D+c*q,s[8]=a*y+o*U+l*F+c*et,s[12]=a*T+o*z+l*L+c*lt,s[1]=h*S+f*R+u*k+d*W,s[5]=h*w+f*P+u*D+d*q,s[9]=h*y+f*U+u*F+d*et,s[13]=h*T+f*z+u*L+d*lt,s[2]=p*S+_*R+m*k+g*W,s[6]=p*w+_*P+m*D+g*q,s[10]=p*y+_*U+m*F+g*et,s[14]=p*T+_*z+m*L+g*lt,s[3]=x*S+v*R+M*k+E*W,s[7]=x*w+v*P+M*D+E*q,s[11]=x*y+v*U+M*F+E*et,s[15]=x*T+v*z+M*L+E*lt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],p=t[3],_=t[7],m=t[11],g=t[15],x=l*d-c*u,v=o*d-c*f,M=o*u-l*f,E=a*d-c*h,S=a*u-l*h,w=a*f-o*h;return e*(_*x-m*v+g*M)-n*(p*x-m*E+g*S)+i*(p*v-_*E+g*w)-s*(p*M-_*S+m*w)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],p=t[12],_=t[13],m=t[14],g=t[15],x=e*o-n*a,v=e*l-i*a,M=e*c-s*a,E=n*l-i*o,S=n*c-s*o,w=i*c-s*l,y=h*_-f*p,T=h*m-u*p,R=h*g-d*p,P=f*m-u*_,U=f*g-d*_,z=u*g-d*m,k=x*z-v*U+M*P+E*R-S*T+w*y;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/k;return t[0]=(o*z-l*U+c*P)*D,t[1]=(i*U-n*z-s*P)*D,t[2]=(_*w-m*S+g*E)*D,t[3]=(u*S-f*w-d*E)*D,t[4]=(l*R-a*z-c*T)*D,t[5]=(e*z-i*R+s*T)*D,t[6]=(m*M-p*w-g*v)*D,t[7]=(h*w-u*M+d*v)*D,t[8]=(a*U-o*R+c*y)*D,t[9]=(n*R-e*U-s*y)*D,t[10]=(p*S-_*M+g*x)*D,t[11]=(f*M-h*S-d*x)*D,t[12]=(o*T-a*P-l*y)*D,t[13]=(e*P-n*T+i*y)*D,t[14]=(_*v-p*E-m*x)*D,t[15]=(h*E-f*v+u*x)*D,this}scale(t){let e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),s=1-n,a=t.x,o=t.y,l=t.z,c=s*a,h=s*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,a){return this.set(1,n,s,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,h=a+a,f=o+o,u=s*c,d=s*h,p=s*f,_=a*h,m=a*f,g=o*f,x=l*c,v=l*h,M=l*f,E=n.x,S=n.y,w=n.z;return i[0]=(1-(_+g))*E,i[1]=(d+M)*E,i[2]=(p-v)*E,i[3]=0,i[4]=(d-M)*S,i[5]=(1-(u+g))*S,i[6]=(m+x)*S,i[7]=0,i[8]=(p+v)*w,i[9]=(m-x)*w,i[10]=(1-(u+_))*w,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let s=this.determinant();if(s===0)return n.set(1,1,1),e.identity(),this;let a=Vr.set(i[0],i[1],i[2]).length(),o=Vr.set(i[4],i[5],i[6]).length(),l=Vr.set(i[8],i[9],i[10]).length();s<0&&(a=-a),ei.copy(this);let c=1/a,h=1/o,f=1/l;return ei.elements[0]*=c,ei.elements[1]*=c,ei.elements[2]*=c,ei.elements[4]*=h,ei.elements[5]*=h,ei.elements[6]*=h,ei.elements[8]*=f,ei.elements[9]*=f,ei.elements[10]*=f,e.setFromRotationMatrix(ei),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,s,a,o=bn,l=!1){let c=this.elements,h=2*s/(e-t),f=2*s/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i),p,_;if(l)p=s/(a-s),_=a*s/(a-s);else if(o===bn)p=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Ms)p=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,a,o=bn,l=!1){let c=this.elements,h=2/(e-t),f=2/(n-i),u=-(e+t)/(e-t),d=-(n+i)/(n-i),p,_;if(l)p=1/(a-s),_=a/(a-s);else if(o===bn)p=-2/(a-s),_=-(a+s)/(a-s);else if(o===Ms)p=-1/(a-s),_=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Vr=new I,ei=new Gt,Rv=new I(0,0,0),Pv=new I(1,1,1),cs=new I,sh=new I,Nn=new I,ng=new Gt,ig=new Ze,Jn=class r{constructor(t=0,e=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,s=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],f=i[2],u=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(zt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-zt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(zt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-zt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(zt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-zt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:ft("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ng.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ng,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ig.setFromEuler(this),this.setFromQuaternion(ig,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Jn.DEFAULT_ORDER="XYZ";var or=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Iv=0,sg=new I,Gr=new Ze,Fi=new Gt,rh=new I,mo=new I,Dv=new I,Lv=new Ze,rg=new I(1,0,0),ag=new I(0,1,0),og=new I(0,0,1),lg={type:"added"},Nv={type:"removed"},Hr={type:"childadded",child:null},$f={type:"childremoved",child:null},ce=class r extends En{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Iv++}),this.uuid=Fn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let t=new I,e=new Jn,n=new Ze,i=new I(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Gt},normalMatrix:{value:new Yt}}),this.matrix=new Gt,this.matrixWorld=new Gt,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new or,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.multiply(Gr),this}rotateOnWorldAxis(t,e){return Gr.setFromAxisAngle(t,e),this.quaternion.premultiply(Gr),this}rotateX(t){return this.rotateOnAxis(rg,t)}rotateY(t){return this.rotateOnAxis(ag,t)}rotateZ(t){return this.rotateOnAxis(og,t)}translateOnAxis(t,e){return sg.copy(t).applyQuaternion(this.quaternion),this.position.add(sg.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(rg,t)}translateY(t){return this.translateOnAxis(ag,t)}translateZ(t){return this.translateOnAxis(og,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Fi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?rh.copy(t):rh.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),mo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fi.lookAt(mo,rh,this.up):Fi.lookAt(rh,mo,this.up),this.quaternion.setFromRotationMatrix(Fi),i&&(Fi.extractRotation(i.matrixWorld),Gr.setFromRotationMatrix(Fi),this.quaternion.premultiply(Gr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Rt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(lg),Hr.child=t,this.dispatchEvent(Hr),Hr.child=null):Rt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Nv),$f.child=t,this.dispatchEvent($f),$f.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Fi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Fi.multiply(t.parent.matrixWorld)),t.applyMatrix4(Fi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(lg),Hr.child=t,this.dispatchEvent(Hr),Hr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,t,Dv),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(mo,Lv,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*n-s[8]*i,s[13]+=n-s[1]*e-s[5]*n-s[9]*i,s[14]+=i-s[2]*e-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let s=0,a=i.length;s<a;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];s(t.shapes,f)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));i.material=o}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];i.animations.push(s(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),c=a(t.textures),h=a(t.images),f=a(t.shapes),u=a(t.skeletons),d=a(t.animations),p=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};ce.DEFAULT_UP=new I(0,1,0);ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var sn=class extends ce{constructor(){super(),this.isGroup=!0,this.type="Group"}},Uv={type:"move"},lr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new sn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new sn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new sn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,a=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(let _ of t.hand.values()){let m=e.getJointPose(_,n),g=this._getHandJoint(c,_);m!==null&&(g.matrix.fromArray(m.transform.matrix),g.matrix.decompose(g.position,g.rotation,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=m.radius),g.visible=m!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Uv)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new sn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},r0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},hs={h:0,s:0,l:0},ah={h:0,s:0,l:0};function Kf(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}var bt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Je){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ie.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ie.workingColorSpace){return this.r=t,this.g=e,this.b=n,ie.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ie.workingColorSpace){if(t=Ep(t,1),e=zt(e,0,1),n=zt(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Kf(a,s,t+1/3),this.g=Kf(a,s,t),this.b=Kf(a,s,t-1/3)}return ie.colorSpaceToWorking(this,i),this}setStyle(t,e=Je){function n(s){s!==void 0&&parseFloat(s)<1&&ft("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:ft("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=i[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);ft("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Je){let n=r0[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ft("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Hi(t.r),this.g=Hi(t.g),this.b=Hi(t.b),this}copyLinearToSRGB(t){return this.r=oa(t.r),this.g=oa(t.g),this.b=oa(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Je){return ie.workingToColorSpace(en.copy(this),t),Math.round(zt(en.r*255,0,255))*65536+Math.round(zt(en.g*255,0,255))*256+Math.round(zt(en.b*255,0,255))}getHexString(t=Je){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ie.workingColorSpace){ie.workingToColorSpace(en.copy(this),e);let n=en.r,i=en.g,s=en.b,a=Math.max(n,i,s),o=Math.min(n,i,s),l,c,h=(o+a)/2;if(o===a)l=0,c=0;else{let f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(i-s)/f+(i<s?6:0);break;case i:l=(s-n)/f+2;break;case s:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ie.workingColorSpace){return ie.workingToColorSpace(en.copy(this),e),t.r=en.r,t.g=en.g,t.b=en.b,t}getStyle(t=Je){ie.workingToColorSpace(en.copy(this),t);let e=en.r,n=en.g,i=en.b;return t!==Je?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(hs),this.setHSL(hs.h+t,hs.s+e,hs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(hs),t.getHSL(ah);let n=Po(hs.h,ah.h,e),i=Po(hs.s,ah.s,e),s=Po(hs.l,ah.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new bt;bt.NAMES=r0;var cr=class r{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new bt(t),this.density=e}clone(){return new r(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},Xo=class r{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new bt(t),this.near=e,this.far=n}clone(){return new r(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},hr=class extends ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Jn,this.environmentIntensity=1,this.environmentRotation=new Jn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},ni=new I,Oi=new I,Qf=new I,Bi=new I,Wr=new I,Xr=new I,cg=new I,jf=new I,td=new I,ed=new I,nd=new de,id=new de,sd=new de,ri=class r{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),ni.subVectors(t,e),i.cross(ni);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){ni.subVectors(i,e),Oi.subVectors(n,e),Qf.subVectors(t,e);let a=ni.dot(ni),o=ni.dot(Oi),l=ni.dot(Qf),c=Oi.dot(Oi),h=Oi.dot(Qf),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;let u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return s.set(1-d-p,p,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(t,e,n,i,s,a,o,l){return this.getBarycoord(t,e,n,i,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bi.x),l.addScaledVector(a,Bi.y),l.addScaledVector(o,Bi.z),l)}static getInterpolatedAttribute(t,e,n,i,s,a){return nd.setScalar(0),id.setScalar(0),sd.setScalar(0),nd.fromBufferAttribute(t,e),id.fromBufferAttribute(t,n),sd.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(nd,s.x),a.addScaledVector(id,s.y),a.addScaledVector(sd,s.z),a}static isFrontFacing(t,e,n,i){return ni.subVectors(n,e),Oi.subVectors(t,e),ni.cross(Oi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ni.subVectors(this.c,this.b),Oi.subVectors(this.a,this.b),ni.cross(Oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return r.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return r.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return r.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return r.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return r.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,s=this.c,a,o;Wr.subVectors(i,n),Xr.subVectors(s,n),jf.subVectors(t,n);let l=Wr.dot(jf),c=Xr.dot(jf);if(l<=0&&c<=0)return e.copy(n);td.subVectors(t,i);let h=Wr.dot(td),f=Xr.dot(td);if(h>=0&&f<=h)return e.copy(i);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),e.copy(n).addScaledVector(Wr,a);ed.subVectors(t,s);let d=Wr.dot(ed),p=Xr.dot(ed);if(p>=0&&d<=p)return e.copy(s);let _=d*c-l*p;if(_<=0&&c>=0&&p<=0)return o=c/(c-p),e.copy(n).addScaledVector(Xr,o);let m=h*p-d*f;if(m<=0&&f-h>=0&&d-p>=0)return cg.subVectors(s,i),o=(f-h)/(f-h+(d-p)),e.copy(i).addScaledVector(cg,o);let g=1/(m+_+u);return a=_*g,o=u*g,e.copy(n).addScaledVector(Wr,a).addScaledVector(Xr,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Ge=class{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,ii):ii.fromBufferAttribute(s,a),ii.applyMatrix4(t.matrixWorld),this.expandByPoint(ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),oh.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),oh.copy(n.boundingBox)),oh.applyMatrix4(t.matrixWorld),this.union(oh)}let i=t.children;for(let s=0,a=i.length;s<a;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ii),ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(go),lh.subVectors(this.max,go),qr.subVectors(t.a,go),Yr.subVectors(t.b,go),Zr.subVectors(t.c,go),us.subVectors(Yr,qr),fs.subVectors(Zr,Yr),Ws.subVectors(qr,Zr);let e=[0,-us.z,us.y,0,-fs.z,fs.y,0,-Ws.z,Ws.y,us.z,0,-us.x,fs.z,0,-fs.x,Ws.z,0,-Ws.x,-us.y,us.x,0,-fs.y,fs.x,0,-Ws.y,Ws.x,0];return!rd(e,qr,Yr,Zr,lh)||(e=[1,0,0,0,1,0,0,0,1],!rd(e,qr,Yr,Zr,lh))?!1:(ch.crossVectors(us,fs),e=[ch.x,ch.y,ch.z],rd(e,qr,Yr,Zr,lh))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(zi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},zi=[new I,new I,new I,new I,new I,new I,new I,new I],ii=new I,oh=new Ge,qr=new I,Yr=new I,Zr=new I,us=new I,fs=new I,Ws=new I,go=new I,lh=new I,ch=new I,Xs=new I;function rd(r,t,e,n,i){for(let s=0,a=r.length-3;s<=a;s+=3){Xs.fromArray(r,s);let o=i.x*Math.abs(Xs.x)+i.y*Math.abs(Xs.y)+i.z*Math.abs(Xs.z),l=t.dot(Xs),c=e.dot(Xs),h=n.dot(Xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Gi=Fv();function Fv(){let r=new ArrayBuffer(4),t=new Float32Array(r),e=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}let s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:a,offsetTable:o}}function Sn(r){Math.abs(r)>65504&&ft("DataUtils.toHalfFloat(): Value out of range."),r=zt(r,-65504,65504),Gi.floatView[0]=r;let t=Gi.uint32View[0],e=t>>23&511;return Gi.baseTable[e]+((t&8388607)>>Gi.shiftTable[e])}function Ao(r){let t=r>>10;return Gi.uint32View[0]=Gi.mantissaTable[Gi.offsetTable[t]+(r&1023)]+Gi.exponentTable[t],Gi.floatView[0]}var Qh=class{static toHalfFloat(t){return Sn(t)}static fromHalfFloat(t){return Ao(t)}},ze=new I,hh=new Q,Ov=0,oe=class extends En{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ov++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=pa,this.updateRanges=[],this.gpuType=rn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)hh.fromBufferAttribute(this,e),hh.applyMatrix3(t),this.setXY(e,hh.x,hh.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=jt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=pn(e,this.array)),e}setX(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=pn(e,this.array)),e}setY(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=pn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=pn(e,this.array)),e}setW(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array),s=jt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==pa&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}},jh=class extends oe{constructor(t,e,n){super(new Int8Array(t),e,n)}},tu=class extends oe{constructor(t,e,n){super(new Uint8Array(t),e,n)}},eu=class extends oe{constructor(t,e,n){super(new Uint8ClampedArray(t),e,n)}},nu=class extends oe{constructor(t,e,n){super(new Int16Array(t),e,n)}},xa=class extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n)}},iu=class extends oe{constructor(t,e,n){super(new Int32Array(t),e,n)}},va=class extends oe{constructor(t,e,n){super(new Uint32Array(t),e,n)}},su=class extends oe{constructor(t,e,n){super(new Uint16Array(t),e,n),this.isFloat16BufferAttribute=!0}getX(t){let e=Ao(this.array[t*this.itemSize]);return this.normalized&&(e=pn(e,this.array)),e}setX(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize]=Sn(e),this}getY(t){let e=Ao(this.array[t*this.itemSize+1]);return this.normalized&&(e=pn(e,this.array)),e}setY(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+1]=Sn(e),this}getZ(t){let e=Ao(this.array[t*this.itemSize+2]);return this.normalized&&(e=pn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+2]=Sn(e),this}getW(t){let e=Ao(this.array[t*this.itemSize+3]);return this.normalized&&(e=pn(e,this.array)),e}setW(t,e){return this.normalized&&(e=jt(e,this.array)),this.array[t*this.itemSize+3]=Sn(e),this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array)),this.array[t+0]=Sn(e),this.array[t+1]=Sn(n),this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array)),this.array[t+0]=Sn(e),this.array[t+1]=Sn(n),this.array[t+2]=Sn(i),this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array),s=jt(s,this.array)),this.array[t+0]=Sn(e),this.array[t+1]=Sn(n),this.array[t+2]=Sn(i),this.array[t+3]=Sn(s),this}},Et=class extends oe{constructor(t,e,n){super(new Float32Array(t),e,n)}},Bv=new Ge,_o=new I,ad=new I,ke=class{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Bv.setFromPoints(t).getCenter(n);let i=0;for(let s=0,a=t.length;s<a;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_o.subVectors(t,this.center);let e=_o.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(_o,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ad.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_o.copy(t.center).add(ad)),this.expandByPoint(_o.copy(t.center).sub(ad))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},zv=0,Yn=new Gt,od=new ce,Jr=new I,Un=new Ge,xo=new Ge,Ye=new I,Ht=class r extends En{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zv++}),this.uuid=Fn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(lv(t)?va:xa)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Yt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Yn.makeRotationFromQuaternion(t),this.applyMatrix4(Yn),this}rotateX(t){return Yn.makeRotationX(t),this.applyMatrix4(Yn),this}rotateY(t){return Yn.makeRotationY(t),this.applyMatrix4(Yn),this}rotateZ(t){return Yn.makeRotationZ(t),this.applyMatrix4(Yn),this}translate(t,e,n){return Yn.makeTranslation(t,e,n),this.applyMatrix4(Yn),this}scale(t,e,n){return Yn.makeScale(t,e,n),this.applyMatrix4(Yn),this}lookAt(t){return od.lookAt(t),od.updateMatrix(),this.applyMatrix4(od.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Jr).negate(),this.translate(Jr.x,Jr.y,Jr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,s=t.length;i<s;i++){let a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Et(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&ft("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ge);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Rt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let s=e[n];Un.setFromBufferAttribute(s),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,Un.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,Un.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(Un.min),this.boundingBox.expandByPoint(Un.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Rt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ke);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Rt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){let n=this.boundingSphere.center;if(Un.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){let o=e[s];xo.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(Un.min,xo.min),Un.expandByPoint(Ye),Ye.addVectors(Un.max,xo.max),Un.expandByPoint(Ye)):(Un.expandByPoint(xo.min),Un.expandByPoint(xo.max))}Un.getCenter(n);let i=0;for(let s=0,a=t.count;s<a;s++)Ye.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ye));if(e)for(let s=0,a=e.length;s<a;s++){let o=e[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ye.fromBufferAttribute(o,c),l&&(Jr.fromBufferAttribute(t,c),Ye.add(Jr)),i=Math.max(i,n.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Rt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Rt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new oe(new Float32Array(4*n.count),4));let a=this.getAttribute("tangent"),o=[],l=[];for(let y=0;y<n.count;y++)o[y]=new I,l[y]=new I;let c=new I,h=new I,f=new I,u=new Q,d=new Q,p=new Q,_=new I,m=new I;function g(y,T,R){c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,T),f.fromBufferAttribute(n,R),u.fromBufferAttribute(s,y),d.fromBufferAttribute(s,T),p.fromBufferAttribute(s,R),h.sub(c),f.sub(c),d.sub(u),p.sub(u);let P=1/(d.x*p.y-p.x*d.y);isFinite(P)&&(_.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(P),m.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(P),o[y].add(_),o[T].add(_),o[R].add(_),l[y].add(m),l[T].add(m),l[R].add(m))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let y=0,T=x.length;y<T;++y){let R=x[y],P=R.start,U=R.count;for(let z=P,k=P+U;z<k;z+=3)g(t.getX(z+0),t.getX(z+1),t.getX(z+2))}let v=new I,M=new I,E=new I,S=new I;function w(y){E.fromBufferAttribute(i,y),S.copy(E);let T=o[y];v.copy(T),v.sub(E.multiplyScalar(E.dot(T))).normalize(),M.crossVectors(S,T);let P=M.dot(l[y])<0?-1:1;a.setXYZW(y,v.x,v.y,v.z,P)}for(let y=0,T=x.length;y<T;++y){let R=x[y],P=R.start,U=R.count;for(let z=P,k=P+U;z<k;z+=3)w(t.getX(z+0)),w(t.getX(z+1)),w(t.getX(z+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new oe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let i=new I,s=new I,a=new I,o=new I,l=new I,c=new I,h=new I,f=new I;if(t)for(let u=0,d=t.count;u<d;u+=3){let p=t.getX(u+0),_=t.getX(u+1),m=t.getX(u+2);i.fromBufferAttribute(e,p),s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,m),h.subVectors(a,s),f.subVectors(i,s),h.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)i.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),a.fromBufferAttribute(e,u+2),h.subVectors(a,s),f.subVectors(i,s),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h),d=0,p=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*h;for(let g=0;g<h;g++)u[p++]=c[d++]}return new oe(u,h,f)}if(this.index===null)return ft("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new r,n=this.index.array,i=this.attributes;for(let o in i){let l=i[o],c=t(l,n);e.setAttribute(o,c)}let s=this.morphAttributes;for(let o in s){let l=[],c=s[o];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(i[l]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let s=t.morphAttributes;for(let c in s){let h=[],f=s[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let c=0,h=a.length;c<h;c++){let f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},ur=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=pa,this.updateRanges=[],this.version=0,this.uuid=Fn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,s=this.stride;i<s;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Fn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},dn=new I,bs=class r{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)dn.fromBufferAttribute(this,e),dn.applyMatrix4(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)dn.fromBufferAttribute(this,e),dn.applyNormalMatrix(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)dn.fromBufferAttribute(this,e),dn.transformDirection(t),this.setXYZ(e,dn.x,dn.y,dn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=jt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=jt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=pn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=pn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=pn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=pn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=jt(e,this.array),n=jt(n,this.array),i=jt(i,this.array),s=jt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=s,this}clone(t){if(t===void 0){ga("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return new oe(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new r(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){ga("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},kv=0,He=class extends En{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kv++}),this.uuid=Fn(),this.name="",this.type="Material",this.blending=vs,this.side=bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lo,this.blendDst=No,this.blendEquation=Wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=ys,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gs,this.stencilZFail=gs,this.stencilZPass=gs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){ft(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){ft(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==vs&&(n.blending=this.blending),this.side!==bi&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Lo&&(n.blendSrc=this.blendSrc),this.blendDst!==No&&(n.blendDst=this.blendDst),this.blendEquation!==Wi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==ys&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jh&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gs&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gs&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gs&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let a=[];for(let o in s){let l=s[o];delete l.metadata,a.push(l)}return a}if(e){let s=i(t.textures),a=i(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},ya=class extends He{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},$r,vo=new I,Kr=new I,Qr=new I,jr=new Q,yo=new Q,a0=new Gt,uh=new I,Mo=new I,fh=new I,hg=new Q,ld=new Q,ug=new Q,qo=class extends ce{constructor(t=new ya){if(super(),this.isSprite=!0,this.type="Sprite",$r===void 0){$r=new Ht;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new ur(e,5);$r.setIndex([0,1,2,0,2,3]),$r.setAttribute("position",new bs(n,3,0,!1)),$r.setAttribute("uv",new bs(n,2,3,!1))}this.geometry=$r,this.material=t,this.center=new Q(.5,.5),this.count=1}raycast(t,e){t.camera===null&&Rt('Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Kr.setFromMatrixScale(this.matrixWorld),a0.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Qr.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Kr.multiplyScalar(-Qr.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let a=this.center;dh(uh.set(-.5,-.5,0),Qr,a,Kr,i,s),dh(Mo.set(.5,-.5,0),Qr,a,Kr,i,s),dh(fh.set(.5,.5,0),Qr,a,Kr,i,s),hg.set(0,0),ld.set(1,0),ug.set(1,1);let o=t.ray.intersectTriangle(uh,Mo,fh,!1,vo);if(o===null&&(dh(Mo.set(-.5,.5,0),Qr,a,Kr,i,s),ld.set(0,1),o=t.ray.intersectTriangle(uh,fh,Mo,!1,vo),o===null))return;let l=t.ray.origin.distanceTo(vo);l<t.near||l>t.far||e.push({distance:l,point:vo.clone(),uv:ri.getInterpolation(vo,uh,Mo,fh,hg,ld,ug,new Q),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function dh(r,t,e,n,i,s){jr.subVectors(r,e).addScalar(.5).multiply(n),i!==void 0?(yo.x=s*jr.x-i*jr.y,yo.y=i*jr.x+s*jr.y):yo.copy(jr),r.copy(t),r.x+=yo.x,r.y+=yo.y,r.applyMatrix4(a0)}var ph=new I,fg=new I,Yo=class extends ce{constructor(){super(),this.isLOD=!0,this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);let e=t.levels;for(let n=0,i=e.length;n<i;n++){let s=e[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,n=0){e=Math.abs(e);let i=this.levels,s;for(s=0;s<i.length&&!(e<i[s].distance);s++);return i.splice(s,0,{distance:e,hysteresis:n,object:t}),this.add(t),this}removeLevel(t){let e=this.levels;for(let n=0;n<e.length;n++)if(e[n].distance===t){let i=e.splice(n,1);return this.remove(i[0].object),!0}return!1}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){let e=this.levels;if(e.length>0){let n,i;for(n=1,i=e.length;n<i;n++){let s=e[n].distance;if(e[n].object.visible&&(s-=s*e[n].hysteresis),t<s)break}return e[n-1].object}return null}raycast(t,e){if(this.levels.length>0){ph.setFromMatrixPosition(this.matrixWorld);let i=t.ray.origin.distanceTo(ph);this.getObjectForDistance(i).raycast(t,e)}}update(t){let e=this.levels;if(e.length>1){ph.setFromMatrixPosition(t.matrixWorld),fg.setFromMatrixPosition(this.matrixWorld);let n=ph.distanceTo(fg)/t.zoom;e[0].object.visible=!0;let i,s;for(i=1,s=e.length;i<s;i++){let a=e[i].distance;if(e[i].object.visible&&(a-=a*e[i].hysteresis),n>=a)e[i-1].object.visible=!1,e[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)e[i].object.visible=!1}}toJSON(t){let e=super.toJSON(t);this.autoUpdate===!1&&(e.object.autoUpdate=!1),e.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let a=n[i];e.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return e}},ki=new I,cd=new I,mh=new I,ds=new I,hd=new I,gh=new I,ud=new I,Xi=class{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ki)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ki.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ki.copy(this.origin).addScaledVector(this.direction,e),ki.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){cd.copy(t).add(e).multiplyScalar(.5),mh.copy(e).sub(t).normalize(),ds.copy(this.origin).sub(cd);let s=t.distanceTo(e)*.5,a=-this.direction.dot(mh),o=ds.dot(this.direction),l=-ds.dot(mh),c=ds.lengthSq(),h=Math.abs(1-a*a),f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=s*h,f>=0)if(u>=-p)if(u<=p){let _=1/h;f*=_,u*=_,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*s+o)),u=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-s,-l),s),d=u*(u+2*l)+c):(f=Math.max(0,-(a*s+o)),u=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+u*(u+2*l)+c);else u=a>0?-s:s,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(cd).addScaledVector(mh,u),d}intersectSphere(t,e){ki.subVectors(t.center,this.origin);let n=ki.dot(this.direction),i=ki.dot(ki)-n*n,s=t.radius*t.radius;if(i>s)return null;let a=Math.sqrt(s-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,a,o,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(s=(t.min.y-u.y)*h,a=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,a=(t.min.y-u.y)*h),n>a||s>i||((s>n||isNaN(n))&&(n=s),(a<i||isNaN(i))&&(i=a),f>=0?(o=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(o=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ki)!==null}intersectTriangle(t,e,n,i,s){hd.subVectors(e,t),gh.subVectors(n,t),ud.crossVectors(hd,gh);let a=this.direction.dot(ud),o;if(a>0){if(i)return null;o=1}else if(a<0)o=-1,a=-a;else return null;ds.subVectors(this.origin,t);let l=o*this.direction.dot(gh.crossVectors(ds,gh));if(l<0)return null;let c=o*this.direction.dot(hd.cross(ds));if(c<0||l+c>a)return null;let h=-o*ds.dot(ud);return h<0?null:this.at(h/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},On=class extends He{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Ha,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},dg=new Gt,qs=new Xi,_h=new ke,pg=new I,xh=new I,vh=new I,yh=new I,fd=new I,Mh=new I,mg=new I,Sh=new I,$t=class extends ce{constructor(t=new Ht,e=new On){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let o=this.morphTargetInfluences;if(s&&o){Mh.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let h=o[l],f=s[l];h!==0&&(fd.fromBufferAttribute(f,t),a?Mh.addScaledVector(fd,h):Mh.addScaledVector(fd.sub(e),h))}e.add(Mh)}return e}raycast(t,e){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),_h.copy(n.boundingSphere),_h.applyMatrix4(s),qs.copy(t.ray).recast(t.near),!(_h.containsPoint(qs.origin)===!1&&(qs.intersectSphere(_h,pg)===null||qs.origin.distanceToSquared(pg)>(t.far-t.near)**2))&&(dg.copy(s).invert(),qs.copy(t.ray).applyMatrix4(dg),!(n.boundingBox!==null&&qs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,qs)))}_computeIntersections(t,e,n){let i,s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,u=s.groups,d=s.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let m=u[p],g=a[m.materialIndex],x=Math.max(m.start,d.start),v=Math.min(o.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,E=v;M<E;M+=3){let S=o.getX(M),w=o.getX(M+1),y=o.getX(M+2);i=bh(this,g,t,n,c,h,f,S,w,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){let x=o.getX(m),v=o.getX(m+1),M=o.getX(m+2);i=bh(this,a,t,n,c,h,f,x,v,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,_=u.length;p<_;p++){let m=u[p],g=a[m.materialIndex],x=Math.max(m.start,d.start),v=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let M=x,E=v;M<E;M+=3){let S=M,w=M+1,y=M+2;i=bh(this,g,t,n,c,h,f,S,w,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,e.push(i))}}else{let p=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=p,g=_;m<g;m+=3){let x=m,v=m+1,M=m+2;i=bh(this,a,t,n,c,h,f,x,v,M),i&&(i.faceIndex=Math.floor(m/3),e.push(i))}}}};function Vv(r,t,e,n,i,s,a,o){let l;if(t.side===ln?l=n.intersectTriangle(a,s,i,!0,o):l=n.intersectTriangle(i,s,a,t.side===bi,o),l===null)return null;Sh.copy(o),Sh.applyMatrix4(r.matrixWorld);let c=e.ray.origin.distanceTo(Sh);return c<e.near||c>e.far?null:{distance:c,point:Sh.clone(),object:r}}function bh(r,t,e,n,i,s,a,o,l,c){r.getVertexPosition(o,xh),r.getVertexPosition(l,vh),r.getVertexPosition(c,yh);let h=Vv(r,t,e,n,xh,vh,yh,mg);if(h){let f=new I;ri.getBarycoord(mg,xh,vh,yh,f),i&&(h.uv=ri.getInterpolatedAttribute(i,o,l,c,f,new Q)),s&&(h.uv1=ri.getInterpolatedAttribute(s,o,l,c,f,new Q)),a&&(h.normal=ri.getInterpolatedAttribute(a,o,l,c,f,new I),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a:o,b:l,c,normal:new I,materialIndex:0};ri.getNormal(xh,vh,yh,u.normal),h.face=u,h.barycoord=f}return h}var So=new de,gg=new de,_g=new de,Gv=new de,xg=new Gt,Th=new I,dd=new ke,vg=new Gt,pd=new Xi,Zo=class extends $t{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=Yh,this.bindMatrix=new Gt,this.bindMatrixInverse=new Gt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new Ge),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Th),this.boundingBox.expandByPoint(Th)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new ke),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,Th),this.boundingSphere.expandByPoint(Th)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),dd.copy(this.boundingSphere),dd.applyMatrix4(i),t.ray.intersectsSphere(dd)!==!1&&(vg.copy(i).invert(),pd.copy(t.ray).applyMatrix4(vg),!(this.boundingBox!==null&&pd.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,pd)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new de,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===Yh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===fp?this.bindMatrixInverse.copy(this.bindMatrix).invert():ft("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;gg.fromBufferAttribute(i.attributes.skinIndex,t),_g.fromBufferAttribute(i.attributes.skinWeight,t),e.isVector4?(So.copy(e),e.set(0,0,0,0)):(So.set(...e,1),e.set(0,0,0)),So.applyMatrix4(this.bindMatrix);for(let s=0;s<4;s++){let a=_g.getComponent(s);if(a!==0){let o=gg.getComponent(s);xg.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),e.addScaledVector(Gv.copy(So).applyMatrix4(xg),a)}}return e.isVector4&&(e.w=So.w),e.applyMatrix4(this.bindMatrixInverse)}},Ma=class extends ce{constructor(){super(),this.isBone=!0,this.type="Bone"}},Tn=class extends Ie{constructor(t=null,e=1,n=1,i,s,a,o,l,c=Pe,h=Pe,f,u){super(null,a,o,l,c,h,i,s,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},yg=new Gt,Hv=new Gt,Jo=class r{constructor(t=[],e=[]){this.uuid=Fn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.previousBoneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){ft("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new Gt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new Gt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,a=t.length;s<a;s++){let o=t[s]?t[s].matrixWorld:Hv;yg.multiplyMatrices(o,e[s]),yg.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new Tn(e,t,t,an,rn);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let s=t.bones[n],a=e[s];a===void 0&&(ft("Skeleton: No bone found with UUID:",s),a=new Ma),this.bones.push(a),this.boneInverses.push(new Gt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,s=e.length;i<s;i++){let a=e[i];t.bones.push(a.uuid);let o=n[i];t.boneInverses.push(o.toArray())}return t}},qi=class extends oe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ta=new Gt,Mg=new Gt,Eh=[],Sg=new Ge,Wv=new Gt,bo=new $t,To=new ke,$o=class extends $t{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qi(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Wv)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ge),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ta),Sg.copy(t.boundingBox).applyMatrix4(ta),this.boundingBox.union(Sg)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ke),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ta),To.copy(t.boundingSphere).applyMatrix4(ta),this.boundingSphere.union(To)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=t.previousInstanceMatrix.clone()),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,a=t*s+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(bo.geometry=this.geometry,bo.material=this.material,bo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),To.copy(this.boundingSphere),To.applyMatrix4(n),t.ray.intersectsSphere(To)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ta),Mg.multiplyMatrices(n,ta),bo.matrixWorld=Mg,bo.raycast(t,Eh);for(let a=0,o=Eh.length;a<o;a++){let l=Eh[a];l.instanceId=s,l.object=this,e.push(l)}Eh.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new qi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Tn(new Float32Array(i*this.count),i,this.count,Ql,rn));let s=this.morphTexture.source.data.data,a=0;for(let c=0;c<n.length;c++)a+=n[c];let o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return s[l]=o,s.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},md=new I,Xv=new I,qv=new Yt,si=class{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=md.subVectors(n,e).cross(Xv.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(md),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let a=-(t.start.dot(this.normal)+this.constant)/s;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||qv.getNormalMatrix(t),i=this.coplanarPoint(md).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Ys=new ke,Yv=new Q(.5,.5),wh=new I,Yi=class{constructor(t=new si,e=new si,n=new si,i=new si,s=new si,a=new si){this.planes=[t,e,n,i,s,a]}set(t,e,n,i,s,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(s),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=bn,n=!1){let i=this.planes,s=t.elements,a=s[0],o=s[1],l=s[2],c=s[3],h=s[4],f=s[5],u=s[6],d=s[7],p=s[8],_=s[9],m=s[10],g=s[11],x=s[12],v=s[13],M=s[14],E=s[15];if(i[0].setComponents(c-a,d-h,g-p,E-x).normalize(),i[1].setComponents(c+a,d+h,g+p,E+x).normalize(),i[2].setComponents(c+o,d+f,g+_,E+v).normalize(),i[3].setComponents(c-o,d-f,g-_,E-v).normalize(),n)i[4].setComponents(l,u,m,M).normalize(),i[5].setComponents(c-l,d-u,g-m,E-M).normalize();else if(i[4].setComponents(c-l,d-u,g-m,E-M).normalize(),e===bn)i[5].setComponents(c+l,d+u,g+m,E+M).normalize();else if(e===Ms)i[5].setComponents(l,u,m,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ys.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ys.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ys)}intersectsSprite(t){Ys.center.set(0,0,0);let e=Yv.distanceTo(t.center);return Ys.radius=.7071067811865476+e,Ys.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ys)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(wh.x=i.normal.x>0?t.max.x:t.min.x,wh.y=i.normal.y>0?t.max.y:t.min.y,wh.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(wh)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},vi=new Gt,yi=new Yi,Ko=class r{constructor(){this.coordinateSystem=bn}intersectsObject(t,e){if(!e.isArrayCamera||e.cameras.length===0)return!1;for(let n=0;n<e.cameras.length;n++){let i=e.cameras[n];if(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),yi.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth),yi.intersectsObject(t))return!0}return!1}intersectsSprite(t,e){if(!e||!e.cameras||e.cameras.length===0)return!1;for(let n=0;n<e.cameras.length;n++){let i=e.cameras[n];if(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),yi.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth),yi.intersectsSprite(t))return!0}return!1}intersectsSphere(t,e){if(!e||!e.cameras||e.cameras.length===0)return!1;for(let n=0;n<e.cameras.length;n++){let i=e.cameras[n];if(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),yi.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth),yi.intersectsSphere(t))return!0}return!1}intersectsBox(t,e){if(!e||!e.cameras||e.cameras.length===0)return!1;for(let n=0;n<e.cameras.length;n++){let i=e.cameras[n];if(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),yi.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth),yi.intersectsBox(t))return!0}return!1}containsPoint(t,e){if(!e||!e.cameras||e.cameras.length===0)return!1;for(let n=0;n<e.cameras.length;n++){let i=e.cameras[n];if(vi.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),yi.setFromProjectionMatrix(vi,i.coordinateSystem,i.reversedDepth),yi.containsPoint(t))return!0}return!1}clone(){return new r}};function gd(r,t){return r-t}function Zv(r,t){return r.z-t.z}function Jv(r,t){return t.z-r.z}var Pd=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n,i){let s=this.pool,a=this.list;this.index>=s.length&&s.push({start:-1,count:-1,z:-1,index:-1});let o=s[this.index];a.push(o),this.index++,o.start=t,o.count=e,o.z=n,o.index=i}reset(){this.list.length=0,this.index=0}},Mn=new Gt,$v=new bt(1,1,1),bg=new Yi,Kv=new Ko,Ah=new Ge,Zs=new ke,Eo=new I,Tg=new I,Qv=new I,_d=new Pd,nn=new $t,Ch=[];function jv(r,t,e=0){let n=t.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==t.array.constructor){let i=r.count;for(let s=0;s<i;s++)for(let a=0;a<n;a++)t.setComponent(s+e,a,r.getComponent(s,a))}else t.array.set(r.array,e*n);t.needsUpdate=!0}function Js(r,t){if(r.constructor!==t.constructor){let e=Math.min(r.length,t.length);for(let n=0;n<e;n++)t[n]=r[n]}else{let e=Math.min(r.length,t.length);t.set(new r.constructor(r.buffer,0,e))}}var Qo=class extends $t{constructor(t,e,n=e*2,i){super(new Ht,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._instanceInfo=[],this._geometryInfo=[],this._availableInstanceIds=[],this._availableGeometryIds=[],this._nextIndexStart=0,this._nextVertexStart=0,this._geometryCount=0,this._visibilityChanged=!0,this._geometryInitialized=!1,this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}get maxInstanceCount(){return this._maxInstanceCount}get instanceCount(){return this._instanceInfo.length-this._availableInstanceIds.length}get unusedVertexCount(){return this._maxVertexCount-this._nextVertexStart}get unusedIndexCount(){return this._maxIndexCount-this._nextIndexStart}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4),n=new Tn(e,t,t,an,rn);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);let e=new Uint32Array(t*t),n=new Tn(e,t,t,Za,Vn);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);let e=new Float32Array(t*t*4).fill(1),n=new Tn(e,t,t,an,rn);n.colorSpace=ie.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){let e=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in t.attributes){let a=t.getAttribute(s),{array:o,itemSize:l,normalized:c}=a,h=new o.constructor(n*l),f=new oe(h,l,c);e.setAttribute(s,f)}if(t.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);e.setIndex(new oe(s,1))}this._geometryInitialized=!0}}_validateGeometry(t){let e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('THREE.BatchedMesh: All geometries must consistently have "index".');for(let n in e.attributes){if(!t.hasAttribute(n))throw new Error(`THREE.BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=t.getAttribute(n),s=e.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("THREE.BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}validateInstanceId(t){let e=this._instanceInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid instanceId ${t}. Instance is either out of range or has been deleted.`)}validateGeometryId(t){let e=this._geometryInfo;if(t<0||t>=e.length||e[t].active===!1)throw new Error(`THREE.BatchedMesh: Invalid geometryId ${t}. Geometry is either out of range or has been deleted.`)}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ge);let t=this.boundingBox,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;let s=e[n].geometryIndex;this.getMatrixAt(n,Mn),this.getBoundingBoxAt(s,Ah).applyMatrix4(Mn),t.union(Ah)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ke);let t=this.boundingSphere,e=this._instanceInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;let s=e[n].geometryIndex;this.getMatrixAt(n,Mn),this.getBoundingSphereAt(s,Zs).applyMatrix4(Mn),t.union(Zs)}}addInstance(t){if(this._instanceInfo.length>=this.maxInstanceCount&&this._availableInstanceIds.length===0)throw new Error("THREE.BatchedMesh: Maximum item count reached.");let n={visible:!0,active:!0,geometryIndex:t},i=null;this._availableInstanceIds.length>0?(this._availableInstanceIds.sort(gd),i=this._availableInstanceIds.shift(),this._instanceInfo[i]=n):(i=this._instanceInfo.length,this._instanceInfo.push(n));let s=this._matricesTexture;Mn.identity().toArray(s.image.data,i*16),s.needsUpdate=!0;let a=this._colorsTexture;return a&&($v.toArray(a.image.data,i*4),a.needsUpdate=!0),this._visibilityChanged=!0,i}addGeometry(t,e=-1,n=-1){this._initializeGeometry(t),this._validateGeometry(t);let i={vertexStart:-1,vertexCount:-1,reservedVertexCount:-1,indexStart:-1,indexCount:-1,reservedIndexCount:-1,start:-1,count:-1,boundingBox:null,boundingSphere:null,active:!0},s=this._geometryInfo;i.vertexStart=this._nextVertexStart,i.reservedVertexCount=e===-1?t.getAttribute("position").count:e;let a=t.getIndex();if(a!==null&&(i.indexStart=this._nextIndexStart,i.reservedIndexCount=n===-1?a.count:n),i.indexStart!==-1&&i.indexStart+i.reservedIndexCount>this._maxIndexCount||i.vertexStart+i.reservedVertexCount>this._maxVertexCount)throw new Error("THREE.BatchedMesh: Reserved space request exceeds the maximum buffer size.");let l;return this._availableGeometryIds.length>0?(this._availableGeometryIds.sort(gd),l=this._availableGeometryIds.shift(),s[l]=i):(l=this._geometryCount,this._geometryCount++,s.push(i)),this.setGeometryAt(l,t),this._nextIndexStart=i.indexStart+i.reservedIndexCount,this._nextVertexStart=i.vertexStart+i.reservedVertexCount,l}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("THREE.BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),a=e.getIndex(),o=this._geometryInfo[t];if(i&&a.count>o.reservedIndexCount||e.attributes.position.count>o.reservedVertexCount)throw new Error("THREE.BatchedMesh: Reserved space not large enough for provided geometry.");let l=o.vertexStart,c=o.reservedVertexCount;o.vertexCount=e.getAttribute("position").count;for(let h in n.attributes){let f=e.getAttribute(h),u=n.getAttribute(h);jv(f,u,l);let d=f.itemSize;for(let p=f.count,_=c;p<_;p++){let m=l+p;for(let g=0;g<d;g++)u.setComponent(m,g,0)}u.needsUpdate=!0,u.addUpdateRange(l*d,c*d)}if(i){let h=o.indexStart,f=o.reservedIndexCount;o.indexCount=e.getIndex().count;for(let u=0;u<a.count;u++)s.setX(h+u,l+a.getX(u));for(let u=a.count,d=f;u<d;u++)s.setX(h+u,l);s.needsUpdate=!0,s.addUpdateRange(h,o.reservedIndexCount)}return o.start=i?o.indexStart:o.vertexStart,o.count=i?o.indexCount:o.vertexCount,o.boundingBox=null,e.boundingBox!==null&&(o.boundingBox=e.boundingBox.clone()),o.boundingSphere=null,e.boundingSphere!==null&&(o.boundingSphere=e.boundingSphere.clone()),this._visibilityChanged=!0,t}deleteGeometry(t){let e=this._geometryInfo;if(t>=e.length||e[t].active===!1)return this;let n=this._instanceInfo;for(let i=0,s=n.length;i<s;i++)n[i].active&&n[i].geometryIndex===t&&this.deleteInstance(i);return e[t].active=!1,this._availableGeometryIds.push(t),this._visibilityChanged=!0,this}deleteInstance(t){return this.validateInstanceId(t),this._instanceInfo[t].active=!1,this._availableInstanceIds.push(t),this._visibilityChanged=!0,this}optimize(){let t=0,e=0,n=this._geometryInfo,i=n.map((a,o)=>o).sort((a,o)=>n[a].vertexStart-n[o].vertexStart),s=this.geometry;for(let a=0,o=n.length;a<o;a++){let l=i[a],c=n[l];if(c.active!==!1){if(s.index!==null){if(c.indexStart!==e){let{indexStart:h,vertexStart:f,reservedIndexCount:u}=c,d=s.index,p=d.array,_=t-f;for(let m=h;m<h+u;m++)p[m]=p[m]+_;d.array.copyWithin(e,h,h+u),d.addUpdateRange(e,u),d.needsUpdate=!0,c.indexStart=e}e+=c.reservedIndexCount}if(c.vertexStart!==t){let{vertexStart:h,reservedVertexCount:f}=c,u=s.attributes;for(let d in u){let p=u[d],{array:_,itemSize:m}=p;_.copyWithin(t*m,h*m,(h+f)*m),p.addUpdateRange(t*m,f*m),p.needsUpdate=!0}c.vertexStart=t}t+=c.reservedVertexCount,c.start=s.index?c.indexStart:c.vertexStart}}return this._nextIndexStart=e,this._nextVertexStart=t,this._visibilityChanged=!0,this}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[t];if(i.boundingBox===null){let s=new Ge,a=n.index,o=n.attributes.position;for(let l=i.start,c=i.start+i.count;l<c;l++){let h=l;a&&(h=a.getX(h)),s.expandByPoint(Eo.fromBufferAttribute(o,h))}i.boundingBox=s}return e.copy(i.boundingBox),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;let n=this.geometry,i=this._geometryInfo[t];if(i.boundingSphere===null){let s=new ke;this.getBoundingBoxAt(t,Ah),Ah.getCenter(s.center);let a=n.index,o=n.attributes.position,l=0;for(let c=i.start,h=i.start+i.count;c<h;c++){let f=c;a&&(f=a.getX(f)),Eo.fromBufferAttribute(o,f),l=Math.max(l,s.center.distanceToSquared(Eo))}s.radius=Math.sqrt(l),i.boundingSphere=s}return e.copy(i.boundingSphere),e}setMatrixAt(t,e){this.validateInstanceId(t);let n=this._matricesTexture,i=this._matricesTexture.image.data;return e.toArray(i,t*16),n.needsUpdate=!0,this}getMatrixAt(t,e){return this.validateInstanceId(t),e.fromArray(this._matricesTexture.image.data,t*16)}setColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null&&this._initColorsTexture(),e.toArray(this._colorsTexture.image.data,t*4),this._colorsTexture.needsUpdate=!0,this}getColorAt(t,e){return this.validateInstanceId(t),this._colorsTexture===null?e.isVector4?e.set(1,1,1,1):e.setRGB(1,1,1):e.fromArray(this._colorsTexture.image.data,t*4)}setVisibleAt(t,e){return this.validateInstanceId(t),this._instanceInfo[t].visible===e?this:(this._instanceInfo[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){return this.validateInstanceId(t),this._instanceInfo[t].visible}setGeometryIdAt(t,e){return this.validateInstanceId(t),this.validateGeometryId(e),this._instanceInfo[t].geometryIndex=e,this}getGeometryIdAt(t){return this.validateInstanceId(t),this._instanceInfo[t].geometryIndex}getGeometryRangeAt(t,e={}){this.validateGeometryId(t);let n=this._geometryInfo[t];return e.vertexStart=n.vertexStart,e.vertexCount=n.vertexCount,e.reservedVertexCount=n.reservedVertexCount,e.indexStart=n.indexStart,e.indexCount=n.indexCount,e.reservedIndexCount=n.reservedIndexCount,e.start=n.start,e.count=n.count,e}setInstanceCount(t){let e=this._availableInstanceIds,n=this._instanceInfo;for(e.sort(gd);e[e.length-1]===n.length-1;)n.pop(),e.pop();if(t<n.length)throw new Error(`BatchedMesh: Instance ids outside the range ${t} are being used. Cannot shrink instance count.`);let i=new Int32Array(t),s=new Int32Array(t);Js(this._multiDrawCounts,i),Js(this._multiDrawStarts,s),this._multiDrawCounts=i,this._multiDrawStarts=s,this._maxInstanceCount=t;let a=this._indirectTexture,o=this._matricesTexture,l=this._colorsTexture;a.dispose(),this._initIndirectTexture(),Js(a.image.data,this._indirectTexture.image.data),o.dispose(),this._initMatricesTexture(),Js(o.image.data,this._matricesTexture.image.data),l&&(l.dispose(),this._initColorsTexture(),Js(l.image.data,this._colorsTexture.image.data))}setGeometrySize(t,e){let n=[...this._geometryInfo].filter(o=>o.active);if(Math.max(...n.map(o=>o.vertexStart+o.reservedVertexCount))>t)throw new Error(`BatchedMesh: Geometry vertex values are being used outside the range ${e}. Cannot shrink further.`);if(this.geometry.index&&Math.max(...n.map(l=>l.indexStart+l.reservedIndexCount))>e)throw new Error(`BatchedMesh: Geometry index values are being used outside the range ${e}. Cannot shrink further.`);let s=this.geometry;s.dispose(),this._maxVertexCount=t,this._maxIndexCount=e,this._geometryInitialized&&(this._geometryInitialized=!1,this.geometry=new Ht,this._initializeGeometry(s));let a=this.geometry;s.index&&Js(s.index.array,a.index.array);for(let o in s.attributes)Js(s.attributes[o].array,a.attributes[o].array)}raycast(t,e){let n=this._instanceInfo,i=this._geometryInfo,s=this.matrixWorld,a=this.geometry;nn.material=this.material,nn.geometry.index=a.index,nn.geometry.attributes=a.attributes,nn.geometry.boundingBox===null&&(nn.geometry.boundingBox=new Ge),nn.geometry.boundingSphere===null&&(nn.geometry.boundingSphere=new ke);for(let o=0,l=n.length;o<l;o++){if(!n[o].visible||!n[o].active)continue;let c=n[o].geometryIndex,h=i[c];nn.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(o,nn.matrixWorld).premultiply(s),this.getBoundingBoxAt(c,nn.geometry.boundingBox),this.getBoundingSphereAt(c,nn.geometry.boundingSphere),nn.raycast(t,Ch);for(let f=0,u=Ch.length;f<u;f++){let d=Ch[f];d.object=this,d.batchId=o,e.push(d)}Ch.length=0}nn.material=null,nn.geometry.index=null,nn.geometry.attributes={},nn.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._geometryInfo=t._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox!==null?e.boundingBox.clone():null,boundingSphere:e.boundingSphere!==null?e.boundingSphere.clone():null})),this._instanceInfo=t._instanceInfo.map(e=>({...e})),this._availableInstanceIds=t._availableInstanceIds.slice(),this._availableGeometryIds=t._availableGeometryIds.slice(),this._nextIndexStart=t._nextIndexStart,this._nextVertexStart=t._nextVertexStart,this._geometryCount=t._geometryCount,this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._indirectTexture=t._indirectTexture.clone(),this._indirectTexture.image.data=this._indirectTexture.image.data.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.data.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.data.slice()),this}dispose(){this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null)}onBeforeRender(t,e,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let a=i.getIndex(),o=a===null?1:a.array.BYTES_PER_ELEMENT,l=1;s.wireframe&&(l=2,o=i.attributes.position.count>65535?4:2);let c=this._instanceInfo,h=this._multiDrawStarts,f=this._multiDrawCounts,u=this._geometryInfo,d=this.perObjectFrustumCulled,p=this._indirectTexture,_=p.image.data,m=n.isArrayCamera?Kv:bg;d&&!n.isArrayCamera&&(Mn.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),bg.setFromProjectionMatrix(Mn,n.coordinateSystem,n.reversedDepth));let g=0;if(this.sortObjects){Mn.copy(this.matrixWorld).invert(),Eo.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Mn),Tg.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Mn);for(let M=0,E=c.length;M<E;M++)if(c[M].visible&&c[M].active){let S=c[M].geometryIndex;this.getMatrixAt(M,Mn),this.getBoundingSphereAt(S,Zs).applyMatrix4(Mn);let w=!1;if(d&&(w=!m.intersectsSphere(Zs,n)),!w){let y=u[S],T=Qv.subVectors(Zs.center,Eo).dot(Tg);_d.push(y.start,y.count,T,M)}}let x=_d.list,v=this.customSort;v===null?x.sort(s.transparent?Jv:Zv):v.call(this,x,n);for(let M=0,E=x.length;M<E;M++){let S=x[M];h[g]=S.start*o*l,f[g]=S.count*l,_[g]=S.index,g++}_d.reset()}else for(let x=0,v=c.length;x<v;x++)if(c[x].visible&&c[x].active){let M=c[x].geometryIndex,E=!1;if(d&&(this.getMatrixAt(x,Mn),this.getBoundingSphereAt(M,Zs).applyMatrix4(Mn),E=!m.intersectsSphere(Zs,n)),!E){let S=u[M];h[g]=S.start*o*l,f[g]=S.count*l,_[g]=x,g++}}p.needsUpdate=!0,this._multiDrawCount=g,this._visibilityChanged=!1}onBeforeShadow(t,e,n,i,s,a){this.onBeforeRender(t,null,i,s,a)}},Ve=class extends He{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},ru=new I,au=new I,Eg=new Gt,wo=new Xi,Rh=new ke,xd=new I,wg=new I,Bn=class extends ce{constructor(t=new Ht,e=new Ve){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,s=e.count;i<s;i++)ru.fromBufferAttribute(e,i-1),au.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=ru.distanceTo(au);t.setAttribute("lineDistance",new Et(n,1))}else ft("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,s=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rh.copy(n.boundingSphere),Rh.applyMatrix4(i),Rh.radius+=s,t.ray.intersectsSphere(Rh)===!1)return;Eg.copy(i).invert(),wo.copy(t.ray).applyMatrix4(Eg);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let _=d,m=p-1;_<m;_+=c){let g=h.getX(_),x=h.getX(_+1),v=Ph(this,t,wo,l,g,x,_);v&&e.push(v)}if(this.isLineLoop){let _=h.getX(p-1),m=h.getX(d),g=Ph(this,t,wo,l,_,m,p-1);g&&e.push(g)}}else{let d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let _=d,m=p-1;_<m;_+=c){let g=Ph(this,t,wo,l,_,_+1,_);g&&e.push(g)}if(this.isLineLoop){let _=Ph(this,t,wo,l,p-1,d,p-1);_&&e.push(_)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Ph(r,t,e,n,i,s,a){let o=r.geometry.attributes.position;if(ru.fromBufferAttribute(o,i),au.fromBufferAttribute(o,s),e.distanceSqToSegment(ru,au,xd,wg)>n)return;xd.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(xd);if(!(c<t.near||c>t.far))return{distance:c,point:wg.clone().applyMatrix4(r.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:r}}var Ag=new I,Cg=new I,zn=class extends Bn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,s=e.count;i<s;i+=2)Ag.fromBufferAttribute(e,i),Cg.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Ag.distanceTo(Cg);t.setAttribute("lineDistance",new Et(n,1))}else ft("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},jo=class extends Bn{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},Ts=class extends He{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Rg=new Gt,Id=new Xi,Ih=new ke,Dh=new I,fr=class extends ce{constructor(t=new Ht,e=new Ts){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ih.copy(n.boundingSphere),Ih.applyMatrix4(i),Ih.radius+=s,t.ray.intersectsSphere(Ih)===!1)return;Rg.copy(i).invert(),Id.copy(t.ray).applyMatrix4(Rg);let o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){let u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let p=u,_=d;p<_;p++){let m=c.getX(p);Dh.fromBufferAttribute(f,m),Pg(Dh,m,l,i,t,e,this)}}else{let u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let p=u,_=d;p<_;p++)Dh.fromBufferAttribute(f,p),Pg(Dh,p,l,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=i.length;s<a;s++){let o=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}};function Pg(r,t,e,n,i,s,a){let o=Id.distanceSqToPoint(r);if(o<e){let l=new I;Id.closestPointToPoint(r,l),l.applyMatrix4(n);let c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:a})}}var tl=class extends Ie{constructor(t,e,n,i,s=Me,a=Me,o,l,c){super(t,e,n,i,s,a,o,l,c),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let h=this;function f(){h.needsUpdate=!0,h._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f)}"requestVideoFrameCallback"in t&&(this._requestVideoFrameCallbackId=t.requestVideoFrameCallback(f))}clone(){return new this.constructor(this.image).copy(this)}update(){let t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&(this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),this._requestVideoFrameCallbackId=0),super.dispose()}},ou=class extends tl{constructor(t,e,n,i,s,a,o,l){super({},t,e,n,i,s,a,o,l),this.isVideoFrameTexture=!0}update(){}clone(){return new this.constructor().copy(this)}setFrame(t){this.image=t,this.needsUpdate=!0}},lu=class extends Ie{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Pe,this.minFilter=Pe,this.generateMipmaps=!1,this.needsUpdate=!0}},dr=class extends Ie{constructor(t,e,n,i,s,a,o,l,c,h,f,u){super(null,a,o,l,c,h,i,s,f,u),this.isCompressedTexture=!0,this.image={width:e,height:n},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}},cu=class extends dr{constructor(t,e,n,i,s,a){super(t,e,n,s,a),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=mn,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},hu=class extends dr{constructor(t,e,n){super(void 0,t[0].width,t[0].height,e,n,di),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}},Es=class extends Ie{constructor(t=[],e=di,n,i,s,a,o,l,c,h){super(t,e,n,i,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},uu=class extends Ie{constructor(t,e,n,i,s,a,o,l,c){super(t,e,n,i,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},fu=class extends Ie{constructor(t,e,n,i,s,a,o,l,c){super(t,e,n,i,s,a,o,l,c),this.isHTMLTexture=!0,this.generateMipmaps=!1,this.needsUpdate=!0;let h=t?t.parentNode:null;h!==null&&"requestPaint"in h&&(h.onpaint=()=>{this.needsUpdate=!0},h.requestPaint())}dispose(){let t=this.image?this.image.parentNode:null;t!==null&&"onpaint"in t&&(t.onpaint=null),super.dispose()}},Ti=class extends Ie{constructor(t,e,n=Vn,i,s,a,o=Pe,l=Pe,c,h=li,f=1){if(h!==li&&h!==ji)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,i,s,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ai(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},el=class extends Ti{constructor(t,e=Vn,n=di,i,s,a=Pe,o=Pe,l,c=li){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,i,s,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Sa=class extends Ie{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},kn=class r extends Ht{constructor(t=1,e=1,n=1,i=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:a};let o=this;i=Math.floor(i),s=Math.floor(s),a=Math.floor(a);let l=[],c=[],h=[],f=[],u=0,d=0;p("z","y","x",-1,-1,n,e,t,a,s,0),p("z","y","x",1,-1,n,e,-t,a,s,1),p("x","z","y",1,1,t,n,e,i,a,2),p("x","z","y",1,-1,t,n,-e,i,a,3),p("x","y","z",1,-1,t,e,n,i,s,4),p("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new Et(c,3)),this.setAttribute("normal",new Et(h,3)),this.setAttribute("uv",new Et(f,2));function p(_,m,g,x,v,M,E,S,w,y,T){let R=M/w,P=E/y,U=M/2,z=E/2,k=S/2,D=w+1,F=y+1,L=0,W=0,q=new I;for(let et=0;et<F;et++){let lt=et*P-z;for(let mt=0;mt<D;mt++){let Ft=mt*R-U;q[_]=Ft*x,q[m]=lt*v,q[g]=k,c.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[g]=S>0?1:-1,h.push(q.x,q.y,q.z),f.push(mt/w),f.push(1-et/y),L+=1}}for(let et=0;et<y;et++)for(let lt=0;lt<w;lt++){let mt=u+lt+D*et,Ft=u+lt+D*(et+1),kt=u+(lt+1)+D*(et+1),Ot=u+(lt+1)+D*et;l.push(mt,Ft,Ot),l.push(Ft,kt,Ot),W+=6}o.addGroup(d,W,T),d+=W,u+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},nl=class r extends Ht{constructor(t=1,e=1,n=4,i=8,s=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:s},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),s=Math.max(1,Math.floor(s));let a=[],o=[],l=[],c=[],h=e/2,f=Math.PI/2*t,u=e,d=2*f+u,p=n*2+s,_=i+1,m=new I,g=new I;for(let x=0;x<=p;x++){let v=0,M=0,E=0,S=0;if(x<=n){let T=x/n,R=T*Math.PI/2;M=-h-t*Math.cos(R),E=t*Math.sin(R),S=-t*Math.cos(R),v=T*f}else if(x<=n+s){let T=(x-n)/s;M=-h+T*e,E=t,S=0,v=f+T*u}else{let T=(x-n-s)/n,R=T*Math.PI/2;M=h+t*Math.sin(R),E=t*Math.cos(R),S=t*Math.sin(R),v=f+u+T*f}let w=Math.max(0,Math.min(1,v/d)),y=0;x===0?y=.5/i:x===p&&(y=-.5/i);for(let T=0;T<=i;T++){let R=T/i,P=R*Math.PI*2,U=Math.sin(P),z=Math.cos(P);g.x=-E*z,g.y=M,g.z=E*U,o.push(g.x,g.y,g.z),m.set(-E*z,S,E*U),m.normalize(),l.push(m.x,m.y,m.z),c.push(R+y,w)}if(x>0){let T=(x-1)*_;for(let R=0;R<i;R++){let P=T+R,U=T+R+1,z=x*_+R,k=x*_+R+1;a.push(P,U,z),a.push(U,k,z)}}}this.setIndex(a),this.setAttribute("position",new Et(o,3)),this.setAttribute("normal",new Et(l,3)),this.setAttribute("uv",new Et(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},il=class r extends Ht{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let s=[],a=[],o=[],l=[],c=new I,h=new Q;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){let d=n+f/e*i;c.x=t*Math.cos(d),c.y=t*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/t+1)/2,h.y=(a[u+1]/t+1)/2,l.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Et(a,3)),this.setAttribute("normal",new Et(o,3)),this.setAttribute("uv",new Et(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.segments,t.thetaStart,t.thetaLength)}},wn=class r extends Ht{constructor(t=1,e=1,n=1,i=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};let c=this;i=Math.floor(i),s=Math.floor(s);let h=[],f=[],u=[],d=[],p=0,_=[],m=n/2,g=0;x(),a===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Et(f,3)),this.setAttribute("normal",new Et(u,3)),this.setAttribute("uv",new Et(d,2));function x(){let M=new I,E=new I,S=0,w=(e-t)/n;for(let y=0;y<=s;y++){let T=[],R=y/s,P=R*(e-t)+t;for(let U=0;U<=i;U++){let z=U/i,k=z*l+o,D=Math.sin(k),F=Math.cos(k);E.x=P*D,E.y=-R*n+m,E.z=P*F,f.push(E.x,E.y,E.z),M.set(D,w,F).normalize(),u.push(M.x,M.y,M.z),d.push(z,1-R),T.push(p++)}_.push(T)}for(let y=0;y<i;y++)for(let T=0;T<s;T++){let R=_[T][y],P=_[T+1][y],U=_[T+1][y+1],z=_[T][y+1];(t>0||T!==0)&&(h.push(R,P,z),S+=3),(e>0||T!==s-1)&&(h.push(P,U,z),S+=3)}c.addGroup(g,S,0),g+=S}function v(M){let E=p,S=new Q,w=new I,y=0,T=M===!0?t:e,R=M===!0?1:-1;for(let U=1;U<=i;U++)f.push(0,m*R,0),u.push(0,R,0),d.push(.5,.5),p++;let P=p;for(let U=0;U<=i;U++){let k=U/i*l+o,D=Math.cos(k),F=Math.sin(k);w.x=T*F,w.y=m*R,w.z=T*D,f.push(w.x,w.y,w.z),u.push(0,R,0),S.x=D*.5+.5,S.y=F*.5*R+.5,d.push(S.x,S.y),p++}for(let U=0;U<i;U++){let z=E+U,k=P+U;M===!0?h.push(k,k+1,z):h.push(k+1,k,z),y+=3}c.addGroup(g,y,M===!0?1:2),g+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ba=class r extends wn{constructor(t=1,e=1,n=32,i=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,i,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new r(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Zi=class r extends Ht{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let s=[],a=[];o(i),c(n),h(),this.setAttribute("position",new Et(s,3)),this.setAttribute("normal",new Et(s.slice(),3)),this.setAttribute("uv",new Et(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){let v=new I,M=new I,E=new I;for(let S=0;S<e.length;S+=3)d(e[S+0],v),d(e[S+1],M),d(e[S+2],E),l(v,M,E,x)}function l(x,v,M,E){let S=E+1,w=[];for(let y=0;y<=S;y++){w[y]=[];let T=x.clone().lerp(M,y/S),R=v.clone().lerp(M,y/S),P=S-y;for(let U=0;U<=P;U++)U===0&&y===S?w[y][U]=T:w[y][U]=T.clone().lerp(R,U/P)}for(let y=0;y<S;y++)for(let T=0;T<2*(S-y)-1;T++){let R=Math.floor(T/2);T%2===0?(u(w[y][R+1]),u(w[y+1][R]),u(w[y][R])):(u(w[y][R+1]),u(w[y+1][R+1]),u(w[y+1][R]))}}function c(x){let v=new I;for(let M=0;M<s.length;M+=3)v.x=s[M+0],v.y=s[M+1],v.z=s[M+2],v.normalize().multiplyScalar(x),s[M+0]=v.x,s[M+1]=v.y,s[M+2]=v.z}function h(){let x=new I;for(let v=0;v<s.length;v+=3){x.x=s[v+0],x.y=s[v+1],x.z=s[v+2];let M=m(x)/2/Math.PI+.5,E=g(x)/Math.PI+.5;a.push(M,1-E)}p(),f()}function f(){for(let x=0;x<a.length;x+=6){let v=a[x+0],M=a[x+2],E=a[x+4],S=Math.max(v,M,E),w=Math.min(v,M,E);S>.9&&w<.1&&(v<.2&&(a[x+0]+=1),M<.2&&(a[x+2]+=1),E<.2&&(a[x+4]+=1))}}function u(x){s.push(x.x,x.y,x.z)}function d(x,v){let M=x*3;v.x=t[M+0],v.y=t[M+1],v.z=t[M+2]}function p(){let x=new I,v=new I,M=new I,E=new I,S=new Q,w=new Q,y=new Q;for(let T=0,R=0;T<s.length;T+=9,R+=6){x.set(s[T+0],s[T+1],s[T+2]),v.set(s[T+3],s[T+4],s[T+5]),M.set(s[T+6],s[T+7],s[T+8]),S.set(a[R+0],a[R+1]),w.set(a[R+2],a[R+3]),y.set(a[R+4],a[R+5]),E.copy(x).add(v).add(M).divideScalar(3);let P=m(E);_(S,R+0,x,P),_(w,R+2,v,P),_(y,R+4,M,P)}}function _(x,v,M,E){E<0&&x.x===1&&(a[v]=x.x-1),M.x===0&&M.z===0&&(a[v]=E/2/Math.PI+.5)}function m(x){return Math.atan2(x.z,-x.x)}function g(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.vertices,t.indices,t.radius,t.detail)}},sl=class r extends Zi{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},Lh=new I,Nh=new I,vd=new I,Uh=new ri,rl=class extends Ht{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let i=Math.pow(10,4),s=Math.cos(ir*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],f=new Array(3),u={},d=[];for(let p=0;p<l;p+=3){a?(c[0]=a.getX(p),c[1]=a.getX(p+1),c[2]=a.getX(p+2)):(c[0]=p,c[1]=p+1,c[2]=p+2);let{a:_,b:m,c:g}=Uh;if(_.fromBufferAttribute(o,c[0]),m.fromBufferAttribute(o,c[1]),g.fromBufferAttribute(o,c[2]),Uh.getNormal(vd),f[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,f[1]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,f[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let x=0;x<3;x++){let v=(x+1)%3,M=f[x],E=f[v],S=Uh[h[x]],w=Uh[h[v]],y=`${M}_${E}`,T=`${E}_${M}`;T in u&&u[T]?(vd.dot(u[T].normal)<=s&&(d.push(S.x,S.y,S.z),d.push(w.x,w.y,w.z)),u[T]=null):y in u||(u[y]={index0:c[x],index1:c[v],normal:vd.clone()})}}for(let p in u)if(u[p]){let{index0:_,index1:m}=u[p];Lh.fromBufferAttribute(o,_),Nh.fromBufferAttribute(o,m),d.push(Lh.x,Lh.y,Lh.z),d.push(Nh.x,Nh.y,Nh.z)}this.setAttribute("position",new Et(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},An=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){ft("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,s=n.length,a;e?a=e:a=t*n[s-1];let o=0,l=s-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(s-1);let h=n[i],u=n[i+1]-h,d=(a-h)/u;return(i+d)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);let a=this.getPoint(i),o=this.getPoint(s),l=e||(a.isVector2?new Q:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new I,i=[],s=[],a=[],o=new I,l=new Gt;for(let d=0;d<=t;d++){let p=d/t;i[d]=this.getTangentAt(p,new I)}s[0]=new I,a[0]=new I;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),f=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],o),a[0].crossVectors(i[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(i[d-1],i[d]),o.length()>Number.EPSILON){o.normalize();let p=Math.acos(zt(i[d-1].dot(i[d]),-1,1));s[d].applyMatrix4(l.makeRotationAxis(o,p))}a[d].crossVectors(i[d],s[d])}if(e===!0){let d=Math.acos(zt(s[0].dot(s[t]),-1,1));d/=t,i[0].dot(o.crossVectors(s[0],s[t]))>0&&(d=-d);for(let p=1;p<=t;p++)s[p].applyMatrix4(l.makeRotationAxis(i[p],d*p)),a[p].crossVectors(i[p],s[p])}return{tangents:i,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},pr=class extends An{constructor(t=0,e=0,n=1,i=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new Q){let n=e,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(a?s=0:s=i),this.aClockwise===!0&&!a&&(s===i?s=-i:s=s-i);let o=this.aStartAngle+t*s,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},al=class extends pr{constructor(t,e,n,i,s,a){super(t,e,n,n,i,s,a),this.isArcCurve=!0,this.type="ArcCurve"}};function wp(){let r=0,t=0,e=0,n=0;function i(s,a,o,l){r=s,t=o,e=-3*s+3*a-2*o-l,n=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){i(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,f){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,i(a,o,u,d)},calc:function(s){let a=s*s,o=a*s;return r+t*s+e*a+n*o}}}var Ig=new I,Dg=new I,yd=new wp,Md=new wp,Sd=new wp,ol=class extends An{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new I){let n=e,i=this.points,s=i.length,a=(s-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%s]:(Dg.subVectors(i[0],i[1]).add(i[0]),c=Dg);let f=i[o%s],u=i[(o+1)%s];if(this.closed||o+2<s?h=i[(o+2)%s]:(Ig.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=Ig),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,p=Math.pow(c.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(u),d),m=Math.pow(u.distanceToSquared(h),d);_<1e-4&&(_=1),p<1e-4&&(p=_),m<1e-4&&(m=_),yd.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,_,m),Md.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,_,m),Sd.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,_,m)}else this.curveType==="catmullrom"&&(yd.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),Md.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),Sd.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(yd.calc(l),Md.calc(l),Sd.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new I().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Lg(r,t,e,n,i){let s=(n-t)*.5,a=(i-e)*.5,o=r*r,l=r*o;return(2*e-2*n+s+a)*l+(-3*e+3*n-2*s-a)*o+s*r+e}function ty(r,t){let e=1-r;return e*e*t}function ey(r,t){return 2*(1-r)*r*t}function ny(r,t){return r*r*t}function Io(r,t,e,n){return ty(r,t)+ey(r,e)+ny(r,n)}function iy(r,t){let e=1-r;return e*e*e*t}function sy(r,t){let e=1-r;return 3*e*e*r*t}function ry(r,t){return 3*(1-r)*r*r*t}function ay(r,t){return r*r*r*t}function Do(r,t,e,n,i){return iy(r,t)+sy(r,e)+ry(r,n)+ay(r,i)}var Ta=class extends An{constructor(t=new Q,e=new Q,n=new Q,i=new Q){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new Q){let n=e,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Do(t,i.x,s.x,a.x,o.x),Do(t,i.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},ll=class extends An{constructor(t=new I,e=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new I){let n=e,i=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Do(t,i.x,s.x,a.x,o.x),Do(t,i.y,s.y,a.y,o.y),Do(t,i.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Ea=class extends An{constructor(t=new Q,e=new Q){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Q){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Q){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},cl=class extends An{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},wa=class extends An{constructor(t=new Q,e=new Q,n=new Q){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Q){let n=e,i=this.v0,s=this.v1,a=this.v2;return n.set(Io(t,i.x,s.x,a.x),Io(t,i.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Aa=class extends An{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){let n=e,i=this.v0,s=this.v1,a=this.v2;return n.set(Io(t,i.x,s.x,a.x),Io(t,i.y,s.y,a.y),Io(t,i.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ca=class extends An{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Q){let n=e,i=this.points,s=(i.length-1)*t,a=Math.floor(s),o=s-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],f=i[a>i.length-3?i.length-1:a+2];return n.set(Lg(o,l.x,c.x,h.x,f.x),Lg(o,l.y,c.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new Q().fromArray(i))}return this}},du=Object.freeze({__proto__:null,ArcCurve:al,CatmullRomCurve3:ol,CubicBezierCurve:Ta,CubicBezierCurve3:ll,EllipseCurve:pr,LineCurve:Ea,LineCurve3:cl,QuadraticBezierCurve:wa,QuadraticBezierCurve3:Aa,SplineCurve:Ca}),hl=class extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new du[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let a=i[s]-n,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}s++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,s=this.curves;i<s.length;i++){let a=s[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new du[i.type]().fromJSON(i))}return this}},mr=class extends hl{constructor(t){super(),this.type="Path",this.currentPoint=new Q,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Ea(this.currentPoint.clone(),new Q(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let s=new wa(this.currentPoint.clone(),new Q(t,e),new Q(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,a){let o=new Ta(this.currentPoint.clone(),new Q(t,e),new Q(n,i),new Q(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ca(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,s,a),this}absarc(t,e,n,i,s,a){return this.absellipse(t,e,n,n,i,s,a),this}ellipse(t,e,n,i,s,a,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,i,s,a,o,l),this}absellipse(t,e,n,i,s,a,o,l){let c=new pr(t,e,n,i,s,a,o,l);if(this.curves.length>0){let f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Si=class extends mr{constructor(t){super(t),this.uuid=Fn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new mr().fromJSON(i))}return this}};function oy(r,t,e=2){let n=t&&t.length,i=n?t[0]*e:r.length,s=o0(r,0,i,e,!0),a=[];if(!s||s.next===s.prev)return a;let o,l,c;if(n&&(s=fy(r,t,s,e)),r.length>80*e){o=r[0],l=r[1];let h=o,f=l;for(let u=e;u<i;u+=e){let d=r[u],p=r[u+1];d<o&&(o=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return ul(s,a,e,o,l,c,0),a}function o0(r,t,e,n,i){let s;if(i===by(r,t,e,n)>0)for(let a=t;a<e;a+=n)s=Ng(a/n|0,r[a],r[a+1],s);else for(let a=e-n;a>=t;a-=n)s=Ng(a/n|0,r[a],r[a+1],s);return s&&Ra(s,s.next)&&(dl(s),s=s.next),s}function gr(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(Ra(e,e.next)||be(e.prev,e,e.next)===0)){if(dl(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function ul(r,t,e,n,i,s,a){if(!r)return;!a&&s&&_y(r,n,i,s);let o=r;for(;r.prev!==r.next;){let l=r.prev,c=r.next;if(s?cy(r,n,i,s):ly(r)){t.push(l.i,r.i,c.i),dl(r),r=c.next,o=c.next;continue}if(r=c,r===o){a?a===1?(r=hy(gr(r),t),ul(r,t,e,n,i,s,2)):a===2&&uy(r,t,e,n,i,s):ul(gr(r),t,e,n,i,s,1);break}}}function ly(r){let t=r.prev,e=r,n=r.next;if(be(t,e,n)>=0)return!1;let i=t.x,s=e.x,a=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(i,s,a),f=Math.min(o,l,c),u=Math.max(i,s,a),d=Math.max(o,l,c),p=n.next;for(;p!==t;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&Co(i,o,s,l,a,c,p.x,p.y)&&be(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function cy(r,t,e,n){let i=r.prev,s=r,a=r.next;if(be(i,s,a)>=0)return!1;let o=i.x,l=s.x,c=a.x,h=i.y,f=s.y,u=a.y,d=Math.min(o,l,c),p=Math.min(h,f,u),_=Math.max(o,l,c),m=Math.max(h,f,u),g=Dd(d,p,t,e,n),x=Dd(_,m,t,e,n),v=r.prevZ,M=r.nextZ;for(;v&&v.z>=g&&M&&M.z<=x;){if(v.x>=d&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==a&&Co(o,h,l,f,c,u,v.x,v.y)&&be(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=d&&M.x<=_&&M.y>=p&&M.y<=m&&M!==i&&M!==a&&Co(o,h,l,f,c,u,M.x,M.y)&&be(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=g;){if(v.x>=d&&v.x<=_&&v.y>=p&&v.y<=m&&v!==i&&v!==a&&Co(o,h,l,f,c,u,v.x,v.y)&&be(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=x;){if(M.x>=d&&M.x<=_&&M.y>=p&&M.y<=m&&M!==i&&M!==a&&Co(o,h,l,f,c,u,M.x,M.y)&&be(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function hy(r,t){let e=r;do{let n=e.prev,i=e.next.next;!Ra(n,i)&&c0(n,e,e.next,i)&&fl(n,i)&&fl(i,n)&&(t.push(n.i,e.i,i.i),dl(e),dl(e.next),e=r=i),e=e.next}while(e!==r);return gr(e)}function uy(r,t,e,n,i,s){let a=r;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&yy(a,o)){let l=h0(a,o);a=gr(a,a.next),l=gr(l,l.next),ul(a,t,e,n,i,s,0),ul(l,t,e,n,i,s,0);return}o=o.next}a=a.next}while(a!==r)}function fy(r,t,e,n){let i=[];for(let s=0,a=t.length;s<a;s++){let o=t[s]*n,l=s<a-1?t[s+1]*n:r.length,c=o0(r,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(vy(c))}i.sort(dy);for(let s=0;s<i.length;s++)e=py(i[s],e);return e}function dy(r,t){let e=r.x-t.x;if(e===0&&(e=r.y-t.y,e===0)){let n=(r.next.y-r.y)/(r.next.x-r.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function py(r,t){let e=my(r,t);if(!e)return t;let n=h0(e,r);return gr(n,n.next),gr(e,e.next)}function my(r,t){let e=t,n=r.x,i=r.y,s=-1/0,a;if(Ra(r,e))return e;do{if(Ra(r,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){let f=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>s&&(s=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;let o=a,l=a.x,c=a.y,h=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&l0(i<c?n:s,i,l,c,i<c?s:n,i,e.x,e.y)){let f=Math.abs(i-e.y)/(n-e.x);fl(e,r)&&(f<h||f===h&&(e.x>a.x||e.x===a.x&&gy(a,e)))&&(a=e,h=f)}e=e.next}while(e!==o);return a}function gy(r,t){return be(r.prev,r,t.prev)<0&&be(t.next,r,r.next)<0}function _y(r,t,e,n){let i=r;do i.z===0&&(i.z=Dd(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,xy(i)}function xy(r){let t,e=1;do{let n=r,i;r=null;let s=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=a}s.nextZ=null,e*=2}while(t>1);return r}function Dd(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function vy(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function l0(r,t,e,n,i,s,a,o){return(i-a)*(t-o)>=(r-a)*(s-o)&&(r-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(i-a)*(n-o)}function Co(r,t,e,n,i,s,a,o){return!(r===a&&t===o)&&l0(r,t,e,n,i,s,a,o)}function yy(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!My(r,t)&&(fl(r,t)&&fl(t,r)&&Sy(r,t)&&(be(r.prev,r,t.prev)||be(r,t.prev,t))||Ra(r,t)&&be(r.prev,r,r.next)>0&&be(t.prev,t,t.next)>0)}function be(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Ra(r,t){return r.x===t.x&&r.y===t.y}function c0(r,t,e,n){let i=Oh(be(r,t,e)),s=Oh(be(r,t,n)),a=Oh(be(e,n,r)),o=Oh(be(e,n,t));return!!(i!==s&&a!==o||i===0&&Fh(r,e,t)||s===0&&Fh(r,n,t)||a===0&&Fh(e,r,n)||o===0&&Fh(e,t,n))}function Fh(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function Oh(r){return r>0?1:r<0?-1:0}function My(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&c0(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function fl(r,t){return be(r.prev,r,r.next)<0?be(r,t,r.next)>=0&&be(r,r.prev,t)>=0:be(r,t,r.prev)<0||be(r,r.next,t)<0}function Sy(r,t){let e=r,n=!1,i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function h0(r,t){let e=Ld(r.i,r.x,r.y),n=Ld(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Ng(r,t,e,n){let i=Ld(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function dl(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Ld(r,t,e){return{i:r,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function by(r,t,e,n){let i=0;for(let s=t,a=e-n;s<e;s+=n)i+=(r[a]-r[s])*(r[s+1]+r[a+1]),a=s;return i}var Nd=class{static triangulate(t,e,n=2){return oy(t,e,n)}},Zn=class r{static area(t){let e=t.length,n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return r.area(t)<0}static triangulateShape(t,e){let n=[],i=[],s=[];Ug(t),Fg(n,t);let a=t.length;e.forEach(Ug);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Fg(n,e[l]);let o=Nd.triangulate(n,i);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}};function Ug(r){let t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function Fg(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}var pl=class r extends Ht{constructor(t=new Si([new Q(.5,.5),new Q(-.5,.5),new Q(-.5,-.5),new Q(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],s=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];a(c)}this.setAttribute("position",new Et(i,3)),this.setAttribute("uv",new Et(s,2)),this.computeVertexNormals();function a(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,p=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,m=e.bevelSegments!==void 0?e.bevelSegments:3,g=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Ty,v,M=!1,E,S,w,y;if(g){v=g.getSpacedPoints(h),M=!0,u=!1;let j=g.isCatmullRomCurve3?g.closed:!1;E=g.computeFrenetFrames(h,j),S=new I,w=new I,y=new I}u||(m=0,d=0,p=0,_=0);let T=o.extractPoints(c),R=T.shape,P=T.holes;if(!Zn.isClockWise(R)){R=R.reverse();for(let j=0,st=P.length;j<st;j++){let tt=P[j];Zn.isClockWise(tt)&&(P[j]=tt.reverse())}}function z(j){let tt=10000000000000001e-36,yt=j[0];for(let gt=1;gt<=j.length;gt++){let Xt=gt%j.length,N=j[Xt],Zt=N.x-yt.x,Pt=N.y-yt.y,qt=Zt*Zt+Pt*Pt,rt=Math.max(Math.abs(N.x),Math.abs(N.y),Math.abs(yt.x),Math.abs(yt.y)),ue=tt*rt*rt;if(qt<=ue){j.splice(Xt,1),gt--;continue}yt=N}}z(R),P.forEach(z);let k=P.length,D=R;for(let j=0;j<k;j++){let st=P[j];R=R.concat(st)}function F(j,st,tt){return st||Rt("ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(st,tt)}let L=R.length;function W(j,st,tt){let yt,gt,Xt,N=j.x-st.x,Zt=j.y-st.y,Pt=tt.x-j.x,qt=tt.y-j.y,rt=N*N+Zt*Zt,ue=N*qt-Zt*Pt;if(Math.abs(ue)>Number.EPSILON){let C=Math.sqrt(rt),b=Math.sqrt(Pt*Pt+qt*qt),V=st.x-Zt/C,J=st.y+N/C,nt=tt.x-qt/b,ot=tt.y+Pt/b,ut=((nt-V)*qt-(ot-J)*Pt)/(N*qt-Zt*Pt);yt=V+N*ut-j.x,gt=J+Zt*ut-j.y;let Y=yt*yt+gt*gt;if(Y<=2)return new Q(yt,gt);Xt=Math.sqrt(Y/2)}else{let C=!1;N>Number.EPSILON?Pt>Number.EPSILON&&(C=!0):N<-Number.EPSILON?Pt<-Number.EPSILON&&(C=!0):Math.sign(Zt)===Math.sign(qt)&&(C=!0),C?(yt=-Zt,gt=N,Xt=Math.sqrt(rt)):(yt=N,gt=Zt,Xt=Math.sqrt(rt/2))}return new Q(yt/Xt,gt/Xt)}let q=[];for(let j=0,st=D.length,tt=st-1,yt=j+1;j<st;j++,tt++,yt++)tt===st&&(tt=0),yt===st&&(yt=0),q[j]=W(D[j],D[tt],D[yt]);let et=[],lt,mt=q.concat();for(let j=0,st=k;j<st;j++){let tt=P[j];lt=[];for(let yt=0,gt=tt.length,Xt=gt-1,N=yt+1;yt<gt;yt++,Xt++,N++)Xt===gt&&(Xt=0),N===gt&&(N=0),lt[yt]=W(tt[yt],tt[Xt],tt[N]);et.push(lt),mt=mt.concat(lt)}let Ft;if(m===0)Ft=Zn.triangulateShape(D,P);else{let j=[],st=[];for(let tt=0;tt<m;tt++){let yt=tt/m,gt=d*Math.cos(yt*Math.PI/2),Xt=p*Math.sin(yt*Math.PI/2)+_;for(let N=0,Zt=D.length;N<Zt;N++){let Pt=F(D[N],q[N],Xt);Dt(Pt.x,Pt.y,-gt),yt===0&&j.push(Pt)}for(let N=0,Zt=k;N<Zt;N++){let Pt=P[N];lt=et[N];let qt=[];for(let rt=0,ue=Pt.length;rt<ue;rt++){let C=F(Pt[rt],lt[rt],Xt);Dt(C.x,C.y,-gt),yt===0&&qt.push(C)}yt===0&&st.push(qt)}}Ft=Zn.triangulateShape(j,st)}let kt=Ft.length,Ot=p+_;for(let j=0;j<L;j++){let st=u?F(R[j],mt[j],Ot):R[j];M?(w.copy(E.normals[0]).multiplyScalar(st.x),S.copy(E.binormals[0]).multiplyScalar(st.y),y.copy(v[0]).add(w).add(S),Dt(y.x,y.y,y.z)):Dt(st.x,st.y,0)}for(let j=1;j<=h;j++)for(let st=0;st<L;st++){let tt=u?F(R[st],mt[st],Ot):R[st];M?(w.copy(E.normals[j]).multiplyScalar(tt.x),S.copy(E.binormals[j]).multiplyScalar(tt.y),y.copy(v[j]).add(w).add(S),Dt(y.x,y.y,y.z)):Dt(tt.x,tt.y,f/h*j)}for(let j=m-1;j>=0;j--){let st=j/m,tt=d*Math.cos(st*Math.PI/2),yt=p*Math.sin(st*Math.PI/2)+_;for(let gt=0,Xt=D.length;gt<Xt;gt++){let N=F(D[gt],q[gt],yt);Dt(N.x,N.y,f+tt)}for(let gt=0,Xt=P.length;gt<Xt;gt++){let N=P[gt];lt=et[gt];for(let Zt=0,Pt=N.length;Zt<Pt;Zt++){let qt=F(N[Zt],lt[Zt],yt);M?Dt(qt.x,qt.y+v[h-1].y,v[h-1].x+tt):Dt(qt.x,qt.y,f+tt)}}}$(),_t();function $(){let j=i.length/3;if(u){let st=0,tt=L*st;for(let yt=0;yt<kt;yt++){let gt=Ft[yt];Vt(gt[2]+tt,gt[1]+tt,gt[0]+tt)}st=h+m*2,tt=L*st;for(let yt=0;yt<kt;yt++){let gt=Ft[yt];Vt(gt[0]+tt,gt[1]+tt,gt[2]+tt)}}else{for(let st=0;st<kt;st++){let tt=Ft[st];Vt(tt[2],tt[1],tt[0])}for(let st=0;st<kt;st++){let tt=Ft[st];Vt(tt[0]+L*h,tt[1]+L*h,tt[2]+L*h)}}n.addGroup(j,i.length/3-j,0)}function _t(){let j=i.length/3,st=0;at(D,st),st+=D.length;for(let tt=0,yt=P.length;tt<yt;tt++){let gt=P[tt];at(gt,st),st+=gt.length}n.addGroup(j,i.length/3-j,1)}function at(j,st){let tt=j.length;for(;--tt>=0;){let yt=tt,gt=tt-1;gt<0&&(gt=j.length-1);for(let Xt=0,N=h+m*2;Xt<N;Xt++){let Zt=L*Xt,Pt=L*(Xt+1),qt=st+yt+Zt,rt=st+gt+Zt,ue=st+gt+Pt,C=st+yt+Pt;Bt(qt,rt,ue,C)}}}function Dt(j,st,tt){l.push(j),l.push(st),l.push(tt)}function Vt(j,st,tt){re(j),re(st),re(tt);let yt=i.length/3,gt=x.generateTopUV(n,i,yt-3,yt-2,yt-1);Wt(gt[0]),Wt(gt[1]),Wt(gt[2])}function Bt(j,st,tt,yt){re(j),re(st),re(yt),re(st),re(tt),re(yt);let gt=i.length/3,Xt=x.generateSideWallUV(n,i,gt-6,gt-3,gt-2,gt-1);Wt(Xt[0]),Wt(Xt[1]),Wt(Xt[3]),Wt(Xt[1]),Wt(Xt[2]),Wt(Xt[3])}function re(j){i.push(l[j*3+0]),i.push(l[j*3+1]),i.push(l[j*3+2])}function Wt(j){s.push(j.x),s.push(j.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Ey(e,n,t)}static fromJSON(t,e){let n=[];for(let s=0,a=t.shapes.length;s<a;s++){let o=e[t.shapes[s]];n.push(o)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new du[i.type]().fromJSON(i)),new r(n,t.options)}},Ty={generateTopUV:function(r,t,e,n,i){let s=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],h=t[i*3+1];return[new Q(s,a),new Q(o,l),new Q(c,h)]},generateSideWallUV:function(r,t,e,n,i,s){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],f=t[n*3+2],u=t[i*3],d=t[i*3+1],p=t[i*3+2],_=t[s*3],m=t[s*3+1],g=t[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new Q(a,1-l),new Q(c,1-f),new Q(u,1-p),new Q(_,1-g)]:[new Q(o,1-l),new Q(h,1-f),new Q(d,1-p),new Q(m,1-g)]}};function Ey(r,t,e){if(e.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var _r=class r extends Zi{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},ml=class r extends Ht{constructor(t=[new Q(0,-.5),new Q(.5,0),new Q(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=zt(i,0,Math.PI*2);let s=[],a=[],o=[],l=[],c=[],h=1/e,f=new I,u=new Q,d=new I,p=new I,_=new I,m=0,g=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:m=t[x+1].x-t[x].x,g=t[x+1].y-t[x].y,d.x=g*1,d.y=-m,d.z=g*0,_.copy(d),d.normalize(),l.push(d.x,d.y,d.z);break;case t.length-1:l.push(_.x,_.y,_.z);break;default:m=t[x+1].x-t[x].x,g=t[x+1].y-t[x].y,d.x=g*1,d.y=-m,d.z=g*0,p.copy(d),d.x+=_.x,d.y+=_.y,d.z+=_.z,d.normalize(),l.push(d.x,d.y,d.z),_.copy(p)}for(let x=0;x<=e;x++){let v=n+x*h*i,M=Math.sin(v),E=Math.cos(v);for(let S=0;S<=t.length-1;S++){f.x=t[S].x*M,f.y=t[S].y,f.z=t[S].x*E,a.push(f.x,f.y,f.z),u.x=x/e,u.y=S/(t.length-1),o.push(u.x,u.y);let w=l[3*S+0]*M,y=l[3*S+1],T=l[3*S+0]*E;c.push(w,y,T)}}for(let x=0;x<e;x++)for(let v=0;v<t.length-1;v++){let M=v+x*t.length,E=M,S=M+t.length,w=M+t.length+1,y=M+1;s.push(E,S,y),s.push(w,y,S)}this.setIndex(s),this.setAttribute("position",new Et(a,3)),this.setAttribute("uv",new Et(o,2)),this.setAttribute("normal",new Et(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.points,t.segments,t.phiStart,t.phiLength)}},Pa=class r extends Zi{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},Ji=class r extends Ht{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let s=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,f=t/o,u=e/l,d=[],p=[],_=[],m=[];for(let g=0;g<h;g++){let x=g*u-a;for(let v=0;v<c;v++){let M=v*f-s;p.push(M,-x,0),_.push(0,0,1),m.push(v/o),m.push(1-g/l)}}for(let g=0;g<l;g++)for(let x=0;x<o;x++){let v=x+c*g,M=x+c*(g+1),E=x+1+c*(g+1),S=x+1+c*g;d.push(v,M,S),d.push(M,E,S)}this.setIndex(d),this.setAttribute("position",new Et(p,3)),this.setAttribute("normal",new Et(_,3)),this.setAttribute("uv",new Et(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.widthSegments,t.heightSegments)}},gl=class r extends Ht{constructor(t=.5,e=1,n=32,i=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);let o=[],l=[],c=[],h=[],f=t,u=(e-t)/i,d=new I,p=new Q;for(let _=0;_<=i;_++){for(let m=0;m<=n;m++){let g=s+m/n*a;d.x=f*Math.cos(g),d.y=f*Math.sin(g),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/e+1)/2,p.y=(d.y/e+1)/2,h.push(p.x,p.y)}f+=u}for(let _=0;_<i;_++){let m=_*(n+1);for(let g=0;g<n;g++){let x=g+m,v=x,M=x+n+1,E=x+n+2,S=x+1;o.push(v,M,S),o.push(M,E,S)}}this.setIndex(o),this.setAttribute("position",new Et(l,3)),this.setAttribute("normal",new Et(c,3)),this.setAttribute("uv",new Et(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},_l=class r extends Ht{constructor(t=new Si([new Q(0,.5),new Q(-.5,-.5),new Q(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],s=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Et(i,3)),this.setAttribute("normal",new Et(s,3)),this.setAttribute("uv",new Et(a,2));function c(h){let f=i.length/3,u=h.extractPoints(e),d=u.shape,p=u.holes;Zn.isClockWise(d)===!1&&(d=d.reverse());for(let m=0,g=p.length;m<g;m++){let x=p[m];Zn.isClockWise(x)===!0&&(p[m]=x.reverse())}let _=Zn.triangulateShape(d,p);for(let m=0,g=p.length;m<g;m++){let x=p[m];d=d.concat(x)}for(let m=0,g=d.length;m<g;m++){let x=d[m];i.push(x.x,x.y,0),s.push(0,0,1),a.push(x.x,x.y)}for(let m=0,g=_.length;m<g;m++){let x=_[m],v=x[0]+f,M=x[1]+f,E=x[2]+f;n.push(v,M,E),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return wy(e,t)}static fromJSON(t,e){let n=[];for(let i=0,s=t.shapes.length;i<s;i++){let a=e[t.shapes[i]];n.push(a)}return new r(n,t.curveSegments)}};function wy(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,n=r.length;e<n;e++){let i=r[e];t.shapes.push(i.uuid)}else t.shapes.push(r.uuid);return t}var $i=class r extends Ht{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),c=0,h=[],f=new I,u=new I,d=[],p=[],_=[],m=[];for(let g=0;g<=n;g++){let x=[],v=g/n,M=0;g===0&&a===0?M=.5/e:g===n&&l===Math.PI&&(M=-.5/e);for(let E=0;E<=e;E++){let S=E/e;f.x=-t*Math.cos(i+S*s)*Math.sin(a+v*o),f.y=t*Math.cos(a+v*o),f.z=t*Math.sin(i+S*s)*Math.sin(a+v*o),p.push(f.x,f.y,f.z),u.copy(f).normalize(),_.push(u.x,u.y,u.z),m.push(S+M,1-v),x.push(c++)}h.push(x)}for(let g=0;g<n;g++)for(let x=0;x<e;x++){let v=h[g][x+1],M=h[g][x],E=h[g+1][x],S=h[g+1][x+1];(g!==0||a>0)&&d.push(v,M,S),(g!==n-1||l<Math.PI)&&d.push(M,E,S)}this.setIndex(d),this.setAttribute("position",new Et(p,3)),this.setAttribute("normal",new Et(_,3)),this.setAttribute("uv",new Et(m,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},xl=class r extends Zi{constructor(t=1,e=0){let n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},ci=class r extends Ht{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);let l=[],c=[],h=[],f=[],u=new I,d=new I,p=new I;for(let _=0;_<=n;_++){let m=a+_/n*o;for(let g=0;g<=i;g++){let x=g/i*s;d.x=(t+e*Math.cos(m))*Math.cos(x),d.y=(t+e*Math.cos(m))*Math.sin(x),d.z=e*Math.sin(m),c.push(d.x,d.y,d.z),u.x=t*Math.cos(x),u.y=t*Math.sin(x),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(g/i),f.push(_/n)}}for(let _=1;_<=n;_++)for(let m=1;m<=i;m++){let g=(i+1)*_+m-1,x=(i+1)*(_-1)+m-1,v=(i+1)*(_-1)+m,M=(i+1)*_+m;l.push(g,x,M),l.push(x,v,M)}this.setIndex(l),this.setAttribute("position",new Et(c,3)),this.setAttribute("normal",new Et(h,3)),this.setAttribute("uv",new Et(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},vl=class r extends Ht{constructor(t=1,e=.4,n=64,i=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:i,p:s,q:a},n=Math.floor(n),i=Math.floor(i);let o=[],l=[],c=[],h=[],f=new I,u=new I,d=new I,p=new I,_=new I,m=new I,g=new I;for(let v=0;v<=n;++v){let M=v/n*s*Math.PI*2;x(M,s,a,t,d),x(M+.01,s,a,t,p),m.subVectors(p,d),g.addVectors(p,d),_.crossVectors(m,g),g.crossVectors(_,m),_.normalize(),g.normalize();for(let E=0;E<=i;++E){let S=E/i*Math.PI*2,w=-e*Math.cos(S),y=e*Math.sin(S);f.x=d.x+(w*g.x+y*_.x),f.y=d.y+(w*g.y+y*_.y),f.z=d.z+(w*g.z+y*_.z),l.push(f.x,f.y,f.z),u.subVectors(f,d).normalize(),c.push(u.x,u.y,u.z),h.push(v/n),h.push(E/i)}}for(let v=1;v<=n;v++)for(let M=1;M<=i;M++){let E=(i+1)*(v-1)+(M-1),S=(i+1)*v+(M-1),w=(i+1)*v+M,y=(i+1)*(v-1)+M;o.push(E,S,y),o.push(S,w,y)}this.setIndex(o),this.setAttribute("position",new Et(l,3)),this.setAttribute("normal",new Et(c,3)),this.setAttribute("uv",new Et(h,2));function x(v,M,E,S,w){let y=Math.cos(v),T=Math.sin(v),R=E/M*v,P=Math.cos(R);w.x=S*(2+P)*.5*y,w.y=S*(2+P)*T*.5,w.z=S*Math.sin(R)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},yl=class r extends Ht{constructor(t=new Aa(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:s};let a=t.computeFrenetFrames(e,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new I,l=new I,c=new Q,h=new I,f=[],u=[],d=[],p=[];_(),this.setIndex(p),this.setAttribute("position",new Et(f,3)),this.setAttribute("normal",new Et(u,3)),this.setAttribute("uv",new Et(d,2));function _(){for(let v=0;v<e;v++)m(v);m(s===!1?e:0),x(),g()}function m(v){h=t.getPointAt(v/e,h);let M=a.normals[v],E=a.binormals[v];for(let S=0;S<=i;S++){let w=S/i*Math.PI*2,y=Math.sin(w),T=-Math.cos(w);l.x=T*M.x+y*E.x,l.y=T*M.y+y*E.y,l.z=T*M.z+y*E.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+n*l.x,o.y=h.y+n*l.y,o.z=h.z+n*l.z,f.push(o.x,o.y,o.z)}}function g(){for(let v=1;v<=e;v++)for(let M=1;M<=i;M++){let E=(i+1)*(v-1)+(M-1),S=(i+1)*v+(M-1),w=(i+1)*v+M,y=(i+1)*(v-1)+M;p.push(E,S,y),p.push(S,w,y)}}function x(){for(let v=0;v<=e;v++)for(let M=0;M<=i;M++)c.x=v/e,c.y=M/i,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new r(new du[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},Ml=class extends Ht{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,i=new I,s=new I;if(t.index!==null){let a=t.attributes.position,o=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){let f=l[c],u=f.start,d=f.count;for(let p=u,_=u+d;p<_;p+=3)for(let m=0;m<3;m++){let g=o.getX(p+m),x=o.getX(p+(m+1)%3);i.fromBufferAttribute(a,g),s.fromBufferAttribute(a,x),Og(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}}else{let a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){let h=3*o+c,f=3*o+(c+1)%3;i.fromBufferAttribute(a,h),s.fromBufferAttribute(a,f),Og(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}this.setAttribute("position",new Et(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function Og(r,t,e){let n=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`,i=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;return e.has(n)===!0||e.has(i)===!0?!1:(e.add(n),e.add(i),!0)}var Bg=Object.freeze({__proto__:null,BoxGeometry:kn,CapsuleGeometry:nl,CircleGeometry:il,ConeGeometry:ba,CylinderGeometry:wn,DodecahedronGeometry:sl,EdgesGeometry:rl,ExtrudeGeometry:pl,IcosahedronGeometry:_r,LatheGeometry:ml,OctahedronGeometry:Pa,PlaneGeometry:Ji,PolyhedronGeometry:Zi,RingGeometry:gl,ShapeGeometry:_l,SphereGeometry:$i,TetrahedronGeometry:xl,TorusGeometry:ci,TorusKnotGeometry:vl,TubeGeometry:yl,WireframeGeometry:Ml}),Sl=class extends He{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new bt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}};function wr(r){let t={};for(let e in r){t[e]={};for(let n in r[e]){let i=r[e][n];if(zg(i))i.isRenderTargetTexture?(ft("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(zg(i[0])){let s=[];for(let a=0,o=i.length;a<o;a++)s[a]=i[a].clone();t[e][n]=s}else t[e][n]=i.slice();else t[e][n]=i}}return t}function cn(r){let t={};for(let e=0;e<r.length;e++){let n=wr(r[e]);for(let i in n)t[i]=n[i]}return t}function zg(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Ay(r){let t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function Ap(r){let t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ie.workingColorSpace}var Cp={clone:wr,merge:cn},Cy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Ry=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,gn=class extends He{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cy,this.fragmentShader=Ry,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=wr(t.uniforms),this.uniformsGroups=Ay(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Ia=class extends gn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ei=class extends He{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},bl=class extends Ei{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Q(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return zt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new bt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new bt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new bt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}},Tl=class extends He{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new bt(16777215),this.specular=new bt(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Ha,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},El=class extends He{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new bt(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},wl=class extends He{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},Al=class extends He{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Jn,this.combine=Ha,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Da=class extends He{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=gp,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},La=class extends He{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},Cl=class extends He{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new bt(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ci,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this.fog=t.fog,this}},Rl=class extends Ve{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function nr(r,t){return!r||r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r)}function u0(r){function t(i,s){return r[i]-r[s]}let e=r.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function Ud(r,t,e){let n=r.length,i=new r.constructor(n);for(let s=0,a=0;a!==n;++s){let o=e[s]*t;for(let l=0;l!==t;++l)i[a++]=r[o+l]}return i}function Rp(r,t,e,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let a=s[n];if(a!==void 0)if(Array.isArray(a))do a=s[n],a!==void 0&&(t.push(s.time),e.push(...a)),s=r[i++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[n],a!==void 0&&(t.push(s.time),a.toArray(e,e.length)),s=r[i++];while(s!==void 0);else do a=s[n],a!==void 0&&(t.push(s.time),e.push(a)),s=r[i++];while(s!==void 0)}function Py(r,t,e,n,i=30){let s=r.clone();s.name=t;let a=[];for(let l=0;l<s.tracks.length;++l){let c=s.tracks[l],h=c.getValueSize(),f=[],u=[];for(let d=0;d<c.times.length;++d){let p=c.times[d]*i;if(!(p<e||p>=n)){f.push(c.times[d]);for(let _=0;_<h;++_)u.push(c.values[d*h+_])}}f.length!==0&&(c.times=nr(f,c.times.constructor),c.values=nr(u,c.values.constructor),a.push(c))}s.tracks=a;let o=1/0;for(let l=0;l<s.tracks.length;++l)o>s.tracks[l].times[0]&&(o=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*o);return s.resetDuration(),s}function Iy(r,t=0,e=r,n=30){n<=0&&(n=30);let i=e.tracks.length,s=t/n;for(let a=0;a<i;++a){let o=e.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;let c=r.tracks.find(function(g){return g.name===o.name&&g.ValueTypeName===l});if(c===void 0)continue;let h=0,f=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=f/3);let u=0,d=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=d/3);let p=o.times.length-1,_;if(s<=o.times[0]){let g=h,x=f-h;_=o.values.slice(g,x)}else if(s>=o.times[p]){let g=p*f+h,x=g+f-h;_=o.values.slice(g,x)}else{let g=o.createInterpolant(),x=h,v=f-h;g.evaluate(s),_=g.resultBuffer.slice(x,v)}l==="quaternion"&&new Ze().fromArray(_).normalize().conjugate().toArray(_);let m=c.times.length;for(let g=0;g<m;++g){let x=g*d+u;if(l==="quaternion")Ze.multiplyQuaternionsFlat(c.values,x,_,0,c.values,x);else{let v=d-u*2;for(let M=0;M<v;++M)c.values[x+M]-=_[M]}}}return r.blendMode=vf,r}var pu=class{static convertArray(t,e){return nr(t,e)}static isTypedArray(t){return Q_(t)}static getKeyframeOrder(t){return u0(t)}static sortedArray(t,e,n){return Ud(t,e,n)}static flattenJSON(t,e,n,i){Rp(t,e,n,i)}static subclip(t,e,n,i,s=30){return Py(t,e,n,i,s)}static makeClipAdditive(t,e=0,n=t,i=30){return Iy(t,e,n,i)}},Ki=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],s=e[n-1];t:{e:{let a;n:{i:if(!(t<i)){for(let o=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(s=i,i=e[++n],t<i)break e}a=e.length;break n}if(!(t>=s)){let o=e[1];t<o&&(n=2,s=o);for(let l=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=s,s=e[--n-1],t>=s)break e}a=n,n=0;break n}break t}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let a=0;a!==i;++a)e[a]=n[s+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Pl=class extends Ki{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_s,endingEnd:_s}}intervalChanged_(t,e,n){let i=this.parameterPositions,s=t-2,a=t+1,o=i[s],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case xs:s=t,o=2*e-n;break;case ua:s=i.length-2,o=e+i[s]-i[s+1];break;default:s=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case xs:a=t,l=2*n-e;break;case ua:a=1,l=n+i[1]-i[0];break;default:a=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(t,e,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(n-e)/(i-e),_=p*p,m=_*p,g=-u*m+2*u*_-u*p,x=(1+u)*m+(-1.5-2*u)*_+(-.5+u)*p+1,v=(-1-d)*m+(1.5+d)*_+.5*p,M=d*m-d*_;for(let E=0;E!==o;++E)s[E]=g*a[h+E]+x*a[c+E]+v*a[l+E]+M*a[f+E];return s}},Na=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(i-e),f=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*f+a[l+u]*h;return s}},Il=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Dl=class extends Ki{interpolate_(t,e,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.settings||this.DefaultSettings_,f=h.inTangents,u=h.outTangents;if(!f||!u){let _=(n-e)/(i-e),m=1-_;for(let g=0;g!==o;++g)s[g]=a[c+g]*m+a[l+g]*_;return s}let d=o*2,p=t-1;for(let _=0;_!==o;++_){let m=a[c+_],g=a[l+_],x=p*d+_*2,v=u[x],M=u[x+1],E=t*d+_*2,S=f[E],w=f[E+1],y=(n-e)/(i-e),T,R,P,U,z;for(let k=0;k<8;k++){T=y*y,R=T*y,P=1-y,U=P*P,z=U*P;let F=z*e+3*U*y*v+3*P*T*S+R*i-n;if(Math.abs(F)<1e-10)break;let L=3*U*(v-e)+6*P*y*(S-v)+3*T*(i-S);if(Math.abs(L)<1e-10)break;y=y-F/L,y=Math.max(0,Math.min(1,y))}s[_]=z*m+3*U*y*M+3*P*T*w+R*g}return s}},_n=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=nr(e,this.TimeBufferType),this.values=nr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:nr(t.times,Array),values:nr(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Il(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Na(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Pl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Dl(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.settings=this.settings),e}setInterpolation(t){let e;switch(t){case ha:e=this.InterpolantFactoryMethodDiscrete;break;case Go:e=this.InterpolantFactoryMethodLinear;break;case Ro:e=this.InterpolantFactoryMethodSmooth;break;case Zh:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ft("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ha;case this.InterpolantFactoryMethodLinear:return Go;case this.InterpolantFactoryMethodSmooth:return Ro;case this.InterpolantFactoryMethodBezier:return Zh}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,s=0,a=i-1;for(;s!==i&&n[s]<t;)++s;for(;a!==-1&&n[a]>e;)--a;if(++a,s!==0||a!==i){s>=a&&(a=Math.max(a,1),s=a-1);let o=this.getValueSize();this.times=n.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Rt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,s=n.length;s===0&&(Rt("KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==s;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Rt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){Rt("KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(i!==void 0&&Q_(i))for(let o=0,l=i.length;o!==l;++o){let c=i[o];if(isNaN(c)){Rt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Ro,s=t.length-1,a=1;for(let o=1;o<s;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(i)l=!0;else{let f=o*n,u=f-n,d=f+n;for(let p=0;p!==n;++p){let _=e[f+p];if(_!==e[u+p]||_!==e[d+p]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*n,u=a*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++a}}if(s>0){t[a]=t[s];for(let o=s*n,l=a*n,c=0;c!==n;++c)e[l+c]=e[o+c];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};_n.prototype.ValueTypeName="";_n.prototype.TimeBufferType=Float32Array;_n.prototype.ValueBufferType=Float32Array;_n.prototype.DefaultInterpolation=Go;var wi=class extends _n{constructor(t,e,n){super(t,e,n)}};wi.prototype.ValueTypeName="bool";wi.prototype.ValueBufferType=Array;wi.prototype.DefaultInterpolation=ha;wi.prototype.InterpolantFactoryMethodLinear=void 0;wi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ua=class extends _n{constructor(t,e,n,i){super(t,e,n,i)}};Ua.prototype.ValueTypeName="color";var ws=class extends _n{constructor(t,e,n,i){super(t,e,n,i)}};ws.prototype.ValueTypeName="number";var Ll=class extends Ki{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(i-e),c=t*o;for(let h=c+o;c!==h;c+=4)Ze.slerpFlat(s,0,a,c-o,a,c,l);return s}},As=class extends _n{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Ll(this.times,this.values,this.getValueSize(),t)}};As.prototype.ValueTypeName="quaternion";As.prototype.InterpolantFactoryMethodSmooth=void 0;var Ai=class extends _n{constructor(t,e,n){super(t,e,n)}};Ai.prototype.ValueTypeName="string";Ai.prototype.ValueBufferType=Array;Ai.prototype.DefaultInterpolation=ha;Ai.prototype.InterpolantFactoryMethodLinear=void 0;Ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Cs=class extends _n{constructor(t,e,n,i){super(t,e,n,i)}};Cs.prototype.ValueTypeName="vector";var Rs=class{constructor(t="",e=-1,n=[],i=Ic){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=Fn(),this.userData={},this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let a=0,o=n.length;a!==o;++a)e.push(Ly(n[a]).scale(i));let s=new this(t.name,t.duration,e,t.blendMode);return s.uuid=t.uuid,s.userData=JSON.parse(t.userData||"{}"),s}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode,userData:JSON.stringify(t.userData)};for(let s=0,a=n.length;s!==a;++s)e.push(_n.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let s=e.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);let h=u0(l);l=Ud(l,1,h),c=Ud(c,1,h),!i&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new ws(".morphTargetInfluences["+e[o].name+"]",l,c).scale(1/n))}return new this(t,-1,a)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=t.length;o<l;o++){let c=t[o],h=c.name.match(s);if(h&&h.length>1){let f=h[1],u=i[f];u||(i[f]=u=[]),u.push(c)}}let a=[];for(let o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],e,n));return a}static parseAnimation(t,e){if(ft("AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!t)return Rt("AnimationClip: No animation in JSONLoader data."),null;let n=function(f,u,d,p,_){if(d.length!==0){let m=[],g=[];Rp(d,m,g,p),m.length!==0&&_.push(new f(u,m,g))}},i=[],s=t.name||"default",a=t.fps||30,o=t.blendMode,l=t.length||-1,c=t.hierarchy||[];for(let f=0;f<c.length;f++){let u=c[f].keys;if(!(!u||u.length===0))if(u[0].morphTargets){let d={},p;for(p=0;p<u.length;p++)if(u[p].morphTargets)for(let _=0;_<u[p].morphTargets.length;_++)d[u[p].morphTargets[_]]=-1;for(let _ in d){let m=[],g=[];for(let x=0;x!==u[p].morphTargets.length;++x){let v=u[p];m.push(v.time),g.push(v.morphTarget===_?1:0)}i.push(new ws(".morphTargetInfluence["+_+"]",m,g))}l=d.length*a}else{let d=".bones["+e[f].name+"]";n(Cs,d+".position",u,"pos",i),n(As,d+".quaternion",u,"rot",i),n(Cs,d+".scale",u,"scl",i)}}return i.length===0?null:new this(s,l,i,o)}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let s=this.tracks[n];e=Math.max(e,s.times[s.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let n=0;n<this.tracks.length;n++)t.push(this.tracks[n].clone());let e=new this.constructor(this.name,this.duration,t,this.blendMode);return e.userData=JSON.parse(JSON.stringify(this.userData)),e}toJSON(){return this.constructor.toJSON(this)}};function Dy(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ws;case"vector":case"vector2":case"vector3":case"vector4":return Cs;case"color":return Ua;case"quaternion":return As;case"bool":case"boolean":return wi;case"string":return Ai}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function Ly(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=Dy(r.type);if(r.times===void 0){let e=[],n=[];Rp(r.keys,e,n,"value"),r.times=e,r.values=n}return t.parse!==void 0?t.parse(r):new t(r.name,r.times,r.values,r.interpolation)}var oi={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(kg(r)||(this.files[r]=t))},get:function(r){if(this.enabled!==!1&&!kg(r))return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}};function kg(r){try{let t=r.slice(r.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var Fa=class{constructor(t,e,n){let i=this,s=!1,a=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,s===!1&&i.onStart!==void 0&&i.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Pp=new Fa,$e=class{constructor(t){this.manager=t!==void 0?t:Pp,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};$e.DEFAULT_MATERIAL_NAME="__DEFAULT";var Vi={},Fd=class extends Error{constructor(t,e){super(t),this.response=e}},$n=class extends $e{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=oi.get(`file:${t}`);if(s!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0);return}if(Vi[t]!==void 0){Vi[t].push({onLoad:e,onProgress:n,onError:i});return}Vi[t]=[],Vi[t].push({onLoad:e,onProgress:n,onError:i});let a=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&ft("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=Vi[t],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0,_=0,m=new ReadableStream({start(g){x();function x(){f.read().then(({done:v,value:M})=>{if(v)g.close();else{_+=M.byteLength;let E=new ProgressEvent("progress",{lengthComputable:p,loaded:_,total:d});for(let S=0,w=h.length;S<w;S++){let y=h[S];y.onProgress&&y.onProgress(E)}g.enqueue(M),x()}},v=>{g.error(v)})}}});return new Response(m)}else throw new Fd(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{let f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{oi.add(`file:${t}`,c);let h=Vi[t];delete Vi[t];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{let h=Vi[t];if(h===void 0)throw this.manager.itemError(t),c;delete Vi[t];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onError&&d.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},mu=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=new $n(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){i?i(l):Rt(l),s.manager.itemError(t)}},n,i)}parse(t){let e=[];for(let n=0;n<t.length;n++){let i=Rs.parse(t[n]);e.push(i)}return e}},gu=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=[],o=new dr,l=new $n(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function h(f){l.load(t[f],function(u){let d=s.parse(u,!0);a[f]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},c+=1,c===6&&(d.mipmapCount===1&&(o.minFilter=Me),o.image=a,o.format=d.format,o.needsUpdate=!0,e&&e(o))},n,i)}if(Array.isArray(t))for(let f=0,u=t.length;f<u;++f)h(f);else l.load(t,function(f){let u=s.parse(f,!0);if(u.isCubemap){let d=u.mipmaps.length/u.mipmapCount;for(let p=0;p<d;p++){a[p]={mipmaps:[]};for(let _=0;_<u.mipmapCount;_++)a[p].mipmaps.push(u.mipmaps[p*u.mipmapCount+_]),a[p].format=u.format,a[p].width=u.width,a[p].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=Me),o.format=u.format,o.needsUpdate=!0,e&&e(o)},n,i);return o}},ea=new WeakMap,Ps=class extends $e{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=this,a=oi.get(`image:${t}`);if(a!==void 0){if(a.complete===!0)s.manager.itemStart(t),setTimeout(function(){e&&e(a),s.manager.itemEnd(t)},0);else{let f=ea.get(a);f===void 0&&(f=[],ea.set(a,f)),f.push({onLoad:e,onError:i})}return a}let o=ma("img");function l(){h(),e&&e(this);let f=ea.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}ea.delete(this),s.manager.itemEnd(t)}function c(f){h(),i&&i(f),oi.remove(`image:${t}`);let u=ea.get(this)||[];for(let d=0;d<u.length;d++){let p=u[d];p.onError&&p.onError(f)}ea.delete(this),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),oi.add(`image:${t}`,o),s.manager.itemStart(t),o.src=t,o}},_u=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=new Es;s.colorSpace=Je;let a=new Ps(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(t[c],function(h){s.images[c]=h,o++,o===6&&(s.needsUpdate=!0,e&&e(s))},void 0,i)}for(let c=0;c<t.length;++c)l(c);return s}},xu=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=new Tn,o=new $n(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(s.withCredentials),o.load(t,function(l){let c;try{c=s.parse(l)}catch(h){i!==void 0?i(h):Rt(h);return}c.image!==void 0?a.image=c.image:c.data!==void 0&&(a.image.width=c.width,a.image.height=c.height,a.image.data=c.data),a.wrapS=c.wrapS!==void 0?c.wrapS:mn,a.wrapT=c.wrapT!==void 0?c.wrapT:mn,a.magFilter=c.magFilter!==void 0?c.magFilter:Me,a.minFilter=c.minFilter!==void 0?c.minFilter:Me,a.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0&&(a.colorSpace=c.colorSpace),c.flipY!==void 0&&(a.flipY=c.flipY),c.format!==void 0&&(a.format=c.format),c.type!==void 0&&(a.type=c.type),c.mipmaps!==void 0&&(a.mipmaps=c.mipmaps,a.minFilter=pi),c.mipmapCount===1&&(a.minFilter=Me),c.generateMipmaps!==void 0&&(a.generateMipmaps=c.generateMipmaps),a.needsUpdate=!0,e&&e(a,c)},n,i),a}},vu=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=new Ie,a=new Ps(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(t,function(o){s.image=o,s.needsUpdate=!0,e!==void 0&&e(s)},n,i),s}},hi=class extends ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},Nl=class extends hi{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new bt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},bd=new Gt,Vg=new I,Gg=new I,Ul=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Q(512,512),this.mapType=xn,this.map=null,this.mapPass=null,this.matrix=new Gt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Yi,this._frameExtents=new Q(1,1),this._viewportCount=1,this._viewports=[new de(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Vg.setFromMatrixPosition(t.matrixWorld),e.position.copy(Vg),Gg.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Gg),e.updateMatrixWorld(),bd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bd,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===Ms||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(bd)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Bh=new I,zh=new Ze,Mi=new I,xr=class extends ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Gt,this.projectionMatrix=new Gt,this.projectionMatrixInverse=new Gt,this.coordinateSystem=bn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Bh,zh,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bh,zh,Mi.set(1,1,1)).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorld.decompose(Bh,zh,Mi),Mi.x===1&&Mi.y===1&&Mi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bh,zh,Mi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ps=new I,Hg=new Q,Wg=new Q,Re=class extends xr{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=sr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ir*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return sr*2*Math.atan(Math.tan(ir*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){ps.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ps.x,ps.y).multiplyScalar(-t/ps.z),ps.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ps.x,ps.y).multiplyScalar(-t/ps.z)}getViewSize(t,e){return this.getViewBounds(t,Hg,Wg),e.subVectors(Wg,Hg)}setViewOffset(t,e,n,i,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ir*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}let o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Od=class extends Ul{constructor(){super(new Re(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(t){let e=this.camera,n=sr*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,s=t.distance||e.far;(n!==e.fov||i!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=i,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},Fl=class extends hi{constructor(t,e,n=0,i=Math.PI/3,s=0,a=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.distance=n,this.angle=i,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new Od}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.map=t.map,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.angle=this.angle,e.object.decay=this.decay,e.object.penumbra=this.penumbra,e.object.target=this.target.uuid,this.map&&this.map.isTexture&&(e.object.map=this.map.toJSON(t).uuid),e.object.shadow=this.shadow.toJSON(),e}},Bd=class extends Ul{constructor(){super(new Re(90,1,.5,500)),this.isPointLightShadow=!0}},vr=class extends hi{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Bd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Is=class extends xr{constructor(t=-1,e=1,n=1,i=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},zd=class extends Ul{constructor(){super(new Is(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ds=class extends hi{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.shadow=new zd}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}},yr=class extends hi{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}},Ol=class extends hi{constructor(t,e,n=10,i=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){let e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}},Oa=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new I)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){let n=t.x,i=t.y,s=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.282095),e.addScaledVector(a[1],.488603*i),e.addScaledVector(a[2],.488603*s),e.addScaledVector(a[3],.488603*n),e.addScaledVector(a[4],1.092548*(n*i)),e.addScaledVector(a[5],1.092548*(i*s)),e.addScaledVector(a[6],.315392*(3*s*s-1)),e.addScaledVector(a[7],1.092548*(n*s)),e.addScaledVector(a[8],.546274*(n*n-i*i)),e}getIrradianceAt(t,e){let n=t.x,i=t.y,s=t.z,a=this.coefficients;return e.copy(a[0]).multiplyScalar(.886227),e.addScaledVector(a[1],2*.511664*i),e.addScaledVector(a[2],2*.511664*s),e.addScaledVector(a[3],2*.511664*n),e.addScaledVector(a[4],2*.429043*n*i),e.addScaledVector(a[5],2*.429043*i*s),e.addScaledVector(a[6],.743125*s*s-.247708),e.addScaledVector(a[7],2*.429043*n*s),e.addScaledVector(a[8],.429043*(n*n-i*i)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(t.coefficients[n],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let n=0;n<9;n++)this.coefficients[n].lerp(t.coefficients[n],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(t,e+i*3);return this}toArray(t=[],e=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(t,e+i*3);return t}static getBasisAt(t,e){let n=t.x,i=t.y,s=t.z;e[0]=.282095,e[1]=.488603*i,e[2]=.488603*s,e[3]=.488603*n,e[4]=1.092548*n*i,e[5]=1.092548*i*s,e[6]=.315392*(3*s*s-1),e[7]=1.092548*n*s,e[8]=.546274*(n*n-i*i)}},Bl=class extends hi{constructor(t=new Oa,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}toJSON(t){let e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}},zl=class r extends $e{constructor(t){super(t),this.textures={}}load(t,e,n,i){let s=this,a=new $n(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){i?i(l):Rt(l),s.manager.itemError(t)}},n,i)}parse(t){let e=this.textures;function n(s){return e[s]===void 0&&ft("MaterialLoader: Undefined texture",s),e[s]}let i=this.createMaterialFromType(t.type);if(t.uuid!==void 0&&(i.uuid=t.uuid),t.name!==void 0&&(i.name=t.name),t.color!==void 0&&i.color!==void 0&&i.color.setHex(t.color),t.roughness!==void 0&&(i.roughness=t.roughness),t.metalness!==void 0&&(i.metalness=t.metalness),t.sheen!==void 0&&(i.sheen=t.sheen),t.sheenColor!==void 0&&(i.sheenColor=new bt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(i.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(t.emissive),t.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(t.specular),t.specularIntensity!==void 0&&(i.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(i.shininess=t.shininess),t.clearcoat!==void 0&&(i.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(i.dispersion=t.dispersion),t.iridescence!==void 0&&(i.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(i.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(i.transmission=t.transmission),t.thickness!==void 0&&(i.thickness=t.thickness),t.attenuationDistance!==void 0&&(i.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(i.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(i.fog=t.fog),t.flatShading!==void 0&&(i.flatShading=t.flatShading),t.blending!==void 0&&(i.blending=t.blending),t.combine!==void 0&&(i.combine=t.combine),t.side!==void 0&&(i.side=t.side),t.shadowSide!==void 0&&(i.shadowSide=t.shadowSide),t.opacity!==void 0&&(i.opacity=t.opacity),t.transparent!==void 0&&(i.transparent=t.transparent),t.alphaTest!==void 0&&(i.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(i.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(i.depthFunc=t.depthFunc),t.depthTest!==void 0&&(i.depthTest=t.depthTest),t.depthWrite!==void 0&&(i.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(i.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(i.blendSrc=t.blendSrc),t.blendDst!==void 0&&(i.blendDst=t.blendDst),t.blendEquation!==void 0&&(i.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(i.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(i.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(i.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(i.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(i.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(i.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(i.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(i.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(i.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(i.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(i.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(i.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(i.rotation=t.rotation),t.linewidth!==void 0&&(i.linewidth=t.linewidth),t.dashSize!==void 0&&(i.dashSize=t.dashSize),t.gapSize!==void 0&&(i.gapSize=t.gapSize),t.scale!==void 0&&(i.scale=t.scale),t.polygonOffset!==void 0&&(i.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(i.dithering=t.dithering),t.alphaToCoverage!==void 0&&(i.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(i.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(i.allowOverride=t.allowOverride),t.visible!==void 0&&(i.visible=t.visible),t.toneMapped!==void 0&&(i.toneMapped=t.toneMapped),t.userData!==void 0&&(i.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?i.vertexColors=t.vertexColors>0:i.vertexColors=t.vertexColors),t.uniforms!==void 0)for(let s in t.uniforms){let a=t.uniforms[s];switch(i.uniforms[s]={},a.type){case"t":i.uniforms[s].value=n(a.value);break;case"c":i.uniforms[s].value=new bt().setHex(a.value);break;case"v2":i.uniforms[s].value=new Q().fromArray(a.value);break;case"v3":i.uniforms[s].value=new I().fromArray(a.value);break;case"v4":i.uniforms[s].value=new de().fromArray(a.value);break;case"m3":i.uniforms[s].value=new Yt().fromArray(a.value);break;case"m4":i.uniforms[s].value=new Gt().fromArray(a.value);break;default:i.uniforms[s].value=a.value}}if(t.defines!==void 0&&(i.defines=t.defines),t.vertexShader!==void 0&&(i.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(i.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(i.glslVersion=t.glslVersion),t.extensions!==void 0)for(let s in t.extensions)i.extensions[s]=t.extensions[s];if(t.lights!==void 0&&(i.lights=t.lights),t.clipping!==void 0&&(i.clipping=t.clipping),t.size!==void 0&&(i.size=t.size),t.sizeAttenuation!==void 0&&(i.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(i.map=n(t.map)),t.matcap!==void 0&&(i.matcap=n(t.matcap)),t.alphaMap!==void 0&&(i.alphaMap=n(t.alphaMap)),t.bumpMap!==void 0&&(i.bumpMap=n(t.bumpMap)),t.bumpScale!==void 0&&(i.bumpScale=t.bumpScale),t.normalMap!==void 0&&(i.normalMap=n(t.normalMap)),t.normalMapType!==void 0&&(i.normalMapType=t.normalMapType),t.normalScale!==void 0){let s=t.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new Q().fromArray(s)}return t.displacementMap!==void 0&&(i.displacementMap=n(t.displacementMap)),t.displacementScale!==void 0&&(i.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(i.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(i.roughnessMap=n(t.roughnessMap)),t.metalnessMap!==void 0&&(i.metalnessMap=n(t.metalnessMap)),t.emissiveMap!==void 0&&(i.emissiveMap=n(t.emissiveMap)),t.emissiveIntensity!==void 0&&(i.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(i.specularMap=n(t.specularMap)),t.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(t.specularIntensityMap)),t.specularColorMap!==void 0&&(i.specularColorMap=n(t.specularColorMap)),t.envMap!==void 0&&(i.envMap=n(t.envMap)),t.envMapRotation!==void 0&&i.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(i.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(i.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(i.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(i.lightMap=n(t.lightMap)),t.lightMapIntensity!==void 0&&(i.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(i.aoMap=n(t.aoMap)),t.aoMapIntensity!==void 0&&(i.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(i.gradientMap=n(t.gradientMap)),t.clearcoatMap!==void 0&&(i.clearcoatMap=n(t.clearcoatMap)),t.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(t.clearcoatRoughnessMap)),t.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(t.clearcoatNormalMap)),t.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new Q().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(i.iridescenceMap=n(t.iridescenceMap)),t.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(t.iridescenceThicknessMap)),t.transmissionMap!==void 0&&(i.transmissionMap=n(t.transmissionMap)),t.thicknessMap!==void 0&&(i.thicknessMap=n(t.thicknessMap)),t.anisotropyMap!==void 0&&(i.anisotropyMap=n(t.anisotropyMap)),t.sheenColorMap!==void 0&&(i.sheenColorMap=n(t.sheenColorMap)),t.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(t.sheenRoughnessMap)),i}setTextures(t){return this.textures=t,this}createMaterialFromType(t){return r.createMaterialFromType(t)}static createMaterialFromType(t){let e={ShadowMaterial:Sl,SpriteMaterial:ya,RawShaderMaterial:Ia,ShaderMaterial:gn,PointsMaterial:Ts,MeshPhysicalMaterial:bl,MeshStandardMaterial:Ei,MeshPhongMaterial:Tl,MeshToonMaterial:El,MeshNormalMaterial:wl,MeshLambertMaterial:Al,MeshDepthMaterial:Da,MeshDistanceMaterial:La,MeshBasicMaterial:On,MeshMatcapMaterial:Cl,LineDashedMaterial:Rl,LineBasicMaterial:Ve,Material:He};return new e[t]}},Ba=class{static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}},kl=class extends Ht{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}},Vl=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=new $n(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(t,function(o){try{e(s.parse(JSON.parse(o)))}catch(l){i?i(l):Rt(l),s.manager.itemError(t)}},n,i)}parse(t){let e={},n={};function i(d,p){if(e[p]!==void 0)return e[p];let m=d.interleavedBuffers[p],g=s(d,m.buffer),x=aa(m.type,g),v=new ur(x,m.stride);return v.uuid=m.uuid,e[p]=v,v}function s(d,p){if(n[p]!==void 0)return n[p];let m=d.arrayBuffers[p],g=new Uint32Array(m).buffer;return n[p]=g,g}let a=t.isInstancedBufferGeometry?new kl:new Ht,o=t.data.index;if(o!==void 0){let d=aa(o.type,o.array);a.setIndex(new oe(d,1))}let l=t.data.attributes;for(let d in l){let p=l[d],_;if(p.isInterleavedBufferAttribute){let m=i(t.data,p.data);_=new bs(m,p.itemSize,p.offset,p.normalized)}else{let m=aa(p.type,p.array),g=p.isInstancedBufferAttribute?qi:oe;_=new g(m,p.itemSize,p.normalized)}p.name!==void 0&&(_.name=p.name),p.usage!==void 0&&_.setUsage(p.usage),a.setAttribute(d,_)}let c=t.data.morphAttributes;if(c)for(let d in c){let p=c[d],_=[];for(let m=0,g=p.length;m<g;m++){let x=p[m],v;if(x.isInterleavedBufferAttribute){let M=i(t.data,x.data);v=new bs(M,x.itemSize,x.offset,x.normalized)}else{let M=aa(x.type,x.array);v=new oe(M,x.itemSize,x.normalized)}x.name!==void 0&&(v.name=x.name),_.push(v)}a.morphAttributes[d]=_}t.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);let f=t.data.groups||t.data.drawcalls||t.data.offsets;if(f!==void 0)for(let d=0,p=f.length;d!==p;++d){let _=f[d];a.addGroup(_.start,_.count,_.materialIndex)}let u=t.data.boundingSphere;return u!==void 0&&(a.boundingSphere=new ke().fromJSON(u)),t.name&&(a.name=t.name),t.userData&&(a.userData=t.userData),a}},Td={},yu=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=this.path===""?Ba.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||a;let o=new $n(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(l){let c=null;try{c=JSON.parse(l)}catch(f){i!==void 0&&i(f),Rt("ObjectLoader: Can't parse "+t+".",f.message);return}let h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+t)),Rt("ObjectLoader: Can't load "+t);return}s.parse(c,e)},n,i)}async loadAsync(t,e){let n=this,i=this.path===""?Ba.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||i;let s=new $n(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);let a=await s.loadAsync(t,e),o;try{o=JSON.parse(a)}catch(c){throw new Error("ObjectLoader: Can't parse "+t+". "+c.message)}let l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await n.parseAsync(o)}parse(t,e){let n=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,i),a=this.parseImages(t.images,function(){e!==void 0&&e(c)}),o=this.parseTextures(t.textures,a),l=this.parseMaterials(t.materials,o),c=this.parseObject(t.object,s,l,o,n),h=this.parseSkeletons(t.skeletons,c);if(this.bindSkeletons(c,h),this.bindLightTargets(c),e!==void 0){let f=!1;for(let u in a)if(a[u].data instanceof HTMLImageElement){f=!0;break}f===!1&&e(c)}return c}async parseAsync(t){let e=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),i=this.parseGeometries(t.geometries,n),s=await this.parseImagesAsync(t.images),a=this.parseTextures(t.textures,s),o=this.parseMaterials(t.materials,a),l=this.parseObject(t.object,i,o,a,e),c=this.parseSkeletons(t.skeletons,l);return this.bindSkeletons(l,c),this.bindLightTargets(l),l}static registerGeometry(t,e){Td[t]=e}parseShapes(t){let e={};if(t!==void 0)for(let n=0,i=t.length;n<i;n++){let s=new Si().fromJSON(t[n]);e[s.uuid]=s}return e}parseSkeletons(t,e){let n={},i={};if(e.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),t!==void 0)for(let s=0,a=t.length;s<a;s++){let o=new Jo().fromJSON(t[s],i);n[o.uuid]=o}return n}parseGeometries(t,e){let n={};if(t!==void 0){let i=new Vl;for(let s=0,a=t.length;s<a;s++){let o,l=t[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=i.parse(l);break;default:l.type in Bg?o=Bg[l.type].fromJSON(l,e):l.type in Td?o=Td[l.type].fromJSON(l,e):ft(`ObjectLoader: Unknown geometry type "${l.type}". Use .registerGeometry() before starting the deserialization process.`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),n[l.uuid]=o}}return n}parseMaterials(t,e){let n={},i={};if(t!==void 0){let s=new zl;s.setTextures(e);for(let a=0,o=t.length;a<o;a++){let l=t[a];n[l.uuid]===void 0&&(n[l.uuid]=s.parse(l)),i[l.uuid]=n[l.uuid]}}return i}parseAnimations(t){let e={};if(t!==void 0)for(let n=0;n<t.length;n++){let i=t[n],s=Rs.parse(i);e[s.uuid]=s}return e}parseImages(t,e){let n=this,i={},s;function a(l){return n.manager.itemStart(l),s.load(l,function(){n.manager.itemEnd(l)},void 0,function(){n.manager.itemError(l),n.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){let c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:n.resourcePath+c;return a(h)}else return l.data?{data:aa(l.type,l.data),width:l.width,height:l.height}:null}if(t!==void 0&&t.length>0){let l=new Fa(e);s=new Ps(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,h=t.length;c<h;c++){let f=t[c],u=f.url;if(Array.isArray(u)){let d=[];for(let p=0,_=u.length;p<_;p++){let m=u[p],g=o(m);g!==null&&(g instanceof HTMLImageElement?d.push(g):d.push(new Tn(g.data,g.width,g.height)))}i[f.uuid]=new ai(d)}else{let d=o(f.url);i[f.uuid]=new ai(d)}}}return i}async parseImagesAsync(t){let e=this,n={},i;async function s(a){if(typeof a=="string"){let o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:e.resourcePath+o;return await i.loadAsync(l)}else return a.data?{data:aa(a.type,a.data),width:a.width,height:a.height}:null}if(t!==void 0&&t.length>0){i=new Ps(this.manager),i.setCrossOrigin(this.crossOrigin);for(let a=0,o=t.length;a<o;a++){let l=t[a],c=l.url;if(Array.isArray(c)){let h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f],p=await s(d);p!==null&&(p instanceof HTMLImageElement?h.push(p):h.push(new Tn(p.data,p.width,p.height)))}n[l.uuid]=new ai(h)}else{let h=await s(l.url);n[l.uuid]=new ai(h)}}}return n}parseTextures(t,e){function n(s,a){return typeof s=="number"?s:(ft("ObjectLoader.parseTexture: Constant should be in numeric form.",s),a[s])}let i={};if(t!==void 0)for(let s=0,a=t.length;s<a;s++){let o=t[s];o.image===void 0&&ft('ObjectLoader: No "image" specified for',o.uuid),e[o.image]===void 0&&ft("ObjectLoader: Undefined image",o.image);let l=e[o.image],c=l.data,h;Array.isArray(c)?(h=new Es,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new Tn:h=new Ie,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=n(o.mapping,Ny)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=n(o.wrap[0],Xg),h.wrapT=n(o.wrap[1],Xg)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.minFilter!==void 0&&(h.minFilter=n(o.minFilter,qg)),o.magFilter!==void 0&&(h.magFilter=n(o.magFilter,qg)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.normalized!==void 0&&(h.normalized=o.normalized),o.userData!==void 0&&(h.userData=o.userData),i[o.uuid]=h}return i}parseObject(t,e,n,i,s){let a;function o(u){return e[u]===void 0&&ft("ObjectLoader: Undefined geometry",u),e[u]}function l(u){if(u!==void 0){if(Array.isArray(u)){let d=[];for(let p=0,_=u.length;p<_;p++){let m=u[p];n[m]===void 0&&ft("ObjectLoader: Undefined material",m),d.push(n[m])}return d}return n[u]===void 0&&ft("ObjectLoader: Undefined material",u),n[u]}}function c(u){return i[u]===void 0&&ft("ObjectLoader: Undefined texture",u),i[u]}let h,f;switch(t.type){case"Scene":a=new hr,t.background!==void 0&&(Number.isInteger(t.background)?a.background=new bt(t.background):a.background=c(t.background)),t.environment!==void 0&&(a.environment=c(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?a.fog=new Xo(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(a.fog=new cr(t.fog.color,t.fog.density)),t.fog.name!==""&&(a.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(a.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&a.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(a.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&a.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":a=new Re(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(a.focus=t.focus),t.zoom!==void 0&&(a.zoom=t.zoom),t.filmGauge!==void 0&&(a.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(a.filmOffset=t.filmOffset),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"OrthographicCamera":a=new Is(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(a.zoom=t.zoom),t.view!==void 0&&(a.view=Object.assign({},t.view));break;case"AmbientLight":a=new yr(t.color,t.intensity);break;case"DirectionalLight":a=new Ds(t.color,t.intensity),a.target=t.target||"";break;case"PointLight":a=new vr(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":a=new Ol(t.color,t.intensity,t.width,t.height);break;case"SpotLight":a=new Fl(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),a.target=t.target||"";break;case"HemisphereLight":a=new Nl(t.color,t.groundColor,t.intensity);break;case"LightProbe":let u=new Oa().fromArray(t.sh);a=new Bl(u,t.intensity);break;case"SkinnedMesh":h=o(t.geometry),f=l(t.material),a=new Zo(h,f),t.bindMode!==void 0&&(a.bindMode=t.bindMode),t.bindMatrix!==void 0&&a.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(a.skeleton=t.skeleton);break;case"Mesh":h=o(t.geometry),f=l(t.material),a=new $t(h,f);break;case"InstancedMesh":h=o(t.geometry),f=l(t.material);let d=t.count,p=t.instanceMatrix,_=t.instanceColor;a=new $o(h,f,d),a.instanceMatrix=new qi(new Float32Array(p.array),16),_!==void 0&&(a.instanceColor=new qi(new Float32Array(_.array),_.itemSize));break;case"BatchedMesh":h=o(t.geometry),f=l(t.material),a=new Qo(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,f),a.geometry=h,a.perObjectFrustumCulled=t.perObjectFrustumCulled,a.sortObjects=t.sortObjects,a._drawRanges=t.drawRanges,a._reservedRanges=t.reservedRanges,a._geometryInfo=t.geometryInfo.map(m=>{let g=null,x=null;return m.boundingBox!==void 0&&(g=new Ge().fromJSON(m.boundingBox)),m.boundingSphere!==void 0&&(x=new ke().fromJSON(m.boundingSphere)),{...m,boundingBox:g,boundingSphere:x}}),a._instanceInfo=t.instanceInfo,a._availableInstanceIds=t._availableInstanceIds,a._availableGeometryIds=t._availableGeometryIds,a._nextIndexStart=t.nextIndexStart,a._nextVertexStart=t.nextVertexStart,a._geometryCount=t.geometryCount,a._maxInstanceCount=t.maxInstanceCount,a._maxVertexCount=t.maxVertexCount,a._maxIndexCount=t.maxIndexCount,a._geometryInitialized=t.geometryInitialized,a._matricesTexture=c(t.matricesTexture.uuid),a._indirectTexture=c(t.indirectTexture.uuid),t.colorsTexture!==void 0&&(a._colorsTexture=c(t.colorsTexture.uuid)),t.boundingSphere!==void 0&&(a.boundingSphere=new ke().fromJSON(t.boundingSphere)),t.boundingBox!==void 0&&(a.boundingBox=new Ge().fromJSON(t.boundingBox));break;case"LOD":a=new Yo;break;case"Line":a=new Bn(o(t.geometry),l(t.material));break;case"LineLoop":a=new jo(o(t.geometry),l(t.material));break;case"LineSegments":a=new zn(o(t.geometry),l(t.material));break;case"PointCloud":case"Points":a=new fr(o(t.geometry),l(t.material));break;case"Sprite":a=new qo(l(t.material));break;case"Group":a=new sn;break;case"Bone":a=new Ma;break;default:a=new ce}if(a.uuid=t.uuid,t.name!==void 0&&(a.name=t.name),t.matrix!==void 0?(a.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=t.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(t.position!==void 0&&a.position.fromArray(t.position),t.rotation!==void 0&&a.rotation.fromArray(t.rotation),t.quaternion!==void 0&&a.quaternion.fromArray(t.quaternion),t.scale!==void 0&&a.scale.fromArray(t.scale)),t.up!==void 0&&a.up.fromArray(t.up),t.pivot!==void 0&&(a.pivot=new I().fromArray(t.pivot)),t.morphTargetDictionary!==void 0&&(a.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),t.morphTargetInfluences!==void 0&&(a.morphTargetInfluences=t.morphTargetInfluences.slice()),t.castShadow!==void 0&&(a.castShadow=t.castShadow),t.receiveShadow!==void 0&&(a.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(a.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(a.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(a.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(a.shadow.radius=t.shadow.radius),t.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(a.visible=t.visible),t.frustumCulled!==void 0&&(a.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(a.renderOrder=t.renderOrder),t.static!==void 0&&(a.static=t.static),t.userData!==void 0&&(a.userData=t.userData),t.layers!==void 0&&(a.layers.mask=t.layers),t.children!==void 0){let u=t.children;for(let d=0;d<u.length;d++)a.add(this.parseObject(u[d],e,n,i,s))}if(t.animations!==void 0){let u=t.animations;for(let d=0;d<u.length;d++){let p=u[d];a.animations.push(s[p])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(a.autoUpdate=t.autoUpdate);let u=t.levels;for(let d=0;d<u.length;d++){let p=u[d],_=a.getObjectByProperty("uuid",p.object);_!==void 0&&a.addLevel(_,p.distance,p.hysteresis)}}return a}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){let i=e[n.skeleton];i===void 0?ft("ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){let n=e.target,i=t.getObjectByProperty("uuid",n);i!==void 0?e.target=i:e.target=new ce}})}},Ny={UVMapping:Zl,CubeReflectionMapping:di,CubeRefractionMapping:Qi,EquirectangularReflectionMapping:Xa,EquirectangularRefractionMapping:qa,CubeUVReflectionMapping:Sr},Xg={RepeatWrapping:la,ClampToEdgeWrapping:mn,MirroredRepeatWrapping:ca},qg={NearestFilter:Pe,NearestMipmapNearestFilter:ff,NearestMipmapLinearFilter:br,LinearFilter:Me,LinearMipmapNearestFilter:Ya,LinearMipmapLinearFilter:pi},Ed=new WeakMap,Mu=class extends $e{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&ft("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&ft("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=this,a=oi.get(`image-bitmap:${t}`);if(a!==void 0){if(s.manager.itemStart(t),a.then){a.then(c=>{Ed.has(a)===!0?(i&&i(Ed.get(a)),s.manager.itemError(t),s.manager.itemEnd(t)):(e&&e(c),s.manager.itemEnd(t))});return}setTimeout(function(){e&&e(a),s.manager.itemEnd(t)},0);return}let o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let l=fetch(t,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(c){oi.add(`image-bitmap:${t}`,c),e&&e(c),s.manager.itemEnd(t)}).catch(function(c){i&&i(c),Ed.set(l,c),oi.remove(`image-bitmap:${t}`),s.manager.itemError(t),s.manager.itemEnd(t)});oi.add(`image-bitmap:${t}`,l),s.manager.itemStart(t)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},kh,za=class{static getContext(){return kh===void 0&&(kh=new(window.AudioContext||window.webkitAudioContext)),kh}static setContext(t){kh=t}},Su=class extends $e{constructor(t){super(t)}load(t,e,n,i){let s=this,a=new $n(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(l){try{let c=l.slice(0),h=za.getContext(),f=t+"#decode";s.manager.itemStart(f),h.decodeAudioData(c,function(u){e(u),s.manager.itemEnd(f)}).catch(function(u){o(u),s.manager.itemEnd(f)})}catch(c){o(c)}},n,i);function o(l){i?i(l):Rt(l),s.manager.itemError(t)}}},Yg=new Gt,Zg=new Gt,$s=new Gt,bu=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new Re,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new Re,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){let e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,$s.copy(t.projectionMatrix);let i=e.eyeSep/2,s=i*e.near/e.focus,a=e.near*Math.tan(ir*e.fov*.5)/e.zoom,o,l;Zg.elements[12]=-i,Yg.elements[12]=i,o=-a*e.aspect+s,l=a*e.aspect+s,$s.elements[0]=2*e.near/(l-o),$s.elements[8]=(l+o)/(l-o),this.cameraL.projectionMatrix.copy($s),o=-a*e.aspect-s,l=a*e.aspect-s,$s.elements[0]=2*e.near/(l-o),$s.elements[8]=(l+o)/(l-o),this.cameraR.projectionMatrix.copy($s)}this.cameraL.matrixWorld.copy(t.matrixWorld).multiply(Zg),this.cameraR.matrixWorld.copy(t.matrixWorld).multiply(Yg)}},na=-90,ia=1,Gl=class extends ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Re(na,ia,t,e);i.layers=this.layers,this.add(i);let s=new Re(na,ia,t,e);s.layers=this.layers,this.add(s);let a=new Re(na,ia,t,e);a.layers=this.layers,this.add(a);let o=new Re(na,ia,t,e);o.layers=this.layers,this.add(o);let l=new Re(na,ia,t,e);l.layers=this.layers,this.add(l);let c=new Re(na,ia,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,s,a,o,l]=e;for(let c of e)this.remove(c);if(t===bn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Ms)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,a,o,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),p=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let m=!1;t.isWebGLRenderer===!0?m=t.state.buffers.depth.getReversed():m=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(n,1,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),m&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Hl=class extends Re{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},Wl=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Uy.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Uy(){this._document.hidden===!1&&this.reset()}var Ks=new I,wd=new Ze,Fy=new I,Qs=new I,js=new I,Tu=class extends ce{constructor(){super(),this.type="AudioListener",this.context=za.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._timer=new Wl}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t),this._timer.update();let e=this.context.listener;if(this.timeDelta=this._timer.getDelta(),this.matrixWorld.decompose(Ks,wd,Fy),Qs.set(0,0,-1).applyQuaternion(wd),js.set(0,1,0).applyQuaternion(wd),e.positionX){let n=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(Ks.x,n),e.positionY.linearRampToValueAtTime(Ks.y,n),e.positionZ.linearRampToValueAtTime(Ks.z,n),e.forwardX.linearRampToValueAtTime(Qs.x,n),e.forwardY.linearRampToValueAtTime(Qs.y,n),e.forwardZ.linearRampToValueAtTime(Qs.z,n),e.upX.linearRampToValueAtTime(js.x,n),e.upY.linearRampToValueAtTime(js.y,n),e.upZ.linearRampToValueAtTime(js.z,n)}else e.setPosition(Ks.x,Ks.y,Ks.z),e.setOrientation(Qs.x,Qs.y,Qs.z,js.x,js.y,js.z)}},Xl=class extends ce{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){ft("Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){ft("Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;let e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){ft("Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(t=0){if(this.hasPlaybackControl===!1){ft("Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(this.context.currentTime+t),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){ft("Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1,this._progress=0}getLoop(){return this.hasPlaybackControl===!1?(ft("Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){ft("Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}copy(t,e){return super.copy(t,e),t.sourceType!=="buffer"?(ft("Audio: Audio source type cannot be copied."),this):(this.autoplay=t.autoplay,this.buffer=t.buffer,this.detune=t.detune,this.loop=t.loop,this.loopStart=t.loopStart,this.loopEnd=t.loopEnd,this.offset=t.offset,this.duration=t.duration,this.playbackRate=t.playbackRate,this.hasPlaybackControl=t.hasPlaybackControl,this.sourceType=t.sourceType,this.filters=t.filters.slice(),this)}clone(t){return new this.constructor(this.listener).copy(this,t)}},tr=new I,Jg=new Ze,Oy=new I,er=new I,Eu=class extends Xl{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){return super.connect(),this.panner.connect(this.gain),this}disconnect(){return super.disconnect(),this.panner.disconnect(this.gain),this}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,n){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=n,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(tr,Jg,Oy),er.set(0,0,1).applyQuaternion(Jg);let e=this.panner;if(e.positionX){let n=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(tr.x,n),e.positionY.linearRampToValueAtTime(tr.y,n),e.positionZ.linearRampToValueAtTime(tr.z,n),e.orientationX.linearRampToValueAtTime(er.x,n),e.orientationY.linearRampToValueAtTime(er.y,n),e.orientationZ.linearRampToValueAtTime(er.z,n)}else e.setPosition(tr.x,tr.y,tr.z),e.setOrientation(er.x,er.y,er.z)}},wu=class{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0,e=this.getFrequencyData();for(let n=0;n<e.length;n++)t+=e[n];return t/e.length}},ql=class{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,s,a;switch(e){case"quaternion":i=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){let n=this.buffer,i=this.valueSize,s=t*i+i,a=this.cumulativeWeight;if(a===0){for(let o=0;o!==i;++o)n[s+o]=n[o];a=e}else{a+=e;let o=e/a;this._mixBufferRegion(n,s,0,o,i)}this.cumulativeWeight=a}accumulateAdditive(t){let e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){let e=this.valueSize,n=this.buffer,i=t*e+e,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let l=e*this._origIndex;this._mixBufferRegion(n,i,l,1-s,e)}a>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let l=e,c=e+e;l!==c;++l)if(n[l]!==n[l+e]){o.setValue(n,i);break}}saveOriginalState(){let t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let s=n,a=i;s!==a;++s)e[s]=e[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){let t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,s){if(i>=.5)for(let a=0;a!==s;++a)t[e+a]=t[n+a]}_slerp(t,e,n,i){Ze.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,s){let a=this._workIndex*s;Ze.multiplyQuaternionsFlat(t,a,t,e,t,n),Ze.slerpFlat(t,e,t,e,t,a,i)}_lerp(t,e,n,i,s){let a=1-i;for(let o=0;o!==s;++o){let l=e+o;t[l]=t[l]*a+t[n+o]*i}}_lerpAdditive(t,e,n,i,s){for(let a=0;a!==s;++a){let o=e+a;t[o]=t[o]+t[n+a]*i}}},Ip="\\[\\]\\.:\\/",By=new RegExp("["+Ip+"]","g"),Dp="[^"+Ip+"]",zy="[^"+Ip.replace("\\.","")+"]",ky=/((?:WC+[\/:])*)/.source.replace("WC",Dp),Vy=/(WCOD+)?/.source.replace("WCOD",zy),Gy=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Dp),Hy=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Dp),Wy=new RegExp("^"+ky+Vy+Gy+Hy+"$"),Xy=["material","materials","bones","map"],kd=class{constructor(t,e,n){let i=n||fe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},fe=class r{constructor(t,e,n){this.path=e,this.parsedPath=n||r.parseTrackName(e),this.node=r.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new r.Composite(t,e,n):new r(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(By,"")}static parseTrackName(t){let e=Wy.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Xy.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let a=0;a<s.length;a++){let o=s[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,s=e.propertyIndex;if(t||(t=r.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){ft("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Rt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Rt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Rt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Rt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Rt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Rt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Rt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let a=t[i];if(a===void 0){let c=e.nodeName;Rt("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Rt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Rt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fe.Composite=kd;fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fe.prototype.GetterByBindingType=[fe.prototype._getValue_direct,fe.prototype._getValue_array,fe.prototype._getValue_arrayElement,fe.prototype._getValue_toArray];fe.prototype.SetterByBindingTypeAndVersioning=[[fe.prototype._setValue_direct,fe.prototype._setValue_direct_setNeedsUpdate,fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_array,fe.prototype._setValue_array_setNeedsUpdate,fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_arrayElement,fe.prototype._setValue_arrayElement_setNeedsUpdate,fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fe.prototype._setValue_fromArray,fe.prototype._setValue_fromArray_setNeedsUpdate,fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var Au=class{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Fn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let t={};this._indicesByUUID=t;for(let n=0,i=arguments.length;n!==i;++n)t[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){let t=this._objects,e=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,a=s.length,o,l=t.length,c=this.nCachedObjects_;for(let h=0,f=arguments.length;h!==f;++h){let u=arguments[h],d=u.uuid,p=e[d];if(p===void 0){p=l++,e[d]=p,t.push(u);for(let _=0,m=a;_!==m;++_)s[_].push(new fe(u,n[_],i[_]))}else if(p<c){o=t[p];let _=--c,m=t[_];e[m.uuid]=p,t[p]=m,e[d]=_,t[_]=u;for(let g=0,x=a;g!==x;++g){let v=s[g],M=v[_],E=v[p];v[p]=M,E===void 0&&(E=new fe(u,n[g],i[g])),v[_]=E}}else t[p]!==o&&Rt("AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){let t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){let l=arguments[a],c=l.uuid,h=e[c];if(h!==void 0&&h>=s){let f=s++,u=t[f];e[u.uuid]=h,t[h]=u,e[c]=f,t[f]=l;for(let d=0,p=i;d!==p;++d){let _=n[d],m=_[f],g=_[h];_[h]=m,_[f]=g}}}this.nCachedObjects_=s}uncache(){let t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_,a=t.length;for(let o=0,l=arguments.length;o!==l;++o){let c=arguments[o],h=c.uuid,f=e[h];if(f!==void 0)if(delete e[h],f<s){let u=--s,d=t[u],p=--a,_=t[p];e[d.uuid]=f,t[f]=d,e[_.uuid]=u,t[u]=_,t.pop();for(let m=0,g=i;m!==g;++m){let x=n[m],v=x[u],M=x[p];x[f]=v,x[u]=M,x.pop()}}else{let u=--a,d=t[u];u>0&&(e[d.uuid]=f),t[f]=d,t.pop();for(let p=0,_=i;p!==_;++p){let m=n[p];m[f]=m[u],m.pop()}}}this.nCachedObjects_=s}subscribe_(t,e){let n=this._bindingsIndicesByPath,i=n[t],s=this._bindings;if(i!==void 0)return s[i];let a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,f=new Array(c);i=s.length,n[t]=i,a.push(t),o.push(e),s.push(f);for(let u=h,d=l.length;u!==d;++u){let p=l[u];f[u]=new fe(p,t,e)}return f}unsubscribe_(t){let e=this._bindingsIndicesByPath,n=e[t];if(n!==void 0){let i=this._paths,s=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=t[o];e[c]=n,a[n]=l,a.pop(),s[n]=s[o],s.pop(),i[n]=i[o],i.pop()}}},Yl=class{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;let s=e.tracks,a=s.length,o=new Array(a),l={endingStart:_s,endingEnd:_s};for(let c=0;c!==a;++c){let h=s[c].createInterpolant(null);o[c]=h,h.settings&&Object.assign(l,h.settings),h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=pp,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n=!1){if(t.fadeOut(e),this.fadeIn(e),n===!0){let i=this._clip.duration,s=t._clip.duration,a=s/i,o=i/s;t.warp(1,a,e),this.warp(o,1,e)}return this}crossFadeTo(t,e,n=!1){return t.crossFadeFrom(this,e,n)}stopFading(){let t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){let i=this._mixer,s=i.time,a=this.timeScale,o=this._timeScaleInterpolant;o===null&&(o=i._lendControlInterpolant(),this._timeScaleInterpolant=o);let l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+n,c[0]=t/a,c[1]=e/a,this}stopWarping(){let t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}let s=this._startTime;if(s!==null){let l=(t-s)*n;l<0||n===0?e=0:(this._startTime=null,e=n*l)}e*=this._updateTimeScale(t);let a=this._updateTime(e),o=this._updateWeight(t);if(o>0){let l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case vf:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case Ic:default:for(let h=0,f=l.length;h!==f;++h)l[h].evaluate(a),c[h].accumulate(i,o)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){let e=this._clip.duration,n=this.loop,i=this.time+t,s=this._loopCount,a=n===mp;if(t===0)return s===-1?i:a&&(s&1)===1?e-i:i;if(n===dp){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(s===-1&&(t>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),i>=e||i<0){let o=Math.floor(i/e);i-=e*o,s+=Math.abs(o);let l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(l===1){let c=t<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this._loopCount=s,this.time=i;if(a&&(s&1)===1)return e-i}return i}_setEndings(t,e,n){let i=this._interpolantSettings;n?(i.endingStart=xs,i.endingEnd=xs):(t?i.endingStart=this.zeroSlopeAtStart?xs:_s:i.endingStart=ua,e?i.endingEnd=this.zeroSlopeAtEnd?xs:_s:i.endingEnd=ua)}_scheduleFading(t,e,n){let i=this._mixer,s=i.time,a=this._weightInterpolant;a===null&&(a=i._lendControlInterpolant(),this._weightInterpolant=a);let o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=e,o[1]=s+t,l[1]=n,this}},qy=new Float32Array(1),Cu=class extends En{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}_bindAction(t,e){let n=t._localRoot||this._root,i=t._clip.tracks,s=i.length,a=t._propertyBindings,o=t._interpolants,l=n.uuid,c=this._bindingsByRootAndName,h=c[l];h===void 0&&(h={},c[l]=h);for(let f=0;f!==s;++f){let u=i[f],d=u.name,p=h[d];if(p!==void 0)++p.referenceCount,a[f]=p;else{if(p=a[f],p!==void 0){p._cacheIndex===null&&(++p.referenceCount,this._addInactiveBinding(p,l,d));continue}let _=e&&e._propertyBindings[f].binding.parsedPath;p=new ql(fe.create(n,d,_),u.ValueTypeName,u.getValueSize()),++p.referenceCount,this._addInactiveBinding(p,l,d),a[f]=p}o[f].resultBuffer=p.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){let n=(t._localRoot||this._root).uuid,i=t._clip.uuid,s=this._actionsByClip[i];this._bindAction(t,s&&s.knownActions[0]),this._addInactiveAction(t,i,n)}let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){let e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){let i=this._actions,s=this._actionsByClip,a=s[e];if(a===void 0)a={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,s[e]=a;else{let o=a.knownActions;t._byClipCacheIndex=o.length,o.push(t)}t._cacheIndex=i.length,i.push(t),a.actionByRoot[n]=t}_removeInactiveAction(t){let e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;let s=t._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=t._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),t._byClipCacheIndex=null;let f=o.actionByRoot,u=(t._localRoot||this._root).uuid;delete f[u],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(t){let e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackAction(t){let e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_addInactiveBinding(t,e,n){let i=this._bindingsByRootAndName,s=this._bindings,a=i[e];a===void 0&&(a={},i[e]=a),a[n]=t,t._cacheIndex=s.length,s.push(t)}_removeInactiveBinding(t){let e=this._bindings,n=t.binding,i=n.rootNode.uuid,s=n.path,a=this._bindingsByRootAndName,o=a[i],l=e[e.length-1],c=t._cacheIndex;l._cacheIndex=c,e[c]=l,e.pop(),delete o[s],Object.keys(o).length===0&&delete a[i]}_lendBinding(t){let e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackBinding(t){let e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_lendControlInterpolant(){let t=this._controlInterpolants,e=this._nActiveControlInterpolants++,n=t[e];return n===void 0&&(n=new Na(new Float32Array(2),new Float32Array(2),1,qy),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){let e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,s=e[i];t.__cacheIndex=i,e[i]=t,s.__cacheIndex=n,e[n]=s}clipAction(t,e,n){let i=e||this._root,s=i.uuid,a=typeof t=="string"?Rs.findByName(i,t):t,o=a!==null?a.uuid:t,l=this._actionsByClip[o],c=null;if(n===void 0&&(a!==null?n=a.blendMode:n=Ic),l!==void 0){let f=l.actionByRoot[s];if(f!==void 0&&f.blendMode===n)return f;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;let h=new Yl(this,a,e,n);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(t,e){let n=e||this._root,i=n.uuid,s=typeof t=="string"?Rs.findByName(n,t):t,a=s?s.uuid:t,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[i]||null}stopAllAction(){let t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;let e=this._actions,n=this._nActiveActions,i=this.time+=t,s=Math.sign(t),a=this._accuIndex^=1;for(let c=0;c!==n;++c)e[c]._update(i,t,s,a);let o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){let e=this._actions,n=t.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){let c=a[o];this._deactivateAction(c);let h=c._cacheIndex,f=e[e.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,f._cacheIndex=h,e[h]=f,e.pop(),this._removeInactiveBindingsForAction(c)}delete i[n]}}uncacheRoot(t){let e=t.uuid,n=this._actionsByClip;for(let a in n){let o=n[a].actionByRoot,l=o[e];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}let i=this._bindingsByRootAndName,s=i[e];if(s!==void 0)for(let a in s){let o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(t,e){let n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}},Ru=class extends _a{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isRenderTarget3D=!0,this.depth=n,this.texture=new ar(null,t,e,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}},Pu=class r{constructor(t){this.value=t}clone(){return new r(this.value.clone===void 0?this.value:this.value.clone())}},Yy=0,Iu=class extends En{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:Yy++}),this.name="",this.usage=pa,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){let e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){this.dispatchEvent({type:"dispose"})}copy(t){this.name=t.name,this.usage=t.usage;let e=t.uniforms;this.uniforms.length=0;for(let n=0,i=e.length;n<i;n++){let s=Array.isArray(e[n])?e[n]:[e[n]];for(let a=0;a<s.length;a++)this.uniforms.push(s[a].clone())}return this}clone(){return new this.constructor().copy(this)}},Du=class extends ur{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}},Lu=class{constructor(t,e,n,i,s,a=!1){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=n,this.elementSize=i,this.count=s,this.normalized=a,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}},$g=new Gt,Nu=class{constructor(t,e,n=0,i=1/0){this.ray=new Xi(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new or,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):Rt("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return $g.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4($g),this}intersectObject(t,e=!0,n=[]){return Vd(t,this,n,e),n.sort(Kg),n}intersectObjects(t,e=!0,n=[]){for(let i=0,s=t.length;i<s;i++)Vd(t[i],this,n,e);return n.sort(Kg),n}};function Kg(r,t){return r.distance-t.distance}function Vd(r,t,e,n){let i=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let a=0,o=s.length;a<o;a++)Vd(s[a],t,e,!0)}}var ka=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,ft("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=performance.now();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}},Uu=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=zt(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(zt(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},Fu=class{constructor(t=1,e=0,n=0){this.radius=t,this.theta=e,this.y=n}set(t,e,n){return this.radius=t,this.theta=e,this.y=n,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+n*n),this.theta=Math.atan2(t,n),this.y=e,this}clone(){return new this.constructor().copy(this)}},Ou=class r{static{r.prototype.isMatrix2=!0}constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let s=this.elements;return s[0]=t,s[2]=e,s[1]=n,s[3]=i,this}},Qg=new Q,Bu=class{constructor(t=new Q(1/0,1/0),e=new Q(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Qg.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qg).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},jg=new I,Vh=new I,sa=new I,ra=new I,Ad=new I,Zy=new I,Jy=new I,zu=class{constructor(t=new I,e=new I){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){jg.subVectors(t,this.start),Vh.subVectors(this.end,this.start);let n=Vh.dot(Vh);if(n===0)return 0;let s=Vh.dot(jg)/n;return e&&(s=zt(s,0,1)),s}closestPointToPoint(t,e,n){let i=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(t,e=Zy,n=Jy){let i=10000000000000001e-32,s,a,o=this.start,l=t.start,c=this.end,h=t.end;sa.subVectors(c,o),ra.subVectors(h,l),Ad.subVectors(o,l);let f=sa.dot(sa),u=ra.dot(ra),d=ra.dot(Ad);if(f<=i&&u<=i)return e.copy(o),n.copy(l),e.sub(n),e.dot(e);if(f<=i)s=0,a=d/u,a=zt(a,0,1);else{let p=sa.dot(Ad);if(u<=i)a=0,s=zt(-p/f,0,1);else{let _=sa.dot(ra),m=f*u-_*_;m!==0?s=zt((_*d-p*u)/m,0,1):s=0,a=(_*s+d)/u,a<0?(a=0,s=zt(-p/f,0,1)):a>1&&(a=1,s=zt((_-p)/f,0,1))}}return e.copy(o).addScaledVector(sa,s),n.copy(l).addScaledVector(ra,a),e.distanceToSquared(n)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},t_=new I,ku=class extends ce{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";let n=new Ht,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){let c=a/l*Math.PI*2,h=o/l*Math.PI*2;i.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new Et(i,3));let s=new Ve({fog:!1,toneMapped:!1});this.cone=new zn(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);let t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),t_.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(t_),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},ms=new I,Gh=new Gt,Cd=new Gt,Vu=class extends zn{constructor(t){let e=f0(t),n=new Ht,i=[],s=[];for(let c=0;c<e.length;c++){let h=e[c];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(0,0,0),s.push(0,0,0))}n.setAttribute("position",new Et(i,3)),n.setAttribute("color",new Et(s,3));let a=new Ve({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,a),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1;let o=new bt(255),l=new bt(65280);this.setColors(o,l)}updateMatrixWorld(t){let e=this.bones,n=this.geometry,i=n.getAttribute("position");Cd.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<e.length;s++){let o=e[s];o.parent&&o.parent.isBone&&(Gh.multiplyMatrices(Cd,o.matrixWorld),ms.setFromMatrixPosition(Gh),i.setXYZ(a,ms.x,ms.y,ms.z),Gh.multiplyMatrices(Cd,o.parent.matrixWorld),ms.setFromMatrixPosition(Gh),i.setXYZ(a+1,ms.x,ms.y,ms.z),a+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}setColors(t,e){let i=this.geometry.getAttribute("color");for(let s=0;s<i.count;s+=2)i.setXYZ(s,t.r,t.g,t.b),i.setXYZ(s+1,e.r,e.g,e.b);return i.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};function f0(r){let t=[];r.isBone===!0&&t.push(r);for(let e=0;e<r.children.length;e++)t.push(...f0(r.children[e]));return t}var Gu=class extends $t{constructor(t,e,n){let i=new $i(e,4,2),s=new On({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=t,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},$y=new I,e_=new bt,n_=new bt,Hu=class extends ce{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";let i=new Pa(e);i.rotateY(Math.PI*.5),this.material=new On({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let s=i.getAttribute("position"),a=new Float32Array(s.count*3);i.setAttribute("color",new oe(a,3)),this.add(new $t(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let e=t.geometry.getAttribute("color");e_.copy(this.light.color),n_.copy(this.light.groundColor);for(let n=0,i=e.count;n<i;n++){let s=n<i/2?e_:n_;e.setXYZ(n,s.r,s.g,s.b)}e.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),t.lookAt($y.setFromMatrixPosition(this.light.matrixWorld).negate())}},Wu=class extends zn{constructor(t=10,e=10,n=4473924,i=8947848){n=new bt(n),i=new bt(i);let s=e/2,a=t/e,o=t/2,l=[],c=[];for(let u=0,d=0,p=-o;u<=e;u++,p+=a){l.push(-o,0,p,o,0,p),l.push(p,0,-o,p,0,o);let _=u===s?n:i;_.toArray(c,d),d+=3,_.toArray(c,d),d+=3,_.toArray(c,d),d+=3,_.toArray(c,d),d+=3}let h=new Ht;h.setAttribute("position",new Et(l,3)),h.setAttribute("color",new Et(c,3));let f=new Ve({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},Xu=class extends zn{constructor(t=10,e=16,n=8,i=64,s=4473924,a=8947848){s=new bt(s),a=new bt(a);let o=[],l=[];if(e>1)for(let f=0;f<e;f++){let u=f/e*(Math.PI*2),d=Math.sin(u)*t,p=Math.cos(u)*t;o.push(0,0,0),o.push(d,0,p);let _=f&1?s:a;l.push(_.r,_.g,_.b),l.push(_.r,_.g,_.b)}for(let f=0;f<n;f++){let u=f&1?s:a,d=t-t/n*f;for(let p=0;p<i;p++){let _=p/i*(Math.PI*2),m=Math.sin(_)*d,g=Math.cos(_)*d;o.push(m,0,g),l.push(u.r,u.g,u.b),_=(p+1)/i*(Math.PI*2),m=Math.sin(_)*d,g=Math.cos(_)*d,o.push(m,0,g),l.push(u.r,u.g,u.b)}}let c=new Ht;c.setAttribute("position",new Et(o,3)),c.setAttribute("color",new Et(l,3));let h=new Ve({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},i_=new I,Hh=new I,s_=new I,qu=class extends ce{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",e===void 0&&(e=1);let i=new Ht;i.setAttribute("position",new Et([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));let s=new Ve({fog:!1,toneMapped:!1});this.lightPlane=new Bn(i,s),this.add(this.lightPlane),i=new Ht,i.setAttribute("position",new Et([0,0,0,0,0,1],3)),this.targetLine=new Bn(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),i_.setFromMatrixPosition(this.light.matrixWorld),Hh.setFromMatrixPosition(this.light.target.matrixWorld),s_.subVectors(Hh,i_),this.lightPlane.lookAt(Hh),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Hh),this.targetLine.scale.z=s_.length()}},Wh=new I,Ce=new xr,Yu=class extends zn{constructor(t){let e=new Ht,n=new Ve({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(p,_){l(p),l(_)}function l(p){i.push(0,0,0),s.push(0,0,0),a[p]===void 0&&(a[p]=[]),a[p].push(i.length/3-1)}e.setAttribute("position",new Et(i,3)),e.setAttribute("color",new Et(s,3)),super(e,n),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();let c=new bt(16755200),h=new bt(16711680),f=new bt(43775),u=new bt(16777215),d=new bt(3355443);this.setColors(c,h,f,u,d)}setColors(t,e,n,i,s){let o=this.geometry.getAttribute("color");return o.setXYZ(0,t.r,t.g,t.b),o.setXYZ(1,t.r,t.g,t.b),o.setXYZ(2,t.r,t.g,t.b),o.setXYZ(3,t.r,t.g,t.b),o.setXYZ(4,t.r,t.g,t.b),o.setXYZ(5,t.r,t.g,t.b),o.setXYZ(6,t.r,t.g,t.b),o.setXYZ(7,t.r,t.g,t.b),o.setXYZ(8,t.r,t.g,t.b),o.setXYZ(9,t.r,t.g,t.b),o.setXYZ(10,t.r,t.g,t.b),o.setXYZ(11,t.r,t.g,t.b),o.setXYZ(12,t.r,t.g,t.b),o.setXYZ(13,t.r,t.g,t.b),o.setXYZ(14,t.r,t.g,t.b),o.setXYZ(15,t.r,t.g,t.b),o.setXYZ(16,t.r,t.g,t.b),o.setXYZ(17,t.r,t.g,t.b),o.setXYZ(18,t.r,t.g,t.b),o.setXYZ(19,t.r,t.g,t.b),o.setXYZ(20,t.r,t.g,t.b),o.setXYZ(21,t.r,t.g,t.b),o.setXYZ(22,t.r,t.g,t.b),o.setXYZ(23,t.r,t.g,t.b),o.setXYZ(24,e.r,e.g,e.b),o.setXYZ(25,e.r,e.g,e.b),o.setXYZ(26,e.r,e.g,e.b),o.setXYZ(27,e.r,e.g,e.b),o.setXYZ(28,e.r,e.g,e.b),o.setXYZ(29,e.r,e.g,e.b),o.setXYZ(30,e.r,e.g,e.b),o.setXYZ(31,e.r,e.g,e.b),o.setXYZ(32,n.r,n.g,n.b),o.setXYZ(33,n.r,n.g,n.b),o.setXYZ(34,n.r,n.g,n.b),o.setXYZ(35,n.r,n.g,n.b),o.setXYZ(36,n.r,n.g,n.b),o.setXYZ(37,n.r,n.g,n.b),o.setXYZ(38,i.r,i.g,i.b),o.setXYZ(39,i.r,i.g,i.b),o.setXYZ(40,s.r,s.g,s.b),o.setXYZ(41,s.r,s.g,s.b),o.setXYZ(42,s.r,s.g,s.b),o.setXYZ(43,s.r,s.g,s.b),o.setXYZ(44,s.r,s.g,s.b),o.setXYZ(45,s.r,s.g,s.b),o.setXYZ(46,s.r,s.g,s.b),o.setXYZ(47,s.r,s.g,s.b),o.setXYZ(48,s.r,s.g,s.b),o.setXYZ(49,s.r,s.g,s.b),o.needsUpdate=!0,this}update(){let t=this.geometry,e=this.pointMap,n=1,i=1,s,a;if(Ce.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),this.camera.reversedDepth===!0)s=1,a=0;else if(this.camera.coordinateSystem===bn)s=-1,a=1;else if(this.camera.coordinateSystem===Ms)s=0,a=1;else throw new Error("THREE.CameraHelper.update(): Invalid coordinate system: "+this.camera.coordinateSystem);Oe("c",e,t,Ce,0,0,s),Oe("t",e,t,Ce,0,0,a),Oe("n1",e,t,Ce,-n,-i,s),Oe("n2",e,t,Ce,n,-i,s),Oe("n3",e,t,Ce,-n,i,s),Oe("n4",e,t,Ce,n,i,s),Oe("f1",e,t,Ce,-n,-i,a),Oe("f2",e,t,Ce,n,-i,a),Oe("f3",e,t,Ce,-n,i,a),Oe("f4",e,t,Ce,n,i,a),Oe("u1",e,t,Ce,n*.7,i*1.1,s),Oe("u2",e,t,Ce,-n*.7,i*1.1,s),Oe("u3",e,t,Ce,0,i*2,s),Oe("cf1",e,t,Ce,-n,0,a),Oe("cf2",e,t,Ce,n,0,a),Oe("cf3",e,t,Ce,0,-i,a),Oe("cf4",e,t,Ce,0,i,a),Oe("cn1",e,t,Ce,-n,0,s),Oe("cn2",e,t,Ce,n,0,s),Oe("cn3",e,t,Ce,0,-i,s),Oe("cn4",e,t,Ce,0,i,s),t.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}};function Oe(r,t,e,n,i,s,a){Wh.set(i,s,a).unproject(n);let o=t[r];if(o!==void 0){let l=e.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],Wh.x,Wh.y,Wh.z)}}var Xh=new Ge,Zu=class extends zn{constructor(t,e=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(24),s=new Ht;s.setIndex(new oe(n,1)),s.setAttribute("position",new oe(i,3)),super(s,new Ve({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(){if(this.object!==void 0&&Xh.setFromObject(this.object),Xh.isEmpty())return;let t=Xh.min,e=Xh.max,n=this.geometry.attributes.position,i=n.array;i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=t.x,i[4]=e.y,i[5]=e.z,i[6]=t.x,i[7]=t.y,i[8]=e.z,i[9]=e.x,i[10]=t.y,i[11]=e.z,i[12]=e.x,i[13]=e.y,i[14]=t.z,i[15]=t.x,i[16]=e.y,i[17]=t.z,i[18]=t.x,i[19]=t.y,i[20]=t.z,i[21]=e.x,i[22]=t.y,i[23]=t.z,n.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}},Ju=class extends zn{constructor(t,e=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Ht;s.setIndex(new oe(n,1)),s.setAttribute("position",new Et(i,3)),super(s,new Ve({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){let e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){this.geometry.dispose(),this.material.dispose()}},$u=class extends Bn{constructor(t,e=1,n=16776960){let i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new Ht;a.setAttribute("position",new Et(s,3)),a.computeBoundingSphere(),super(a,new Ve({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;let o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Ht;l.setAttribute("position",new Et(o,3)),l.computeBoundingSphere(),this.add(new $t(l,new On({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}},r_=new I,qh,Rd,Ku=class extends ce{constructor(t=new I(0,0,1),e=new I(0,0,0),n=1,i=16776960,s=n*.2,a=s*.2){super(),this.type="ArrowHelper",qh===void 0&&(qh=new Ht,qh.setAttribute("position",new Et([0,0,0,0,1,0],3)),Rd=new ba(.5,1,5,1),Rd.translate(0,-.5,0)),this.position.copy(e),this.line=new Bn(qh,new Ve({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new $t(Rd,new On({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,s,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{r_.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(r_,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},Qu=class extends zn{constructor(t=1){let e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Ht;i.setAttribute("position",new Et(e,3)),i.setAttribute("color",new Et(n,3));let s=new Ve({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(t,e,n){let i=new bt,s=this.geometry.attributes.color.array;return i.set(t),i.toArray(s,0),i.toArray(s,3),i.set(e),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}},ju=class{constructor(){this.type="ShapePath",this.color=new bt,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new mr,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,i){return this.currentPath.quadraticCurveTo(t,e,n,i),this}bezierCurveTo(t,e,n,i,s,a){return this.currentPath.bezierCurveTo(t,e,n,i,s,a),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(g){let x=[];for(let v=0,M=g.length;v<M;v++){let E=g[v],S=new Si;S.curves=E.curves,x.push(S)}return x}function n(g,x){let v=x.length,M=!1;for(let E=v-1,S=0;S<v;E=S++){let w=x[E],y=x[S],T=y.x-w.x,R=y.y-w.y;if(Math.abs(R)>Number.EPSILON){if(R<0&&(w=x[S],T=-T,y=x[E],R=-R),g.y<w.y||g.y>y.y)continue;if(g.y===w.y){if(g.x===w.x)return!0}else{let P=R*(g.x-w.x)-T*(g.y-w.y);if(P===0)return!0;if(P<0)continue;M=!M}}else{if(g.y!==w.y)continue;if(y.x<=g.x&&g.x<=w.x||w.x<=g.x&&g.x<=y.x)return!0}}return M}let i=Zn.isClockWise,s=this.subPaths;if(s.length===0)return[];let a,o,l,c=[];if(s.length===1)return o=s[0],l=new Si,l.curves=o.curves,c.push(l),c;let h=!i(s[0].getPoints());h=t?!h:h;let f=[],u=[],d=[],p=0,_;u[p]=void 0,d[p]=[];for(let g=0,x=s.length;g<x;g++)o=s[g],_=o.getPoints(),a=i(_),a=t?!a:a,a?(!h&&u[p]&&p++,u[p]={s:new Si,p:_},u[p].s.curves=o.curves,h&&p++,d[p]=[]):d[p].push({h:o,p:_[0]});if(!u[0])return e(s);if(u.length>1){let g=!1,x=0;for(let v=0,M=u.length;v<M;v++)f[v]=[];for(let v=0,M=u.length;v<M;v++){let E=d[v];for(let S=0;S<E.length;S++){let w=E[S],y=!0;for(let T=0;T<u.length;T++)n(w.p,u[T].p)&&(v!==T&&x++,y?(y=!1,f[T].push(w)):g=!0);y&&f[v].push(w)}}x>0&&g===!1&&(d=f)}let m;for(let g=0,x=u.length;g<x;g++){l=u[g].s,c.push(l),m=d[g];for(let v=0,M=m.length;v<M;v++)l.holes.push(m[v].h)}return c}},tf=class extends En{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){if(t===void 0){ft("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Ky(r,t){let e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function Qy(r,t){let e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function jy(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function Mf(r,t,e,n){let i=tM(n);switch(e){case _f:return r*t;case Ql:return r*t/i.components*i.byteLength;case Za:return r*t/i.components*i.byteLength;case ts:return r*t*2/i.components*i.byteLength;case jl:return r*t*2/i.components*i.byteLength;case xf:return r*t*3/i.components*i.byteLength;case an:return r*t*4/i.components*i.byteLength;case tc:return r*t*4/i.components*i.byteLength;case Ja:case $a:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Ka:case Qa:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case nc:case sc:return Math.max(r,16)*Math.max(t,8)/4;case ec:case ic:return Math.max(r,8)*Math.max(t,8)/2;case rc:case ac:case lc:case cc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case oc:case ja:case hc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case uc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case fc:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case dc:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case pc:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case mc:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case gc:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case _c:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case xc:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case vc:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case yc:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Mc:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Sc:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case bc:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Tc:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Ec:case wc:case Ac:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Cc:case Rc:return Math.ceil(r/4)*Math.ceil(t/4)*8;case to:case Pc:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function tM(r){switch(r){case xn:case df:return{byteLength:1,components:1};case Tr:case pf:case mi:return{byteLength:2,components:1};case $l:case Kl:return{byteLength:2,components:4};case Vn:case Jl:case rn:return{byteLength:4,components:1};case mf:case gf:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}var ef=class{static contain(t,e){return Ky(t,e)}static cover(t,e){return Qy(t,e)}static fill(t){return jy(t)}static getByteLength(t,e,n,i){return Mf(t,e,n,i)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"184"}}));typeof window<"u"&&(window.__THREE__?ft("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="184");function U0(){let r=null,t=!1,e=null,n=null;function i(s,a){e(s,a),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&r!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function eM(r){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,f=c.byteLength,u=r.createBuffer();r.bindBuffer(l,u),r.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=r.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=r.SHORT;else if(c instanceof Uint32Array)d=r.UNSIGNED_INT;else if(c instanceof Int32Array)d=r.INT;else if(c instanceof Int8Array)d=r.BYTE;else if(c instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){let h=l.array,f=l.updateRanges;if(r.bindBuffer(c,o),f.length===0)r.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){let p=f[u],_=f[d];_.start<=p.start+p.count+1?p.count=Math.max(p.count,_.start+_.count-p.start):(++u,f[u]=_)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){let _=f[d];r.bufferSubData(c,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(r.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:s,update:a}}var nM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iM=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,sM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,aM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,oM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,cM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,hM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,uM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,fM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,dM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,mM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,gM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,_M=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,xM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,MM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,SM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,bM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,TM=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,EM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,AM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,CM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,RM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,PM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,IM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,DM="gl_FragColor = linearToOutputTexel( gl_FragColor );",LM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,NM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,UM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,FM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,OM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,BM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,zM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,kM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,VM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,GM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,HM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,WM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,XM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,YM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,ZM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,JM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$M=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,KM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,QM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,jM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,tS=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,eS=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nS=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,iS=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sS=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,rS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,aS=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,oS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,lS=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,cS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hS=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,fS=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,dS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,gS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,_S=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xS=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,vS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,yS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,MS=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,SS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,bS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,TS=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ES=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,AS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,CS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,RS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,PS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,IS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,DS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,LS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,NS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,US=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,FS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,OS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,BS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,zS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,kS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,VS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,GS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,HS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,WS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,XS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,qS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,YS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ZS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,JS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,$S=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,KS=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,QS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,jS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,tb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,eb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,nb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ib=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ab=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ob=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,cb=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,hb=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ub=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,fb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,db=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pb=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,mb=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,gb=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,_b=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xb=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vb=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yb=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Mb=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,bb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Tb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Eb=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wb=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ab=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Rb=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Ib=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Db=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Nb=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ub=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ee={alphahash_fragment:nM,alphahash_pars_fragment:iM,alphamap_fragment:sM,alphamap_pars_fragment:rM,alphatest_fragment:aM,alphatest_pars_fragment:oM,aomap_fragment:lM,aomap_pars_fragment:cM,batching_pars_vertex:hM,batching_vertex:uM,begin_vertex:fM,beginnormal_vertex:dM,bsdfs:pM,iridescence_fragment:mM,bumpmap_pars_fragment:gM,clipping_planes_fragment:_M,clipping_planes_pars_fragment:xM,clipping_planes_pars_vertex:vM,clipping_planes_vertex:yM,color_fragment:MM,color_pars_fragment:SM,color_pars_vertex:bM,color_vertex:TM,common:EM,cube_uv_reflection_fragment:wM,defaultnormal_vertex:AM,displacementmap_pars_vertex:CM,displacementmap_vertex:RM,emissivemap_fragment:PM,emissivemap_pars_fragment:IM,colorspace_fragment:DM,colorspace_pars_fragment:LM,envmap_fragment:NM,envmap_common_pars_fragment:UM,envmap_pars_fragment:FM,envmap_pars_vertex:OM,envmap_physical_pars_fragment:ZM,envmap_vertex:BM,fog_vertex:zM,fog_pars_vertex:kM,fog_fragment:VM,fog_pars_fragment:GM,gradientmap_pars_fragment:HM,lightmap_pars_fragment:WM,lights_lambert_fragment:XM,lights_lambert_pars_fragment:qM,lights_pars_begin:YM,lights_toon_fragment:JM,lights_toon_pars_fragment:$M,lights_phong_fragment:KM,lights_phong_pars_fragment:QM,lights_physical_fragment:jM,lights_physical_pars_fragment:tS,lights_fragment_begin:eS,lights_fragment_maps:nS,lights_fragment_end:iS,lightprobes_pars_fragment:sS,logdepthbuf_fragment:rS,logdepthbuf_pars_fragment:aS,logdepthbuf_pars_vertex:oS,logdepthbuf_vertex:lS,map_fragment:cS,map_pars_fragment:hS,map_particle_fragment:uS,map_particle_pars_fragment:fS,metalnessmap_fragment:dS,metalnessmap_pars_fragment:pS,morphinstance_vertex:mS,morphcolor_vertex:gS,morphnormal_vertex:_S,morphtarget_pars_vertex:xS,morphtarget_vertex:vS,normal_fragment_begin:yS,normal_fragment_maps:MS,normal_pars_fragment:SS,normal_pars_vertex:bS,normal_vertex:TS,normalmap_pars_fragment:ES,clearcoat_normal_fragment_begin:wS,clearcoat_normal_fragment_maps:AS,clearcoat_pars_fragment:CS,iridescence_pars_fragment:RS,opaque_fragment:PS,packing:IS,premultiplied_alpha_fragment:DS,project_vertex:LS,dithering_fragment:NS,dithering_pars_fragment:US,roughnessmap_fragment:FS,roughnessmap_pars_fragment:OS,shadowmap_pars_fragment:BS,shadowmap_pars_vertex:zS,shadowmap_vertex:kS,shadowmask_pars_fragment:VS,skinbase_vertex:GS,skinning_pars_vertex:HS,skinning_vertex:WS,skinnormal_vertex:XS,specularmap_fragment:qS,specularmap_pars_fragment:YS,tonemapping_fragment:ZS,tonemapping_pars_fragment:JS,transmission_fragment:$S,transmission_pars_fragment:KS,uv_pars_fragment:QS,uv_pars_vertex:jS,uv_vertex:tb,worldpos_vertex:eb,background_vert:nb,background_frag:ib,backgroundCube_vert:sb,backgroundCube_frag:rb,cube_vert:ab,cube_frag:ob,depth_vert:lb,depth_frag:cb,distance_vert:hb,distance_frag:ub,equirect_vert:fb,equirect_frag:db,linedashed_vert:pb,linedashed_frag:mb,meshbasic_vert:gb,meshbasic_frag:_b,meshlambert_vert:xb,meshlambert_frag:vb,meshmatcap_vert:yb,meshmatcap_frag:Mb,meshnormal_vert:Sb,meshnormal_frag:bb,meshphong_vert:Tb,meshphong_frag:Eb,meshphysical_vert:wb,meshphysical_frag:Ab,meshtoon_vert:Cb,meshtoon_frag:Rb,points_vert:Pb,points_frag:Ib,shadow_vert:Db,shadow_frag:Lb,sprite_vert:Nb,sprite_frag:Ub},xt={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Yt}},envmap:{envMap:{value:null},envMapRotation:{value:new Yt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Yt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Yt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Yt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Yt},normalScale:{value:new Q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Yt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Yt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Yt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Yt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0},uvTransform:{value:new Yt}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Yt},alphaMap:{value:null},alphaMapTransform:{value:new Yt},alphaTest:{value:0}}},gi={basic:{uniforms:cn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:cn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new bt(0)},envMapIntensity:{value:1}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:cn([xt.common,xt.specularmap,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,xt.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:cn([xt.common,xt.envmap,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.roughnessmap,xt.metalnessmap,xt.fog,xt.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:cn([xt.common,xt.aomap,xt.lightmap,xt.emissivemap,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.gradientmap,xt.fog,xt.lights,{emissive:{value:new bt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:cn([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,xt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:cn([xt.points,xt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:cn([xt.common,xt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:cn([xt.common,xt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:cn([xt.common,xt.bumpmap,xt.normalmap,xt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:cn([xt.sprite,xt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Yt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Yt}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distance:{uniforms:cn([xt.common,xt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distance_vert,fragmentShader:ee.distance_frag},shadow:{uniforms:cn([xt.lights,xt.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};gi.physical={uniforms:cn([gi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Yt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Yt},clearcoatNormalScale:{value:new Q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Yt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Yt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Yt},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Yt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Yt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Yt},transmissionSamplerSize:{value:new Q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Yt},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Yt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Yt},anisotropyVector:{value:new Q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Yt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};var Sf={r:0,b:0,g:0},Fb=new Gt,F0=new Yt;F0.set(-1,0,0,0,1,0,0,0,1);function Ob(r,t,e,n,i,s){let a=new bt(0),o=i===!0?0:1,l,c,h=null,f=0,u=null;function d(x){let v=x.isScene===!0?x.background:null;if(v&&v.isTexture){let M=x.backgroundBlurriness>0;v=t.get(v,M)}return v}function p(x){let v=!1,M=d(x);M===null?m(a,o):M&&M.isColor&&(m(M,1),v=!0);let E=r.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,s):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(r.autoClear||v)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function _(x,v){let M=d(v);M&&(M.isCubeTexture||M.mapping===Sr)?(c===void 0&&(c=new $t(new kn(1,1,1),new gn({name:"BackgroundCubeMaterial",uniforms:wr(gi.backgroundCube.uniforms),vertexShader:gi.backgroundCube.vertexShader,fragmentShader:gi.backgroundCube.fragmentShader,side:ln,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,S,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Fb.makeRotationFromEuler(v.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(F0),c.material.toneMapped=ie.getTransfer(M.colorSpace)!==he,(h!==M||f!==M.version||u!==r.toneMapping)&&(c.material.needsUpdate=!0,h=M,f=M.version,u=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new $t(new Ji(2,2),new gn({name:"BackgroundMaterial",uniforms:wr(gi.background.uniforms),vertexShader:gi.background.vertexShader,fragmentShader:gi.background.fragmentShader,side:bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=ie.getTransfer(M.colorSpace)!==he,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(h!==M||f!==M.version||u!==r.toneMapping)&&(l.material.needsUpdate=!0,h=M,f=M.version,u=r.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,v){x.getRGB(Sf,Ap(r)),e.buffers.color.setClear(Sf.r,Sf.g,Sf.b,v,s)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),o=v,m(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,m(a,o)},render:p,addToRenderList:_,dispose:g}}function Bb(r,t){let e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null),s=i,a=!1;function o(P,U,z,k,D){let F=!1,L=f(P,k,z,U);s!==L&&(s=L,c(s.object)),F=d(P,k,z,D),F&&p(P,k,z,D),D!==null&&t.update(D,r.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,M(P,U,z,k),D!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function l(){return r.createVertexArray()}function c(P){return r.bindVertexArray(P)}function h(P){return r.deleteVertexArray(P)}function f(P,U,z,k){let D=k.wireframe===!0,F=n[U.id];F===void 0&&(F={},n[U.id]=F);let L=P.isInstancedMesh===!0?P.id:0,W=F[L];W===void 0&&(W={},F[L]=W);let q=W[z.id];q===void 0&&(q={},W[z.id]=q);let et=q[D];return et===void 0&&(et=u(l()),q[D]=et),et}function u(P){let U=[],z=[],k=[];for(let D=0;D<e;D++)U[D]=0,z[D]=0,k[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:z,attributeDivisors:k,object:P,attributes:{},index:null}}function d(P,U,z,k){let D=s.attributes,F=U.attributes,L=0,W=z.getAttributes();for(let q in W)if(W[q].location>=0){let lt=D[q],mt=F[q];if(mt===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(mt=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(mt=P.instanceColor)),lt===void 0||lt.attribute!==mt||mt&&lt.data!==mt.data)return!0;L++}return s.attributesNum!==L||s.index!==k}function p(P,U,z,k){let D={},F=U.attributes,L=0,W=z.getAttributes();for(let q in W)if(W[q].location>=0){let lt=F[q];lt===void 0&&(q==="instanceMatrix"&&P.instanceMatrix&&(lt=P.instanceMatrix),q==="instanceColor"&&P.instanceColor&&(lt=P.instanceColor));let mt={};mt.attribute=lt,lt&&lt.data&&(mt.data=lt.data),D[q]=mt,L++}s.attributes=D,s.attributesNum=L,s.index=k}function _(){let P=s.newAttributes;for(let U=0,z=P.length;U<z;U++)P[U]=0}function m(P){g(P,0)}function g(P,U){let z=s.newAttributes,k=s.enabledAttributes,D=s.attributeDivisors;z[P]=1,k[P]===0&&(r.enableVertexAttribArray(P),k[P]=1),D[P]!==U&&(r.vertexAttribDivisor(P,U),D[P]=U)}function x(){let P=s.newAttributes,U=s.enabledAttributes;for(let z=0,k=U.length;z<k;z++)U[z]!==P[z]&&(r.disableVertexAttribArray(z),U[z]=0)}function v(P,U,z,k,D,F,L){L===!0?r.vertexAttribIPointer(P,U,z,D,F):r.vertexAttribPointer(P,U,z,k,D,F)}function M(P,U,z,k){_();let D=k.attributes,F=z.getAttributes(),L=U.defaultAttributeValues;for(let W in F){let q=F[W];if(q.location>=0){let et=D[W];if(et===void 0&&(W==="instanceMatrix"&&P.instanceMatrix&&(et=P.instanceMatrix),W==="instanceColor"&&P.instanceColor&&(et=P.instanceColor)),et!==void 0){let lt=et.normalized,mt=et.itemSize,Ft=t.get(et);if(Ft===void 0)continue;let kt=Ft.buffer,Ot=Ft.type,$=Ft.bytesPerElement,_t=Ot===r.INT||Ot===r.UNSIGNED_INT||et.gpuType===Jl;if(et.isInterleavedBufferAttribute){let at=et.data,Dt=at.stride,Vt=et.offset;if(at.isInstancedInterleavedBuffer){for(let Bt=0;Bt<q.locationSize;Bt++)g(q.location+Bt,at.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Bt=0;Bt<q.locationSize;Bt++)m(q.location+Bt);r.bindBuffer(r.ARRAY_BUFFER,kt);for(let Bt=0;Bt<q.locationSize;Bt++)v(q.location+Bt,mt/q.locationSize,Ot,lt,Dt*$,(Vt+mt/q.locationSize*Bt)*$,_t)}else{if(et.isInstancedBufferAttribute){for(let at=0;at<q.locationSize;at++)g(q.location+at,et.meshPerAttribute);P.isInstancedMesh!==!0&&k._maxInstanceCount===void 0&&(k._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let at=0;at<q.locationSize;at++)m(q.location+at);r.bindBuffer(r.ARRAY_BUFFER,kt);for(let at=0;at<q.locationSize;at++)v(q.location+at,mt/q.locationSize,Ot,lt,mt*$,mt/q.locationSize*at*$,_t)}}else if(L!==void 0){let lt=L[W];if(lt!==void 0)switch(lt.length){case 2:r.vertexAttrib2fv(q.location,lt);break;case 3:r.vertexAttrib3fv(q.location,lt);break;case 4:r.vertexAttrib4fv(q.location,lt);break;default:r.vertexAttrib1fv(q.location,lt)}}}}x()}function E(){T();for(let P in n){let U=n[P];for(let z in U){let k=U[z];for(let D in k){let F=k[D];for(let L in F)h(F[L].object),delete F[L];delete k[D]}}delete n[P]}}function S(P){if(n[P.id]===void 0)return;let U=n[P.id];for(let z in U){let k=U[z];for(let D in k){let F=k[D];for(let L in F)h(F[L].object),delete F[L];delete k[D]}}delete n[P.id]}function w(P){for(let U in n){let z=n[U];for(let k in z){let D=z[k];if(D[P.id]===void 0)continue;let F=D[P.id];for(let L in F)h(F[L].object),delete F[L];delete D[P.id]}}}function y(P){for(let U in n){let z=n[U],k=P.isInstancedMesh===!0?P.id:0,D=z[k];if(D!==void 0){for(let F in D){let L=D[F];for(let W in L)h(L[W].object),delete L[W];delete D[F]}delete z[k],Object.keys(z).length===0&&delete n[U]}}}function T(){R(),a=!0,s!==i&&(s=i,c(s.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:T,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:S,releaseStatesOfObject:y,releaseStatesOfProgram:w,initAttributes:_,enableAttribute:m,disableUnusedAttributes:x}}function zb(r,t,e){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,h){h!==0&&(r.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=i,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function kb(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let w=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(w){return!(w!==an&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){let y=w===mi&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==xn&&n.convert(w)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==rn&&!y)}function l(w){if(w==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(ft("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ft("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),p=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=r.getParameter(r.MAX_TEXTURE_SIZE),m=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),g=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),v=r.getParameter(r.MAX_VARYING_VECTORS),M=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),E=r.getParameter(r.MAX_SAMPLES),S=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:_,maxCubemapSize:m,maxAttributes:g,maxVertexUniforms:x,maxVaryings:v,maxFragmentUniforms:M,maxSamples:E,samples:S}}function Vb(r){let t=this,e=null,n=0,i=!1,s=!1,a=new si,o=new Yt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||i;return i=u,n=f.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let p=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,g=r.get(f);if(!i||p===null||p.length===0||s&&!m)s?h(null):c();else{let x=s?0:n,v=x*4,M=g.clippingState||null;l.value=M,M=h(p,u,v,d);for(let E=0;E!==v;++E)M[E]=e[E];g.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,p){let _=f!==null?f.length:0,m=null;if(_!==0){if(m=l.value,p!==!0||m===null){let g=d+_*4,x=u.matrixWorldInverse;o.getNormalMatrix(x),(m===null||m.length<g)&&(m=new Float32Array(g));for(let v=0,M=d;v!==_;++v,M+=4)a.copy(f[v]).applyMatrix4(x,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,m}}var Ls=4,d0=[.125,.215,.35,.446,.526,.582],Ar=20,Gb=256,Nc=new Is,p0=new bt,Lp=null,Np=0,Up=0,Fp=!1,Hb=new I,Oc=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,s={}){let{size:a=256,position:o=Hb}=s;Lp=this._renderer.getRenderTarget(),Np=this._renderer.getActiveCubeFace(),Up=this._renderer.getActiveMipmapLevel(),Fp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,o),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=g0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Lp,Np,Up),this._renderer.xr.enabled=Fp,t.scissorTest=!1,eo(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===di||t.mapping===Qi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Lp=this._renderer.getRenderTarget(),Np=this._renderer.getActiveCubeFace(),Up=this._renderer.getActiveMipmapLevel(),Fp=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Me,minFilter:Me,generateMipmaps:!1,type:mi,format:an,colorSpace:fa,depthBuffer:!1},i=m0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=m0(t,e,n);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Wb(s)),this._blurMaterial=qb(s,t,e),this._ggxMaterial=Xb(s,t,e)}return i}_compileMaterial(t){let e=new $t(new Ht,t);this._renderer.compile(e,Nc)}_sceneToCubeUV(t,e,n,i,s){let l=new Re(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(p0),f.toneMapping=Kn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(i),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new $t(new kn,new On({name:"PMREM.Background",side:ln,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,g=!1,x=t.background;x?x.isColor&&(m.color.copy(x),t.background=null,g=!0):(m.color.copy(p0),g=!0);for(let v=0;v<6;v++){let M=v%3;M===0?(l.up.set(0,c[v],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+h[v],s.y,s.z)):M===1?(l.up.set(0,0,c[v]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+h[v],s.z)):(l.up.set(0,c[v],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+h[v]));let E=this._cubeSize;eo(i,M*E,v>2?E:0,E,E),f.setRenderTarget(i),g&&f.render(_,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=x}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===di||t.mapping===Qi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=_0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=g0());let s=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;let o=s.uniforms;o.envMap.value=t;let l=this._cubeSize;eo(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,Nc)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=n}_applyGGXFilter(t,e,n){let i=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;let l=a.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=0+c*1.25,d=f*u,{_lodMax:p}=this,_=this._sizeLods[n],m=3*_*(n>p-Ls?n-p+Ls:0),g=4*(this._cubeSize-_);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=p-e,eo(s,m,g,3*_,2*_),i.setRenderTarget(s),i.render(o,Nc),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=p-n,eo(t,m,g,3*_,2*_),i.setRenderTarget(t),i.render(o,Nc)}_blur(t,e,n,i,s){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,i,"latitudinal",s),this._halfBlur(a,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,a,o){let l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&Rt("blur direction must be either latitudinal or longitudinal!");let h=3,f=this._lodMeshes[i];f.material=c;let u=c.uniforms,d=this._sizeLods[n]-1,p=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*Ar-1),_=s/p,m=isFinite(s)?1+Math.floor(h*_):Ar;m>Ar&&ft(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ar}`);let g=[],x=0;for(let w=0;w<Ar;++w){let y=w/_,T=Math.exp(-y*y/2);g.push(T),w===0?x+=T:w<m&&(x+=2*T)}for(let w=0;w<g.length;w++)g[w]=g[w]/x;u.envMap.value=t.texture,u.samples.value=m,u.weights.value=g,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);let{_lodMax:v}=this;u.dTheta.value=p,u.mipInt.value=v-n;let M=this._sizeLods[i],E=3*M*(i>v-Ls?i-v+Ls:0),S=4*(this._cubeSize-M);eo(e,E,S,3*M,2*M),l.setRenderTarget(e),l.render(f,Nc)}};function Wb(r){let t=[],e=[],n=[],i=r,s=r-Ls+1+d0.length;for(let a=0;a<s;a++){let o=Math.pow(2,i);t.push(o);let l=1/o;a>r-Ls?l=d0[a-r+Ls-1]:a===0&&(l=0),e.push(l);let c=1/(o-2),h=-c,f=1+c,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,p=6,_=3,m=2,g=1,x=new Float32Array(_*p*d),v=new Float32Array(m*p*d),M=new Float32Array(g*p*d);for(let S=0;S<d;S++){let w=S%3*2/3-1,y=S>2?0:-1,T=[w,y,0,w+2/3,y,0,w+2/3,y+1,0,w,y,0,w+2/3,y+1,0,w,y+1,0];x.set(T,_*p*S),v.set(u,m*p*S);let R=[S,S,S,S,S,S];M.set(R,g*p*S)}let E=new Ht;E.setAttribute("position",new oe(x,_)),E.setAttribute("uv",new oe(v,m)),E.setAttribute("faceIndex",new oe(M,g)),n.push(new $t(E,null)),i>Ls&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function m0(r,t,e){let n=new on(r,t,e);return n.texture.mapping=Sr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function eo(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function Xb(r,t,e){return new gn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Gb,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Tf(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function qb(r,t,e){let n=new Float32Array(Ar),i=new I(0,1,0);return new gn({name:"SphericalGaussianBlur",defines:{n:Ar,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Tf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function g0(){return new gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Tf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function _0(){return new gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Tf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fi,depthTest:!1,depthWrite:!1})}function Tf(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}var Bc=class extends on{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Es(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new kn(5,5,5),s=new gn({name:"CubemapFromEquirect",uniforms:wr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ln,blending:fi});s.uniforms.tEquirect.value=e;let a=new $t(i,s),o=e.minFilter;return e.minFilter===pi&&(e.minFilter=Me),new Gl(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(s)}};function Yb(r){let t=new WeakMap,e=new WeakMap,n=null;function i(u,d=!1){return u==null?null:d?a(u):s(u)}function s(u){if(u&&u.isTexture){let d=u.mapping;if(d===Xa||d===qa)if(t.has(u)){let p=t.get(u).texture;return o(p,u.mapping)}else{let p=u.image;if(p&&p.height>0){let _=new Bc(p.height);return _.fromEquirectangularTexture(r,u),t.set(u,_),u.addEventListener("dispose",c),o(_.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){let d=u.mapping,p=d===Xa||d===qa,_=d===di||d===Qi;if(p||_){let m=e.get(u),g=m!==void 0?m.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new Oc(r)),m=p?n.fromEquirectangular(u,m):n.fromCubemap(u,m),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),m.texture;if(m!==void 0)return m.texture;{let x=u.image;return p&&x&&x.height>0||_&&x&&l(x)?(n===null&&(n=new Oc(r)),m=p?n.fromEquirectangular(u):n.fromCubemap(u),m.texture.pmremVersion=u.pmremVersion,e.set(u,m),u.addEventListener("dispose",h),m.texture):null}}}return u}function o(u,d){return d===Xa?u.mapping=di:d===qa&&(u.mapping=Qi),u}function l(u){let d=0,p=6;for(let _=0;_<p;_++)u[_]!==void 0&&d++;return d===p}function c(u){let d=u.target;d.removeEventListener("dispose",c);let p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:f}}function Zb(r){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=r.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Ho("WebGLRenderer: "+n+" extension not supported."),i}}}function Jb(r,t,e,n){let i={},s=new WeakMap;function a(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let p in u.attributes)t.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete i[u.id];let d=s.get(u);d&&(t.remove(d),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function o(f,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],r.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,p=f.attributes.position,_=0;if(p===void 0)return;if(d!==null){let x=d.array;_=d.version;for(let v=0,M=x.length;v<M;v+=3){let E=x[v+0],S=x[v+1],w=x[v+2];u.push(E,S,S,w,w,E)}}else{let x=p.array;_=p.version;for(let v=0,M=x.length/3-1;v<M;v+=3){let E=v+0,S=v+1,w=v+2;u.push(E,S,S,w,w,E)}}let m=new(p.count>=65535?va:xa)(u,1);m.version=_;let g=s.get(f);g&&t.remove(g),s.set(f,m)}function h(f){let u=s.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function $b(r,t,e){let n;function i(f){n=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,u){r.drawElements(n,u,s,f*a),e.update(u,n,1)}function c(f,u,d){d!==0&&(r.drawElementsInstanced(n,u,s,f*a,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,s,f,0,d);let _=0;for(let m=0;m<d;m++)_+=u[m];e.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Kb(r){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case r.TRIANGLES:e.triangles+=o*(s/3);break;case r.LINES:e.lines+=o*(s/2);break;case r.LINE_STRIP:e.lines+=o*(s-1);break;case r.LINE_LOOP:e.lines+=o*s;break;case r.POINTS:e.points+=o*s;break;default:Rt("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function Qb(r,t,e){let n=new WeakMap,i=new de;function s(a,o,l){let c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(o);if(u===void 0||u.count!==f){let T=function(){w.dispose(),n.delete(o),o.removeEventListener("dispose",T)};u!==void 0&&u.texture.dispose();let d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,m=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],x=o.morphAttributes.color||[],v=0;d===!0&&(v=1),p===!0&&(v=2),_===!0&&(v=3);let M=o.attributes.position.count*v,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);let S=new Float32Array(M*E*4*f),w=new rr(S,M,E,f);w.type=rn,w.needsUpdate=!0;let y=v*4;for(let R=0;R<f;R++){let P=m[R],U=g[R],z=x[R],k=M*E*4*R;for(let D=0;D<P.count;D++){let F=D*y;d===!0&&(i.fromBufferAttribute(P,D),S[k+F+0]=i.x,S[k+F+1]=i.y,S[k+F+2]=i.z,S[k+F+3]=0),p===!0&&(i.fromBufferAttribute(U,D),S[k+F+4]=i.x,S[k+F+5]=i.y,S[k+F+6]=i.z,S[k+F+7]=0),_===!0&&(i.fromBufferAttribute(z,D),S[k+F+8]=i.x,S[k+F+9]=i.y,S[k+F+10]=i.z,S[k+F+11]=z.itemSize===4?i.w:1)}}u={count:f,texture:w,size:new Q(M,E)},n.set(o,u),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",a.morphTexture,e);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];let p=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(r,"morphTargetBaseInfluence",p),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function jb(r,t,e,n,i){let s=new WeakMap;function a(c){let h=i.render.frame,f=c.geometry,u=t.get(c,f);if(s.get(u)!==h&&(t.update(u),s.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==h&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==h&&(d.update(),s.set(d,h))}return u}function o(){s=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:a,dispose:o}}var tT={[af]:"LINEAR_TONE_MAPPING",[of]:"REINHARD_TONE_MAPPING",[lf]:"CINEON_TONE_MAPPING",[Wa]:"ACES_FILMIC_TONE_MAPPING",[hf]:"AGX_TONE_MAPPING",[uf]:"NEUTRAL_TONE_MAPPING",[cf]:"CUSTOM_TONE_MAPPING"};function eT(r,t,e,n,i){let s=new on(t,e,{type:r,depthBuffer:n,stencilBuffer:i,depthTexture:n?new Ti(t,e):void 0}),a=new on(t,e,{type:mi,depthBuffer:!1,stencilBuffer:!1}),o=new Ht;o.setAttribute("position",new Et([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Et([0,2,0,0,2,0],2));let l=new Ia({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new $t(o,l),h=new Is(-1,1,1,-1,0,1),f=null,u=null,d=!1,p,_=null,m=[],g=!1;this.setSize=function(x,v){s.setSize(x,v),a.setSize(x,v);for(let M=0;M<m.length;M++){let E=m[M];E.setSize&&E.setSize(x,v)}},this.setEffects=function(x){m=x,g=m.length>0&&m[0].isRenderPass===!0;let v=s.width,M=s.height;for(let E=0;E<m.length;E++){let S=m[E];S.setSize&&S.setSize(v,M)}},this.begin=function(x,v){if(d||x.toneMapping===Kn&&m.length===0)return!1;if(_=v,v!==null){let M=v.width,E=v.height;(s.width!==M||s.height!==E)&&this.setSize(M,E)}return g===!1&&x.setRenderTarget(s),p=x.toneMapping,x.toneMapping=Kn,!0},this.hasRenderPass=function(){return g},this.end=function(x,v){x.toneMapping=p,d=!0;let M=s,E=a;for(let S=0;S<m.length;S++){let w=m[S];if(w.enabled!==!1&&(w.render(x,E,M,v),w.needsSwap!==!1)){let y=M;M=E,E=y}}if(f!==x.outputColorSpace||u!==x.toneMapping){f=x.outputColorSpace,u=x.toneMapping,l.defines={},ie.getTransfer(f)===he&&(l.defines.SRGB_TRANSFER="");let S=tT[u];S&&(l.defines[S]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,x.setRenderTarget(_),x.render(c,h),_=null,d=!1},this.isCompositing=function(){return d},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),a.dispose(),o.dispose(),l.dispose()}}var O0=new Ie,zp=new Ti(1,1),B0=new rr,z0=new ar,k0=new Es,x0=[],v0=[],y0=new Float32Array(16),M0=new Float32Array(9),S0=new Float32Array(4);function io(r,t,e){let n=r[0];if(n<=0||n>0)return r;let i=t*e,s=x0[i];if(s===void 0&&(s=new Float32Array(i),x0[i]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,r[a].toArray(s,o)}return s}function We(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function Xe(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function Ef(r,t){let e=v0[t];e===void 0&&(e=new Int32Array(t),v0[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function nT(r,t){let e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function iT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2fv(this.addr,t),Xe(e,t)}}function sT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;r.uniform3fv(this.addr,t),Xe(e,t)}}function rT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4fv(this.addr,t),Xe(e,t)}}function aT(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;S0.set(n),r.uniformMatrix2fv(this.addr,!1,S0),Xe(e,n)}}function oT(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;M0.set(n),r.uniformMatrix3fv(this.addr,!1,M0),Xe(e,n)}}function lT(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;y0.set(n),r.uniformMatrix4fv(this.addr,!1,y0),Xe(e,n)}}function cT(r,t){let e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function hT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2iv(this.addr,t),Xe(e,t)}}function uT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;r.uniform3iv(this.addr,t),Xe(e,t)}}function fT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4iv(this.addr,t),Xe(e,t)}}function dT(r,t){let e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function pT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;r.uniform2uiv(this.addr,t),Xe(e,t)}}function mT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;r.uniform3uiv(this.addr,t),Xe(e,t)}}function gT(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;r.uniform4uiv(this.addr,t),Xe(e,t)}}function _T(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(zp.compareFunction=e.isReversedDepthBuffer()?Lc:Dc,s=zp):s=O0,e.setTexture2D(t||s,i)}function xT(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||z0,i)}function vT(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||k0,i)}function yT(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||B0,i)}function MT(r){switch(r){case 5126:return nT;case 35664:return iT;case 35665:return sT;case 35666:return rT;case 35674:return aT;case 35675:return oT;case 35676:return lT;case 5124:case 35670:return cT;case 35667:case 35671:return hT;case 35668:case 35672:return uT;case 35669:case 35673:return fT;case 5125:return dT;case 36294:return pT;case 36295:return mT;case 36296:return gT;case 35678:case 36198:case 36298:case 36306:case 35682:return _T;case 35679:case 36299:case 36307:return xT;case 35680:case 36300:case 36308:case 36293:return vT;case 36289:case 36303:case 36311:case 36292:return yT}}function ST(r,t){r.uniform1fv(this.addr,t)}function bT(r,t){let e=io(t,this.size,2);r.uniform2fv(this.addr,e)}function TT(r,t){let e=io(t,this.size,3);r.uniform3fv(this.addr,e)}function ET(r,t){let e=io(t,this.size,4);r.uniform4fv(this.addr,e)}function wT(r,t){let e=io(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function AT(r,t){let e=io(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function CT(r,t){let e=io(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function RT(r,t){r.uniform1iv(this.addr,t)}function PT(r,t){r.uniform2iv(this.addr,t)}function IT(r,t){r.uniform3iv(this.addr,t)}function DT(r,t){r.uniform4iv(this.addr,t)}function LT(r,t){r.uniform1uiv(this.addr,t)}function NT(r,t){r.uniform2uiv(this.addr,t)}function UT(r,t){r.uniform3uiv(this.addr,t)}function FT(r,t){r.uniform4uiv(this.addr,t)}function OT(r,t,e){let n=this.cache,i=t.length,s=Ef(e,i);We(n,s)||(r.uniform1iv(this.addr,s),Xe(n,s));let a;this.type===r.SAMPLER_2D_SHADOW?a=zp:a=O0;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,s[o])}function BT(r,t,e){let n=this.cache,i=t.length,s=Ef(e,i);We(n,s)||(r.uniform1iv(this.addr,s),Xe(n,s));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||z0,s[a])}function zT(r,t,e){let n=this.cache,i=t.length,s=Ef(e,i);We(n,s)||(r.uniform1iv(this.addr,s),Xe(n,s));for(let a=0;a!==i;++a)e.setTextureCube(t[a]||k0,s[a])}function kT(r,t,e){let n=this.cache,i=t.length,s=Ef(e,i);We(n,s)||(r.uniform1iv(this.addr,s),Xe(n,s));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||B0,s[a])}function VT(r){switch(r){case 5126:return ST;case 35664:return bT;case 35665:return TT;case 35666:return ET;case 35674:return wT;case 35675:return AT;case 35676:return CT;case 5124:case 35670:return RT;case 35667:case 35671:return PT;case 35668:case 35672:return IT;case 35669:case 35673:return DT;case 5125:return LT;case 36294:return NT;case 36295:return UT;case 36296:return FT;case 35678:case 36198:case 36298:case 36306:case 35682:return OT;case 35679:case 36299:case 36307:return BT;case 35680:case 36300:case 36308:case 36293:return zT;case 36289:case 36303:case 36311:case 36292:return kT}}var kp=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=MT(e.type)}},Vp=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=VT(e.type)}},Gp=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let s=0,a=i.length;s!==a;++s){let o=i[s];o.setValue(t,e[o.id],n)}}},Op=/(\w+)(\])?(\[|\.)?/g;function b0(r,t){r.seq.push(t),r.map[t.id]=t}function GT(r,t,e){let n=r.name,i=n.length;for(Op.lastIndex=0;;){let s=Op.exec(n),a=Op.lastIndex,o=s[1],l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){b0(e,c===void 0?new kp(o,r,t):new Vp(o,r,t));break}else{let f=e.map[o];f===void 0&&(f=new Gp(o),b0(e,f)),e=f}}}var no=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){let o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);GT(o,l,this)}let i=[],s=[];for(let a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):s.push(a);i.length>0&&(this.seq=i.concat(s))}setValue(t,e,n,i){let s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,a=e.length;s!==a;++s){let o=e[s],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,s=t.length;i!==s;++i){let a=t[i];a.id in e&&n.push(a)}return n}};function T0(r,t,e){let n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}var HT=37297,WT=0;function XT(r,t){let e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=i;a<s;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}var E0=new Yt;function qT(r){ie._getMatrix(E0,ie.workingColorSpace,r);let t=`mat3( ${E0.elements.map(e=>e.toFixed(4))} )`;switch(ie.getTransfer(r)){case da:return[t,"LinearTransferOETF"];case he:return[t,"sRGBTransferOETF"];default:return ft("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function w0(r,t,e){let n=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";let a=/ERROR: 0:(\d+)/.exec(s);if(a){let o=parseInt(a[1]);return e.toUpperCase()+`

`+s+`

`+XT(r.getShaderSource(t),o)}else return s}function YT(r,t){let e=qT(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var ZT={[af]:"Linear",[of]:"Reinhard",[lf]:"Cineon",[Wa]:"ACESFilmic",[hf]:"AgX",[uf]:"Neutral",[cf]:"Custom"};function JT(r,t){let e=ZT[t];return e===void 0?(ft("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var bf=new I;function $T(){ie.getLuminanceCoefficients(bf);let r=bf.x.toFixed(4),t=bf.y.toFixed(4),e=bf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function KT(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Fc).join(`
`)}function QT(r){let t=[];for(let e in r){let n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function jT(r,t){let e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(t,i),a=s.name,o=1;s.type===r.FLOAT_MAT2&&(o=2),s.type===r.FLOAT_MAT3&&(o=3),s.type===r.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:r.getAttribLocation(t,a),locationSize:o}}return e}function Fc(r){return r!==""}function A0(r,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function C0(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var t1=/^[ \t]*#include +<([\w\d./]+)>/gm;function Hp(r){return r.replace(t1,n1)}var e1=new Map;function n1(r,t){let e=ee[t];if(e===void 0){let n=e1.get(t);if(n!==void 0)e=ee[n],ft('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Hp(e)}var i1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function R0(r){return r.replace(i1,s1)}function s1(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function P0(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var r1={[Va]:"SHADOWMAP_TYPE_PCF",[Mr]:"SHADOWMAP_TYPE_VSM"};function a1(r){return r1[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var o1={[di]:"ENVMAP_TYPE_CUBE",[Qi]:"ENVMAP_TYPE_CUBE",[Sr]:"ENVMAP_TYPE_CUBE_UV"};function l1(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":o1[r.envMapMode]||"ENVMAP_TYPE_CUBE"}var c1={[Qi]:"ENVMAP_MODE_REFRACTION"};function h1(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":c1[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}var u1={[Ha]:"ENVMAP_BLENDING_MULTIPLY",[hp]:"ENVMAP_BLENDING_MIX",[up]:"ENVMAP_BLENDING_ADD"};function f1(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":u1[r.combine]||"ENVMAP_BLENDING_NONE"}function d1(r){let t=r.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function p1(r,t,e,n){let i=r.getContext(),s=e.defines,a=e.vertexShader,o=e.fragmentShader,l=a1(e),c=l1(e),h=h1(e),f=f1(e),u=d1(e),d=KT(e),p=QT(s),_=i.createProgram(),m,g,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Fc).join(`
`),m.length>0&&(m+=`
`),g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p].filter(Fc).join(`
`),g.length>0&&(g+=`
`)):(m=[P0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Fc).join(`
`),g=[P0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,p,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Kn?"#define TONE_MAPPING":"",e.toneMapping!==Kn?ee.tonemapping_pars_fragment:"",e.toneMapping!==Kn?JT("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,YT("linearToOutputTexel",e.outputColorSpace),$T(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Fc).join(`
`)),a=Hp(a),a=A0(a,e),a=C0(a,e),o=Hp(o),o=A0(o,e),o=C0(o,e),a=R0(a),o=R0(o),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,g=["#define varying in",e.glslVersion===yf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===yf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+g);let v=x+m+a,M=x+g+o,E=T0(i,i.VERTEX_SHADER,v),S=T0(i,i.FRAGMENT_SHADER,M);i.attachShader(_,E),i.attachShader(_,S),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function w(P){if(r.debug.checkShaderErrors){let U=i.getProgramInfoLog(_)||"",z=i.getShaderInfoLog(E)||"",k=i.getShaderInfoLog(S)||"",D=U.trim(),F=z.trim(),L=k.trim(),W=!0,q=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(W=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,_,E,S);else{let et=w0(i,E,"vertex"),lt=w0(i,S,"fragment");Rt("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+D+`
`+et+`
`+lt)}else D!==""?ft("WebGLProgram: Program Info Log:",D):(F===""||L==="")&&(q=!1);q&&(P.diagnostics={runnable:W,programLog:D,vertexShader:{log:F,prefix:m},fragmentShader:{log:L,prefix:g}})}i.deleteShader(E),i.deleteShader(S),y=new no(i,_),T=jT(i,_)}let y;this.getUniforms=function(){return y===void 0&&w(this),y};let T;this.getAttributes=function(){return T===void 0&&w(this),T};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(_,HT)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=WT++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=E,this.fragmentShader=S,this}var m1=0,Wp=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(i)===!1&&(a.add(i),i.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Xp(t),e.set(t,n)),n}},Xp=class{constructor(t){this.id=m1++,this.code=t,this.usedTimes=0}};function g1(r){return r===ts||r===ja||r===to}function _1(r,t,e,n,i,s){let a=new or,o=new Wp,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,T,R,P,U,z){let k=P.fog,D=U.geometry,F=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?P.environment:null,L=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,W=t.get(y.envMap||F,L),q=W&&W.mapping===Sr?W.image.height:null,et=d[y.type];y.precision!==null&&(u=n.getMaxPrecision(y.precision),u!==y.precision&&ft("WebGLProgram.getParameters:",y.precision,"not supported, using",u,"instead."));let lt=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,mt=lt!==void 0?lt.length:0,Ft=0;D.morphAttributes.position!==void 0&&(Ft=1),D.morphAttributes.normal!==void 0&&(Ft=2),D.morphAttributes.color!==void 0&&(Ft=3);let kt,Ot,$,_t;if(et){let Kt=gi[et];kt=Kt.vertexShader,Ot=Kt.fragmentShader}else kt=y.vertexShader,Ot=y.fragmentShader,o.update(y),$=o.getVertexShaderID(y),_t=o.getFragmentShaderID(y);let at=r.getRenderTarget(),Dt=r.state.buffers.depth.getReversed(),Vt=U.isInstancedMesh===!0,Bt=U.isBatchedMesh===!0,re=!!y.map,Wt=!!y.matcap,j=!!W,st=!!y.aoMap,tt=!!y.lightMap,yt=!!y.bumpMap,gt=!!y.normalMap,Xt=!!y.displacementMap,N=!!y.emissiveMap,Zt=!!y.metalnessMap,Pt=!!y.roughnessMap,qt=y.anisotropy>0,rt=y.clearcoat>0,ue=y.dispersion>0,C=y.iridescence>0,b=y.sheen>0,V=y.transmission>0,J=qt&&!!y.anisotropyMap,nt=rt&&!!y.clearcoatMap,ot=rt&&!!y.clearcoatNormalMap,ut=rt&&!!y.clearcoatRoughnessMap,Y=C&&!!y.iridescenceMap,K=C&&!!y.iridescenceThicknessMap,St=b&&!!y.sheenColorMap,At=b&&!!y.sheenRoughnessMap,dt=!!y.specularMap,ct=!!y.specularColorMap,Jt=!!y.specularIntensityMap,te=V&&!!y.transmissionMap,le=V&&!!y.thicknessMap,O=!!y.gradientMap,ht=!!y.alphaMap,Z=y.alphaTest>0,Tt=!!y.alphaHash,pt=!!y.extensions,it=Kn;y.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(it=r.toneMapping);let Lt={shaderID:et,shaderType:y.type,shaderName:y.name,vertexShader:kt,fragmentShader:Ot,defines:y.defines,customVertexShaderID:$,customFragmentShaderID:_t,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:u,batching:Bt,batchingColor:Bt&&U._colorsTexture!==null,instancing:Vt,instancingColor:Vt&&U.instanceColor!==null,instancingMorph:Vt&&U.morphTexture!==null,outputColorSpace:at===null?r.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:ie.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:re,matcap:Wt,envMap:j,envMapMode:j&&W.mapping,envMapCubeUVHeight:q,aoMap:st,lightMap:tt,bumpMap:yt,normalMap:gt,displacementMap:Xt,emissiveMap:N,normalMapObjectSpace:gt&&y.normalMapType===_p,normalMapTangentSpace:gt&&y.normalMapType===Ci,packedNormalMap:gt&&y.normalMapType===Ci&&g1(y.normalMap.format),metalnessMap:Zt,roughnessMap:Pt,anisotropy:qt,anisotropyMap:J,clearcoat:rt,clearcoatMap:nt,clearcoatNormalMap:ot,clearcoatRoughnessMap:ut,dispersion:ue,iridescence:C,iridescenceMap:Y,iridescenceThicknessMap:K,sheen:b,sheenColorMap:St,sheenRoughnessMap:At,specularMap:dt,specularColorMap:ct,specularIntensityMap:Jt,transmission:V,transmissionMap:te,thicknessMap:le,gradientMap:O,opaque:y.transparent===!1&&y.blending===vs&&y.alphaToCoverage===!1,alphaMap:ht,alphaTest:Z,alphaHash:Tt,combine:y.combine,mapUv:re&&p(y.map.channel),aoMapUv:st&&p(y.aoMap.channel),lightMapUv:tt&&p(y.lightMap.channel),bumpMapUv:yt&&p(y.bumpMap.channel),normalMapUv:gt&&p(y.normalMap.channel),displacementMapUv:Xt&&p(y.displacementMap.channel),emissiveMapUv:N&&p(y.emissiveMap.channel),metalnessMapUv:Zt&&p(y.metalnessMap.channel),roughnessMapUv:Pt&&p(y.roughnessMap.channel),anisotropyMapUv:J&&p(y.anisotropyMap.channel),clearcoatMapUv:nt&&p(y.clearcoatMap.channel),clearcoatNormalMapUv:ot&&p(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ut&&p(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Y&&p(y.iridescenceMap.channel),iridescenceThicknessMapUv:K&&p(y.iridescenceThicknessMap.channel),sheenColorMapUv:St&&p(y.sheenColorMap.channel),sheenRoughnessMapUv:At&&p(y.sheenRoughnessMap.channel),specularMapUv:dt&&p(y.specularMap.channel),specularColorMapUv:ct&&p(y.specularColorMap.channel),specularIntensityMapUv:Jt&&p(y.specularIntensityMap.channel),transmissionMapUv:te&&p(y.transmissionMap.channel),thicknessMapUv:le&&p(y.thicknessMap.channel),alphaMapUv:ht&&p(y.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(gt||qt),vertexNormals:!!D.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!D.attributes.uv&&(re||ht),fog:!!k,useFog:y.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||D.attributes.normal===void 0&&gt===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Dt,skinning:U.isSkinnedMesh===!0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:Ft,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:r.shadowMap.enabled&&R.length>0,shadowMapType:r.shadowMap.type,toneMapping:it,decodeVideoTexture:re&&y.map.isVideoTexture===!0&&ie.getTransfer(y.map.colorSpace)===he,decodeVideoTextureEmissive:N&&y.emissiveMap.isVideoTexture===!0&&ie.getTransfer(y.emissiveMap.colorSpace)===he,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ui,flipSided:y.side===ln,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:pt&&y.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&y.extensions.multiDraw===!0||Bt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Lt.vertexUv1s=l.has(1),Lt.vertexUv2s=l.has(2),Lt.vertexUv3s=l.has(3),l.clear(),Lt}function m(y){let T=[];if(y.shaderID?T.push(y.shaderID):(T.push(y.customVertexShaderID),T.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)T.push(R),T.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(g(T,y),x(T,y),T.push(r.outputColorSpace)),T.push(y.customProgramCacheKey),T.join()}function g(y,T){y.push(T.precision),y.push(T.outputColorSpace),y.push(T.envMapMode),y.push(T.envMapCubeUVHeight),y.push(T.mapUv),y.push(T.alphaMapUv),y.push(T.lightMapUv),y.push(T.aoMapUv),y.push(T.bumpMapUv),y.push(T.normalMapUv),y.push(T.displacementMapUv),y.push(T.emissiveMapUv),y.push(T.metalnessMapUv),y.push(T.roughnessMapUv),y.push(T.anisotropyMapUv),y.push(T.clearcoatMapUv),y.push(T.clearcoatNormalMapUv),y.push(T.clearcoatRoughnessMapUv),y.push(T.iridescenceMapUv),y.push(T.iridescenceThicknessMapUv),y.push(T.sheenColorMapUv),y.push(T.sheenRoughnessMapUv),y.push(T.specularMapUv),y.push(T.specularColorMapUv),y.push(T.specularIntensityMapUv),y.push(T.transmissionMapUv),y.push(T.thicknessMapUv),y.push(T.combine),y.push(T.fogExp2),y.push(T.sizeAttenuation),y.push(T.morphTargetsCount),y.push(T.morphAttributeCount),y.push(T.numDirLights),y.push(T.numPointLights),y.push(T.numSpotLights),y.push(T.numSpotLightMaps),y.push(T.numHemiLights),y.push(T.numRectAreaLights),y.push(T.numDirLightShadows),y.push(T.numPointLightShadows),y.push(T.numSpotLightShadows),y.push(T.numSpotLightShadowsWithMaps),y.push(T.numLightProbes),y.push(T.shadowMapType),y.push(T.toneMapping),y.push(T.numClippingPlanes),y.push(T.numClipIntersection),y.push(T.depthPacking)}function x(y,T){a.disableAll(),T.instancing&&a.enable(0),T.instancingColor&&a.enable(1),T.instancingMorph&&a.enable(2),T.matcap&&a.enable(3),T.envMap&&a.enable(4),T.normalMapObjectSpace&&a.enable(5),T.normalMapTangentSpace&&a.enable(6),T.clearcoat&&a.enable(7),T.iridescence&&a.enable(8),T.alphaTest&&a.enable(9),T.vertexColors&&a.enable(10),T.vertexAlphas&&a.enable(11),T.vertexUv1s&&a.enable(12),T.vertexUv2s&&a.enable(13),T.vertexUv3s&&a.enable(14),T.vertexTangents&&a.enable(15),T.anisotropy&&a.enable(16),T.alphaHash&&a.enable(17),T.batching&&a.enable(18),T.dispersion&&a.enable(19),T.batchingColor&&a.enable(20),T.gradientMap&&a.enable(21),T.packedNormalMap&&a.enable(22),T.vertexNormals&&a.enable(23),y.push(a.mask),a.disableAll(),T.fog&&a.enable(0),T.useFog&&a.enable(1),T.flatShading&&a.enable(2),T.logarithmicDepthBuffer&&a.enable(3),T.reversedDepthBuffer&&a.enable(4),T.skinning&&a.enable(5),T.morphTargets&&a.enable(6),T.morphNormals&&a.enable(7),T.morphColors&&a.enable(8),T.premultipliedAlpha&&a.enable(9),T.shadowMapEnabled&&a.enable(10),T.doubleSided&&a.enable(11),T.flipSided&&a.enable(12),T.useDepthPacking&&a.enable(13),T.dithering&&a.enable(14),T.transmission&&a.enable(15),T.sheen&&a.enable(16),T.opaque&&a.enable(17),T.pointsUvs&&a.enable(18),T.decodeVideoTexture&&a.enable(19),T.decodeVideoTextureEmissive&&a.enable(20),T.alphaToCoverage&&a.enable(21),T.numLightProbeGrids>0&&a.enable(22),y.push(a.mask)}function v(y){let T=d[y.type],R;if(T){let P=gi[T];R=Cp.clone(P.uniforms)}else R=y.uniforms;return R}function M(y,T){let R=h.get(T);return R!==void 0?++R.usedTimes:(R=new p1(r,T,y,i),c.push(R),h.set(T,R)),R}function E(y){if(--y.usedTimes===0){let T=c.indexOf(y);c[T]=c[c.length-1],c.pop(),h.delete(y.cacheKey),y.destroy()}}function S(y){o.remove(y)}function w(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:v,acquireProgram:M,releaseProgram:E,releaseShaderCache:S,programs:c,dispose:w}}function x1(){let r=new WeakMap;function t(a){return r.has(a)}function e(a){let o=r.get(a);return o===void 0&&(o={},r.set(a,o)),o}function n(a){r.delete(a)}function i(a,o,l){r.get(a)[o]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function v1(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id}function I0(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function D0(){let r=[],t=0,e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,_,m,g){let x=r[t];return x===void 0?(x={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:_,renderOrder:u.renderOrder,z:m,group:g},r[t]=x):(x.id=u.id,x.object=u,x.geometry=d,x.material=p,x.materialVariant=a(u),x.groupOrder=_,x.renderOrder=u.renderOrder,x.z=m,x.group=g),t++,x}function l(u,d,p,_,m,g){let x=o(u,d,p,_,m,g);p.transmission>0?n.push(x):p.transparent===!0?i.push(x):e.push(x)}function c(u,d,p,_,m,g){let x=o(u,d,p,_,m,g);p.transmission>0?n.unshift(x):p.transparent===!0?i.unshift(x):e.unshift(x)}function h(u,d){e.length>1&&e.sort(u||v1),n.length>1&&n.sort(d||I0),i.length>1&&i.sort(d||I0)}function f(){for(let u=t,d=r.length;u<d;u++){let p=r[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:f,sort:h}}function y1(){let r=new WeakMap;function t(n,i){let s=r.get(n),a;return s===void 0?(a=new D0,r.set(n,[a])):i>=s.length?(a=new D0,s.push(a)):a=s[i],a}function e(){r=new WeakMap}return{get:t,dispose:e}}function M1(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new I,color:new bt};break;case"SpotLight":e={position:new I,direction:new I,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new I,halfWidth:new I,halfHeight:new I};break}return r[t.id]=e,e}}}function S1(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}var b1=0;function T1(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function E1(r){let t=new M1,e=S1(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);let i=new I,s=new Gt,a=new Gt;function o(c){let h=0,f=0,u=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let d=0,p=0,_=0,m=0,g=0,x=0,v=0,M=0,E=0,S=0,w=0;c.sort(T1);for(let T=0,R=c.length;T<R;T++){let P=c[T],U=P.color,z=P.intensity,k=P.distance,D=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ts?D=P.shadow.map.texture:D=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=U.r*z,f+=U.g*z,u+=U.b*z;else if(P.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(P.sh.coefficients[F],z);w++}else if(P.isDirectionalLight){let F=t.get(P);if(F.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let L=P.shadow,W=e.get(P);W.shadowIntensity=L.intensity,W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=D,n.directionalShadowMatrix[d]=P.shadow.matrix,x++}n.directional[d]=F,d++}else if(P.isSpotLight){let F=t.get(P);F.position.setFromMatrixPosition(P.matrixWorld),F.color.copy(U).multiplyScalar(z),F.distance=k,F.coneCos=Math.cos(P.angle),F.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),F.decay=P.decay,n.spot[_]=F;let L=P.shadow;if(P.map&&(n.spotLightMap[E]=P.map,E++,L.updateMatrices(P),P.castShadow&&S++),n.spotLightMatrix[_]=L.matrix,P.castShadow){let W=e.get(P);W.shadowIntensity=L.intensity,W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=D,M++}_++}else if(P.isRectAreaLight){let F=t.get(P);F.color.copy(U).multiplyScalar(z),F.halfWidth.set(P.width*.5,0,0),F.halfHeight.set(0,P.height*.5,0),n.rectArea[m]=F,m++}else if(P.isPointLight){let F=t.get(P);if(F.color.copy(P.color).multiplyScalar(P.intensity),F.distance=P.distance,F.decay=P.decay,P.castShadow){let L=P.shadow,W=e.get(P);W.shadowIntensity=L.intensity,W.shadowBias=L.bias,W.shadowNormalBias=L.normalBias,W.shadowRadius=L.radius,W.shadowMapSize=L.mapSize,W.shadowCameraNear=L.camera.near,W.shadowCameraFar=L.camera.far,n.pointShadow[p]=W,n.pointShadowMap[p]=D,n.pointShadowMatrix[p]=P.shadow.matrix,v++}n.point[p]=F,p++}else if(P.isHemisphereLight){let F=t.get(P);F.skyColor.copy(P.color).multiplyScalar(z),F.groundColor.copy(P.groundColor).multiplyScalar(z),n.hemi[g]=F,g++}}m>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=xt.LTC_FLOAT_1,n.rectAreaLTC2=xt.LTC_FLOAT_2):(n.rectAreaLTC1=xt.LTC_HALF_1,n.rectAreaLTC2=xt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let y=n.hash;(y.directionalLength!==d||y.pointLength!==p||y.spotLength!==_||y.rectAreaLength!==m||y.hemiLength!==g||y.numDirectionalShadows!==x||y.numPointShadows!==v||y.numSpotShadows!==M||y.numSpotMaps!==E||y.numLightProbes!==w)&&(n.directional.length=d,n.spot.length=_,n.rectArea.length=m,n.point.length=p,n.hemi.length=g,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=M+E-S,n.spotLightMap.length=E,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=w,y.directionalLength=d,y.pointLength=p,y.spotLength=_,y.rectAreaLength=m,y.hemiLength=g,y.numDirectionalShadows=x,y.numPointShadows=v,y.numSpotShadows=M,y.numSpotMaps=E,y.numLightProbes=w,n.version=b1++)}function l(c,h){let f=0,u=0,d=0,p=0,_=0,m=h.matrixWorldInverse;for(let g=0,x=c.length;g<x;g++){let v=c[g];if(v.isDirectionalLight){let M=n.directional[f];M.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),f++}else if(v.isSpotLight){let M=n.spot[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(m),d++}else if(v.isRectAreaLight){let M=n.rectArea[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),p++}else if(v.isPointLight){let M=n.point[u];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),u++}else if(v.isHemisphereLight){let M=n.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function L0(r){let t=new E1(r),e=[],n=[],i=[];function s(u){f.camera=u,e.length=0,n.length=0,i.length=0}function a(u){e.push(u)}function o(u){n.push(u)}function l(u){i.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function w1(r){let t=new WeakMap;function e(i,s=0){let a=t.get(i),o;return a===void 0?(o=new L0(r),t.set(i,[o])):s>=a.length?(o=new L0(r),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var A1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,C1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,R1=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],P1=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],N0=new Gt,Uc=new I,Bp=new I;function I1(r,t,e){let n=new Yi,i=new Q,s=new Q,a=new de,o=new Da,l=new La,c={},h=e.maxTextureSize,f={[bi]:ln,[ln]:bi,[ui]:ui},u=new gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Q},radius:{value:4}},vertexShader:A1,fragmentShader:C1}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let p=new Ht;p.setAttribute("position",new oe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new $t(p,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Va;let g=this.type;this.render=function(S,w,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;this.type===Xd&&(ft("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Va);let T=r.getRenderTarget(),R=r.getActiveCubeFace(),P=r.getActiveMipmapLevel(),U=r.state;U.setBlending(fi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let z=g!==this.type;z&&w.traverse(function(k){k.material&&(Array.isArray(k.material)?k.material.forEach(D=>D.needsUpdate=!0):k.material.needsUpdate=!0)});for(let k=0,D=S.length;k<D;k++){let F=S[k],L=F.shadow;if(L===void 0){ft("WebGLShadowMap:",F,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;i.copy(L.mapSize);let W=L.getFrameExtents();i.multiply(W),s.copy(L.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/W.x),i.x=s.x*W.x,L.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/W.y),i.y=s.y*W.y,L.mapSize.y=s.y));let q=r.state.buffers.depth.getReversed();if(L.camera._reversedDepth=q,L.map===null||z===!0){if(L.map!==null&&(L.map.depthTexture!==null&&(L.map.depthTexture.dispose(),L.map.depthTexture=null),L.map.dispose()),this.type===Mr){if(F.isPointLight){ft("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}L.map=new on(i.x,i.y,{format:ts,type:mi,minFilter:Me,magFilter:Me,generateMipmaps:!1}),L.map.texture.name=F.name+".shadowMap",L.map.depthTexture=new Ti(i.x,i.y,rn),L.map.depthTexture.name=F.name+".shadowMapDepth",L.map.depthTexture.format=li,L.map.depthTexture.compareFunction=null,L.map.depthTexture.minFilter=Pe,L.map.depthTexture.magFilter=Pe}else F.isPointLight?(L.map=new Bc(i.x),L.map.depthTexture=new el(i.x,Vn)):(L.map=new on(i.x,i.y),L.map.depthTexture=new Ti(i.x,i.y,Vn)),L.map.depthTexture.name=F.name+".shadowMap",L.map.depthTexture.format=li,this.type===Va?(L.map.depthTexture.compareFunction=q?Lc:Dc,L.map.depthTexture.minFilter=Me,L.map.depthTexture.magFilter=Me):(L.map.depthTexture.compareFunction=null,L.map.depthTexture.minFilter=Pe,L.map.depthTexture.magFilter=Pe);L.camera.updateProjectionMatrix()}let et=L.map.isWebGLCubeRenderTarget?6:1;for(let lt=0;lt<et;lt++){if(L.map.isWebGLCubeRenderTarget)r.setRenderTarget(L.map,lt),r.clear();else{lt===0&&(r.setRenderTarget(L.map),r.clear());let mt=L.getViewport(lt);a.set(s.x*mt.x,s.y*mt.y,s.x*mt.z,s.y*mt.w),U.viewport(a)}if(F.isPointLight){let mt=L.camera,Ft=L.matrix,kt=F.distance||mt.far;kt!==mt.far&&(mt.far=kt,mt.updateProjectionMatrix()),Uc.setFromMatrixPosition(F.matrixWorld),mt.position.copy(Uc),Bp.copy(mt.position),Bp.add(R1[lt]),mt.up.copy(P1[lt]),mt.lookAt(Bp),mt.updateMatrixWorld(),Ft.makeTranslation(-Uc.x,-Uc.y,-Uc.z),N0.multiplyMatrices(mt.projectionMatrix,mt.matrixWorldInverse),L._frustum.setFromProjectionMatrix(N0,mt.coordinateSystem,mt.reversedDepth)}else L.updateMatrices(F);n=L.getFrustum(),M(w,y,L.camera,F,this.type)}L.isPointLightShadow!==!0&&this.type===Mr&&x(L,y),L.needsUpdate=!1}g=this.type,m.needsUpdate=!1,r.setRenderTarget(T,R,P)};function x(S,w){let y=t.update(_);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new on(i.x,i.y,{format:ts,type:mi})),u.uniforms.shadow_pass.value=S.map.depthTexture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,r.setRenderTarget(S.mapPass),r.clear(),r.renderBufferDirect(w,null,y,u,_,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,r.setRenderTarget(S.map),r.clear(),r.renderBufferDirect(w,null,y,d,_,null)}function v(S,w,y,T){let R=null,P=y.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(P!==void 0)R=P;else if(R=y.isPointLight===!0?l:o,r.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0||w.alphaToCoverage===!0){let U=R.uuid,z=w.uuid,k=c[U];k===void 0&&(k={},c[U]=k);let D=k[z];D===void 0&&(D=R.clone(),k[z]=D,w.addEventListener("dispose",E)),R=D}if(R.visible=w.visible,R.wireframe=w.wireframe,T===Mr?R.side=w.shadowSide!==null?w.shadowSide:w.side:R.side=w.shadowSide!==null?w.shadowSide:f[w.side],R.alphaMap=w.alphaMap,R.alphaTest=w.alphaToCoverage===!0?.5:w.alphaTest,R.map=w.map,R.clipShadows=w.clipShadows,R.clippingPlanes=w.clippingPlanes,R.clipIntersection=w.clipIntersection,R.displacementMap=w.displacementMap,R.displacementScale=w.displacementScale,R.displacementBias=w.displacementBias,R.wireframeLinewidth=w.wireframeLinewidth,R.linewidth=w.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let U=r.properties.get(R);U.light=y}return R}function M(S,w,y,T,R){if(S.visible===!1)return;if(S.layers.test(w.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&R===Mr)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,S.matrixWorld);let z=t.update(S),k=S.material;if(Array.isArray(k)){let D=z.groups;for(let F=0,L=D.length;F<L;F++){let W=D[F],q=k[W.materialIndex];if(q&&q.visible){let et=v(S,q,T,R);S.onBeforeShadow(r,S,w,y,z,et,W),r.renderBufferDirect(y,null,z,et,S,W),S.onAfterShadow(r,S,w,y,z,et,W)}}}else if(k.visible){let D=v(S,k,T,R);S.onBeforeShadow(r,S,w,y,z,D,null),r.renderBufferDirect(y,null,z,D,S,null),S.onAfterShadow(r,S,w,y,z,D,null)}}let U=S.children;for(let z=0,k=U.length;z<k;z++)M(U[z],w,y,T,R)}function E(S){S.target.removeEventListener("dispose",E);for(let y in c){let T=c[y],R=S.target.uuid;R in T&&(T[R].dispose(),delete T[R])}}}function D1(r,t){function e(){let O=!1,ht=new de,Z=null,Tt=new de(0,0,0,0);return{setMask:function(pt){Z!==pt&&!O&&(r.colorMask(pt,pt,pt,pt),Z=pt)},setLocked:function(pt){O=pt},setClear:function(pt,it,Lt,Kt,Ne){Ne===!0&&(pt*=Kt,it*=Kt,Lt*=Kt),ht.set(pt,it,Lt,Kt),Tt.equals(ht)===!1&&(r.clearColor(pt,it,Lt,Kt),Tt.copy(ht))},reset:function(){O=!1,Z=null,Tt.set(-1,0,0,0)}}}function n(){let O=!1,ht=!1,Z=null,Tt=null,pt=null;return{setReversed:function(it){if(ht!==it){let Lt=t.get("EXT_clip_control");it?Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.ZERO_TO_ONE_EXT):Lt.clipControlEXT(Lt.LOWER_LEFT_EXT,Lt.NEGATIVE_ONE_TO_ONE_EXT),ht=it;let Kt=pt;pt=null,this.setClear(Kt)}},getReversed:function(){return ht},setTest:function(it){it?at(r.DEPTH_TEST):Dt(r.DEPTH_TEST)},setMask:function(it){Z!==it&&!O&&(r.depthMask(it),Z=it)},setFunc:function(it){if(ht&&(it=i0[it]),Tt!==it){switch(it){case Uo:r.depthFunc(r.NEVER);break;case Fo:r.depthFunc(r.ALWAYS);break;case Oo:r.depthFunc(r.LESS);break;case ys:r.depthFunc(r.LEQUAL);break;case Bo:r.depthFunc(r.EQUAL);break;case zo:r.depthFunc(r.GEQUAL);break;case ko:r.depthFunc(r.GREATER);break;case Vo:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Tt=it}},setLocked:function(it){O=it},setClear:function(it){pt!==it&&(pt=it,ht&&(it=1-it),r.clearDepth(it))},reset:function(){O=!1,Z=null,Tt=null,pt=null,ht=!1}}}function i(){let O=!1,ht=null,Z=null,Tt=null,pt=null,it=null,Lt=null,Kt=null,Ne=null;return{setTest:function(pe){O||(pe?at(r.STENCIL_TEST):Dt(r.STENCIL_TEST))},setMask:function(pe){ht!==pe&&!O&&(r.stencilMask(pe),ht=pe)},setFunc:function(pe,Ui,_i){(Z!==pe||Tt!==Ui||pt!==_i)&&(r.stencilFunc(pe,Ui,_i),Z=pe,Tt=Ui,pt=_i)},setOp:function(pe,Ui,_i){(it!==pe||Lt!==Ui||Kt!==_i)&&(r.stencilOp(pe,Ui,_i),it=pe,Lt=Ui,Kt=_i)},setLocked:function(pe){O=pe},setClear:function(pe){Ne!==pe&&(r.clearStencil(pe),Ne=pe)},reset:function(){O=!1,ht=null,Z=null,Tt=null,pt=null,it=null,Lt=null,Kt=null,Ne=null}}}let s=new e,a=new n,o=new i,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,p=[],_=null,m=!1,g=null,x=null,v=null,M=null,E=null,S=null,w=null,y=new bt(0,0,0),T=0,R=!1,P=null,U=null,z=null,k=null,D=null,F=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),L=!1,W=0,q=r.getParameter(r.VERSION);q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(q)[1]),L=W>=1):q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),L=W>=2);let et=null,lt={},mt=r.getParameter(r.SCISSOR_BOX),Ft=r.getParameter(r.VIEWPORT),kt=new de().fromArray(mt),Ot=new de().fromArray(Ft);function $(O,ht,Z,Tt){let pt=new Uint8Array(4),it=r.createTexture();r.bindTexture(O,it),r.texParameteri(O,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(O,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Lt=0;Lt<Z;Lt++)O===r.TEXTURE_3D||O===r.TEXTURE_2D_ARRAY?r.texImage3D(ht,0,r.RGBA,1,1,Tt,0,r.RGBA,r.UNSIGNED_BYTE,pt):r.texImage2D(ht+Lt,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,pt);return it}let _t={};_t[r.TEXTURE_2D]=$(r.TEXTURE_2D,r.TEXTURE_2D,1),_t[r.TEXTURE_CUBE_MAP]=$(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),_t[r.TEXTURE_2D_ARRAY]=$(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),_t[r.TEXTURE_3D]=$(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),at(r.DEPTH_TEST),a.setFunc(ys),yt(!1),gt(nf),at(r.CULL_FACE),st(fi);function at(O){h[O]!==!0&&(r.enable(O),h[O]=!0)}function Dt(O){h[O]!==!1&&(r.disable(O),h[O]=!1)}function Vt(O,ht){return u[O]!==ht?(r.bindFramebuffer(O,ht),u[O]=ht,O===r.DRAW_FRAMEBUFFER&&(u[r.FRAMEBUFFER]=ht),O===r.FRAMEBUFFER&&(u[r.DRAW_FRAMEBUFFER]=ht),!0):!1}function Bt(O,ht){let Z=p,Tt=!1;if(O){Z=d.get(ht),Z===void 0&&(Z=[],d.set(ht,Z));let pt=O.textures;if(Z.length!==pt.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let it=0,Lt=pt.length;it<Lt;it++)Z[it]=r.COLOR_ATTACHMENT0+it;Z.length=pt.length,Tt=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,Tt=!0);Tt&&r.drawBuffers(Z)}function re(O){return _!==O?(r.useProgram(O),_=O,!0):!1}let Wt={[Wi]:r.FUNC_ADD,[Yd]:r.FUNC_SUBTRACT,[Zd]:r.FUNC_REVERSE_SUBTRACT};Wt[Jd]=r.MIN,Wt[$d]=r.MAX;let j={[Kd]:r.ZERO,[Qd]:r.ONE,[jd]:r.SRC_COLOR,[Lo]:r.SRC_ALPHA,[rp]:r.SRC_ALPHA_SATURATE,[ip]:r.DST_COLOR,[ep]:r.DST_ALPHA,[tp]:r.ONE_MINUS_SRC_COLOR,[No]:r.ONE_MINUS_SRC_ALPHA,[sp]:r.ONE_MINUS_DST_COLOR,[np]:r.ONE_MINUS_DST_ALPHA,[ap]:r.CONSTANT_COLOR,[op]:r.ONE_MINUS_CONSTANT_COLOR,[lp]:r.CONSTANT_ALPHA,[cp]:r.ONE_MINUS_CONSTANT_ALPHA};function st(O,ht,Z,Tt,pt,it,Lt,Kt,Ne,pe){if(O===fi){m===!0&&(Dt(r.BLEND),m=!1);return}if(m===!1&&(at(r.BLEND),m=!0),O!==qd){if(O!==g||pe!==R){if((x!==Wi||E!==Wi)&&(r.blendEquation(r.FUNC_ADD),x=Wi,E=Wi),pe)switch(O){case vs:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ga:r.blendFunc(r.ONE,r.ONE);break;case sf:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case rf:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:Rt("WebGLState: Invalid blending: ",O);break}else switch(O){case vs:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case Ga:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case sf:Rt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rf:Rt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Rt("WebGLState: Invalid blending: ",O);break}v=null,M=null,S=null,w=null,y.set(0,0,0),T=0,g=O,R=pe}return}pt=pt||ht,it=it||Z,Lt=Lt||Tt,(ht!==x||pt!==E)&&(r.blendEquationSeparate(Wt[ht],Wt[pt]),x=ht,E=pt),(Z!==v||Tt!==M||it!==S||Lt!==w)&&(r.blendFuncSeparate(j[Z],j[Tt],j[it],j[Lt]),v=Z,M=Tt,S=it,w=Lt),(Kt.equals(y)===!1||Ne!==T)&&(r.blendColor(Kt.r,Kt.g,Kt.b,Ne),y.copy(Kt),T=Ne),g=O,R=!1}function tt(O,ht){O.side===ui?Dt(r.CULL_FACE):at(r.CULL_FACE);let Z=O.side===ln;ht&&(Z=!Z),yt(Z),O.blending===vs&&O.transparent===!1?st(fi):st(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),s.setMask(O.colorWrite);let Tt=O.stencilWrite;o.setTest(Tt),Tt&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),N(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?at(r.SAMPLE_ALPHA_TO_COVERAGE):Dt(r.SAMPLE_ALPHA_TO_COVERAGE)}function yt(O){P!==O&&(O?r.frontFace(r.CW):r.frontFace(r.CCW),P=O)}function gt(O){O!==Hd?(at(r.CULL_FACE),O!==U&&(O===nf?r.cullFace(r.BACK):O===Wd?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Dt(r.CULL_FACE),U=O}function Xt(O){O!==z&&(L&&r.lineWidth(O),z=O)}function N(O,ht,Z){O?(at(r.POLYGON_OFFSET_FILL),(k!==ht||D!==Z)&&(k=ht,D=Z,a.getReversed()&&(ht=-ht),r.polygonOffset(ht,Z))):Dt(r.POLYGON_OFFSET_FILL)}function Zt(O){O?at(r.SCISSOR_TEST):Dt(r.SCISSOR_TEST)}function Pt(O){O===void 0&&(O=r.TEXTURE0+F-1),et!==O&&(r.activeTexture(O),et=O)}function qt(O,ht,Z){Z===void 0&&(et===null?Z=r.TEXTURE0+F-1:Z=et);let Tt=lt[Z];Tt===void 0&&(Tt={type:void 0,texture:void 0},lt[Z]=Tt),(Tt.type!==O||Tt.texture!==ht)&&(et!==Z&&(r.activeTexture(Z),et=Z),r.bindTexture(O,ht||_t[O]),Tt.type=O,Tt.texture=ht)}function rt(){let O=lt[et];O!==void 0&&O.type!==void 0&&(r.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function ue(){try{r.compressedTexImage2D(...arguments)}catch(O){Rt("WebGLState:",O)}}function C(){try{r.compressedTexImage3D(...arguments)}catch(O){Rt("WebGLState:",O)}}function b(){try{r.texSubImage2D(...arguments)}catch(O){Rt("WebGLState:",O)}}function V(){try{r.texSubImage3D(...arguments)}catch(O){Rt("WebGLState:",O)}}function J(){try{r.compressedTexSubImage2D(...arguments)}catch(O){Rt("WebGLState:",O)}}function nt(){try{r.compressedTexSubImage3D(...arguments)}catch(O){Rt("WebGLState:",O)}}function ot(){try{r.texStorage2D(...arguments)}catch(O){Rt("WebGLState:",O)}}function ut(){try{r.texStorage3D(...arguments)}catch(O){Rt("WebGLState:",O)}}function Y(){try{r.texImage2D(...arguments)}catch(O){Rt("WebGLState:",O)}}function K(){try{r.texImage3D(...arguments)}catch(O){Rt("WebGLState:",O)}}function St(O){return f[O]!==void 0?f[O]:r.getParameter(O)}function At(O,ht){f[O]!==ht&&(r.pixelStorei(O,ht),f[O]=ht)}function dt(O){kt.equals(O)===!1&&(r.scissor(O.x,O.y,O.z,O.w),kt.copy(O))}function ct(O){Ot.equals(O)===!1&&(r.viewport(O.x,O.y,O.z,O.w),Ot.copy(O))}function Jt(O,ht){let Z=c.get(ht);Z===void 0&&(Z=new WeakMap,c.set(ht,Z));let Tt=Z.get(O);Tt===void 0&&(Tt=r.getUniformBlockIndex(ht,O.name),Z.set(O,Tt))}function te(O,ht){let Tt=c.get(ht).get(O);l.get(ht)!==Tt&&(r.uniformBlockBinding(ht,Tt,O.__bindingPointIndex),l.set(ht,Tt))}function le(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),a.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),h={},f={},et=null,lt={},u={},d=new WeakMap,p=[],_=null,m=!1,g=null,x=null,v=null,M=null,E=null,S=null,w=null,y=new bt(0,0,0),T=0,R=!1,P=null,U=null,z=null,k=null,D=null,kt.set(0,0,r.canvas.width,r.canvas.height),Ot.set(0,0,r.canvas.width,r.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:at,disable:Dt,bindFramebuffer:Vt,drawBuffers:Bt,useProgram:re,setBlending:st,setMaterial:tt,setFlipSided:yt,setCullFace:gt,setLineWidth:Xt,setPolygonOffset:N,setScissorTest:Zt,activeTexture:Pt,bindTexture:qt,unbindTexture:rt,compressedTexImage2D:ue,compressedTexImage3D:C,texImage2D:Y,texImage3D:K,pixelStorei:At,getParameter:St,updateUBOMapping:Jt,uniformBlockBinding:te,texStorage2D:ot,texStorage3D:ut,texSubImage2D:b,texSubImage3D:V,compressedTexSubImage2D:J,compressedTexSubImage3D:nt,scissor:dt,viewport:ct,reset:le}}function L1(r,t,e,n,i,s,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Q,h=new WeakMap,f=new Set,u,d=new WeakMap,p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(C,b){return p?new OffscreenCanvas(C,b):ma("canvas")}function m(C,b,V){let J=1,nt=ue(C);if((nt.width>V||nt.height>V)&&(J=V/Math.max(nt.width,nt.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ot=Math.floor(J*nt.width),ut=Math.floor(J*nt.height);u===void 0&&(u=_(ot,ut));let Y=b?_(ot,ut):u;return Y.width=ot,Y.height=ut,Y.getContext("2d").drawImage(C,0,0,ot,ut),ft("WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+ot+"x"+ut+")."),Y}else return"data"in C&&ft("WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),C;return C}function g(C){return C.generateMipmaps}function x(C){r.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?r.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function M(C,b,V,J,nt,ot=!1){if(C!==null){if(r[C]!==void 0)return r[C];ft("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ut;J&&(ut=t.get("EXT_texture_norm16"),ut||ft("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Y=b;if(b===r.RED&&(V===r.FLOAT&&(Y=r.R32F),V===r.HALF_FLOAT&&(Y=r.R16F),V===r.UNSIGNED_BYTE&&(Y=r.R8),V===r.UNSIGNED_SHORT&&ut&&(Y=ut.R16_EXT),V===r.SHORT&&ut&&(Y=ut.R16_SNORM_EXT)),b===r.RED_INTEGER&&(V===r.UNSIGNED_BYTE&&(Y=r.R8UI),V===r.UNSIGNED_SHORT&&(Y=r.R16UI),V===r.UNSIGNED_INT&&(Y=r.R32UI),V===r.BYTE&&(Y=r.R8I),V===r.SHORT&&(Y=r.R16I),V===r.INT&&(Y=r.R32I)),b===r.RG&&(V===r.FLOAT&&(Y=r.RG32F),V===r.HALF_FLOAT&&(Y=r.RG16F),V===r.UNSIGNED_BYTE&&(Y=r.RG8),V===r.UNSIGNED_SHORT&&ut&&(Y=ut.RG16_EXT),V===r.SHORT&&ut&&(Y=ut.RG16_SNORM_EXT)),b===r.RG_INTEGER&&(V===r.UNSIGNED_BYTE&&(Y=r.RG8UI),V===r.UNSIGNED_SHORT&&(Y=r.RG16UI),V===r.UNSIGNED_INT&&(Y=r.RG32UI),V===r.BYTE&&(Y=r.RG8I),V===r.SHORT&&(Y=r.RG16I),V===r.INT&&(Y=r.RG32I)),b===r.RGB_INTEGER&&(V===r.UNSIGNED_BYTE&&(Y=r.RGB8UI),V===r.UNSIGNED_SHORT&&(Y=r.RGB16UI),V===r.UNSIGNED_INT&&(Y=r.RGB32UI),V===r.BYTE&&(Y=r.RGB8I),V===r.SHORT&&(Y=r.RGB16I),V===r.INT&&(Y=r.RGB32I)),b===r.RGBA_INTEGER&&(V===r.UNSIGNED_BYTE&&(Y=r.RGBA8UI),V===r.UNSIGNED_SHORT&&(Y=r.RGBA16UI),V===r.UNSIGNED_INT&&(Y=r.RGBA32UI),V===r.BYTE&&(Y=r.RGBA8I),V===r.SHORT&&(Y=r.RGBA16I),V===r.INT&&(Y=r.RGBA32I)),b===r.RGB&&(V===r.UNSIGNED_SHORT&&ut&&(Y=ut.RGB16_EXT),V===r.SHORT&&ut&&(Y=ut.RGB16_SNORM_EXT),V===r.UNSIGNED_INT_5_9_9_9_REV&&(Y=r.RGB9_E5),V===r.UNSIGNED_INT_10F_11F_11F_REV&&(Y=r.R11F_G11F_B10F)),b===r.RGBA){let K=ot?da:ie.getTransfer(nt);V===r.FLOAT&&(Y=r.RGBA32F),V===r.HALF_FLOAT&&(Y=r.RGBA16F),V===r.UNSIGNED_BYTE&&(Y=K===he?r.SRGB8_ALPHA8:r.RGBA8),V===r.UNSIGNED_SHORT&&ut&&(Y=ut.RGBA16_EXT),V===r.SHORT&&ut&&(Y=ut.RGBA16_SNORM_EXT),V===r.UNSIGNED_SHORT_4_4_4_4&&(Y=r.RGBA4),V===r.UNSIGNED_SHORT_5_5_5_1&&(Y=r.RGB5_A1)}return(Y===r.R16F||Y===r.R32F||Y===r.RG16F||Y===r.RG32F||Y===r.RGBA16F||Y===r.RGBA32F)&&t.get("EXT_color_buffer_float"),Y}function E(C,b){let V;return C?b===null||b===Vn||b===Er?V=r.DEPTH24_STENCIL8:b===rn?V=r.DEPTH32F_STENCIL8:b===Tr&&(V=r.DEPTH24_STENCIL8,ft("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Vn||b===Er?V=r.DEPTH_COMPONENT24:b===rn?V=r.DEPTH_COMPONENT32F:b===Tr&&(V=r.DEPTH_COMPONENT16),V}function S(C,b){return g(C)===!0||C.isFramebufferTexture&&C.minFilter!==Pe&&C.minFilter!==Me?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function w(C){let b=C.target;b.removeEventListener("dispose",w),T(b),b.isVideoTexture&&h.delete(b),b.isHTMLTexture&&f.delete(b)}function y(C){let b=C.target;b.removeEventListener("dispose",y),P(b)}function T(C){let b=n.get(C);if(b.__webglInit===void 0)return;let V=C.source,J=d.get(V);if(J){let nt=J[b.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&R(C),Object.keys(J).length===0&&d.delete(V)}n.remove(C)}function R(C){let b=n.get(C);r.deleteTexture(b.__webglTexture);let V=C.source,J=d.get(V);delete J[b.__cacheKey],a.memory.textures--}function P(C){let b=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(b.__webglFramebuffer[J]))for(let nt=0;nt<b.__webglFramebuffer[J].length;nt++)r.deleteFramebuffer(b.__webglFramebuffer[J][nt]);else r.deleteFramebuffer(b.__webglFramebuffer[J]);b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer[J])}else{if(Array.isArray(b.__webglFramebuffer))for(let J=0;J<b.__webglFramebuffer.length;J++)r.deleteFramebuffer(b.__webglFramebuffer[J]);else r.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&r.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&r.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let J=0;J<b.__webglColorRenderbuffer.length;J++)b.__webglColorRenderbuffer[J]&&r.deleteRenderbuffer(b.__webglColorRenderbuffer[J]);b.__webglDepthRenderbuffer&&r.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let V=C.textures;for(let J=0,nt=V.length;J<nt;J++){let ot=n.get(V[J]);ot.__webglTexture&&(r.deleteTexture(ot.__webglTexture),a.memory.textures--),n.remove(V[J])}n.remove(C)}let U=0;function z(){U=0}function k(){return U}function D(C){U=C}function F(){let C=U;return C>=i.maxTextures&&ft("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),U+=1,C}function L(C){let b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function W(C,b){let V=n.get(C);if(C.isVideoTexture&&qt(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&V.__version!==C.version){let J=C.image;if(J===null)ft("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)ft("WebGLRenderer: Texture marked for update but image is incomplete");else{Dt(V,C,b);return}}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,V.__webglTexture,r.TEXTURE0+b)}function q(C,b){let V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){Dt(V,C,b);return}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(r.TEXTURE_2D_ARRAY,V.__webglTexture,r.TEXTURE0+b)}function et(C,b){let V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){Dt(V,C,b);return}e.bindTexture(r.TEXTURE_3D,V.__webglTexture,r.TEXTURE0+b)}function lt(C,b){let V=n.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&V.__version!==C.version){Vt(V,C,b);return}e.bindTexture(r.TEXTURE_CUBE_MAP,V.__webglTexture,r.TEXTURE0+b)}let mt={[la]:r.REPEAT,[mn]:r.CLAMP_TO_EDGE,[ca]:r.MIRRORED_REPEAT},Ft={[Pe]:r.NEAREST,[ff]:r.NEAREST_MIPMAP_NEAREST,[br]:r.NEAREST_MIPMAP_LINEAR,[Me]:r.LINEAR,[Ya]:r.LINEAR_MIPMAP_NEAREST,[pi]:r.LINEAR_MIPMAP_LINEAR},kt={[xp]:r.NEVER,[bp]:r.ALWAYS,[vp]:r.LESS,[Dc]:r.LEQUAL,[yp]:r.EQUAL,[Lc]:r.GEQUAL,[Mp]:r.GREATER,[Sp]:r.NOTEQUAL};function Ot(C,b){if(b.type===rn&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Me||b.magFilter===Ya||b.magFilter===br||b.magFilter===pi||b.minFilter===Me||b.minFilter===Ya||b.minFilter===br||b.minFilter===pi)&&ft("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(C,r.TEXTURE_WRAP_S,mt[b.wrapS]),r.texParameteri(C,r.TEXTURE_WRAP_T,mt[b.wrapT]),(C===r.TEXTURE_3D||C===r.TEXTURE_2D_ARRAY)&&r.texParameteri(C,r.TEXTURE_WRAP_R,mt[b.wrapR]),r.texParameteri(C,r.TEXTURE_MAG_FILTER,Ft[b.magFilter]),r.texParameteri(C,r.TEXTURE_MIN_FILTER,Ft[b.minFilter]),b.compareFunction&&(r.texParameteri(C,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(C,r.TEXTURE_COMPARE_FUNC,kt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===Pe||b.minFilter!==br&&b.minFilter!==pi||b.type===rn&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");r.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function $(C,b){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",w));let J=b.source,nt=d.get(J);nt===void 0&&(nt={},d.set(J,nt));let ot=L(b);if(ot!==C.__cacheKey){nt[ot]===void 0&&(nt[ot]={texture:r.createTexture(),usedTimes:0},a.memory.textures++,V=!0),nt[ot].usedTimes++;let ut=nt[C.__cacheKey];ut!==void 0&&(nt[C.__cacheKey].usedTimes--,ut.usedTimes===0&&R(b)),C.__cacheKey=ot,C.__webglTexture=nt[ot].texture}return V}function _t(C,b,V){return Math.floor(Math.floor(C/V)/b)}function at(C,b,V,J){let ot=C.updateRanges;if(ot.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,b.width,b.height,V,J,b.data);else{ot.sort((At,dt)=>At.start-dt.start);let ut=0;for(let At=1;At<ot.length;At++){let dt=ot[ut],ct=ot[At],Jt=dt.start+dt.count,te=_t(ct.start,b.width,4),le=_t(dt.start,b.width,4);ct.start<=Jt+1&&te===le&&_t(ct.start+ct.count-1,b.width,4)===te?dt.count=Math.max(dt.count,ct.start+ct.count-dt.start):(++ut,ot[ut]=ct)}ot.length=ut+1;let Y=e.getParameter(r.UNPACK_ROW_LENGTH),K=e.getParameter(r.UNPACK_SKIP_PIXELS),St=e.getParameter(r.UNPACK_SKIP_ROWS);e.pixelStorei(r.UNPACK_ROW_LENGTH,b.width);for(let At=0,dt=ot.length;At<dt;At++){let ct=ot[At],Jt=Math.floor(ct.start/4),te=Math.ceil(ct.count/4),le=Jt%b.width,O=Math.floor(Jt/b.width),ht=te,Z=1;e.pixelStorei(r.UNPACK_SKIP_PIXELS,le),e.pixelStorei(r.UNPACK_SKIP_ROWS,O),e.texSubImage2D(r.TEXTURE_2D,0,le,O,ht,Z,V,J,b.data)}C.clearUpdateRanges(),e.pixelStorei(r.UNPACK_ROW_LENGTH,Y),e.pixelStorei(r.UNPACK_SKIP_PIXELS,K),e.pixelStorei(r.UNPACK_SKIP_ROWS,St)}}function Dt(C,b,V){let J=r.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(J=r.TEXTURE_2D_ARRAY),b.isData3DTexture&&(J=r.TEXTURE_3D);let nt=$(C,b),ot=b.source;e.bindTexture(J,C.__webglTexture,r.TEXTURE0+V);let ut=n.get(ot);if(ot.version!==ut.__version||nt===!0){if(e.activeTexture(r.TEXTURE0+V),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let Z=ie.getPrimaries(ie.workingColorSpace),Tt=b.colorSpace===Ri?null:ie.getPrimaries(b.colorSpace),pt=b.colorSpace===Ri||Z===Tt?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}e.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment);let K=m(b.image,!1,i.maxTextureSize);K=rt(b,K);let St=s.convert(b.format,b.colorSpace),At=s.convert(b.type),dt=M(b.internalFormat,St,At,b.normalized,b.colorSpace,b.isVideoTexture);Ot(J,b);let ct,Jt=b.mipmaps,te=b.isVideoTexture!==!0,le=ut.__version===void 0||nt===!0,O=ot.dataReady,ht=S(b,K);if(b.isDepthTexture)dt=E(b.format===ji,b.type),le&&(te?e.texStorage2D(r.TEXTURE_2D,1,dt,K.width,K.height):e.texImage2D(r.TEXTURE_2D,0,dt,K.width,K.height,0,St,At,null));else if(b.isDataTexture)if(Jt.length>0){te&&le&&e.texStorage2D(r.TEXTURE_2D,ht,dt,Jt[0].width,Jt[0].height);for(let Z=0,Tt=Jt.length;Z<Tt;Z++)ct=Jt[Z],te?O&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,ct.width,ct.height,St,At,ct.data):e.texImage2D(r.TEXTURE_2D,Z,dt,ct.width,ct.height,0,St,At,ct.data);b.generateMipmaps=!1}else te?(le&&e.texStorage2D(r.TEXTURE_2D,ht,dt,K.width,K.height),O&&at(b,K,St,At)):e.texImage2D(r.TEXTURE_2D,0,dt,K.width,K.height,0,St,At,K.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){te&&le&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ht,dt,Jt[0].width,Jt[0].height,K.depth);for(let Z=0,Tt=Jt.length;Z<Tt;Z++)if(ct=Jt[Z],b.format!==an)if(St!==null)if(te){if(O)if(b.layerUpdates.size>0){let pt=Mf(ct.width,ct.height,b.format,b.type);for(let it of b.layerUpdates){let Lt=ct.data.subarray(it*pt/ct.data.BYTES_PER_ELEMENT,(it+1)*pt/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,it,ct.width,ct.height,1,St,Lt)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ct.width,ct.height,K.depth,St,ct.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,dt,ct.width,ct.height,K.depth,0,ct.data,0,0);else ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else te?O&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,ct.width,ct.height,K.depth,St,At,ct.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Z,dt,ct.width,ct.height,K.depth,0,St,At,ct.data)}else{te&&le&&e.texStorage2D(r.TEXTURE_2D,ht,dt,Jt[0].width,Jt[0].height);for(let Z=0,Tt=Jt.length;Z<Tt;Z++)ct=Jt[Z],b.format!==an?St!==null?te?O&&e.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,ct.width,ct.height,St,ct.data):e.compressedTexImage2D(r.TEXTURE_2D,Z,dt,ct.width,ct.height,0,ct.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):te?O&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,ct.width,ct.height,St,At,ct.data):e.texImage2D(r.TEXTURE_2D,Z,dt,ct.width,ct.height,0,St,At,ct.data)}else if(b.isDataArrayTexture)if(te){if(le&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ht,dt,K.width,K.height,K.depth),O)if(b.layerUpdates.size>0){let Z=Mf(K.width,K.height,b.format,b.type);for(let Tt of b.layerUpdates){let pt=K.data.subarray(Tt*Z/K.data.BYTES_PER_ELEMENT,(Tt+1)*Z/K.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,Tt,K.width,K.height,1,St,At,pt)}b.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,St,At,K.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,dt,K.width,K.height,K.depth,0,St,At,K.data);else if(b.isData3DTexture)te?(le&&e.texStorage3D(r.TEXTURE_3D,ht,dt,K.width,K.height,K.depth),O&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,St,At,K.data)):e.texImage3D(r.TEXTURE_3D,0,dt,K.width,K.height,K.depth,0,St,At,K.data);else if(b.isFramebufferTexture){if(le)if(te)e.texStorage2D(r.TEXTURE_2D,ht,dt,K.width,K.height);else{let Z=K.width,Tt=K.height;for(let pt=0;pt<ht;pt++)e.texImage2D(r.TEXTURE_2D,pt,dt,Z,Tt,0,St,At,null),Z>>=1,Tt>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in r){let Z=r.canvas;if(Z.hasAttribute("layoutsubtree")||Z.setAttribute("layoutsubtree","true"),K.parentNode!==Z){Z.appendChild(K),f.add(b),Z.onpaint=Kt=>{let Ne=Kt.changedElements;for(let pe of f)Ne.includes(pe.image)&&(pe.needsUpdate=!0)},Z.requestPaint();return}let Tt=0,pt=r.RGBA,it=r.RGBA,Lt=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,Tt,pt,it,Lt,K),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Jt.length>0){if(te&&le){let Z=ue(Jt[0]);e.texStorage2D(r.TEXTURE_2D,ht,dt,Z.width,Z.height)}for(let Z=0,Tt=Jt.length;Z<Tt;Z++)ct=Jt[Z],te?O&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,St,At,ct):e.texImage2D(r.TEXTURE_2D,Z,dt,St,At,ct);b.generateMipmaps=!1}else if(te){if(le){let Z=ue(K);e.texStorage2D(r.TEXTURE_2D,ht,dt,Z.width,Z.height)}O&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,St,At,K)}else e.texImage2D(r.TEXTURE_2D,0,dt,St,At,K);g(b)&&x(J),ut.__version=ot.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Vt(C,b,V){if(b.image.length!==6)return;let J=$(C,b),nt=b.source;e.bindTexture(r.TEXTURE_CUBE_MAP,C.__webglTexture,r.TEXTURE0+V);let ot=n.get(nt);if(nt.version!==ot.__version||J===!0){e.activeTexture(r.TEXTURE0+V);let ut=ie.getPrimaries(ie.workingColorSpace),Y=b.colorSpace===Ri?null:ie.getPrimaries(b.colorSpace),K=b.colorSpace===Ri||ut===Y?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,b.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),e.pixelStorei(r.UNPACK_ALIGNMENT,b.unpackAlignment),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let St=b.isCompressedTexture||b.image[0].isCompressedTexture,At=b.image[0]&&b.image[0].isDataTexture,dt=[];for(let it=0;it<6;it++)!St&&!At?dt[it]=m(b.image[it],!0,i.maxCubemapSize):dt[it]=At?b.image[it].image:b.image[it],dt[it]=rt(b,dt[it]);let ct=dt[0],Jt=s.convert(b.format,b.colorSpace),te=s.convert(b.type),le=M(b.internalFormat,Jt,te,b.normalized,b.colorSpace),O=b.isVideoTexture!==!0,ht=ot.__version===void 0||J===!0,Z=nt.dataReady,Tt=S(b,ct);Ot(r.TEXTURE_CUBE_MAP,b);let pt;if(St){O&&ht&&e.texStorage2D(r.TEXTURE_CUBE_MAP,Tt,le,ct.width,ct.height);for(let it=0;it<6;it++){pt=dt[it].mipmaps;for(let Lt=0;Lt<pt.length;Lt++){let Kt=pt[Lt];b.format!==an?Jt!==null?O?Z&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt,0,0,Kt.width,Kt.height,Jt,Kt.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt,le,Kt.width,Kt.height,0,Kt.data):ft("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?Z&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt,0,0,Kt.width,Kt.height,Jt,te,Kt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt,le,Kt.width,Kt.height,0,Jt,te,Kt.data)}}}else{if(pt=b.mipmaps,O&&ht){pt.length>0&&Tt++;let it=ue(dt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,Tt,le,it.width,it.height)}for(let it=0;it<6;it++)if(At){O?Z&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,dt[it].width,dt[it].height,Jt,te,dt[it].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,le,dt[it].width,dt[it].height,0,Jt,te,dt[it].data);for(let Lt=0;Lt<pt.length;Lt++){let Ne=pt[Lt].image[it].image;O?Z&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt+1,0,0,Ne.width,Ne.height,Jt,te,Ne.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt+1,le,Ne.width,Ne.height,0,Jt,te,Ne.data)}}else{O?Z&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Jt,te,dt[it]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,le,Jt,te,dt[it]);for(let Lt=0;Lt<pt.length;Lt++){let Kt=pt[Lt];O?Z&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt+1,0,0,Jt,te,Kt.image[it]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+it,Lt+1,le,Jt,te,Kt.image[it])}}}g(b)&&x(r.TEXTURE_CUBE_MAP),ot.__version=nt.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function Bt(C,b,V,J,nt,ot){let ut=s.convert(V.format,V.colorSpace),Y=s.convert(V.type),K=M(V.internalFormat,ut,Y,V.normalized,V.colorSpace),St=n.get(b),At=n.get(V);if(At.__renderTarget=b,!St.__hasExternalTextures){let dt=Math.max(1,b.width>>ot),ct=Math.max(1,b.height>>ot);nt===r.TEXTURE_3D||nt===r.TEXTURE_2D_ARRAY?e.texImage3D(nt,ot,K,dt,ct,b.depth,0,ut,Y,null):e.texImage2D(nt,ot,K,dt,ct,0,ut,Y,null)}e.bindFramebuffer(r.FRAMEBUFFER,C),Pt(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,J,nt,At.__webglTexture,0,Zt(b)):(nt===r.TEXTURE_2D||nt>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,J,nt,At.__webglTexture,ot),e.bindFramebuffer(r.FRAMEBUFFER,null)}function re(C,b,V){if(r.bindRenderbuffer(r.RENDERBUFFER,C),b.depthBuffer){let J=b.depthTexture,nt=J&&J.isDepthTexture?J.type:null,ot=E(b.stencilBuffer,nt),ut=b.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;Pt(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Zt(b),ot,b.width,b.height):V?r.renderbufferStorageMultisample(r.RENDERBUFFER,Zt(b),ot,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,ot,b.width,b.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ut,r.RENDERBUFFER,C)}else{let J=b.textures;for(let nt=0;nt<J.length;nt++){let ot=J[nt],ut=s.convert(ot.format,ot.colorSpace),Y=s.convert(ot.type),K=M(ot.internalFormat,ut,Y,ot.normalized,ot.colorSpace);Pt(b)?o.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Zt(b),K,b.width,b.height):V?r.renderbufferStorageMultisample(r.RENDERBUFFER,Zt(b),K,b.width,b.height):r.renderbufferStorage(r.RENDERBUFFER,K,b.width,b.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function Wt(C,b,V){let J=b.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(r.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let nt=n.get(b.depthTexture);if(nt.__renderTarget=b,(!nt.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),J){if(nt.__webglInit===void 0&&(nt.__webglInit=!0,b.depthTexture.addEventListener("dispose",w)),nt.__webglTexture===void 0){nt.__webglTexture=r.createTexture(),e.bindTexture(r.TEXTURE_CUBE_MAP,nt.__webglTexture),Ot(r.TEXTURE_CUBE_MAP,b.depthTexture);let St=s.convert(b.depthTexture.format),At=s.convert(b.depthTexture.type),dt;b.depthTexture.format===li?dt=r.DEPTH_COMPONENT24:b.depthTexture.format===ji&&(dt=r.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,dt,b.width,b.height,0,St,At,null)}}else W(b.depthTexture,0);let ot=nt.__webglTexture,ut=Zt(b),Y=J?r.TEXTURE_CUBE_MAP_POSITIVE_X+V:r.TEXTURE_2D,K=b.depthTexture.format===ji?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(b.depthTexture.format===li)Pt(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,Y,ot,0,ut):r.framebufferTexture2D(r.FRAMEBUFFER,K,Y,ot,0);else if(b.depthTexture.format===ji)Pt(b)?o.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,Y,ot,0,ut):r.framebufferTexture2D(r.FRAMEBUFFER,K,Y,ot,0);else throw new Error("Unknown depthTexture format")}function j(C){let b=n.get(C),V=C.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==C.depthTexture){let J=C.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),J){let nt=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,J.removeEventListener("dispose",nt)};J.addEventListener("dispose",nt),b.__depthDisposeCallback=nt}b.__boundDepthTexture=J}if(C.depthTexture&&!b.__autoAllocateDepthBuffer)if(V)for(let J=0;J<6;J++)Wt(b.__webglFramebuffer[J],C,J);else{let J=C.texture.mipmaps;J&&J.length>0?Wt(b.__webglFramebuffer[0],C,0):Wt(b.__webglFramebuffer,C,0)}else if(V){b.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(e.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[J]),b.__webglDepthbuffer[J]===void 0)b.__webglDepthbuffer[J]=r.createRenderbuffer(),re(b.__webglDepthbuffer[J],C,!1);else{let nt=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ot=b.__webglDepthbuffer[J];r.bindRenderbuffer(r.RENDERBUFFER,ot),r.framebufferRenderbuffer(r.FRAMEBUFFER,nt,r.RENDERBUFFER,ot)}}else{let J=C.texture.mipmaps;if(J&&J.length>0?e.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=r.createRenderbuffer(),re(b.__webglDepthbuffer,C,!1);else{let nt=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ot=b.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,ot),r.framebufferRenderbuffer(r.FRAMEBUFFER,nt,r.RENDERBUFFER,ot)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function st(C,b,V){let J=n.get(C);b!==void 0&&Bt(J.__webglFramebuffer,C,C.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),V!==void 0&&j(C)}function tt(C){let b=C.texture,V=n.get(C),J=n.get(b);C.addEventListener("dispose",y);let nt=C.textures,ot=C.isWebGLCubeRenderTarget===!0,ut=nt.length>1;if(ut||(J.__webglTexture===void 0&&(J.__webglTexture=r.createTexture()),J.__version=b.version,a.memory.textures++),ot){V.__webglFramebuffer=[];for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer[Y]=[];for(let K=0;K<b.mipmaps.length;K++)V.__webglFramebuffer[Y][K]=r.createFramebuffer()}else V.__webglFramebuffer[Y]=r.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){V.__webglFramebuffer=[];for(let Y=0;Y<b.mipmaps.length;Y++)V.__webglFramebuffer[Y]=r.createFramebuffer()}else V.__webglFramebuffer=r.createFramebuffer();if(ut)for(let Y=0,K=nt.length;Y<K;Y++){let St=n.get(nt[Y]);St.__webglTexture===void 0&&(St.__webglTexture=r.createTexture(),a.memory.textures++)}if(C.samples>0&&Pt(C)===!1){V.__webglMultisampledFramebuffer=r.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let Y=0;Y<nt.length;Y++){let K=nt[Y];V.__webglColorRenderbuffer[Y]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,V.__webglColorRenderbuffer[Y]);let St=s.convert(K.format,K.colorSpace),At=s.convert(K.type),dt=M(K.internalFormat,St,At,K.normalized,K.colorSpace,C.isXRRenderTarget===!0),ct=Zt(C);r.renderbufferStorageMultisample(r.RENDERBUFFER,ct,dt,C.width,C.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Y,r.RENDERBUFFER,V.__webglColorRenderbuffer[Y])}r.bindRenderbuffer(r.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=r.createRenderbuffer(),re(V.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(ot){e.bindTexture(r.TEXTURE_CUBE_MAP,J.__webglTexture),Ot(r.TEXTURE_CUBE_MAP,b);for(let Y=0;Y<6;Y++)if(b.mipmaps&&b.mipmaps.length>0)for(let K=0;K<b.mipmaps.length;K++)Bt(V.__webglFramebuffer[Y][K],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,K);else Bt(V.__webglFramebuffer[Y],C,b,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0);g(b)&&x(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ut){for(let Y=0,K=nt.length;Y<K;Y++){let St=nt[Y],At=n.get(St),dt=r.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(dt=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(dt,At.__webglTexture),Ot(dt,St),Bt(V.__webglFramebuffer,C,St,r.COLOR_ATTACHMENT0+Y,dt,0),g(St)&&x(dt)}e.unbindTexture()}else{let Y=r.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(Y=C.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(Y,J.__webglTexture),Ot(Y,b),b.mipmaps&&b.mipmaps.length>0)for(let K=0;K<b.mipmaps.length;K++)Bt(V.__webglFramebuffer[K],C,b,r.COLOR_ATTACHMENT0,Y,K);else Bt(V.__webglFramebuffer,C,b,r.COLOR_ATTACHMENT0,Y,0);g(b)&&x(Y),e.unbindTexture()}C.depthBuffer&&j(C)}function yt(C){let b=C.textures;for(let V=0,J=b.length;V<J;V++){let nt=b[V];if(g(nt)){let ot=v(C),ut=n.get(nt).__webglTexture;e.bindTexture(ot,ut),x(ot),e.unbindTexture()}}}let gt=[],Xt=[];function N(C){if(C.samples>0){if(Pt(C)===!1){let b=C.textures,V=C.width,J=C.height,nt=r.COLOR_BUFFER_BIT,ot=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ut=n.get(C),Y=b.length>1;if(Y)for(let St=0;St<b.length;St++)e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+St,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+St,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ut.__webglMultisampledFramebuffer);let K=C.texture.mipmaps;K&&K.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglFramebuffer);for(let St=0;St<b.length;St++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(nt|=r.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(nt|=r.STENCIL_BUFFER_BIT)),Y){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ut.__webglColorRenderbuffer[St]);let At=n.get(b[St]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,At,0)}r.blitFramebuffer(0,0,V,J,0,0,V,J,nt,r.NEAREST),l===!0&&(gt.length=0,Xt.length=0,gt.push(r.COLOR_ATTACHMENT0+St),C.depthBuffer&&C.resolveDepthBuffer===!1&&(gt.push(ot),Xt.push(ot),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,Xt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,gt))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),Y)for(let St=0;St<b.length;St++){e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+St,r.RENDERBUFFER,ut.__webglColorRenderbuffer[St]);let At=n.get(b[St]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ut.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+St,r.TEXTURE_2D,At,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ut.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){let b=C.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[b])}}}function Zt(C){return Math.min(i.maxSamples,C.samples)}function Pt(C){let b=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function qt(C){let b=a.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function rt(C,b){let V=C.colorSpace,J=C.format,nt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==fa&&V!==Ri&&(ie.getTransfer(V)===he?(J!==an||nt!==xn)&&ft("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Rt("WebGLTextures: Unsupported texture color space:",V)),b}function ue(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=F,this.resetTextureUnits=z,this.getTextureUnits=k,this.setTextureUnits=D,this.setTexture2D=W,this.setTexture2DArray=q,this.setTexture3D=et,this.setTextureCube=lt,this.rebindTextures=st,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=yt,this.updateMultisampleRenderTarget=N,this.setupDepthRenderbuffer=j,this.setupFrameBufferTexture=Bt,this.useMultisampledRTT=Pt,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function V0(r,t){function e(n,i=Ri){let s,a=ie.getTransfer(i);if(n===xn)return r.UNSIGNED_BYTE;if(n===$l)return r.UNSIGNED_SHORT_4_4_4_4;if(n===Kl)return r.UNSIGNED_SHORT_5_5_5_1;if(n===mf)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===gf)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===df)return r.BYTE;if(n===pf)return r.SHORT;if(n===Tr)return r.UNSIGNED_SHORT;if(n===Jl)return r.INT;if(n===Vn)return r.UNSIGNED_INT;if(n===rn)return r.FLOAT;if(n===mi)return r.HALF_FLOAT;if(n===_f)return r.ALPHA;if(n===xf)return r.RGB;if(n===an)return r.RGBA;if(n===li)return r.DEPTH_COMPONENT;if(n===ji)return r.DEPTH_STENCIL;if(n===Ql)return r.RED;if(n===Za)return r.RED_INTEGER;if(n===ts)return r.RG;if(n===jl)return r.RG_INTEGER;if(n===tc)return r.RGBA_INTEGER;if(n===Ja||n===$a||n===Ka||n===Qa)if(a===he)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ja)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$a)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ka)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qa)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ja)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$a)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ka)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qa)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ec||n===nc||n===ic||n===sc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===ec)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===nc)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ic)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===sc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===rc||n===ac||n===oc||n===lc||n===cc||n===ja||n===hc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===rc||n===ac)return a===he?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===oc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===lc)return s.COMPRESSED_R11_EAC;if(n===cc)return s.COMPRESSED_SIGNED_R11_EAC;if(n===ja)return s.COMPRESSED_RG11_EAC;if(n===hc)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===uc||n===fc||n===dc||n===pc||n===mc||n===gc||n===_c||n===xc||n===vc||n===yc||n===Mc||n===Sc||n===bc||n===Tc)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===uc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===fc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===dc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===pc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===mc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===gc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===_c)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===xc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===vc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===yc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Mc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Sc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===bc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Tc)return a===he?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ec||n===wc||n===Ac)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Ec)return a===he?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===wc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ac)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Cc||n===Rc||n===to||n===Pc)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===Cc)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Rc)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===to)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Pc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Er?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}var N1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,U1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,qp=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Sa(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new gn({vertexShader:N1,fragmentShader:U1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new $t(new Ji(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Yp=class extends En{constructor(t,e){super();let n=this,i=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null,_=typeof XRWebGLBinding<"u",m=new qp,g={},x=e.getContextAttributes(),v=null,M=null,E=[],S=[],w=new Q,y=null,T=new Re;T.viewport=new de;let R=new Re;R.viewport=new de;let P=[T,R],U=new Hl,z=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let _t=E[$];return _t===void 0&&(_t=new lr,E[$]=_t),_t.getTargetRaySpace()},this.getControllerGrip=function($){let _t=E[$];return _t===void 0&&(_t=new lr,E[$]=_t),_t.getGripSpace()},this.getHand=function($){let _t=E[$];return _t===void 0&&(_t=new lr,E[$]=_t),_t.getHandSpace()};function D($){let _t=S.indexOf($.inputSource);if(_t===-1)return;let at=E[_t];at!==void 0&&(at.update($.inputSource,$.frame,c||a),at.dispatchEvent({type:$.type,data:$.inputSource}))}function F(){i.removeEventListener("select",D),i.removeEventListener("selectstart",D),i.removeEventListener("selectend",D),i.removeEventListener("squeeze",D),i.removeEventListener("squeezestart",D),i.removeEventListener("squeezeend",D),i.removeEventListener("end",F),i.removeEventListener("inputsourceschange",L);for(let $=0;$<E.length;$++){let _t=S[$];_t!==null&&(S[$]=null,E[$].disconnect(_t))}z=null,k=null,m.reset();for(let $ in g)delete g[$];t.setRenderTarget(v),d=null,u=null,f=null,i=null,M=null,Ot.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,n.isPresenting===!0&&ft("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,n.isPresenting===!0&&ft("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(i,e)),f},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function($){if(i=$,i!==null){if(v=t.getRenderTarget(),i.addEventListener("select",D),i.addEventListener("selectstart",D),i.addEventListener("selectend",D),i.addEventListener("squeeze",D),i.addEventListener("squeezestart",D),i.addEventListener("squeezeend",D),i.addEventListener("end",F),i.addEventListener("inputsourceschange",L),x.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(w),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let at=null,Dt=null,Vt=null;x.depth&&(Vt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=x.stencil?ji:li,Dt=x.stencil?Er:Vn);let Bt={colorFormat:e.RGBA8,depthFormat:Vt,scaleFactor:s};f=this.getBinding(),u=f.createProjectionLayer(Bt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),M=new on(u.textureWidth,u.textureHeight,{format:an,type:xn,depthTexture:new Ti(u.textureWidth,u.textureHeight,Dt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{let at={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,e,at),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new on(d.framebufferWidth,d.framebufferHeight,{format:an,type:xn,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Ot.setContext(i),Ot.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function L($){for(let _t=0;_t<$.removed.length;_t++){let at=$.removed[_t],Dt=S.indexOf(at);Dt>=0&&(S[Dt]=null,E[Dt].disconnect(at))}for(let _t=0;_t<$.added.length;_t++){let at=$.added[_t],Dt=S.indexOf(at);if(Dt===-1){for(let Bt=0;Bt<E.length;Bt++)if(Bt>=S.length){S.push(at),Dt=Bt;break}else if(S[Bt]===null){S[Bt]=at,Dt=Bt;break}if(Dt===-1)break}let Vt=E[Dt];Vt&&Vt.connect(at)}}let W=new I,q=new I;function et($,_t,at){W.setFromMatrixPosition(_t.matrixWorld),q.setFromMatrixPosition(at.matrixWorld);let Dt=W.distanceTo(q),Vt=_t.projectionMatrix.elements,Bt=at.projectionMatrix.elements,re=Vt[14]/(Vt[10]-1),Wt=Vt[14]/(Vt[10]+1),j=(Vt[9]+1)/Vt[5],st=(Vt[9]-1)/Vt[5],tt=(Vt[8]-1)/Vt[0],yt=(Bt[8]+1)/Bt[0],gt=re*tt,Xt=re*yt,N=Dt/(-tt+yt),Zt=N*-tt;if(_t.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Zt),$.translateZ(N),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),Vt[10]===-1)$.projectionMatrix.copy(_t.projectionMatrix),$.projectionMatrixInverse.copy(_t.projectionMatrixInverse);else{let Pt=re+N,qt=Wt+N,rt=gt-Zt,ue=Xt+(Dt-Zt),C=j*Wt/qt*Pt,b=st*Wt/qt*Pt;$.projectionMatrix.makePerspective(rt,ue,C,b,Pt,qt),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function lt($,_t){_t===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(_t.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(i===null)return;let _t=$.near,at=$.far;m.texture!==null&&(m.depthNear>0&&(_t=m.depthNear),m.depthFar>0&&(at=m.depthFar)),U.near=R.near=T.near=_t,U.far=R.far=T.far=at,(z!==U.near||k!==U.far)&&(i.updateRenderState({depthNear:U.near,depthFar:U.far}),z=U.near,k=U.far),U.layers.mask=$.layers.mask|6,T.layers.mask=U.layers.mask&-5,R.layers.mask=U.layers.mask&-3;let Dt=$.parent,Vt=U.cameras;lt(U,Dt);for(let Bt=0;Bt<Vt.length;Bt++)lt(Vt[Bt],Dt);Vt.length===2?et(U,T,R):U.projectionMatrix.copy(T.projectionMatrix),mt($,U,Dt)};function mt($,_t,at){at===null?$.matrix.copy(_t.matrixWorld):($.matrix.copy(at.matrixWorld),$.matrix.invert(),$.matrix.multiply(_t.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(_t.projectionMatrix),$.projectionMatrixInverse.copy(_t.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=sr*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function($){l=$,u!==null&&(u.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(U)},this.getCameraTexture=function($){return g[$]};let Ft=null;function kt($,_t){if(h=_t.getViewerPose(c||a),p=_t,h!==null){let at=h.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let Dt=!1;at.length!==U.cameras.length&&(U.cameras.length=0,Dt=!0);for(let Wt=0;Wt<at.length;Wt++){let j=at[Wt],st=null;if(d!==null)st=d.getViewport(j);else{let yt=f.getViewSubImage(u,j);st=yt.viewport,Wt===0&&(t.setRenderTargetTextures(M,yt.colorTexture,yt.depthStencilTexture),t.setRenderTarget(M))}let tt=P[Wt];tt===void 0&&(tt=new Re,tt.layers.enable(Wt),tt.viewport=new de,P[Wt]=tt),tt.matrix.fromArray(j.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(j.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(st.x,st.y,st.width,st.height),Wt===0&&(U.matrix.copy(tt.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),Dt===!0&&U.cameras.push(tt)}let Vt=i.enabledFeatures;if(Vt&&Vt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){f=n.getBinding();let Wt=f.getDepthInformation(at[0]);Wt&&Wt.isValid&&Wt.texture&&m.init(Wt,i.renderState)}if(Vt&&Vt.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let Wt=0;Wt<at.length;Wt++){let j=at[Wt].camera;if(j){let st=g[j];st||(st=new Sa,g[j]=st);let tt=f.getCameraImage(j);st.sourceTexture=tt}}}}for(let at=0;at<E.length;at++){let Dt=S[at],Vt=E[at];Dt!==null&&Vt!==void 0&&Vt.update(Dt,_t,c||a)}Ft&&Ft($,_t),_t.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:_t}),p=null}let Ot=new U0;Ot.setAnimationLoop(kt),this.setAnimationLoop=function($){Ft=$},this.dispose=function(){}}},F1=new Gt,G0=new Yt;G0.set(-1,0,0,0,1,0,0,0,1);function O1(r,t){function e(m,g){m.matrixAutoUpdate===!0&&m.updateMatrix(),g.value.copy(m.matrix)}function n(m,g){g.color.getRGB(m.fogColor.value,Ap(r)),g.isFog?(m.fogNear.value=g.near,m.fogFar.value=g.far):g.isFogExp2&&(m.fogDensity.value=g.density)}function i(m,g,x,v,M){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?s(m,g):g.isMeshLambertMaterial?(s(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(s(m,g),f(m,g)):g.isMeshPhongMaterial?(s(m,g),h(m,g),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(s(m,g),u(m,g),g.isMeshPhysicalMaterial&&d(m,g,M)):g.isMeshMatcapMaterial?(s(m,g),p(m,g)):g.isMeshDepthMaterial?s(m,g):g.isMeshDistanceMaterial?(s(m,g),_(m,g)):g.isMeshNormalMaterial?s(m,g):g.isLineBasicMaterial?(a(m,g),g.isLineDashedMaterial&&o(m,g)):g.isPointsMaterial?l(m,g,x,v):g.isSpriteMaterial?c(m,g):g.isShadowMaterial?(m.color.value.copy(g.color),m.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function s(m,g){m.opacity.value=g.opacity,g.color&&m.diffuse.value.copy(g.color),g.emissive&&m.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.bumpMap&&(m.bumpMap.value=g.bumpMap,e(g.bumpMap,m.bumpMapTransform),m.bumpScale.value=g.bumpScale,g.side===ln&&(m.bumpScale.value*=-1)),g.normalMap&&(m.normalMap.value=g.normalMap,e(g.normalMap,m.normalMapTransform),m.normalScale.value.copy(g.normalScale),g.side===ln&&m.normalScale.value.negate()),g.displacementMap&&(m.displacementMap.value=g.displacementMap,e(g.displacementMap,m.displacementMapTransform),m.displacementScale.value=g.displacementScale,m.displacementBias.value=g.displacementBias),g.emissiveMap&&(m.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,m.emissiveMapTransform)),g.specularMap&&(m.specularMap.value=g.specularMap,e(g.specularMap,m.specularMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest);let x=t.get(g),v=x.envMap,M=x.envMapRotation;v&&(m.envMap.value=v,m.envMapRotation.value.setFromMatrix4(F1.makeRotationFromEuler(M)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(G0),m.reflectivity.value=g.reflectivity,m.ior.value=g.ior,m.refractionRatio.value=g.refractionRatio),g.lightMap&&(m.lightMap.value=g.lightMap,m.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,m.lightMapTransform)),g.aoMap&&(m.aoMap.value=g.aoMap,m.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,m.aoMapTransform))}function a(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform))}function o(m,g){m.dashSize.value=g.dashSize,m.totalSize.value=g.dashSize+g.gapSize,m.scale.value=g.scale}function l(m,g,x,v){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.size.value=g.size*x,m.scale.value=v*.5,g.map&&(m.map.value=g.map,e(g.map,m.uvTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function c(m,g){m.diffuse.value.copy(g.color),m.opacity.value=g.opacity,m.rotation.value=g.rotation,g.map&&(m.map.value=g.map,e(g.map,m.mapTransform)),g.alphaMap&&(m.alphaMap.value=g.alphaMap,e(g.alphaMap,m.alphaMapTransform)),g.alphaTest>0&&(m.alphaTest.value=g.alphaTest)}function h(m,g){m.specular.value.copy(g.specular),m.shininess.value=Math.max(g.shininess,1e-4)}function f(m,g){g.gradientMap&&(m.gradientMap.value=g.gradientMap)}function u(m,g){m.metalness.value=g.metalness,g.metalnessMap&&(m.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,m.metalnessMapTransform)),m.roughness.value=g.roughness,g.roughnessMap&&(m.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,m.roughnessMapTransform)),g.envMap&&(m.envMapIntensity.value=g.envMapIntensity)}function d(m,g,x){m.ior.value=g.ior,g.sheen>0&&(m.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),m.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(m.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,m.sheenColorMapTransform)),g.sheenRoughnessMap&&(m.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,m.sheenRoughnessMapTransform))),g.clearcoat>0&&(m.clearcoat.value=g.clearcoat,m.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(m.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,m.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(m.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===ln&&m.clearcoatNormalScale.value.negate())),g.dispersion>0&&(m.dispersion.value=g.dispersion),g.iridescence>0&&(m.iridescence.value=g.iridescence,m.iridescenceIOR.value=g.iridescenceIOR,m.iridescenceThicknessMinimum.value=g.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=g.iridescenceThicknessRange[1],g.iridescenceMap&&(m.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,m.iridescenceMapTransform)),g.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),g.transmission>0&&(m.transmission.value=g.transmission,m.transmissionSamplerMap.value=x.texture,m.transmissionSamplerSize.value.set(x.width,x.height),g.transmissionMap&&(m.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,m.transmissionMapTransform)),m.thickness.value=g.thickness,g.thicknessMap&&(m.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=g.attenuationDistance,m.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(m.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(m.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=g.specularIntensity,m.specularColor.value.copy(g.specularColor),g.specularColorMap&&(m.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,m.specularColorMapTransform)),g.specularIntensityMap&&(m.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,m.specularIntensityMapTransform))}function p(m,g){g.matcap&&(m.matcap.value=g.matcap)}function _(m,g){let x=t.get(g).light;m.referencePosition.value.setFromMatrixPosition(x.matrixWorld),m.nearDistance.value=x.shadow.camera.near,m.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function B1(r,t,e,n){let i={},s={},a=[],o=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,v){let M=v.program;n.uniformBlockBinding(x,M)}function c(x,v){let M=i[x.id];M===void 0&&(p(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",m));let E=v.program;n.updateUBOMapping(x,E);let S=t.render.frame;s[x.id]!==S&&(u(x),s[x.id]=S)}function h(x){let v=f();x.__bindingPointIndex=v;let M=r.createBuffer(),E=x.__size,S=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,M),r.bufferData(r.UNIFORM_BUFFER,E,S),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,M),M}function f(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return Rt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){let v=i[x.id],M=x.uniforms,E=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let S=0,w=M.length;S<w;S++){let y=Array.isArray(M[S])?M[S]:[M[S]];for(let T=0,R=y.length;T<R;T++){let P=y[T];if(d(P,S,T,E)===!0){let U=P.__offset,z=Array.isArray(P.value)?P.value:[P.value],k=0;for(let D=0;D<z.length;D++){let F=z[D],L=_(F);typeof F=="number"||typeof F=="boolean"?(P.__data[0]=F,r.bufferSubData(r.UNIFORM_BUFFER,U+k,P.__data)):F.isMatrix3?(P.__data[0]=F.elements[0],P.__data[1]=F.elements[1],P.__data[2]=F.elements[2],P.__data[3]=0,P.__data[4]=F.elements[3],P.__data[5]=F.elements[4],P.__data[6]=F.elements[5],P.__data[7]=0,P.__data[8]=F.elements[6],P.__data[9]=F.elements[7],P.__data[10]=F.elements[8],P.__data[11]=0):ArrayBuffer.isView(F)?P.__data.set(new F.constructor(F.buffer,F.byteOffset,P.__data.length)):(F.toArray(P.__data,k),k+=L.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,U,P.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(x,v,M,E){let S=x.value,w=v+"_"+M;if(E[w]===void 0)return typeof S=="number"||typeof S=="boolean"?E[w]=S:ArrayBuffer.isView(S)?E[w]=S.slice():E[w]=S.clone(),!0;{let y=E[w];if(typeof S=="number"||typeof S=="boolean"){if(y!==S)return E[w]=S,!0}else{if(ArrayBuffer.isView(S))return!0;if(y.equals(S)===!1)return y.copy(S),!0}}return!1}function p(x){let v=x.uniforms,M=0,E=16;for(let w=0,y=v.length;w<y;w++){let T=Array.isArray(v[w])?v[w]:[v[w]];for(let R=0,P=T.length;R<P;R++){let U=T[R],z=Array.isArray(U.value)?U.value:[U.value];for(let k=0,D=z.length;k<D;k++){let F=z[k],L=_(F),W=M%E,q=W%L.boundary,et=W+q;M+=q,et!==0&&E-et<L.storage&&(M+=E-et),U.__data=new Float32Array(L.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=M,M+=L.storage}}}let S=M%E;return S>0&&(M+=E-S),x.__size=M,x.__cache={},this}function _(x){let v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?ft("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(v.boundary=16,v.storage=x.byteLength):ft("WebGLRenderer: Unsupported uniform value type.",x),v}function m(x){let v=x.target;v.removeEventListener("dispose",m);let M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),r.deleteBuffer(i[v.id]),delete i[v.id],delete s[v.id]}function g(){for(let x in i)r.deleteBuffer(i[x]);a=[],i={},s={}}return{bind:l,update:c,dispose:g}}var z1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Pi=null;function k1(){return Pi===null&&(Pi=new Tn(z1,16,16,ts,mi),Pi.name="DFG_LUT",Pi.minFilter=Me,Pi.magFilter=Me,Pi.wrapS=mn,Pi.wrapT=mn,Pi.generateMipmaps=!1,Pi.needsUpdate=!0),Pi}var zc=class{constructor(t={}){let{canvas:e=Tp(),context:n=null,depth:i=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=xn}=t;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;let _=d,m=new Set([tc,jl,Za]),g=new Set([xn,Vn,Tr,Er,$l,Kl]),x=new Uint32Array(4),v=new Int32Array(4),M=new I,E=null,S=null,w=[],y=[],T=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Kn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,P=!1,U=null;this._outputColorSpace=Je;let z=0,k=0,D=null,F=-1,L=null,W=new de,q=new de,et=null,lt=new bt(0),mt=0,Ft=e.width,kt=e.height,Ot=1,$=null,_t=null,at=new de(0,0,Ft,kt),Dt=new de(0,0,Ft,kt),Vt=!1,Bt=new Yi,re=!1,Wt=!1,j=new Gt,st=new I,tt=new de,yt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},gt=!1;function Xt(){return D===null?Ot:1}let N=n;function Zt(A,B){return e.getContext(A,B)}try{let A={alpha:!0,depth:i,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"184"}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",Lt,!1),e.addEventListener("webglcontextcreationerror",Kt,!1),N===null){let B="webgl2";if(N=Zt(B,A),N===null)throw Zt(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw Rt("WebGLRenderer: "+A.message),A}let Pt,qt,rt,ue,C,b,V,J,nt,ot,ut,Y,K,St,At,dt,ct,Jt,te,le,O,ht,Z;function Tt(){Pt=new Zb(N),Pt.init(),O=new V0(N,Pt),qt=new kb(N,Pt,t,O),rt=new D1(N,Pt),qt.reversedDepthBuffer&&u&&rt.buffers.depth.setReversed(!0),ue=new Kb(N),C=new x1,b=new L1(N,Pt,rt,C,qt,O,ue),V=new Yb(R),J=new eM(N),ht=new Bb(N,J),nt=new Jb(N,J,ue,ht),ot=new jb(N,nt,J,ht,ue),Jt=new Qb(N,qt,b),At=new Vb(C),ut=new _1(R,V,Pt,qt,ht,At),Y=new O1(R,C),K=new y1,St=new w1(Pt),ct=new Ob(R,V,rt,ot,p,l),dt=new I1(R,ot,qt),Z=new B1(N,ue,qt,rt),te=new zb(N,Pt,ue),le=new $b(N,Pt,ue),ue.programs=ut.programs,R.capabilities=qt,R.extensions=Pt,R.properties=C,R.renderLists=K,R.shadowMap=dt,R.state=rt,R.info=ue}Tt(),_!==xn&&(T=new eT(_,e.width,e.height,i,s));let pt=new Yp(R,N);this.xr=pt,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){let A=Pt.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){let A=Pt.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return Ot},this.setPixelRatio=function(A){A!==void 0&&(Ot=A,this.setSize(Ft,kt,!1))},this.getSize=function(A){return A.set(Ft,kt)},this.setSize=function(A,B,X=!0){if(pt.isPresenting){ft("WebGLRenderer: Can't change size while VR device is presenting.");return}Ft=A,kt=B,e.width=Math.floor(A*Ot),e.height=Math.floor(B*Ot),X===!0&&(e.style.width=A+"px",e.style.height=B+"px"),T!==null&&T.setSize(e.width,e.height),this.setViewport(0,0,A,B)},this.getDrawingBufferSize=function(A){return A.set(Ft*Ot,kt*Ot).floor()},this.setDrawingBufferSize=function(A,B,X){Ft=A,kt=B,Ot=X,e.width=Math.floor(A*X),e.height=Math.floor(B*X),this.setViewport(0,0,A,B)},this.setEffects=function(A){if(_===xn){Rt("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let B=0;B<A.length;B++)if(A[B].isOutputPass===!0){ft("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}T.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(W)},this.getViewport=function(A){return A.copy(at)},this.setViewport=function(A,B,X,G){A.isVector4?at.set(A.x,A.y,A.z,A.w):at.set(A,B,X,G),rt.viewport(W.copy(at).multiplyScalar(Ot).round())},this.getScissor=function(A){return A.copy(Dt)},this.setScissor=function(A,B,X,G){A.isVector4?Dt.set(A.x,A.y,A.z,A.w):Dt.set(A,B,X,G),rt.scissor(q.copy(Dt).multiplyScalar(Ot).round())},this.getScissorTest=function(){return Vt},this.setScissorTest=function(A){rt.setScissorTest(Vt=A)},this.setOpaqueSort=function(A){$=A},this.setTransparentSort=function(A){_t=A},this.getClearColor=function(A){return A.copy(ct.getClearColor())},this.setClearColor=function(){ct.setClearColor(...arguments)},this.getClearAlpha=function(){return ct.getClearAlpha()},this.setClearAlpha=function(){ct.setClearAlpha(...arguments)},this.clear=function(A=!0,B=!0,X=!0){let G=0;if(A){let H=!1;if(D!==null){let Mt=D.texture.format;H=m.has(Mt)}if(H){let Mt=D.texture.type,Ct=g.has(Mt),vt=ct.getClearColor(),It=ct.getClearAlpha(),Nt=vt.r,Qt=vt.g,ne=vt.b;Ct?(x[0]=Nt,x[1]=Qt,x[2]=ne,x[3]=It,N.clearBufferuiv(N.COLOR,0,x)):(v[0]=Nt,v[1]=Qt,v[2]=ne,v[3]=It,N.clearBufferiv(N.COLOR,0,v))}else G|=N.COLOR_BUFFER_BIT}B&&(G|=N.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),X&&(G|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&N.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),U=A},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",Lt,!1),e.removeEventListener("webglcontextcreationerror",Kt,!1),ct.dispose(),K.dispose(),St.dispose(),C.dispose(),V.dispose(),ot.dispose(),ht.dispose(),Z.dispose(),ut.dispose(),pt.dispose(),pt.removeEventListener("sessionstart",Gm),pt.removeEventListener("sessionend",Hm),Hs.stop()};function it(A){A.preventDefault(),ga("WebGLRenderer: Context Lost."),P=!0}function Lt(){ga("WebGLRenderer: Context Restored."),P=!1;let A=ue.autoReset,B=dt.enabled,X=dt.autoUpdate,G=dt.needsUpdate,H=dt.type;Tt(),ue.autoReset=A,dt.enabled=B,dt.autoUpdate=X,dt.needsUpdate=G,dt.type=H}function Kt(A){Rt("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Ne(A){let B=A.target;B.removeEventListener("dispose",Ne),pe(B)}function pe(A){Ui(A),C.remove(A)}function Ui(A){let B=C.get(A).programs;B!==void 0&&(B.forEach(function(X){ut.releaseProgram(X)}),A.isShaderMaterial&&ut.releaseShaderCache(A))}this.renderBufferDirect=function(A,B,X,G,H,Mt){B===null&&(B=yt);let Ct=H.isMesh&&H.matrixWorld.determinant()<0,vt=Kx(A,B,X,G,H);rt.setMaterial(G,Ct);let It=X.index,Nt=1;if(G.wireframe===!0){if(It=nt.getWireframeAttribute(X),It===void 0)return;Nt=2}let Qt=X.drawRange,ne=X.attributes.position,Ut=Qt.start*Nt,me=(Qt.start+Qt.count)*Nt;Mt!==null&&(Ut=Math.max(Ut,Mt.start*Nt),me=Math.min(me,(Mt.start+Mt.count)*Nt)),It!==null?(Ut=Math.max(Ut,0),me=Math.min(me,It.count)):ne!=null&&(Ut=Math.max(Ut,0),me=Math.min(me,ne.count));let Ue=me-Ut;if(Ue<0||Ue===1/0)return;ht.setup(H,G,vt,X,It);let Ae,ge=te;if(It!==null&&(Ae=J.get(It),ge=le,ge.setIndex(Ae)),H.isMesh)G.wireframe===!0?(rt.setLineWidth(G.wireframeLinewidth*Xt()),ge.setMode(N.LINES)):ge.setMode(N.TRIANGLES);else if(H.isLine){let je=G.linewidth;je===void 0&&(je=1),rt.setLineWidth(je*Xt()),H.isLineSegments?ge.setMode(N.LINES):H.isLineLoop?ge.setMode(N.LINE_LOOP):ge.setMode(N.LINE_STRIP)}else H.isPoints?ge.setMode(N.POINTS):H.isSprite&&ge.setMode(N.TRIANGLES);if(H.isBatchedMesh)if(Pt.get("WEBGL_multi_draw"))ge.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let je=H._multiDrawStarts,wt=H._multiDrawCounts,Ln=H._multiDrawCount,ae=It?J.get(It).bytesPerElement:1,qn=C.get(G).currentProgram.getUniforms();for(let xi=0;xi<Ln;xi++)qn.setValue(N,"_gl_DrawID",xi),ge.render(je[xi]/ae,wt[xi])}else if(H.isInstancedMesh)ge.renderInstances(Ut,Ue,H.count);else if(X.isInstancedBufferGeometry){let je=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,wt=Math.min(X.instanceCount,je);ge.renderInstances(Ut,Ue,wt)}else ge.render(Ut,Ue)};function _i(A,B,X){A.transparent===!0&&A.side===ui&&A.forceSinglePass===!1?(A.side=ln,A.needsUpdate=!0,ih(A,B,X),A.side=bi,A.needsUpdate=!0,ih(A,B,X),A.side=ui):ih(A,B,X)}this.compile=function(A,B,X=null){X===null&&(X=A),S=St.get(X),S.init(B),y.push(S),X.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(S.pushLight(H),H.castShadow&&S.pushShadow(H))}),A!==X&&A.traverseVisible(function(H){H.isLight&&H.layers.test(B.layers)&&(S.pushLight(H),H.castShadow&&S.pushShadow(H))}),S.setupLights();let G=new Set;return A.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Mt=H.material;if(Mt)if(Array.isArray(Mt))for(let Ct=0;Ct<Mt.length;Ct++){let vt=Mt[Ct];_i(vt,X,H),G.add(vt)}else _i(Mt,X,H),G.add(Mt)}),S=y.pop(),G},this.compileAsync=function(A,B,X=null){let G=this.compile(A,B,X);return new Promise(H=>{function Mt(){if(G.forEach(function(Ct){C.get(Ct).currentProgram.isReady()&&G.delete(Ct)}),G.size===0){H(A);return}setTimeout(Mt,10)}Pt.get("KHR_parallel_shader_compile")!==null?Mt():setTimeout(Mt,10)})};let Hf=null;function Jx(A){Hf&&Hf(A)}function Gm(){Hs.stop()}function Hm(){Hs.start()}let Hs=new U0;Hs.setAnimationLoop(Jx),typeof self<"u"&&Hs.setContext(self),this.setAnimationLoop=function(A){Hf=A,pt.setAnimationLoop(A),A===null?Hs.stop():Hs.start()},pt.addEventListener("sessionstart",Gm),pt.addEventListener("sessionend",Hm),this.render=function(A,B){if(B!==void 0&&B.isCamera!==!0){Rt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;U!==null&&U.renderStart(A,B);let X=pt.enabled===!0&&pt.isPresenting===!0,G=T!==null&&(D===null||X)&&T.begin(R,D);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),pt.enabled===!0&&pt.isPresenting===!0&&(T===null||T.isCompositing()===!1)&&(pt.cameraAutoUpdate===!0&&pt.updateCamera(B),B=pt.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,B,D),S=St.get(A,y.length),S.init(B),S.state.textureUnits=b.getTextureUnits(),y.push(S),j.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Bt.setFromProjectionMatrix(j,bn,B.reversedDepth),Wt=this.localClippingEnabled,re=At.init(this.clippingPlanes,Wt),E=K.get(A,w.length),E.init(),w.push(E),pt.enabled===!0&&pt.isPresenting===!0){let Ct=R.xr.getDepthSensingMesh();Ct!==null&&Wf(Ct,B,-1/0,R.sortObjects)}Wf(A,B,0,R.sortObjects),E.finish(),R.sortObjects===!0&&E.sort($,_t),gt=pt.enabled===!1||pt.isPresenting===!1||pt.hasDepthSensing()===!1,gt&&ct.addToRenderList(E,A),this.info.render.frame++,re===!0&&At.beginShadows();let H=S.state.shadowsArray;if(dt.render(H,A,B),re===!0&&At.endShadows(),this.info.autoReset===!0&&this.info.reset(),(G&&T.hasRenderPass())===!1){let Ct=E.opaque,vt=E.transmissive;if(S.setupLights(),B.isArrayCamera){let It=B.cameras;if(vt.length>0)for(let Nt=0,Qt=It.length;Nt<Qt;Nt++){let ne=It[Nt];Xm(Ct,vt,A,ne)}gt&&ct.render(A);for(let Nt=0,Qt=It.length;Nt<Qt;Nt++){let ne=It[Nt];Wm(E,A,ne,ne.viewport)}}else vt.length>0&&Xm(Ct,vt,A,B),gt&&ct.render(A),Wm(E,A,B)}D!==null&&k===0&&(b.updateMultisampleRenderTarget(D),b.updateRenderTargetMipmap(D)),G&&T.end(R),A.isScene===!0&&A.onAfterRender(R,A,B),ht.resetDefaultState(),F=-1,L=null,y.pop(),y.length>0?(S=y[y.length-1],b.setTextureUnits(S.state.textureUnits),re===!0&&At.setGlobalState(R.clippingPlanes,S.state.camera)):S=null,w.pop(),w.length>0?E=w[w.length-1]:E=null,U!==null&&U.renderEnd()};function Wf(A,B,X,G){if(A.visible===!1)return;if(A.layers.test(B.layers)){if(A.isGroup)X=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(B);else if(A.isLightProbeGrid)S.pushLightProbeGrid(A);else if(A.isLight)S.pushLight(A),A.castShadow&&S.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Bt.intersectsSprite(A)){G&&tt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(j);let Ct=ot.update(A),vt=A.material;vt.visible&&E.push(A,Ct,vt,X,tt.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Bt.intersectsObject(A))){let Ct=ot.update(A),vt=A.material;if(G&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),tt.copy(A.boundingSphere.center)):(Ct.boundingSphere===null&&Ct.computeBoundingSphere(),tt.copy(Ct.boundingSphere.center)),tt.applyMatrix4(A.matrixWorld).applyMatrix4(j)),Array.isArray(vt)){let It=Ct.groups;for(let Nt=0,Qt=It.length;Nt<Qt;Nt++){let ne=It[Nt],Ut=vt[ne.materialIndex];Ut&&Ut.visible&&E.push(A,Ct,Ut,X,tt.z,ne)}}else vt.visible&&E.push(A,Ct,vt,X,tt.z,null)}}let Mt=A.children;for(let Ct=0,vt=Mt.length;Ct<vt;Ct++)Wf(Mt[Ct],B,X,G)}function Wm(A,B,X,G){let{opaque:H,transmissive:Mt,transparent:Ct}=A;S.setupLightsView(X),re===!0&&At.setGlobalState(R.clippingPlanes,X),G&&rt.viewport(W.copy(G)),H.length>0&&nh(H,B,X),Mt.length>0&&nh(Mt,B,X),Ct.length>0&&nh(Ct,B,X),rt.buffers.depth.setTest(!0),rt.buffers.depth.setMask(!0),rt.buffers.color.setMask(!0),rt.setPolygonOffset(!1)}function Xm(A,B,X,G){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[G.id]===void 0){let Ut=Pt.has("EXT_color_buffer_half_float")||Pt.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[G.id]=new on(1,1,{generateMipmaps:!0,type:Ut?mi:xn,minFilter:pi,samples:Math.max(4,qt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ie.workingColorSpace})}let Mt=S.state.transmissionRenderTarget[G.id],Ct=G.viewport||W;Mt.setSize(Ct.z*R.transmissionResolutionScale,Ct.w*R.transmissionResolutionScale);let vt=R.getRenderTarget(),It=R.getActiveCubeFace(),Nt=R.getActiveMipmapLevel();R.setRenderTarget(Mt),R.getClearColor(lt),mt=R.getClearAlpha(),mt<1&&R.setClearColor(16777215,.5),R.clear(),gt&&ct.render(X);let Qt=R.toneMapping;R.toneMapping=Kn;let ne=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),S.setupLightsView(G),re===!0&&At.setGlobalState(R.clippingPlanes,G),nh(A,X,G),b.updateMultisampleRenderTarget(Mt),b.updateRenderTargetMipmap(Mt),Pt.has("WEBGL_multisampled_render_to_texture")===!1){let Ut=!1;for(let me=0,Ue=B.length;me<Ue;me++){let Ae=B[me],{object:ge,geometry:je,material:wt,group:Ln}=Ae;if(wt.side===ui&&ge.layers.test(G.layers)){let ae=wt.side;wt.side=ln,wt.needsUpdate=!0,qm(ge,X,G,je,wt,Ln),wt.side=ae,wt.needsUpdate=!0,Ut=!0}}Ut===!0&&(b.updateMultisampleRenderTarget(Mt),b.updateRenderTargetMipmap(Mt))}R.setRenderTarget(vt,It,Nt),R.setClearColor(lt,mt),ne!==void 0&&(G.viewport=ne),R.toneMapping=Qt}function nh(A,B,X){let G=B.isScene===!0?B.overrideMaterial:null;for(let H=0,Mt=A.length;H<Mt;H++){let Ct=A[H],{object:vt,geometry:It,group:Nt}=Ct,Qt=Ct.material;Qt.allowOverride===!0&&G!==null&&(Qt=G),vt.layers.test(X.layers)&&qm(vt,B,X,It,Qt,Nt)}}function qm(A,B,X,G,H,Mt){A.onBeforeRender(R,B,X,G,H,Mt),A.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),H.onBeforeRender(R,B,X,G,A,Mt),H.transparent===!0&&H.side===ui&&H.forceSinglePass===!1?(H.side=ln,H.needsUpdate=!0,R.renderBufferDirect(X,B,G,H,A,Mt),H.side=bi,H.needsUpdate=!0,R.renderBufferDirect(X,B,G,H,A,Mt),H.side=ui):R.renderBufferDirect(X,B,G,H,A,Mt),A.onAfterRender(R,B,X,G,H,Mt)}function ih(A,B,X){B.isScene!==!0&&(B=yt);let G=C.get(A),H=S.state.lights,Mt=S.state.shadowsArray,Ct=H.state.version,vt=ut.getParameters(A,H.state,Mt,B,X,S.state.lightProbeGridArray),It=ut.getProgramCacheKey(vt),Nt=G.programs;G.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?B.environment:null,G.fog=B.fog;let Qt=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;G.envMap=V.get(A.envMap||G.environment,Qt),G.envMapRotation=G.environment!==null&&A.envMap===null?B.environmentRotation:A.envMapRotation,Nt===void 0&&(A.addEventListener("dispose",Ne),Nt=new Map,G.programs=Nt);let ne=Nt.get(It);if(ne!==void 0){if(G.currentProgram===ne&&G.lightsStateVersion===Ct)return Zm(A,vt),ne}else vt.uniforms=ut.getUniforms(A),U!==null&&A.isNodeMaterial&&U.build(A,X,vt),A.onBeforeCompile(vt,R),ne=ut.acquireProgram(vt,It),Nt.set(It,ne),G.uniforms=vt.uniforms;let Ut=G.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ut.clippingPlanes=At.uniform),Zm(A,vt),G.needsLights=jx(A),G.lightsStateVersion=Ct,G.needsLights&&(Ut.ambientLightColor.value=H.state.ambient,Ut.lightProbe.value=H.state.probe,Ut.directionalLights.value=H.state.directional,Ut.directionalLightShadows.value=H.state.directionalShadow,Ut.spotLights.value=H.state.spot,Ut.spotLightShadows.value=H.state.spotShadow,Ut.rectAreaLights.value=H.state.rectArea,Ut.ltc_1.value=H.state.rectAreaLTC1,Ut.ltc_2.value=H.state.rectAreaLTC2,Ut.pointLights.value=H.state.point,Ut.pointLightShadows.value=H.state.pointShadow,Ut.hemisphereLights.value=H.state.hemi,Ut.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ut.spotLightMatrix.value=H.state.spotLightMatrix,Ut.spotLightMap.value=H.state.spotLightMap,Ut.pointShadowMatrix.value=H.state.pointShadowMatrix),G.lightProbeGrid=S.state.lightProbeGridArray.length>0,G.currentProgram=ne,G.uniformsList=null,ne}function Ym(A){if(A.uniformsList===null){let B=A.currentProgram.getUniforms();A.uniformsList=no.seqWithValue(B.seq,A.uniforms)}return A.uniformsList}function Zm(A,B){let X=C.get(A);X.outputColorSpace=B.outputColorSpace,X.batching=B.batching,X.batchingColor=B.batchingColor,X.instancing=B.instancing,X.instancingColor=B.instancingColor,X.instancingMorph=B.instancingMorph,X.skinning=B.skinning,X.morphTargets=B.morphTargets,X.morphNormals=B.morphNormals,X.morphColors=B.morphColors,X.morphTargetsCount=B.morphTargetsCount,X.numClippingPlanes=B.numClippingPlanes,X.numIntersection=B.numClipIntersection,X.vertexAlphas=B.vertexAlphas,X.vertexTangents=B.vertexTangents,X.toneMapping=B.toneMapping}function $x(A,B){if(A.length===0)return null;if(A.length===1)return A[0].texture!==null?A[0]:null;M.setFromMatrixPosition(B.matrixWorld);for(let X=0,G=A.length;X<G;X++){let H=A[X];if(H.texture!==null&&H.boundingBox.containsPoint(M))return H}return null}function Kx(A,B,X,G,H){B.isScene!==!0&&(B=yt),b.resetTextureUnits();let Mt=B.fog,Ct=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?B.environment:null,vt=D===null?R.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:ie.workingColorSpace,It=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Nt=V.get(G.envMap||Ct,It),Qt=G.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,ne=!!X.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ut=!!X.morphAttributes.position,me=!!X.morphAttributes.normal,Ue=!!X.morphAttributes.color,Ae=Kn;G.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Ae=R.toneMapping);let ge=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,je=ge!==void 0?ge.length:0,wt=C.get(G),Ln=S.state.lights;if(re===!0&&(Wt===!0||A!==L)){let ye=A===L&&G.id===F;At.setState(G,A,ye)}let ae=!1;G.version===wt.__version?(wt.needsLights&&wt.lightsStateVersion!==Ln.state.version||wt.outputColorSpace!==vt||H.isBatchedMesh&&wt.batching===!1||!H.isBatchedMesh&&wt.batching===!0||H.isBatchedMesh&&wt.batchingColor===!0&&H.colorTexture===null||H.isBatchedMesh&&wt.batchingColor===!1&&H.colorTexture!==null||H.isInstancedMesh&&wt.instancing===!1||!H.isInstancedMesh&&wt.instancing===!0||H.isSkinnedMesh&&wt.skinning===!1||!H.isSkinnedMesh&&wt.skinning===!0||H.isInstancedMesh&&wt.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&wt.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&wt.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&wt.instancingMorph===!1&&H.morphTexture!==null||wt.envMap!==Nt||G.fog===!0&&wt.fog!==Mt||wt.numClippingPlanes!==void 0&&(wt.numClippingPlanes!==At.numPlanes||wt.numIntersection!==At.numIntersection)||wt.vertexAlphas!==Qt||wt.vertexTangents!==ne||wt.morphTargets!==Ut||wt.morphNormals!==me||wt.morphColors!==Ue||wt.toneMapping!==Ae||wt.morphTargetsCount!==je||!!wt.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(ae=!0):(ae=!0,wt.__version=G.version);let qn=wt.currentProgram;ae===!0&&(qn=ih(G,B,H),U&&G.isNodeMaterial&&U.onUpdateProgram(G,qn,wt));let xi=!1,as=!1,Br=!1,_e=qn.getUniforms(),Fe=wt.uniforms;if(rt.useProgram(qn.program)&&(xi=!0,as=!0,Br=!0),G.id!==F&&(F=G.id,as=!0),wt.needsLights){let ye=$x(S.state.lightProbeGridArray,H);wt.lightProbeGrid!==ye&&(wt.lightProbeGrid=ye,as=!0)}if(xi||L!==A){rt.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),_e.setValue(N,"projectionMatrix",A.projectionMatrix),_e.setValue(N,"viewMatrix",A.matrixWorldInverse);let ls=_e.map.cameraPosition;ls!==void 0&&ls.setValue(N,st.setFromMatrixPosition(A.matrixWorld)),qt.logarithmicDepthBuffer&&_e.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&_e.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),L!==A&&(L=A,as=!0,Br=!0)}if(wt.needsLights&&(Ln.state.directionalShadowMap.length>0&&_e.setValue(N,"directionalShadowMap",Ln.state.directionalShadowMap,b),Ln.state.spotShadowMap.length>0&&_e.setValue(N,"spotShadowMap",Ln.state.spotShadowMap,b),Ln.state.pointShadowMap.length>0&&_e.setValue(N,"pointShadowMap",Ln.state.pointShadowMap,b)),H.isSkinnedMesh){_e.setOptional(N,H,"bindMatrix"),_e.setOptional(N,H,"bindMatrixInverse");let ye=H.skeleton;ye&&(ye.boneTexture===null&&ye.computeBoneTexture(),_e.setValue(N,"boneTexture",ye.boneTexture,b))}H.isBatchedMesh&&(_e.setOptional(N,H,"batchingTexture"),_e.setValue(N,"batchingTexture",H._matricesTexture,b),_e.setOptional(N,H,"batchingIdTexture"),_e.setValue(N,"batchingIdTexture",H._indirectTexture,b),_e.setOptional(N,H,"batchingColorTexture"),H._colorsTexture!==null&&_e.setValue(N,"batchingColorTexture",H._colorsTexture,b));let os=X.morphAttributes;if((os.position!==void 0||os.normal!==void 0||os.color!==void 0)&&Jt.update(H,X,qn),(as||wt.receiveShadow!==H.receiveShadow)&&(wt.receiveShadow=H.receiveShadow,_e.setValue(N,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&B.environment!==null&&(Fe.envMapIntensity.value=B.environmentIntensity),Fe.dfgLUT!==void 0&&(Fe.dfgLUT.value=k1()),as){if(_e.setValue(N,"toneMappingExposure",R.toneMappingExposure),wt.needsLights&&Qx(Fe,Br),Mt&&G.fog===!0&&Y.refreshFogUniforms(Fe,Mt),Y.refreshMaterialUniforms(Fe,G,Ot,kt,S.state.transmissionRenderTarget[A.id]),wt.needsLights&&wt.lightProbeGrid){let ye=wt.lightProbeGrid;Fe.probesSH.value=ye.texture,Fe.probesMin.value.copy(ye.boundingBox.min),Fe.probesMax.value.copy(ye.boundingBox.max),Fe.probesResolution.value.copy(ye.resolution)}no.upload(N,Ym(wt),Fe,b)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(no.upload(N,Ym(wt),Fe,b),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&_e.setValue(N,"center",H.center),_e.setValue(N,"modelViewMatrix",H.modelViewMatrix),_e.setValue(N,"normalMatrix",H.normalMatrix),_e.setValue(N,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){let ye=G.uniformsGroups;for(let ls=0,zr=ye.length;ls<zr;ls++){let Jm=ye[ls];Z.update(Jm,qn),Z.bind(Jm,qn)}}return qn}function Qx(A,B){A.ambientLightColor.needsUpdate=B,A.lightProbe.needsUpdate=B,A.directionalLights.needsUpdate=B,A.directionalLightShadows.needsUpdate=B,A.pointLights.needsUpdate=B,A.pointLightShadows.needsUpdate=B,A.spotLights.needsUpdate=B,A.spotLightShadows.needsUpdate=B,A.rectAreaLights.needsUpdate=B,A.hemisphereLights.needsUpdate=B}function jx(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(A,B,X){let G=C.get(A);G.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),C.get(A.texture).__webglTexture=B,C.get(A.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:X,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,B){let X=C.get(A);X.__webglFramebuffer=B,X.__useDefaultFramebuffer=B===void 0};let tv=N.createFramebuffer();this.setRenderTarget=function(A,B=0,X=0){D=A,z=B,k=X;let G=null,H=!1,Mt=!1;if(A){let vt=C.get(A);if(vt.__useDefaultFramebuffer!==void 0){rt.bindFramebuffer(N.FRAMEBUFFER,vt.__webglFramebuffer),W.copy(A.viewport),q.copy(A.scissor),et=A.scissorTest,rt.viewport(W),rt.scissor(q),rt.setScissorTest(et),F=-1;return}else if(vt.__webglFramebuffer===void 0)b.setupRenderTarget(A);else if(vt.__hasExternalTextures)b.rebindTextures(A,C.get(A.texture).__webglTexture,C.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){let Qt=A.depthTexture;if(vt.__boundDepthTexture!==Qt){if(Qt!==null&&C.has(Qt)&&(A.width!==Qt.image.width||A.height!==Qt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(A)}}let It=A.texture;(It.isData3DTexture||It.isDataArrayTexture||It.isCompressedArrayTexture)&&(Mt=!0);let Nt=C.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(Nt[B])?G=Nt[B][X]:G=Nt[B],H=!0):A.samples>0&&b.useMultisampledRTT(A)===!1?G=C.get(A).__webglMultisampledFramebuffer:Array.isArray(Nt)?G=Nt[X]:G=Nt,W.copy(A.viewport),q.copy(A.scissor),et=A.scissorTest}else W.copy(at).multiplyScalar(Ot).floor(),q.copy(Dt).multiplyScalar(Ot).floor(),et=Vt;if(X!==0&&(G=tv),rt.bindFramebuffer(N.FRAMEBUFFER,G)&&rt.drawBuffers(A,G),rt.viewport(W),rt.scissor(q),rt.setScissorTest(et),H){let vt=C.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+B,vt.__webglTexture,X)}else if(Mt){let vt=B;for(let It=0;It<A.textures.length;It++){let Nt=C.get(A.textures[It]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+It,Nt.__webglTexture,X,vt)}}else if(A!==null&&X!==0){let vt=C.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,vt.__webglTexture,X)}F=-1},this.readRenderTargetPixels=function(A,B,X,G,H,Mt,Ct,vt=0){if(!(A&&A.isWebGLRenderTarget)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let It=C.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It){rt.bindFramebuffer(N.FRAMEBUFFER,It);try{let Nt=A.textures[vt],Qt=Nt.format,ne=Nt.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+vt),!qt.textureFormatReadable(Qt)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qt.textureTypeReadable(ne)){Rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=A.width-G&&X>=0&&X<=A.height-H&&N.readPixels(B,X,G,H,O.convert(Qt),O.convert(ne),Mt)}finally{let Nt=D!==null?C.get(D).__webglFramebuffer:null;rt.bindFramebuffer(N.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(A,B,X,G,H,Mt,Ct,vt=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let It=C.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ct!==void 0&&(It=It[Ct]),It)if(B>=0&&B<=A.width-G&&X>=0&&X<=A.height-H){rt.bindFramebuffer(N.FRAMEBUFFER,It);let Nt=A.textures[vt],Qt=Nt.format,ne=Nt.type;if(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+vt),!qt.textureFormatReadable(Qt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qt.textureTypeReadable(ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ut=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Ut),N.bufferData(N.PIXEL_PACK_BUFFER,Mt.byteLength,N.STREAM_READ),N.readPixels(B,X,G,H,O.convert(Qt),O.convert(ne),0);let me=D!==null?C.get(D).__webglFramebuffer:null;rt.bindFramebuffer(N.FRAMEBUFFER,me);let Ue=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await n0(N,Ue,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Ut),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Mt),N.deleteBuffer(Ut),N.deleteSync(Ue),Mt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,B=null,X=0){let G=Math.pow(2,-X),H=Math.floor(A.image.width*G),Mt=Math.floor(A.image.height*G),Ct=B!==null?B.x:0,vt=B!==null?B.y:0;b.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,X,0,0,Ct,vt,H,Mt),rt.unbindTexture()};let ev=N.createFramebuffer(),nv=N.createFramebuffer();this.copyTextureToTexture=function(A,B,X=null,G=null,H=0,Mt=0){let Ct,vt,It,Nt,Qt,ne,Ut,me,Ue,Ae=A.isCompressedTexture?A.mipmaps[Mt]:A.image;if(X!==null)Ct=X.max.x-X.min.x,vt=X.max.y-X.min.y,It=X.isBox3?X.max.z-X.min.z:1,Nt=X.min.x,Qt=X.min.y,ne=X.isBox3?X.min.z:0;else{let Fe=Math.pow(2,-H);Ct=Math.floor(Ae.width*Fe),vt=Math.floor(Ae.height*Fe),A.isDataArrayTexture?It=Ae.depth:A.isData3DTexture?It=Math.floor(Ae.depth*Fe):It=1,Nt=0,Qt=0,ne=0}G!==null?(Ut=G.x,me=G.y,Ue=G.z):(Ut=0,me=0,Ue=0);let ge=O.convert(B.format),je=O.convert(B.type),wt;B.isData3DTexture?(b.setTexture3D(B,0),wt=N.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(b.setTexture2DArray(B,0),wt=N.TEXTURE_2D_ARRAY):(b.setTexture2D(B,0),wt=N.TEXTURE_2D),rt.activeTexture(N.TEXTURE0),rt.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,B.flipY),rt.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),rt.pixelStorei(N.UNPACK_ALIGNMENT,B.unpackAlignment);let Ln=rt.getParameter(N.UNPACK_ROW_LENGTH),ae=rt.getParameter(N.UNPACK_IMAGE_HEIGHT),qn=rt.getParameter(N.UNPACK_SKIP_PIXELS),xi=rt.getParameter(N.UNPACK_SKIP_ROWS),as=rt.getParameter(N.UNPACK_SKIP_IMAGES);rt.pixelStorei(N.UNPACK_ROW_LENGTH,Ae.width),rt.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Ae.height),rt.pixelStorei(N.UNPACK_SKIP_PIXELS,Nt),rt.pixelStorei(N.UNPACK_SKIP_ROWS,Qt),rt.pixelStorei(N.UNPACK_SKIP_IMAGES,ne);let Br=A.isDataArrayTexture||A.isData3DTexture,_e=B.isDataArrayTexture||B.isData3DTexture;if(A.isDepthTexture){let Fe=C.get(A),os=C.get(B),ye=C.get(Fe.__renderTarget),ls=C.get(os.__renderTarget);rt.bindFramebuffer(N.READ_FRAMEBUFFER,ye.__webglFramebuffer),rt.bindFramebuffer(N.DRAW_FRAMEBUFFER,ls.__webglFramebuffer);for(let zr=0;zr<It;zr++)Br&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,C.get(A).__webglTexture,H,ne+zr),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,C.get(B).__webglTexture,Mt,Ue+zr)),N.blitFramebuffer(Nt,Qt,Ct,vt,Ut,me,Ct,vt,N.DEPTH_BUFFER_BIT,N.NEAREST);rt.bindFramebuffer(N.READ_FRAMEBUFFER,null),rt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(H!==0||A.isRenderTargetTexture||C.has(A)){let Fe=C.get(A),os=C.get(B);rt.bindFramebuffer(N.READ_FRAMEBUFFER,ev),rt.bindFramebuffer(N.DRAW_FRAMEBUFFER,nv);for(let ye=0;ye<It;ye++)Br?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Fe.__webglTexture,H,ne+ye):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Fe.__webglTexture,H),_e?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,os.__webglTexture,Mt,Ue+ye):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,os.__webglTexture,Mt),H!==0?N.blitFramebuffer(Nt,Qt,Ct,vt,Ut,me,Ct,vt,N.COLOR_BUFFER_BIT,N.NEAREST):_e?N.copyTexSubImage3D(wt,Mt,Ut,me,Ue+ye,Nt,Qt,Ct,vt):N.copyTexSubImage2D(wt,Mt,Ut,me,Nt,Qt,Ct,vt);rt.bindFramebuffer(N.READ_FRAMEBUFFER,null),rt.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else _e?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(wt,Mt,Ut,me,Ue,Ct,vt,It,ge,je,Ae.data):B.isCompressedArrayTexture?N.compressedTexSubImage3D(wt,Mt,Ut,me,Ue,Ct,vt,It,ge,Ae.data):N.texSubImage3D(wt,Mt,Ut,me,Ue,Ct,vt,It,ge,je,Ae):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Mt,Ut,me,Ct,vt,ge,je,Ae.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Mt,Ut,me,Ae.width,Ae.height,ge,Ae.data):N.texSubImage2D(N.TEXTURE_2D,Mt,Ut,me,Ct,vt,ge,je,Ae);rt.pixelStorei(N.UNPACK_ROW_LENGTH,Ln),rt.pixelStorei(N.UNPACK_IMAGE_HEIGHT,ae),rt.pixelStorei(N.UNPACK_SKIP_PIXELS,qn),rt.pixelStorei(N.UNPACK_SKIP_ROWS,xi),rt.pixelStorei(N.UNPACK_SKIP_IMAGES,as),Mt===0&&B.generateMipmaps&&N.generateMipmap(wt),rt.unbindTexture()},this.initRenderTarget=function(A){C.get(A).__webglFramebuffer===void 0&&b.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?b.setTextureCube(A,0):A.isData3DTexture?b.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?b.setTexture2DArray(A,0):b.setTexture2D(A,0),rt.unbindTexture()},this.resetState=function(){z=0,k=0,D=null,rt.reset(),ht.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ie._getDrawingBufferColorSpace(t),e.unpackColorSpace=ie._getUnpackColorSpace()}};function es(r){if(r===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return r}function K0(r,t){r.prototype=Object.create(t.prototype),r.prototype.constructor=r,r.__proto__=t}var In={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Xc={duration:.5,overwrite:!1,delay:0},fm,Ke,Se,jn=1e8,ve=1/jn,nm=Math.PI*2,V1=nm/4,G1=0,Q0=Math.sqrt,H1=Math.cos,W1=Math.sin,qe=function(t){return typeof t=="string"},De=function(t){return typeof t=="function"},is=function(t){return typeof t=="number"},Uf=function(t){return typeof t>"u"},Li=function(t){return typeof t=="object"},Pn=function(t){return t!==!1},dm=function(){return typeof window<"u"},wf=function(t){return De(t)||qe(t)},j0=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},un=Array.isArray,X1=/random\([^)]+\)/g,q1=/,\s*/g,H0=/(?:-?\.?\d|\.)+/gi,pm=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Ir=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Jp=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,mm=/[+-]=-?[.\d]+/,Y1=/[^,'"\[\]\s]+/gi,Z1=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Ee,Ii,im,gm,Hn={},Pf={},tx,ex=function(t){return(Pf=ro(t,Hn))&&fn},Ff=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},qc=function(t,e){return!e&&console.warn(t)},nx=function(t,e){return t&&(Hn[t]=e)&&Pf&&(Pf[t]=e)||Hn},Yc=function(){return 0},J1={suppressEvents:!0,isStart:!0,kill:!1},Af={suppressEvents:!0,kill:!1},$1={suppressEvents:!0},_m={},Us=[],sm={},ix,Cn={},$p={},W0=30,Cf=[],xm="",vm=function(t){var e=t[0],n,i;if(Li(e)||De(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=Cf.length;i--&&!Cf[i].targetTest(e););n=Cf[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new bm(t[i],n)))||t.splice(i,1);return t},Fs=function(t){return t._gsap||vm(ti(t))[0]._gsap},ym=function(t,e,n){return(n=t[e])&&De(n)?t[e]():Uf(n)&&t.getAttribute&&t.getAttribute(e)||n},vn=function(t,e){return(t=t.split(",")).forEach(e)||t},Le=function(t){return Math.round(t*1e5)/1e5||0},Te=function(t){return Math.round(t*1e7)/1e7||0},Dr=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},K1=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},If=function(){var t=Us.length,e=Us.slice(0),n,i;for(sm={},Us.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Mm=function(t){return!!(t._initted||t._startAt||t.add)},sx=function(t,e,n,i){Us.length&&!Ke&&If(),t.render(e,n,i||!!(Ke&&e<0&&Mm(t))),Us.length&&!Ke&&If()},rx=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(Y1).length<2?e:qe(t)?t.trim():t},ax=function(t){return t},Wn=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},Q1=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},ro=function(t,e){for(var n in e)t[n]=e[n];return t},X0=function r(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=Li(e[n])?r(t[n]||(t[n]={}),e[n]):e[n]);return t},Df=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},Gc=function(t){var e=t.parent||Ee,n=t.keyframes?Q1(un(t.keyframes)):Wn;if(Pn(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},j1=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},ox=function(t,e,n,i,s){n===void 0&&(n="_first"),i===void 0&&(i="_last");var a=t[i],o;if(s)for(o=e[s];a&&a[s]>o;)a=a._prev;return a?(e._next=a._next,a._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=a,e.parent=e._dp=t,e},Of=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var s=e._prev,a=e._next;s?s._next=a:t[n]===e&&(t[n]=a),a?a._prev=s:t[i]===e&&(t[i]=s),e._next=e._prev=e.parent=null},Os=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Cr=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},tE=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},rm=function(t,e,n,i){return t._startAt&&(Ke?t._startAt.revert(Af):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},eE=function r(t){return!t||t._ts&&r(t.parent)},q0=function(t){return t._repeat?ao(t._tTime,t=t.duration()+t._rDelay)*t:0},ao=function(t,e){var n=Math.floor(t=Te(t/e));return t&&n===t?n-1:n},Lf=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Bf=function(t){return t._end=Te(t._start+(t._tDur/Math.abs(t._ts||t._rts||ve)||0))},zf=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=Te(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Bf(t),n._dirty||Cr(n,t)),t},lx=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=Lf(t.rawTime(),e),(!e._dur||$c(0,e.totalDuration(),n)-e._tTime>ve)&&e.render(n,!0)),Cr(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-ve}},Di=function(t,e,n,i){return e.parent&&Os(e),e._start=Te((is(n)?n:n||t!==Ee?Qn(t,n,e):t._time)+e._delay),e._end=Te(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),ox(t,e,"_first","_last",t._sort?"_start":0),am(e)||(t._recent=e),i||lx(t,e),t._ts<0&&zf(t,t._tTime),t},cx=function(t,e){return(Hn.ScrollTrigger||Ff("scrollTrigger",e))&&Hn.ScrollTrigger.create(e,t)},hx=function(t,e,n,i,s){if(wm(t,e,s),!t._initted)return 1;if(!n&&t._pt&&!Ke&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&ix!==Rn.frame)return Us.push(t),t._lazy=[s,i],1},nE=function r(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||r(e))},am=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},iE=function(t,e,n,i){var s=t.ratio,a=e<0||!e&&(!t._start&&nE(t)&&!(!t._initted&&am(t))||(t._ts<0||t._dp._ts<0)&&!am(t))?0:1,o=t._rDelay,l=0,c,h,f;if(o&&t._repeat&&(l=$c(0,t._tDur,e),h=ao(l,o),t._yoyo&&h&1&&(a=1-a),h!==ao(t._tTime,o)&&(s=1-a,t.vars.repeatRefresh&&t._initted&&t.invalidate())),a!==s||Ke||i||t._zTime===ve||!e&&t._zTime){if(!t._initted&&hx(t,e,i,n,l))return;for(f=t._zTime,t._zTime=e||(n?ve:0),n||(n=e&&!f),t.ratio=a,t._from&&(a=1-a),t._time=0,t._tTime=l,c=t._pt;c;)c.r(a,c.d),c=c._next;e<0&&rm(t,e,n,!0),t._onUpdate&&!n&&Gn(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&Gn(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===a&&(a&&Os(t,1),!n&&!Ke&&(Gn(t,a?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},sE=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},oo=function(t,e,n,i){var s=t._repeat,a=Te(e)||0,o=t._tTime/t._tDur;return o&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=s?s<0?1e10:Te(a*(s+1)+t._rDelay*s):a,o>0&&!i&&zf(t,t._tTime=t._tDur*o),t.parent&&Bf(t),n||Cr(t.parent,t),t},Y0=function(t){return t instanceof hn?Cr(t):oo(t,t._dur)},rE={_start:0,endTime:Yc,totalDuration:Yc},Qn=function r(t,e,n){var i=t.labels,s=t._recent||rE,a=t.duration()>=jn?s.endTime(!1):t._dur,o,l,c;return qe(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",o=e.indexOf("="),l==="<"||l===">"?(o>=0&&(e=e.replace(/=/,"")),(l==="<"?s._start:s.endTime(s._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(o<0?s:n).totalDuration()/100:1)):o<0?(e in i||(i[e]=a),i[e]):(l=parseFloat(e.charAt(o-1)+e.substr(o+1)),c&&n&&(l=l/100*(un(n)?n[0]:n).totalDuration()),o>1?r(t,e.substr(0,o-1),n)+l:a+l)):e==null?a:+e},Hc=function(t,e,n){var i=is(e[1]),s=(i?2:1)+(t<2?0:1),a=e[s],o,l;if(i&&(a.duration=e[1]),a.parent=n,t){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=Pn(l.vars.inherit)&&l.parent;a.immediateRender=Pn(o.immediateRender),t<2?a.runBackwards=1:a.startAt=e[s-1]}return new Be(e[0],a,e[s+1])},Bs=function(t,e){return t||t===0?e(t):e},$c=function(t,e,n){return n<t?t:n>e?e:n},Qe=function(t,e){return!qe(t)||!(e=Z1.exec(t))?"":e[1]},aE=function(t,e,n){return Bs(n,function(i){return $c(t,e,i)})},om=[].slice,ux=function(t,e){return t&&Li(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&Li(t[0]))&&!t.nodeType&&t!==Ii},oE=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var s;return qe(i)&&!e||ux(i,1)?(s=n).push.apply(s,ti(i)):n.push(i)})||n},ti=function(t,e,n){return Se&&!e&&Se.selector?Se.selector(t):qe(t)&&!n&&(im||!lo())?om.call((e||gm).querySelectorAll(t),0):un(t)?oE(t,n):ux(t)?om.call(t,0):t?[t]:[]},lm=function(t){return t=ti(t)[0]||qc("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return ti(e,n.querySelectorAll?n:n===t?qc("Invalid scope")||gm.createElement("div"):t)}},fx=function(t){return t.sort(function(){return .5-Math.random()})},dx=function(t){if(De(t))return t;var e=Li(t)?t:{each:t},n=Rr(e.ease),i=e.from||0,s=parseFloat(e.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=e.axis,h=i,f=i;return qe(i)?h=f={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(h=i[0],f=i[1]),function(u,d,p){var _=(p||e).length,m=a[_],g,x,v,M,E,S,w,y,T;if(!m){if(T=e.grid==="auto"?0:(e.grid||[1,jn])[1],!T){for(w=-jn;w<(w=p[T++].getBoundingClientRect().left)&&T<_;);T<_&&T--}for(m=a[_]=[],g=l?Math.min(T,_)*h-.5:i%T,x=T===jn?0:l?_*f/T-.5:i/T|0,w=0,y=jn,S=0;S<_;S++)v=S%T-g,M=x-(S/T|0),m[S]=E=c?Math.abs(c==="y"?M:v):Q0(v*v+M*M),E>w&&(w=E),E<y&&(y=E);i==="random"&&fx(m),m.max=w-y,m.min=y,m.v=_=(parseFloat(e.amount)||parseFloat(e.each)*(T>_?_-1:c?c==="y"?_/T:T:Math.max(T,_/T))||0)*(i==="edges"?-1:1),m.b=_<0?s-_:s,m.u=Qe(e.amount||e.each)||0,n=n&&_<0?yE(n):n}return _=(m[u]-m.min)/m.max||0,Te(m.b+(n?n(_):_)*m.v)+m.u}},cm=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=Te(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(is(n)?0:Qe(n))}},px=function(t,e){var n=un(t),i,s;return!n&&Li(t)&&(i=n=t.radius||jn,t.values?(t=ti(t.values),(s=!is(t[0]))&&(i*=i)):t=cm(t.increment)),Bs(e,n?De(t)?function(a){return s=t(a),Math.abs(s-a)<=i?s:a}:function(a){for(var o=parseFloat(s?a.x:a),l=parseFloat(s?a.y:0),c=jn,h=0,f=t.length,u,d;f--;)s?(u=t[f].x-o,d=t[f].y-l,u=u*u+d*d):u=Math.abs(t[f]-o),u<c&&(c=u,h=f);return h=!i||c<=i?t[h]:a,s||h===a||is(a)?h:h+Qe(a)}:cm(t))},mx=function(t,e,n,i){return Bs(un(t)?!e:n===!0?!!(n=0):!i,function(){return un(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},lE=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(s,a){return a(s)},i)}},cE=function(t,e){return function(n){return t(parseFloat(n))+(e||Qe(n))}},hE=function(t,e,n){return _x(t,e,0,1,n)},gx=function(t,e,n){return Bs(n,function(i){return t[~~e(i)]})},uE=function r(t,e,n){var i=e-t;return un(t)?gx(t,r(0,t.length),e):Bs(n,function(s){return(i+(s-t)%i)%i+t})},fE=function r(t,e,n){var i=e-t,s=i*2;return un(t)?gx(t,r(0,t.length-1),e):Bs(n,function(a){return a=(s+(a-t)%s)%s||0,t+(a>i?s-a:a)})},co=function(t){return t.replace(X1,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(q1);return mx(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},_x=function(t,e,n,i,s){var a=e-t,o=i-n;return Bs(s,function(l){return n+((l-t)/a*o||0)})},dE=function r(t,e,n,i){var s=isNaN(t+e)?0:function(d){return(1-d)*t+d*e};if(!s){var a=qe(t),o={},l,c,h,f,u;if(n===!0&&(i=1)&&(n=null),a)t={p:t},e={p:e};else if(un(t)&&!un(e)){for(h=[],f=t.length,u=f-2,c=1;c<f;c++)h.push(r(t[c-1],t[c]));f--,s=function(p){p*=f;var _=Math.min(u,~~p);return h[_](p-_)},n=e}else i||(t=ro(un(t)?[]:{},t));if(!h){for(l in e)Tm.call(o,t,l,"get",e[l]);s=function(p){return Rm(p,o)||(a?t.p:t)}}}return Bs(n,s)},Z0=function(t,e,n){var i=t.labels,s=jn,a,o,l;for(a in i)o=i[a]-e,o<0==!!n&&o&&s>(o=Math.abs(o))&&(l=a,s=o);return l},Gn=function(t,e,n){var i=t.vars,s=i[e],a=Se,o=t._ctx,l,c,h;if(s)return l=i[e+"Params"],c=i.callbackScope||t,n&&Us.length&&If(),o&&(Se=o),h=l?s.apply(c,l):s.call(c),Se=a,h},kc=function(t){return Os(t),t.scrollTrigger&&t.scrollTrigger.kill(!!Ke),t.progress()<1&&Gn(t,"onInterrupt"),t},so,xx=[],vx=function(t){if(t)if(t=!t.name&&t.default||t,dm()||t.headless){var e=t.name,n=De(t),i=e&&!n&&t.init?function(){this._props=[]}:t,s={init:Yc,render:Rm,add:Tm,kill:PE,modifier:RE,rawVars:0},a={targetTest:0,get:0,getSetter:kf,aliases:{},register:0};if(lo(),t!==i){if(Cn[e])return;Wn(i,Wn(Df(t,s),a)),ro(i.prototype,ro(s,Df(t,a))),Cn[i.prop=e]=i,t.targetTest&&(Cf.push(i),_m[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}nx(e,i),t.register&&t.register(fn,i,yn)}else xx.push(t)},xe=255,Vc={aqua:[0,xe,xe],lime:[0,xe,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,xe],navy:[0,0,128],white:[xe,xe,xe],olive:[128,128,0],yellow:[xe,xe,0],orange:[xe,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[xe,0,0],pink:[xe,192,203],cyan:[0,xe,xe],transparent:[xe,xe,xe,0]},Kp=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*xe+.5|0},yx=function(t,e,n){var i=t?is(t)?[t>>16,t>>8&xe,t&xe]:0:Vc.black,s,a,o,l,c,h,f,u,d,p;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),Vc[t])i=Vc[t];else if(t.charAt(0)==="#"){if(t.length<6&&(s=t.charAt(1),a=t.charAt(2),o=t.charAt(3),t="#"+s+s+a+a+o+o+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&xe,i&xe,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&xe,t&xe]}else if(t.substr(0,3)==="hsl"){if(i=p=t.match(H0),!e)l=+i[0]%360/360,c=+i[1]/100,h=+i[2]/100,a=h<=.5?h*(c+1):h+c-h*c,s=h*2-a,i.length>3&&(i[3]*=1),i[0]=Kp(l+1/3,s,a),i[1]=Kp(l,s,a),i[2]=Kp(l-1/3,s,a);else if(~t.indexOf("="))return i=t.match(pm),n&&i.length<4&&(i[3]=1),i}else i=t.match(H0)||Vc.transparent;i=i.map(Number)}return e&&!p&&(s=i[0]/xe,a=i[1]/xe,o=i[2]/xe,f=Math.max(s,a,o),u=Math.min(s,a,o),h=(f+u)/2,f===u?l=c=0:(d=f-u,c=h>.5?d/(2-f-u):d/(f+u),l=f===s?(a-o)/d+(a<o?6:0):f===a?(o-s)/d+2:(s-a)/d+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(h*100+.5)),n&&i.length<4&&(i[3]=1),i},Mx=function(t){var e=[],n=[],i=-1;return t.split(ns).forEach(function(s){var a=s.match(Ir)||[];e.push.apply(e,a),n.push(i+=a.length+1)}),e.c=n,e},J0=function(t,e,n){var i="",s=(t+i).match(ns),a=e?"hsla(":"rgba(",o=0,l,c,h,f;if(!s)return t;if(s=s.map(function(u){return(u=yx(u,e,1))&&a+(e?u[0]+","+u[1]+"%,"+u[2]+"%,"+u[3]:u.join(","))+")"}),n&&(h=Mx(t),l=n.c,l.join(i)!==h.c.join(i)))for(c=t.replace(ns,"1").split(Ir),f=c.length-1;o<f;o++)i+=c[o]+(~l.indexOf(o)?s.shift()||a+"0,0,0,0)":(h.length?h:s.length?s:n).shift());if(!c)for(c=t.split(ns),f=c.length-1;o<f;o++)i+=c[o]+s[o];return i+c[f]},ns=(function(){var r="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in Vc)r+="|"+t+"\\b";return new RegExp(r+")","gi")})(),pE=/hsl[a]?\(/,Sm=function(t){var e=t.join(" "),n;if(ns.lastIndex=0,ns.test(e))return n=pE.test(e),t[1]=J0(t[1],n),t[0]=J0(t[0],n,Mx(t[1])),!0},Zc,Rn=(function(){var r=Date.now,t=500,e=33,n=r(),i=n,s=1e3/240,a=s,o=[],l,c,h,f,u,d,p=function _(m){var g=r()-i,x=m===!0,v,M,E,S;if((g>t||g<0)&&(n+=g-e),i+=g,E=i-n,v=E-a,(v>0||x)&&(S=++f.frame,u=E-f.time*1e3,f.time=E=E/1e3,a+=v+(v>=s?4:s-v),M=1),x||(l=c(_)),M)for(d=0;d<o.length;d++)o[d](E,u,S,m)};return f={time:0,frame:0,tick:function(){p(!0)},deltaRatio:function(m){return u/(1e3/(m||60))},wake:function(){tx&&(!im&&dm()&&(Ii=im=window,gm=Ii.document||{},Hn.gsap=fn,(Ii.gsapVersions||(Ii.gsapVersions=[])).push(fn.version),ex(Pf||Ii.GreenSockGlobals||!Ii.gsap&&Ii||{}),xx.forEach(vx)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&f.sleep(),c=h||function(m){return setTimeout(m,a-f.time*1e3+1|0)},Zc=1,p(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),Zc=0,c=Yc},lagSmoothing:function(m,g){t=m||1/0,e=Math.min(g||33,t)},fps:function(m){s=1e3/(m||240),a=f.time*1e3+s},add:function(m,g,x){var v=g?function(M,E,S,w){m(M,E,S,w),f.remove(v)}:m;return f.remove(m),o[x?"unshift":"push"](v),lo(),v},remove:function(m,g){~(g=o.indexOf(m))&&o.splice(g,1)&&d>=g&&d--},_listeners:o},f})(),lo=function(){return!Zc&&Rn.wake()},se={},mE=/^[\d.\-M][\d.\-,\s]/,gE=/["']/g,_E=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],s=1,a=n.length,o,l,c;s<a;s++)l=n[s],o=s!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),e[i]=isNaN(c)?c.replace(gE,"").trim():+c,i=l.substr(o+1).trim();return e},xE=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},vE=function(t){var e=(t+"").split("("),n=se[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[_E(e[1])]:xE(t).split(",").map(rx)):se._CE&&mE.test(t)?se._CE("",t):n},yE=function(t){return function(e){return 1-t(1-e)}},Rr=function(t,e){return t&&(De(t)?t:se[t]||vE(t))||e},Lr=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var s={easeIn:e,easeOut:n,easeInOut:i},a;return vn(t,function(o){se[o]=Hn[o]=s,se[a=o.toLowerCase()]=n;for(var l in s)se[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=se[o+"."+l]=s[l]}),s},Sx=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},Qp=function r(t,e,n){var i=e>=1?e:1,s=(n||(t?.3:.45))/(e<1?e:1),a=s/nm*(Math.asin(1/i)||0),o=function(h){return h===1?1:i*Math.pow(2,-10*h)*W1((h-a)*s)+1},l=t==="out"?o:t==="in"?function(c){return 1-o(1-c)}:Sx(o);return s=nm/s,l.config=function(c,h){return r(t,c,h)},l},jp=function r(t,e){e===void 0&&(e=1.70158);var n=function(a){return a?--a*a*((e+1)*a+e)+1:0},i=t==="out"?n:t==="in"?function(s){return 1-n(1-s)}:Sx(n);return i.config=function(s){return r(t,s)},i};vn("Linear,Quad,Cubic,Quart,Quint,Strong",function(r,t){var e=t<5?t+1:t;Lr(r+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});se.Linear.easeNone=se.none=se.Linear.easeIn;Lr("Elastic",Qp("in"),Qp("out"),Qp());(function(r,t){var e=1/t,n=2*e,i=2.5*e,s=function(o){return o<e?r*o*o:o<n?r*Math.pow(o-1.5/t,2)+.75:o<i?r*(o-=2.25/t)*o+.9375:r*Math.pow(o-2.625/t,2)+.984375};Lr("Bounce",function(a){return 1-s(1-a)},s)})(7.5625,2.75);Lr("Expo",function(r){return Math.pow(2,10*(r-1))*r+r*r*r*r*r*r*(1-r)});Lr("Circ",function(r){return-(Q0(1-r*r)-1)});Lr("Sine",function(r){return r===1?1:-H1(r*V1)+1});Lr("Back",jp("in"),jp("out"),jp());se.SteppedEase=se.steps=Hn.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),s=e?1:0,a=1-ve;return function(o){return((i*$c(0,a,o)|0)+s)*n}}};Xc.ease=se["quad.out"];vn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(r){return xm+=r+","+r+"Params,"});var bm=function(t,e){this.id=G1++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:ym,this.set=e?e.getSetter:kf},Jc=(function(){function r(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,oo(this,+e.duration,1,1),this.data=e.data,Se&&(this._ctx=Se,Se.data.push(this)),Zc||Rn.wake()}var t=r.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,oo(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(lo(),!arguments.length)return this._tTime;var s=this._dp;if(s&&s.smoothChildTiming&&this._ts){for(zf(this,n),!s._dp||s.parent||lx(s,this);s&&s.parent;)s.parent._time!==s._start+(s._ts>=0?s._tTime/s._ts:(s.totalDuration()-s._tTime)/-s._ts)&&s.totalTime(s._tTime,!0),s=s.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&Di(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===ve||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),sx(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+q0(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+q0(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var s=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*s,i):this._repeat?ao(this._tTime,s)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-ve?0:this._rts;if(this._rts===n)return this;var s=this.parent&&this._ts?Lf(this.parent._time,this):this._tTime;return this._rts=+n||0,this._ts=this._ps||n===-ve?0:this._rts,this.totalTime($c(-Math.abs(this._delay),this.totalDuration(),s),i!==!1),Bf(this),tE(this)},t.paused=function(n){return arguments.length?(this._ps!==n&&(this._ps=n,n?(this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0):(lo(),this._ts=this._rts,this.totalTime(this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,this.progress()===1&&Math.abs(this._zTime)!==ve&&(this._tTime-=ve)))),this):this._ps},t.startTime=function(n){if(arguments.length){this._start=Te(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&Di(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(Pn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?Lf(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=$1);var i=Ke;return Ke=n,Mm(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),Ke=i,this},t.globalTime=function(n){for(var i=this,s=arguments.length?n:i.rawTime();i;)s=i._start+s/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):s},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,Y0(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,Y0(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(Qn(this,n),Pn(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,Pn(i)),this._dur||(this._zTime=-ve),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-ve:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-ve,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,s;return!!(!n||this._ts&&this._initted&&n.isActive()&&(s=n.rawTime(!0))>=i&&s<this.endTime(!0)-ve)},t.eventCallback=function(n,i,s){var a=this.vars;return arguments.length>1?(i?(a[n]=i,s&&(a[n+"Params"]=s),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},t.then=function(n){var i=this,s=i._prom;return new Promise(function(a){var o=De(n)?n:ax,l=function(){var h=i.then;i.then=null,s&&s(),De(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=h),a(o),i.then=h};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){kc(this)},r})();Wn(Jc.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-ve,_prom:0,_ps:!1,_rts:1});var hn=(function(r){K0(t,r);function t(n,i){var s;return n===void 0&&(n={}),s=r.call(this,n)||this,s.labels={},s.smoothChildTiming=!!n.smoothChildTiming,s.autoRemoveChildren=!!n.autoRemoveChildren,s._sort=Pn(n.sortChildren),Ee&&Di(n.parent||Ee,es(s),i),n.reversed&&s.reverse(),n.paused&&s.paused(!0),n.scrollTrigger&&cx(es(s),n.scrollTrigger),s}var e=t.prototype;return e.to=function(i,s,a){return Hc(0,arguments,this),this},e.from=function(i,s,a){return Hc(1,arguments,this),this},e.fromTo=function(i,s,a,o){return Hc(2,arguments,this),this},e.set=function(i,s,a){return s.duration=0,s.parent=this,Gc(s).repeatDelay||(s.repeat=0),s.immediateRender=!!s.immediateRender,new Be(i,s,Qn(this,a),1),this},e.call=function(i,s,a){return Di(this,Be.delayedCall(0,i,s),a)},e.staggerTo=function(i,s,a,o,l,c,h){return a.duration=s,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=h,a.parent=this,new Be(i,a,Qn(this,l)),this},e.staggerFrom=function(i,s,a,o,l,c,h){return a.runBackwards=1,Gc(a).immediateRender=Pn(a.immediateRender),this.staggerTo(i,s,a,o,l,c,h)},e.staggerFromTo=function(i,s,a,o,l,c,h,f){return o.startAt=a,Gc(o).immediateRender=Pn(o.immediateRender),this.staggerTo(i,s,o,l,c,h,f)},e.render=function(i,s,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=i<=0?0:Te(i),f=this._zTime<0!=i<0&&(this._initted||!c),u,d,p,_,m,g,x,v,M,E,S,w;if(this!==Ee&&h>l&&i>=0&&(h=l),h!==this._tTime||a||f){if(o!==this._time&&c&&(h+=this._time-o,i+=this._time-o),u=h,M=this._start,v=this._ts,g=!v,f&&(c||(o=this._zTime),(i||!s)&&(this._zTime=i)),this._repeat){if(S=this._yoyo,m=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(m*100+i,s,a);if(u=Te(h%m),h===l?(_=this._repeat,u=c):(E=Te(h/m),_=~~E,_&&_===E&&(u=c,_--),u>c&&(u=c)),E=ao(this._tTime,m),!o&&this._tTime&&E!==_&&this._tTime-E*m-this._dur<=0&&(E=_),S&&_&1&&(u=c-u,w=1),_!==E&&!this._lock){var y=S&&E&1,T=y===(S&&_&1);if(_<E&&(y=!y),o=y?0:h%c?c:h,this._lock=1,this.render(o||(w?0:Te(_*m)),s,!c)._lock=0,this._tTime=h,!s&&this.parent&&Gn(this,"onRepeat"),this.vars.repeatRefresh&&!w&&(this.invalidate()._lock=1,E=_),o&&o!==this._time||g!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,T&&(this._lock=2,o=y?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!w&&this.invalidate()),this._lock=0,!this._ts&&!g)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(x=sE(this,Te(o),Te(u)),x&&(h-=u-(u=x._start))),this._tTime=h,this._time=u,this._act=!!v,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&h&&c&&!s&&!E&&(Gn(this,"onStart"),this._tTime!==h))return this;if(u>=o&&i>=0)for(d=this._first;d;){if(p=d._next,(d._act||u>=d._start)&&d._ts&&x!==d){if(d.parent!==this)return this.render(i,s,a);if(d.render(d._ts>0?(u-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(u-d._start)*d._ts,s,a),u!==this._time||!this._ts&&!g){x=0,p&&(h+=this._zTime=-ve);break}}d=p}else{d=this._last;for(var R=i<0?i:u;d;){if(p=d._prev,(d._act||R<=d._end)&&d._ts&&x!==d){if(d.parent!==this)return this.render(i,s,a);if(d.render(d._ts>0?(R-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(R-d._start)*d._ts,s,a||Ke&&Mm(d)),u!==this._time||!this._ts&&!g){x=0,p&&(h+=this._zTime=R?-ve:ve);break}}d=p}}if(x&&!s&&(this.pause(),x.render(u>=o?0:-ve)._zTime=u>=o?1:-1,this._ts))return this._start=M,Bf(this),this.render(i,s,a);this._onUpdate&&!s&&Gn(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&o)&&(M===this._start||Math.abs(v)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&Os(this,1),!s&&!(i<0&&!o)&&(h||o||!l)&&(Gn(this,h===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,s){var a=this;if(is(s)||(s=Qn(this,s,i)),!(i instanceof Jc)){if(un(i))return i.forEach(function(o){return a.add(o,s)}),this;if(qe(i))return this.addLabel(i,s);if(De(i))i=Be.delayedCall(0,i);else return this}return this!==i?Di(this,i,s):this},e.getChildren=function(i,s,a,o){i===void 0&&(i=!0),s===void 0&&(s=!0),a===void 0&&(a=!0),o===void 0&&(o=-jn);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof Be?s&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,s,a)))),c=c._next;return l},e.getById=function(i){for(var s=this.getChildren(1,1,1),a=s.length;a--;)if(s[a].vars.id===i)return s[a]},e.remove=function(i){return qe(i)?this.removeLabel(i):De(i)?this.killTweensOf(i):(i.parent===this&&Of(this,i),i===this._recent&&(this._recent=this._last),Cr(this))},e.totalTime=function(i,s){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Te(Rn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),r.prototype.totalTime.call(this,i,s),this._forcing=0,this):this._tTime},e.addLabel=function(i,s){return this.labels[i]=Qn(this,s),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,s,a){var o=Be.delayedCall(0,s||Yc,a);return o.data="isPause",this._hasPause=1,Di(this,o,Qn(this,i))},e.removePause=function(i){var s=this._first;for(i=Qn(this,i);s;)s._start===i&&s.data==="isPause"&&Os(s),s=s._next},e.killTweensOf=function(i,s,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)Ns!==o[l]&&o[l].kill(i,s);return this},e.getTweensOf=function(i,s){for(var a=[],o=ti(i),l=this._first,c=is(s),h;l;)l instanceof Be?K1(l._targets,o)&&(c?(!Ns||l._initted&&l._ts)&&l.globalTime(0)<=s&&l.globalTime(l.totalDuration())>s:!s||l.isActive())&&a.push(l):(h=l.getTweensOf(o,s)).length&&a.push.apply(a,h),l=l._next;return a},e.tweenTo=function(i,s){s=s||{};var a=this,o=Qn(a,i),l=s,c=l.startAt,h=l.onStart,f=l.onStartParams,u=l.immediateRender,d,p=Be.to(a,Wn({ease:s.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||ve,onStart:function(){if(a.pause(),!d){var m=s.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());p._dur!==m&&oo(p,m,0,1).render(p._time,!0,!0),d=1}h&&h.apply(p,f||[])}},s));return u?p.render(0):p},e.tweenFromTo=function(i,s,a){return this.tweenTo(s,Wn({startAt:{time:Qn(this,i)}},a))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),Z0(this,Qn(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),Z0(this,Qn(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+ve)},e.shiftChildren=function(i,s,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=Te(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(s)for(c in l)l[c]>=a&&(l[c]+=i);return Cr(this)},e.invalidate=function(i){var s=this._first;for(this._lock=0;s;)s.invalidate(i),s=s._next;return r.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var s=this._first,a;s;)a=s._next,this.remove(s),s=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),Cr(this)},e.totalDuration=function(i){var s=0,a=this,o=a._last,l=jn,c,h,f;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(f=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),h=o._start,h>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,Di(a,o,h-o._delay,1)._lock=0):l=h,h<0&&o._ts&&(s-=h,(!f&&!a._dp||f&&f.smoothChildTiming)&&(a._start+=Te(h/a._ts),a._time-=h,a._tTime-=h),a.shiftChildren(-h,!1,-1/0),l=0),o._end>s&&o._ts&&(s=o._end),o=c;oo(a,a===Ee&&a._time>s?a._time:s,1,1),a._dirty=0}return a._tDur},t.updateRoot=function(i){if(Ee._ts&&(sx(Ee,Lf(i,Ee)),ix=Rn.frame),Rn.frame>=W0){W0+=In.autoSleep||120;var s=Ee._first;if((!s||!s._ts)&&In.autoSleep&&Rn._listeners.length<2){for(;s&&!s._ts;)s=s._next;s||Rn.sleep()}}},t})(Jc);Wn(hn.prototype,{_lock:0,_hasPause:0,_forcing:0});var ME=function(t,e,n,i,s,a,o){var l=new yn(this._pt,t,e,0,1,Cm,null,s),c=0,h=0,f,u,d,p,_,m,g,x;for(l.b=n,l.e=i,n+="",i+="",(g=~i.indexOf("random("))&&(i=co(i)),a&&(x=[n,i],a(x,t,e),n=x[0],i=x[1]),u=n.match(Jp)||[];f=Jp.exec(i);)p=f[0],_=i.substring(c,f.index),d?d=(d+1)%5:_.substr(-5)==="rgba("&&(d=1),p!==u[h++]&&(m=parseFloat(u[h-1])||0,l._pt={_next:l._pt,p:_||h===1?_:",",s:m,c:p.charAt(1)==="="?Dr(m,p)-m:parseFloat(p)-m,m:d&&d<4?Math.round:0},c=Jp.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(mm.test(i)||g)&&(l.e=0),this._pt=l,l},Tm=function(t,e,n,i,s,a,o,l,c,h){De(i)&&(i=i(s||0,t,a));var f=t[e],u=n!=="get"?n:De(f)?c?t[e.indexOf("set")||!De(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():f,d=De(f)?c?wE:Ex:Am,p;if(qe(i)&&(~i.indexOf("random(")&&(i=co(i)),i.charAt(1)==="="&&(p=Dr(u,i)+(Qe(u)||0),(p||p===0)&&(i=p))),!h||u!==i||hm)return!isNaN(u*i)&&i!==""?(p=new yn(this._pt,t,e,+u||0,i-(u||0),typeof f=="boolean"?CE:wx,0,d),c&&(p.fp=c),o&&p.modifier(o,this,t),this._pt=p):(!f&&!(e in t)&&Ff(e,i),ME.call(this,t,e,u,i,d,l||In.stringFilter,c))},SE=function(t,e,n,i,s){if(De(t)&&(t=Wc(t,s,e,n,i)),!Li(t)||t.style&&t.nodeType||un(t)||j0(t))return qe(t)?Wc(t,s,e,n,i):t;var a={},o;for(o in t)a[o]=Wc(t[o],s,e,n,i);return a},Em=function(t,e,n,i,s,a){var o,l,c,h;if(Cn[t]&&(o=new Cn[t]).init(s,o.rawVars?e[t]:SE(e[t],i,s,a,n),n,i,a)!==!1&&(n._pt=l=new yn(n._pt,s,t,0,1,o.render,o,0,o.priority),n!==so))for(c=n._ptLookup[n._targets.indexOf(s)],h=o._props.length;h--;)c[o._props[h]]=l;return o},Ns,hm,wm=function r(t,e,n){var i=t.vars,s=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,h=i.runBackwards,f=i.yoyoEase,u=i.keyframes,d=i.autoRevert,p=t._dur,_=t._startAt,m=t._targets,g=t.parent,x=g&&g.data==="nested"?g.vars.targets:m,v=t._overwrite==="auto"&&!fm,M=t.timeline,E=i.easeReverse||f,S,w,y,T,R,P,U,z,k,D,F,L,W;if(M&&(!u||!s)&&(s="none"),t._ease=Rr(s,Xc.ease),t._rEase=E&&(Rr(E)||t._ease),t._from=!M&&!!i.runBackwards,t._from&&(t.ratio=1),!M||u&&!i.stagger){if(z=m[0]?Fs(m[0]).harness:0,L=z&&i[z.prop],S=Df(i,_m),_&&(_._zTime<0&&_.progress(1),e<0&&h&&o&&!d?_.render(-1,!0):_.revert(h&&p?Af:J1),_._lazy=0),a){if(Os(t._startAt=Be.set(m,Wn({data:"isStart",overwrite:!1,parent:g,immediateRender:!0,lazy:!_&&Pn(l),startAt:null,delay:0,onUpdate:c&&function(){return Gn(t,"onUpdate")},stagger:0},a))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ke||!o&&!d)&&t._startAt.revert(Af),o&&p&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(h&&p&&!_){if(e&&(o=!1),y=Wn({overwrite:!1,data:"isFromStart",lazy:o&&!_&&Pn(l),immediateRender:o,stagger:0,parent:g},S),L&&(y[z.prop]=L),Os(t._startAt=Be.set(m,y)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Ke?t._startAt.revert(Af):t._startAt.render(-1,!0)),t._zTime=e,!o)r(t._startAt,ve,ve);else if(!e)return}for(t._pt=t._ptCache=0,l=p&&Pn(l)||l&&!p,w=0;w<m.length;w++){if(R=m[w],U=R._gsap||vm(m)[w]._gsap,t._ptLookup[w]=D={},sm[U.id]&&Us.length&&If(),F=x===m?w:x.indexOf(R),z&&(k=new z).init(R,L||S,t,F,x)!==!1&&(t._pt=T=new yn(t._pt,R,k.name,0,1,k.render,k,0,k.priority),k._props.forEach(function(q){D[q]=T}),k.priority&&(P=1)),!z||L)for(y in S)Cn[y]&&(k=Em(y,S,t,F,R,x))?k.priority&&(P=1):D[y]=T=Tm.call(t,R,y,"get",S[y],F,x,0,i.stringFilter);t._op&&t._op[w]&&t.kill(R,t._op[w]),v&&t._pt&&(Ns=t,Ee.killTweensOf(R,D,t.globalTime(e)),W=!t.parent,Ns=0),t._pt&&l&&(sm[U.id]=1)}P&&Pm(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!W,u&&e<=0&&M.render(jn,!0,!0)},bE=function(t,e,n,i,s,a,o,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],h,f,u,d;if(!c)for(c=t._ptCache[e]=[],u=t._ptLookup,d=t._targets.length;d--;){if(h=u[d][e],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==e&&h.fp!==e;)h=h._next;if(!h)return hm=1,t.vars[e]="+=0",wm(t,o),hm=0,l?qc(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(h)}for(d=c.length;d--;)f=c[d],h=f._pt||f,h.s=(i||i===0)&&!s?i:h.s+(i||0)+a*h.c,h.c=n-h.s,f.e&&(f.e=Le(n)+Qe(f.e)),f.b&&(f.b=h.s+Qe(f.b))},TE=function(t,e){var n=t[0]?Fs(t[0]).harness:0,i=n&&n.aliases,s,a,o,l;if(!i)return e;s=ro({},e);for(a in i)if(a in s)for(l=i[a].split(","),o=l.length;o--;)s[l[o]]=s[a];return s},EE=function(t,e,n,i){var s=e.ease||i||"power1.inOut",a,o;if(un(e))o=n[t]||(n[t]=[]),e.forEach(function(l,c){return o.push({t:c/(e.length-1)*100,v:l,e:s})});else for(a in e)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(t),v:e[a],e:s})},Wc=function(t,e,n,i,s){return De(t)?t.call(e,n,i,s):qe(t)&&~t.indexOf("random(")?co(t):t},bx=xm+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",Tx={};vn(bx+",id,stagger,delay,duration,paused,scrollTrigger",function(r){return Tx[r]=1});var Be=(function(r){K0(t,r);function t(n,i,s,a){var o;typeof i=="number"&&(s.duration=i,i=s,s=null),o=r.call(this,a?i:Gc(i))||this;var l=o.vars,c=l.duration,h=l.delay,f=l.immediateRender,u=l.stagger,d=l.overwrite,p=l.keyframes,_=l.defaults,m=l.scrollTrigger,g=i.parent||Ee,x=(un(n)||j0(n)?is(n[0]):"length"in i)?[n]:ti(n),v,M,E,S,w,y,T,R;if(o._targets=x.length?vm(x):qc("GSAP target "+n+" not found. https://gsap.com",!In.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,p||u||wf(c)||wf(h)){i=o.vars;var P=i.easeReverse||i.yoyoEase;if(v=o.timeline=new hn({data:"nested",defaults:_||{},targets:g&&g.data==="nested"?g.vars.targets:x}),v.kill(),v.parent=v._dp=es(o),v._start=0,u||wf(c)||wf(h)){if(S=x.length,T=u&&dx(u),Li(u))for(w in u)~bx.indexOf(w)&&(R||(R={}),R[w]=u[w]);for(M=0;M<S;M++)E=Df(i,Tx),E.stagger=0,P&&(E.easeReverse=P),R&&ro(E,R),y=x[M],E.duration=+Wc(c,es(o),M,y,x),E.delay=(+Wc(h,es(o),M,y,x)||0)-o._delay,!u&&S===1&&E.delay&&(o._delay=h=E.delay,o._start+=h,E.delay=0),v.to(y,E,T?T(M,y,x):0),v._ease=se.none;v.duration()?c=h=0:o.timeline=0}else if(p){Gc(Wn(v.vars.defaults,{ease:"none"})),v._ease=Rr(p.ease||i.ease||"none");var U=0,z,k,D;if(un(p))p.forEach(function(F){return v.to(x,F,">")}),v.duration();else{E={};for(w in p)w==="ease"||w==="easeEach"||EE(w,p[w],E,p.easeEach);for(w in E)for(z=E[w].sort(function(F,L){return F.t-L.t}),U=0,M=0;M<z.length;M++)k=z[M],D={ease:k.e,duration:(k.t-(M?z[M-1].t:0))/100*c},D[w]=k.v,v.to(x,D,U),U+=D.duration;v.duration()<c&&v.to({},{duration:c-v.duration()})}}c||o.duration(c=v.duration())}else o.timeline=0;return d===!0&&!fm&&(Ns=es(o),Ee.killTweensOf(x),Ns=0),Di(g,es(o),s),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(f||!c&&!p&&o._start===Te(g._time)&&Pn(f)&&eE(es(o))&&g.data!=="nested")&&(o._tTime=-ve,o.render(Math.max(0,-h)||0)),m&&cx(es(o),m),o}var e=t.prototype;return e.render=function(i,s,a){var o=this._time,l=this._tDur,c=this._dur,h=i<0,f=i>l-ve&&!h?l:i<ve?0:i,u,d,p,_,m,g,x,v;if(!c)iE(this,i,s,a);else if(f!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(u=f,v=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(_*100+i,s,a);if(u=Te(f%_),f===l?(p=this._repeat,u=c):(m=Te(f/_),p=~~m,p&&p===m?(u=c,p--):u>c&&(u=c)),g=this._yoyo&&p&1,g&&(u=c-u),m=ao(this._tTime,_),u===o&&!a&&this._initted&&p===m)return this._tTime=f,this;p!==m&&this.vars.repeatRefresh&&!g&&!this._lock&&u!==_&&this._initted&&(this._lock=a=1,this.render(Te(_*p),!0).invalidate()._lock=0)}if(!this._initted){if(hx(this,h?i:u,a,s,f))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&p!==m))return this;if(c!==this._dur)return this.render(i,s,a)}if(this._rEase){var M=u<o;if(M!==this._inv){var E=M?o:c-o;this._inv=M,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=E?(M?-1:1)/E:0,this._invScale=M?-this.ratio:1-this.ratio,this._invEase=M?this._rEase:this._ease}this.ratio=x=this._invRatio+this._invScale*this._invEase((u-this._invTime)*this._invRecip)}else this.ratio=x=this._ease(u/c);if(this._from&&(this.ratio=x=1-x),this._tTime=f,this._time=u,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&f&&!s&&!m&&(Gn(this,"onStart"),this._tTime!==f))return this;for(d=this._pt;d;)d.r(x,d.d),d=d._next;v&&v.render(i<0?i:v._dur*v._ease(u/this._dur),s,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!s&&(h&&rm(this,i,s,a),Gn(this,"onUpdate")),this._repeat&&p!==m&&this.vars.onRepeat&&!s&&this.parent&&Gn(this,"onRepeat"),(f===this._tDur||!f)&&this._tTime===f&&(h&&!this._onUpdate&&rm(this,i,!0,!0),(i||!c)&&(f===this._tDur&&this._ts>0||!f&&this._ts<0)&&Os(this,1),!s&&!(h&&!o)&&(f||o||g)&&(Gn(this,f===l?"onComplete":"onReverseComplete",!0),this._prom&&!(f<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),r.prototype.invalidate.call(this,i)},e.resetTo=function(i,s,a,o,l){Zc||Rn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||wm(this,c),h=this._ease(c/this._dur),bE(this,i,s,a,o,h,c,l)?this.resetTo(i,s,a,o,1):(zf(this,0),this.parent||ox(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,s){if(s===void 0&&(s="all"),!i&&(!s||s==="all"))return this._lazy=this._pt=0,this.parent?kc(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Ke),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,s,Ns&&Ns.vars.overwrite!==!0)._first||kc(this),this.parent&&a!==this.timeline.totalDuration()&&oo(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?ti(i):o,c=this._ptLookup,h=this._pt,f,u,d,p,_,m,g;if((!s||s==="all")&&j1(o,l))return s==="all"&&(this._pt=0),kc(this);for(f=this._op=this._op||[],s!=="all"&&(qe(s)&&(_={},vn(s,function(x){return _[x]=1}),s=_),s=TE(o,s)),g=o.length;g--;)if(~l.indexOf(o[g])){u=c[g],s==="all"?(f[g]=s,p=u,d={}):(d=f[g]=f[g]||{},p=s);for(_ in p)m=u&&u[_],m&&((!("kill"in m.d)||m.d.kill(_)===!0)&&Of(this,m,"_pt"),delete u[_]),d!=="all"&&(d[_]=1)}return this._initted&&!this._pt&&h&&kc(this),this},t.to=function(i,s){return new t(i,s,arguments[2])},t.from=function(i,s){return Hc(1,arguments)},t.delayedCall=function(i,s,a,o){return new t(s,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:s,onReverseComplete:s,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},t.fromTo=function(i,s,a){return Hc(2,arguments)},t.set=function(i,s){return s.duration=0,s.repeatDelay||(s.repeat=0),new t(i,s)},t.killTweensOf=function(i,s,a){return Ee.killTweensOf(i,s,a)},t})(Jc);Wn(Be.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});vn("staggerTo,staggerFrom,staggerFromTo",function(r){Be[r]=function(){var t=new hn,e=om.call(arguments,0);return e.splice(r==="staggerFromTo"?5:4,0,0),t[r].apply(t,e)}});var Am=function(t,e,n){return t[e]=n},Ex=function(t,e,n){return t[e](n)},wE=function(t,e,n,i){return t[e](i.fp,n)},AE=function(t,e,n){return t.setAttribute(e,n)},kf=function(t,e){return De(t[e])?Ex:Uf(t[e])&&t.setAttribute?AE:Am},wx=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},CE=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},Cm=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Rm=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},RE=function(t,e,n,i){for(var s=this._pt,a;s;)a=s._next,s.p===i&&s.modifier(t,e,n),s=a},PE=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?Of(this,e,"_pt"):e.dep||(n=1),e=i;return!n},IE=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},Pm=function(t){for(var e=t._pt,n,i,s,a;e;){for(n=e._next,i=s;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:a)?e._prev._next=e:s=e,(e._next=i)?i._prev=e:a=e,e=n}t._pt=s},yn=(function(){function r(e,n,i,s,a,o,l,c,h){this.t=n,this.s=s,this.c=a,this.p=i,this.r=o||wx,this.d=l||this,this.set=c||Am,this.pr=h||0,this._next=e,e&&(e._prev=this)}var t=r.prototype;return t.modifier=function(n,i,s){this.mSet=this.mSet||this.set,this.set=IE,this.m=n,this.mt=s,this.tween=i},r})();vn(xm+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(r){return _m[r]=1});Hn.TweenMax=Hn.TweenLite=Be;Hn.TimelineLite=Hn.TimelineMax=hn;Ee=new hn({sortChildren:!1,defaults:Xc,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});In.stringFilter=Sm;var Pr=[],Rf={},DE=[],$0=0,LE=0,tm=function(t){return(Rf[t]||DE).map(function(e){return e()})},um=function(){var t=Date.now(),e=[];t-$0>2&&(tm("matchMediaInit"),Pr.forEach(function(n){var i=n.queries,s=n.conditions,a,o,l,c;for(o in i)a=Ii.matchMedia(i[o]).matches,a&&(l=1),a!==s[o]&&(s[o]=a,c=1);c&&(n.revert(),l&&e.push(n))}),tm("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),$0=t,tm("matchMedia"))},Ax=(function(){function r(e,n){this.selector=n&&lm(n),this.data=[],this._r=[],this.isReverted=!1,this.id=LE++,e&&this.add(e)}var t=r.prototype;return t.add=function(n,i,s){De(n)&&(s=i,i=n,n=De);var a=this,o=function(){var c=Se,h=a.selector,f;return c&&c!==a&&c.data.push(a),s&&(a.selector=lm(s)),Se=a,f=i.apply(a,arguments),De(f)&&a._r.push(f),Se=c,a.selector=h,a.isReverted=!1,f};return a.last=o,n===De?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},t.ignore=function(n){var i=Se;Se=null,n(this),Se=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof r?n.push.apply(n,i.getTweens()):i instanceof Be&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var s=this;if(n?(function(){for(var o=s.getTweens(),l=s.data.length,c;l--;)c=s.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return o.splice(o.indexOf(h),1)}));for(o.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,f){return f.g-h.g||-1/0}).forEach(function(h){return h.t.revert(n)}),l=s.data.length;l--;)c=s.data[l],c instanceof hn?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof Be)&&c.revert&&c.revert(n);s._r.forEach(function(h){return h(n,s)}),s.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i)for(var a=Pr.length;a--;)Pr[a].id===this.id&&Pr.splice(a,1)},t.revert=function(n){this.kill(n||{})},r})(),NE=(function(){function r(e){this.contexts=[],this.scope=e,Se&&Se.data.push(this)}var t=r.prototype;return t.add=function(n,i,s){Li(n)||(n={matches:n});var a=new Ax(0,s||this.scope),o=a.conditions={},l,c,h;Se&&!a.selector&&(a.selector=Se.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?h=1:(l=Ii.matchMedia(n[c]),l&&(Pr.indexOf(a)<0&&Pr.push(a),(o[c]=l.matches)&&(h=1),l.addListener?l.addListener(um):l.addEventListener("change",um)));return h&&i(a,function(f){return a.add(null,f)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},r})(),Nf={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return vx(i)})},timeline:function(t){return new hn(t)},getTweensOf:function(t,e){return Ee.getTweensOf(t,e)},getProperty:function(t,e,n,i){qe(t)&&(t=ti(t)[0]);var s=Fs(t||{}).get,a=n?ax:rx;return n==="native"&&(n=""),t&&(e?a((Cn[e]&&Cn[e].get||s)(t,e,n,i)):function(o,l,c){return a((Cn[o]&&Cn[o].get||s)(t,o,l,c))})},quickSetter:function(t,e,n){if(t=ti(t),t.length>1){var i=t.map(function(h){return fn.quickSetter(h,e,n)}),s=i.length;return function(h){for(var f=s;f--;)i[f](h)}}t=t[0]||{};var a=Cn[e],o=Fs(t),l=o.harness&&(o.harness.aliases||{})[e]||e,c=a?function(h){var f=new a;so._pt=0,f.init(t,n?h+n:h,so,0,[t]),f.render(1,f),so._pt&&Rm(1,so)}:o.set(t,l);return a?c:function(h){return c(t,l,n?h+n:h,o,1)}},quickTo:function(t,e,n){var i,s=fn.to(t,Wn((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,h){return s.resetTo(e,l,c,h)};return a.tween=s,a},isTweening:function(t){return Ee.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=Rr(t.ease,Xc.ease)),X0(Xc,t||{})},config:function(t){return X0(In,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,s=t.defaults,a=t.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!Cn[o]&&!Hn[o]&&qc(e+" effect requires "+o+" plugin.")}),$p[e]=function(o,l,c){return n(ti(o),Wn(l||{},s),c)},a&&(hn.prototype[e]=function(o,l,c){return this.add($p[e](o,Li(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){se[t]=Rr(e)},parseEase:function(t,e){return arguments.length?Rr(t,e):se},getById:function(t){return Ee.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new hn(t),i,s;for(n.smoothChildTiming=Pn(t.smoothChildTiming),Ee.remove(n),n._dp=0,n._time=n._tTime=Ee._time,i=Ee._first;i;)s=i._next,(e||!(!i._dur&&i instanceof Be&&i.vars.onComplete===i._targets[0]))&&Di(n,i,i._start-i._delay),i=s;return Di(Ee,n,0),n},context:function(t,e){return t?new Ax(t,e):Se},matchMedia:function(t){return new NE(t)},matchMediaRefresh:function(){return Pr.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||um()},addEventListener:function(t,e){var n=Rf[t]||(Rf[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=Rf[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:uE,wrapYoyo:fE,distribute:dx,random:mx,snap:px,normalize:hE,getUnit:Qe,clamp:aE,splitColor:yx,toArray:ti,selector:lm,mapRange:_x,pipe:lE,unitize:cE,interpolate:dE,shuffle:fx},install:ex,effects:$p,ticker:Rn,updateRoot:hn.updateRoot,plugins:Cn,globalTimeline:Ee,core:{PropTween:yn,globals:nx,Tween:Be,Timeline:hn,Animation:Jc,getCache:Fs,_removeLinkedListItem:Of,reverting:function(){return Ke},context:function(t){return t&&Se&&(Se.data.push(t),t._ctx=Se),Se},suppressOverwrites:function(t){return fm=t}}};vn("to,from,fromTo,delayedCall,set,killTweensOf",function(r){return Nf[r]=Be[r]});Rn.add(hn.updateRoot);so=Nf.to({},{duration:0});var UE=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},FE=function(t,e){var n=t._targets,i,s,a;for(i in e)for(s=n.length;s--;)a=t._ptLookup[s][i],a&&(a=a.d)&&(a._pt&&(a=UE(a,i)),a&&a.modifier&&a.modifier(e[i],t,n[s],i))},em=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,s,a){a._onInit=function(o){var l,c;if(qe(s)&&(l={},vn(s,function(h){return l[h]=1}),s=l),e){l={};for(c in s)l[c]=e(s[c]);s=l}FE(o,s)}}}},fn=Nf.registerPlugin({name:"attr",init:function(t,e,n,i,s){var a,o,l;this.tween=n;for(a in e)l=t.getAttribute(a)||"",o=this.add(t,"setAttribute",(l||0)+"",e[a],i,s,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(t,e){for(var n=e._pt;n;)Ke?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},em("roundProps",cm),em("modifiers"),em("snap",px))||Nf;Be.version=hn.version=fn.version="3.15.0";tx=1;dm()&&lo();var OE=se.Power0,BE=se.Power1,zE=se.Power2,kE=se.Power3,VE=se.Power4,GE=se.Linear,HE=se.Quad,WE=se.Cubic,XE=se.Quart,qE=se.Quint,YE=se.Strong,ZE=se.Elastic,JE=se.Back,$E=se.SteppedEase,KE=se.Bounce,QE=se.Sine,jE=se.Expo,tw=se.Circ;var Cx,zs,uo,Fm,Or,ew,Rx,Om,nw=function(){return typeof window<"u"},rs={},Fr=180/Math.PI,fo=Math.PI/180,ho=Math.atan2,Px=1e8,Bm=/([A-Z])/g,iw=/(left|right|width|margin|padding|x)/i,sw=/[\s,\(]\S/,Ni={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Dm=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},rw=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},aw=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},ow=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},lw=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},Bx=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},zx=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},cw=function(t,e,n){return t.style[e]=n},hw=function(t,e,n){return t.style.setProperty(e,n)},uw=function(t,e,n){return t._gsap[e]=n},fw=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},dw=function(t,e,n,i,s){var a=t._gsap;a.scaleX=a.scaleY=n,a.renderTransform(s,a)},pw=function(t,e,n,i,s){var a=t._gsap;a[e]=n,a.renderTransform(s,a)},we="transform",Dn=we+"Origin",mw=function r(t,e){var n=this,i=this.target,s=i.style,a=i._gsap;if(t in rs&&s){if(this.tfm=this.tfm||{},t!=="transform")t=Ni[t]||t,~t.indexOf(",")?t.split(",").forEach(function(o){return n.tfm[o]=ss(i,o)}):this.tfm[t]=a.x?a[t]:ss(i,t),t===Dn&&(this.tfm.zOrigin=a.zOrigin);else return Ni.transform.split(",").forEach(function(o){return r.call(n,o,e)});if(this.props.indexOf(we)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(Dn,e,"")),t=we}(s||e)&&this.props.push(t,e,s[t])},kx=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},gw=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,s,a;for(s=0;s<t.length;s+=3)t[s+1]?t[s+1]===2?e[t[s]](t[s+2]):e[t[s]]=t[s+2]:t[s+2]?n[t[s]]=t[s+2]:n.removeProperty(t[s].substr(0,2)==="--"?t[s]:t[s].replace(Bm,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),s=Om(),(!s||!s.isStart)&&!n[we]&&(kx(n),i.zOrigin&&n[Dn]&&(n[Dn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},Vx=function(t,e){var n={target:t,props:[],revert:gw,save:mw};return t._gsap||fn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},Gx,Lm=function(t,e){var n=zs.createElementNS?zs.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):zs.createElement(t);return n&&n.style?n:zs.createElement(t)},Xn=function r(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Bm,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&r(t,po(e)||e,1)||""},Ix="O,Moz,ms,Ms,Webkit".split(","),po=function(t,e,n){var i=e||Or,s=i.style,a=5;if(t in s&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);a--&&!(Ix[a]+t in s););return a<0?null:(a===3?"ms":a>=0?Ix[a]:"")+t},Nm=function(){nw()&&window.document&&(Cx=window,zs=Cx.document,uo=zs.documentElement,Or=Lm("div")||{style:{}},ew=Lm("div"),we=po(we),Dn=we+"Origin",Or.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Gx=!!po("perspective"),Om=fn.core.reverting,Fm=1)},Dx=function(t){var e=t.ownerSVGElement,n=Lm("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),s;i.style.display="block",n.appendChild(i),uo.appendChild(n);try{s=i.getBBox()}catch{}return n.removeChild(i),uo.removeChild(n),s},Lx=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},Hx=function(t){var e,n;try{e=t.getBBox()}catch{e=Dx(t),n=1}return e&&(e.width||e.height)||n||(e=Dx(t)),e&&!e.width&&!e.x&&!e.y?{x:+Lx(t,["x","cx","x1"])||0,y:+Lx(t,["y","cy","y1"])||0,width:0,height:0}:e},Wx=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&Hx(t))},Vs=function(t,e){if(e){var n=t.style,i;e in rs&&e!==Dn&&(e=we),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Bm,"-$1").toLowerCase())):n.removeAttribute(e)}},ks=function(t,e,n,i,s,a){var o=new yn(t._pt,e,n,0,1,a?zx:Bx);return t._pt=o,o.b=i,o.e=s,t._props.push(n),o},Nx={deg:1,rad:1,turn:1},_w={grid:1,flex:1},Gs=function r(t,e,n,i){var s=parseFloat(n)||0,a=(n+"").trim().substr((s+"").length)||"px",o=Or.style,l=iw.test(e),c=t.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),f=100,u=i==="px",d=i==="%",p,_,m,g;if(i===a||!s||Nx[i]||Nx[a])return s;if(a!=="px"&&!u&&(s=r(t,e,n,"px")),g=t.getCTM&&Wx(t),(d||a==="%")&&(rs[e]||~e.indexOf("adius")))return p=g?t.getBBox()[l?"width":"height"]:t[h],Le(d?s/p*f:s/100*p);if(o[l?"width":"height"]=f+(u?a:i),_=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,g&&(_=(t.ownerSVGElement||{}).parentNode),(!_||_===zs||!_.appendChild)&&(_=zs.body),m=_._gsap,m&&d&&m.width&&l&&m.time===Rn.time&&!m.uncache)return Le(s/m.width*f);if(d&&(e==="height"||e==="width")){var x=t.style[e];t.style[e]=f+i,p=t[h],x?t.style[e]=x:Vs(t,e)}else(d||a==="%")&&!_w[Xn(_,"display")]&&(o.position=Xn(t,"position")),_===t&&(o.position="static"),_.appendChild(Or),p=Or[h],_.removeChild(Or),o.position="absolute";return l&&d&&(m=Fs(_),m.time=Rn.time,m.width=_[h]),Le(u?p*s/f:p&&s?f/p*s:0)},ss=function(t,e,n,i){var s;return Fm||Nm(),e in Ni&&e!=="transform"&&(e=Ni[e],~e.indexOf(",")&&(e=e.split(",")[0])),rs[e]&&e!=="transform"?(s=jc(t,i),s=e!=="transformOrigin"?s[e]:s.svg?s.origin:Gf(Xn(t,Dn))+" "+s.zOrigin+"px"):(s=t.style[e],(!s||s==="auto"||i||~(s+"").indexOf("calc("))&&(s=Vf[e]&&Vf[e](t,e,n)||Xn(t,e)||ym(t,e)||(e==="opacity"?1:0))),n&&!~(s+"").trim().indexOf(" ")?Gs(t,e,s,n)+n:s},xw=function(t,e,n,i){if(!n||n==="none"){var s=po(e,t,1),a=s&&Xn(t,s,1);a&&a!==n?(e=s,n=a):e==="borderColor"&&(n=Xn(t,"borderTopColor"))}var o=new yn(this._pt,t.style,e,0,1,Cm),l=0,c=0,h,f,u,d,p,_,m,g,x,v,M,E;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Xn(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=t.style[e],t.style[e]=i,i=Xn(t,e)||i,_?t.style[e]=_:Vs(t,e)),h=[n,i],Sm(h),n=h[0],i=h[1],u=n.match(Ir)||[],E=i.match(Ir)||[],E.length){for(;f=Ir.exec(i);)m=f[0],x=i.substring(l,f.index),p?p=(p+1)%5:(x.substr(-5)==="rgba("||x.substr(-5)==="hsla(")&&(p=1),m!==(_=u[c++]||"")&&(d=parseFloat(_)||0,M=_.substr((d+"").length),m.charAt(1)==="="&&(m=Dr(d,m)+M),g=parseFloat(m),v=m.substr((g+"").length),l=Ir.lastIndex-v.length,v||(v=v||In.units[e]||M,l===i.length&&(i+=v,o.e+=v)),M!==v&&(d=Gs(t,e,_,v)||0),o._pt={_next:o._pt,p:x||c===1?x:",",s:d,c:g-d,m:p&&p<4||e==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=e==="display"&&i==="none"?zx:Bx;return mm.test(i)&&(o.e=0),this._pt=o,o},Ux={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},vw=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=Ux[n]||n,e[1]=Ux[i]||i,e.join(" ")},yw=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,s=e.u,a=n._gsap,o,l,c;if(s==="all"||s===!0)i.cssText="",l=1;else for(s=s.split(","),c=s.length;--c>-1;)o=s[c],rs[o]&&(l=1,o=o==="transformOrigin"?Dn:we),Vs(n,o);l&&(Vs(n,we),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",jc(n,1),a.uncache=1,kx(i)))}},Vf={clearProps:function(t,e,n,i,s){if(s.data!=="isFromStart"){var a=t._pt=new yn(t._pt,e,n,0,0,yw);return a.u=i,a.pr=-10,a.tween=s,t._props.push(n),1}}},Qc=[1,0,0,1,0,0],Xx={},qx=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Fx=function(t){var e=Xn(t,we);return qx(e)?Qc:e.substr(7).match(pm).map(Le)},zm=function(t,e){var n=t._gsap||Fs(t),i=t.style,s=Fx(t),a,o,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,s=[l.a,l.b,l.c,l.d,l.e,l.f],s.join(",")==="1,0,0,1,0,0"?Qc:s):(s===Qc&&!t.offsetParent&&t!==uo&&!n.svg&&(l=i.display,i.display="block",a=t.parentNode,(!a||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,o=t.nextElementSibling,uo.appendChild(t)),s=Fx(t),l?i.display=l:Vs(t,"display"),c&&(o?a.insertBefore(t,o):a?a.appendChild(t):uo.removeChild(t))),e&&s.length>6?[s[0],s[1],s[4],s[5],s[12],s[13]]:s)},Um=function(t,e,n,i,s,a){var o=t._gsap,l=s||zm(t,!0),c=o.xOrigin||0,h=o.yOrigin||0,f=o.xOffset||0,u=o.yOffset||0,d=l[0],p=l[1],_=l[2],m=l[3],g=l[4],x=l[5],v=e.split(" "),M=parseFloat(v[0])||0,E=parseFloat(v[1])||0,S,w,y,T;n?l!==Qc&&(w=d*m-p*_)&&(y=M*(m/w)+E*(-_/w)+(_*x-m*g)/w,T=M*(-p/w)+E*(d/w)-(d*x-p*g)/w,M=y,E=T):(S=Hx(t),M=S.x+(~v[0].indexOf("%")?M/100*S.width:M),E=S.y+(~(v[1]||v[0]).indexOf("%")?E/100*S.height:E)),i||i!==!1&&o.smooth?(g=M-c,x=E-h,o.xOffset=f+(g*d+x*_)-g,o.yOffset=u+(g*p+x*m)-x):o.xOffset=o.yOffset=0,o.xOrigin=M,o.yOrigin=E,o.smooth=!!i,o.origin=e,o.originIsAbsolute=!!n,t.style[Dn]="0px 0px",a&&(ks(a,o,"xOrigin",c,M),ks(a,o,"yOrigin",h,E),ks(a,o,"xOffset",f,o.xOffset),ks(a,o,"yOffset",u,o.yOffset)),t.setAttribute("data-svg-origin",M+" "+E)},jc=function(t,e){var n=t._gsap||new bm(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,s=n.scaleX<0,a="px",o="deg",l=getComputedStyle(t),c=Xn(t,Dn)||"0",h,f,u,d,p,_,m,g,x,v,M,E,S,w,y,T,R,P,U,z,k,D,F,L,W,q,et,lt,mt,Ft,kt,Ot;return h=f=u=_=m=g=x=v=M=0,d=p=1,n.svg=!!(t.getCTM&&Wx(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[we]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[we]!=="none"?l[we]:"")),i.scale=i.rotate=i.translate="none"),w=zm(t,n.svg),n.svg&&(n.uncache?(W=t.getBBox(),c=n.xOrigin-W.x+"px "+(n.yOrigin-W.y)+"px",L=""):L=!e&&t.getAttribute("data-svg-origin"),Um(t,L||c,!!L||n.originIsAbsolute,n.smooth!==!1,w)),E=n.xOrigin||0,S=n.yOrigin||0,w!==Qc&&(P=w[0],U=w[1],z=w[2],k=w[3],h=D=w[4],f=F=w[5],w.length===6?(d=Math.sqrt(P*P+U*U),p=Math.sqrt(k*k+z*z),_=P||U?ho(U,P)*Fr:0,x=z||k?ho(z,k)*Fr+_:0,x&&(p*=Math.abs(Math.cos(x*fo))),n.svg&&(h-=E-(E*P+S*z),f-=S-(E*U+S*k))):(Ot=w[6],Ft=w[7],et=w[8],lt=w[9],mt=w[10],kt=w[11],h=w[12],f=w[13],u=w[14],y=ho(Ot,mt),m=y*Fr,y&&(T=Math.cos(-y),R=Math.sin(-y),L=D*T+et*R,W=F*T+lt*R,q=Ot*T+mt*R,et=D*-R+et*T,lt=F*-R+lt*T,mt=Ot*-R+mt*T,kt=Ft*-R+kt*T,D=L,F=W,Ot=q),y=ho(-z,mt),g=y*Fr,y&&(T=Math.cos(-y),R=Math.sin(-y),L=P*T-et*R,W=U*T-lt*R,q=z*T-mt*R,kt=k*R+kt*T,P=L,U=W,z=q),y=ho(U,P),_=y*Fr,y&&(T=Math.cos(y),R=Math.sin(y),L=P*T+U*R,W=D*T+F*R,U=U*T-P*R,F=F*T-D*R,P=L,D=W),m&&Math.abs(m)+Math.abs(_)>359.9&&(m=_=0,g=180-g),d=Le(Math.sqrt(P*P+U*U+z*z)),p=Le(Math.sqrt(F*F+Ot*Ot)),y=ho(D,F),x=Math.abs(y)>2e-4?y*Fr:0,M=kt?1/(kt<0?-kt:kt):0),n.svg&&(L=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!qx(Xn(t,we)),L&&t.setAttribute("transform",L))),Math.abs(x)>90&&Math.abs(x)<270&&(s?(d*=-1,x+=_<=0?180:-180,_+=_<=0?180:-180):(p*=-1,x+=x<=0?180:-180)),e=e||n.uncache,n.x=h-((n.xPercent=h&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-h)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+a,n.y=f-((n.yPercent=f&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-f)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+a,n.z=u+a,n.scaleX=Le(d),n.scaleY=Le(p),n.rotation=Le(_)+o,n.rotationX=Le(m)+o,n.rotationY=Le(g)+o,n.skewX=x+o,n.skewY=v+o,n.transformPerspective=M+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[Dn]=Gf(c)),n.xOffset=n.yOffset=0,n.force3D=In.force3D,n.renderTransform=n.svg?Sw:Gx?Yx:Mw,n.uncache=0,n},Gf=function(t){return(t=t.split(" "))[0]+" "+t[1]},Im=function(t,e,n){var i=Qe(e);return Le(parseFloat(e)+parseFloat(Gs(t,"x",n+"px",i)))+i},Mw=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Yx(t,e)},Nr="0deg",Kc="0px",Ur=") ",Yx=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,h=n.rotationY,f=n.rotationX,u=n.skewX,d=n.skewY,p=n.scaleX,_=n.scaleY,m=n.transformPerspective,g=n.force3D,x=n.target,v=n.zOrigin,M="",E=g==="auto"&&t&&t!==1||g===!0;if(v&&(f!==Nr||h!==Nr)){var S=parseFloat(h)*fo,w=Math.sin(S),y=Math.cos(S),T;S=parseFloat(f)*fo,T=Math.cos(S),a=Im(x,a,w*T*-v),o=Im(x,o,-Math.sin(S)*-v),l=Im(x,l,y*T*-v+v)}m!==Kc&&(M+="perspective("+m+Ur),(i||s)&&(M+="translate("+i+"%, "+s+"%) "),(E||a!==Kc||o!==Kc||l!==Kc)&&(M+=l!==Kc||E?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+Ur),c!==Nr&&(M+="rotate("+c+Ur),h!==Nr&&(M+="rotateY("+h+Ur),f!==Nr&&(M+="rotateX("+f+Ur),(u!==Nr||d!==Nr)&&(M+="skew("+u+", "+d+Ur),(p!==1||_!==1)&&(M+="scale("+p+", "+_+Ur),x.style[we]=M||"translate(0, 0)"},Sw=function(t,e){var n=e||this,i=n.xPercent,s=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,h=n.skewY,f=n.scaleX,u=n.scaleY,d=n.target,p=n.xOrigin,_=n.yOrigin,m=n.xOffset,g=n.yOffset,x=n.forceCSS,v=parseFloat(a),M=parseFloat(o),E,S,w,y,T;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=fo,c*=fo,E=Math.cos(l)*f,S=Math.sin(l)*f,w=Math.sin(l-c)*-u,y=Math.cos(l-c)*u,c&&(h*=fo,T=Math.tan(c-h),T=Math.sqrt(1+T*T),w*=T,y*=T,h&&(T=Math.tan(h),T=Math.sqrt(1+T*T),E*=T,S*=T)),E=Le(E),S=Le(S),w=Le(w),y=Le(y)):(E=f,y=u,S=w=0),(v&&!~(a+"").indexOf("px")||M&&!~(o+"").indexOf("px"))&&(v=Gs(d,"x",a,"px"),M=Gs(d,"y",o,"px")),(p||_||m||g)&&(v=Le(v+p-(p*E+_*w)+m),M=Le(M+_-(p*S+_*y)+g)),(i||s)&&(T=d.getBBox(),v=Le(v+i/100*T.width),M=Le(M+s/100*T.height)),T="matrix("+E+","+S+","+w+","+y+","+v+","+M+")",d.setAttribute("transform",T),x&&(d.style[we]=T)},bw=function(t,e,n,i,s){var a=360,o=qe(s),l=parseFloat(s)*(o&&~s.indexOf("rad")?Fr:1),c=l-i,h=i+c+"deg",f,u;return o&&(f=s.split("_")[1],f==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),f==="cw"&&c<0?c=(c+a*Px)%a-~~(c/a)*a:f==="ccw"&&c>0&&(c=(c-a*Px)%a-~~(c/a)*a)),t._pt=u=new yn(t._pt,e,n,i,c,rw),u.e=h,u.u="deg",t._props.push(n),u},Ox=function(t,e){for(var n in e)t[n]=e[n];return t},Tw=function(t,e,n){var i=Ox({},n._gsap),s="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,h,f,u,d,p;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[we]=e,o=jc(n,1),Vs(n,we),n.setAttribute("transform",c)):(c=getComputedStyle(n)[we],a[we]=e,o=jc(n,1),a[we]=c);for(l in rs)c=i[l],h=o[l],c!==h&&s.indexOf(l)<0&&(d=Qe(c),p=Qe(h),f=d!==p?Gs(n,l,c,p):parseFloat(c),u=parseFloat(h),t._pt=new yn(t._pt,o,l,f,u-f,Dm),t._pt.u=p||0,t._props.push(l));Ox(o,i)};vn("padding,margin,Width,Radius",function(r,t){var e="Top",n="Right",i="Bottom",s="Left",a=(t<3?[e,n,i,s]:[e+s,e+n,i+n,i+s]).map(function(o){return t<2?r+o:"border"+o+r});Vf[t>1?"border"+r:r]=function(o,l,c,h,f){var u,d;if(arguments.length<4)return u=a.map(function(p){return ss(o,p,c)}),d=u.join(" "),d.split(u[0]).length===5?u[0]:d;u=(h+"").split(" "),d={},a.forEach(function(p,_){return d[p]=u[_]=u[_]||u[(_-1)/2|0]}),o.init(l,d,f)}});var km={name:"css",register:Nm,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,s){var a=this._props,o=t.style,l=n.vars.startAt,c,h,f,u,d,p,_,m,g,x,v,M,E,S,w,y,T;Fm||Nm(),this.styles=this.styles||Vx(t),y=this.styles.props,this.tween=n;for(_ in e)if(_!=="autoRound"&&(h=e[_],!(Cn[_]&&Em(_,e,n,i,t,s)))){if(d=typeof h,p=Vf[_],d==="function"&&(h=h.call(n,i,t,s),d=typeof h),d==="string"&&~h.indexOf("random(")&&(h=co(h)),p)p(this,t,_,h,n)&&(w=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(_)+"").trim(),h+="",ns.lastIndex=0,ns.test(c)||(m=Qe(c),g=Qe(h),g?m!==g&&(c=Gs(t,_,c,g)+g):m&&(h+=m)),this.add(o,"setProperty",c,h,i,s,0,0,_),a.push(_),y.push(_,0,o[_]);else if(d!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,t,s):l[_],qe(c)&&~c.indexOf("random(")&&(c=co(c)),Qe(c+"")||c==="auto"||(c+=In.units[_]||Qe(ss(t,_))||""),(c+"").charAt(1)==="="&&(c=ss(t,_))):c=ss(t,_),u=parseFloat(c),x=d==="string"&&h.charAt(1)==="="&&h.substr(0,2),x&&(h=h.substr(2)),f=parseFloat(h),_ in Ni&&(_==="autoAlpha"&&(u===1&&ss(t,"visibility")==="hidden"&&f&&(u=0),y.push("visibility",0,o.visibility),ks(this,o,"visibility",u?"inherit":"hidden",f?"inherit":"hidden",!f)),_!=="scale"&&_!=="transform"&&(_=Ni[_],~_.indexOf(",")&&(_=_.split(",")[0]))),v=_ in rs,v){if(this.styles.save(_),T=h,d==="string"&&h.substring(0,6)==="var(--"){if(h=Xn(t,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var R=t.style.perspective;t.style.perspective=h,h=Xn(t,"perspective"),R?t.style.perspective=R:Vs(t,"perspective")}f=parseFloat(h)}if(M||(E=t._gsap,E.renderTransform&&!e.parseTransform||jc(t,e.parseTransform),S=e.smoothOrigin!==!1&&E.smooth,M=this._pt=new yn(this._pt,o,we,0,1,E.renderTransform,E,0,-1),M.dep=1),_==="scale")this._pt=new yn(this._pt,E,"scaleY",E.scaleY,(x?Dr(E.scaleY,x+f):f)-E.scaleY||0,Dm),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){y.push(Dn,0,o[Dn]),h=vw(h),E.svg?Um(t,h,0,S,0,this):(g=parseFloat(h.split(" ")[2])||0,g!==E.zOrigin&&ks(this,E,"zOrigin",E.zOrigin,g),ks(this,o,_,Gf(c),Gf(h)));continue}else if(_==="svgOrigin"){Um(t,h,1,S,0,this);continue}else if(_ in Xx){bw(this,E,_,u,x?Dr(u,x+h):h);continue}else if(_==="smoothOrigin"){ks(this,E,"smooth",E.smooth,h);continue}else if(_==="force3D"){E[_]=h;continue}else if(_==="transform"){Tw(this,h,t);continue}}else _ in o||(_=po(_)||_);if(v||(f||f===0)&&(u||u===0)&&!sw.test(h)&&_ in o)m=(c+"").substr((u+"").length),f||(f=0),g=Qe(h)||(_ in In.units?In.units[_]:m),m!==g&&(u=Gs(t,_,c,g)),this._pt=new yn(this._pt,v?E:o,_,u,(x?Dr(u,x+f):f)-u,!v&&(g==="px"||_==="zIndex")&&e.autoRound!==!1?lw:Dm),this._pt.u=g||0,v&&T!==h?(this._pt.b=c,this._pt.e=T,this._pt.r=ow):m!==g&&g!=="%"&&(this._pt.b=c,this._pt.r=aw);else if(_ in o)xw.call(this,t,_,c,x?x+h:h);else if(_ in t)this.add(t,_,c||t[_],x?x+h:h,i,s);else if(_!=="parseTransform"){Ff(_,h);continue}v||(_ in o?y.push(_,0,o[_]):typeof t[_]=="function"?y.push(_,2,t[_]()):y.push(_,1,c||t[_])),a.push(_)}}w&&Pm(this)},render:function(t,e){if(e.tween._time||!Om())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:ss,aliases:Ni,getSetter:function(t,e,n){var i=Ni[e];return i&&i.indexOf(",")<0&&(e=i),e in rs&&e!==Dn&&(t._gsap.x||ss(t,"x"))?n&&Rx===n?e==="scale"?fw:uw:(Rx=n||{})&&(e==="scale"?dw:pw):t.style&&!Uf(t.style[e])?cw:~e.indexOf("-")?hw:kf(t,e)},core:{_removeProperty:Vs,_getMatrix:zm}};fn.utils.checkPrefix=po;fn.core.getStyleSaver=Vx;(function(r,t,e,n){var i=vn(r+","+t+","+e,function(s){rs[s]=1});vn(t,function(s){In.units[s]="deg",Xx[s]=1}),Ni[i[13]]=r+","+t,vn(n,function(s){var a=s.split(":");Ni[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");vn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(r){In.units[r]="px"});fn.registerPlugin(km);var th=fn.registerPlugin(km)||fn,Gw=th.core.Tween;var eh=null,Zx=(r,t,e)=>Math.max(t,Math.min(e,r));function Ew(){let r=document.getElementById("messages-container")?.getBoundingClientRect();return r?[...document.querySelectorAll("#messages-list .msg-row, #messages-list .msg-follow")].filter(t=>{let e=t.getBoundingClientRect();return e.width>30&&e.height>12&&e.bottom>r.top&&e.top<r.bottom}).slice(-20):[]}function ww(r){let t=document.createElement("div");t.className="vault-message-card";let e=document.createElement("div");e.className="vault-message-avatar";let n=r.querySelector(".msg-avatar img");if(n?.src){let l=document.createElement("img");l.src=n.src,e.appendChild(l)}else e.textContent=String(r.querySelector(".msg-avatar")?.textContent||"?").trim().slice(0,2);let i=document.createElement("div");i.className="vault-message-copy";let s=document.createElement("div");s.className="vault-message-name";let a=[...r.querySelectorAll(".msg-reply-target")].find(l=>l.tagName==="SPAN");s.textContent=String(a?.textContent||"Message").trim();let o=document.createElement("div");return o.className="vault-message-text",o.textContent=String(r.querySelector(".msg-bubble")?.textContent||r.textContent||"").trim().slice(0,100),i.append(s,o),t.append(e,i),t}function Vm(r,t=.42,e=.9){return new Ei({color:r,roughness:t,metalness:e})}function Aw(r){let t=new sn,e=Vm(2435894,.5,.94),n=Vm(6976387,.3,1),i=Vm(1448741,.58,.9),s=new Ei({color:5973903,emissive:8266446,emissiveIntensity:.72,roughness:.3,metalness:.58}),a=new $t(new wn(2.35,2.35,1.55,64),e);a.rotation.x=Math.PI/2,a.position.z=-.55,t.add(a);let o=new $t(new kn(5.25,.65,2.3),e);o.position.set(0,-2.35,-.45),t.add(o);let l=new $t(new ci(1.92,.25,18,80),n);l.position.z=.32,t.add(l);let c=new $t(new ci(1.5,.11,14,72),i);c.position.z=.43,t.add(c);let h=new $t(new ci(1.14,.12,14,72),s);h.position.z=.39,t.add(h);let f=new sn;f.position.set(-2.02,0,.12);let u=new sn;u.position.x=2.02;let d=new $t(new wn(1.67,1.67,.34,64),n);d.rotation.x=Math.PI/2,d.position.z=.42,u.add(d);let p=new $t(new wn(1.12,1.12,.4,64),i);p.rotation.x=Math.PI/2,p.position.z=.64,u.add(p);let _=new $t(new ci(1.42,.1,14,64),e);_.position.z=.75,u.add(_);for(let L=0;L<8;L++){let W=new $t(new kn(.13,1.42,.15),n);W.position.z=.88,W.rotation.z=L*Math.PI/4,u.add(W)}let m=new $t(new wn(.42,.42,.34,32),e);m.rotation.x=Math.PI/2,m.position.z=.93,u.add(m);let g=new $t(new ci(.52,.08,12,48),n);g.position.z=1.09,u.add(g);for(let L=0;L<18;L++){let W=L/18*Math.PI*2,q=new $t(new $i(.075,12,10),n);q.position.set(Math.cos(W)*1.43,Math.sin(W)*1.43,.83),u.add(q)}f.add(u),t.add(f);for(let L of[-.92,.92]){let W=new $t(new kn(.52,.42,.66),n);W.position.set(-2.02,L,.31),t.add(W);let q=new $t(new wn(.19,.19,.72,20),e);q.position.set(-2.14,L,.52),t.add(q)}let x=new sn;x.position.z=1.15;for(let L=0;L<5;L++){let W=L*Math.PI*2/5,q=new $t(new wn(.055,.055,.82,12),n);q.position.set(-Math.sin(W)*.39,Math.cos(W)*.39,0),q.rotation.z=W,x.add(q)}let v=new $t(new wn(.18,.18,.25,24),n);v.rotation.x=Math.PI/2,x.add(v),u.add(x);let M=new On({color:15324671,transparent:!0,opacity:.92}),E=new $t(new $i(.25,28,22),M);E.position.z=.45,E.scale.setScalar(.72),t.add(E);let S=new Ve({color:14239471,transparent:!0,opacity:0}),w=new sn;for(let L=0;L<15;L++){let W=[],q=L/15*Math.PI*2+L%3*.08;for(let et=0;et<7;et++){let lt=.26+et*.245,mt=et?Math.sin(L*8.4+et*4.1)*.08:0;W.push(new I(Math.cos(q+mt)*lt,Math.sin(q+mt)*lt,1.015+et*.002))}w.add(new Bn(new Ht().setFromPoints(W),S))}u.add(w);let y=new sn;y.visible=!1;let T=[];for(let L=0;L<44;L++){let W=L%3===0?new _r(.11+Math.random()*.18,0):new kn(.12+Math.random()*.22,.1+Math.random()*.28,.1+Math.random()*.2),q=new $t(W,L%4===0?s.clone():n.clone()),et=Math.random()*Math.PI*2,lt=.35+Math.random()*1.7;q.position.set(Math.cos(et)*lt,Math.sin(et)*lt,.65+Math.random()*.35),q.userData.target=new I(q.position.x*(2.2+Math.random()*2.5),q.position.y*(2.2+Math.random()*2.5),1.8+Math.random()*3.8),y.add(q),T.push(q)}r.add(y);let R=720,P=new Float32Array(R*3),U=[];for(let L=0;L<R;L++){let W=Math.random()*Math.PI*2,q=.08+Math.random()*1.8;P[L*3]=Math.cos(W)*q,P[L*3+1]=Math.sin(W)*q,P[L*3+2]=.85+(Math.random()-.5)*.7,U.push(new I((Math.random()-.5)*.085,(Math.random()-.5)*.085,.025+Math.random()*.12))}let z=new Ht;z.setAttribute("position",new oe(P,3));let k=new Ts({color:12616956,size:.035,transparent:!0,opacity:.72,blending:Ga,depthWrite:!1}),D=new fr(z,k);r.add(D);let F=new vr(11032055,7,11,1.5);return F.position.set(0,0,2.2),r.add(F),r.add(t),{vault:t,front:u,doorPivot:f,lockingHandle:x,portalRing:h,core:E,coreMaterial:M,crackMaterial:S,debris:y,debrisPieces:T,particles:D,particleMaterial:k,particleGeometry:z,velocities:U,energyLight:F}}function Cw(r,t){r.traverse(e=>{e.geometry?.dispose?.(),Array.isArray(e.material)?e.material.forEach(n=>n.dispose?.()):e.material?.dispose?.()}),t.dispose(),t.forceContextLoss?.()}function Rw({durationMs:r=14e3}={}){if(eh?.stop?.(),!th||!Zp?.WebGLRenderer)return null;let t=Ew(),e=document.createElement("div");e.className="vault-effect-overlay",e.innerHTML=`<div class="vault-effect-vignette"></div><div class="vault-effect-energy"></div>
    <div class="vault-message-layer"></div><div class="vault-impact-flash"></div>
    <div class="vault-effect-hud"><div class="vault-effect-kicker">3D Vault Message Effect</div><div class="vault-effect-stage-label">Vault unlocking</div><div class="vault-effect-progress"><span></span></div></div>`,document.body.appendChild(e),document.body.classList.add("vault-effect-running");let n=e.querySelector(".vault-message-layer"),i=e.querySelector(".vault-effect-stage-label"),s=e.querySelector(".vault-effect-energy"),a=e.querySelector(".vault-impact-flash"),o=e.querySelector(".vault-effect-progress span"),l=[],c=t.map((D,F)=>{let L=D.getBoundingClientRect(),W=ww(D);n.appendChild(W);let q=Zx(L.width*.72,150,310);return W.style.width=`${q}px`,W.style.left="0",W.style.top="0",th.set(W,{x:L.left,y:L.top,opacity:1,scale:1,rotationZ:0,rotationY:0,z:0,transformPerspective:900}),l.push({node:D,opacity:D.style.opacity}),D.style.opacity="0",{node:D,card:W,rect:L,index:F,width:q}}),h=new hr;h.fog=new cr(197899,.055);let f=new Re(42,innerWidth/innerHeight,.1,100);f.position.set(0,.05,10.2);let u=new zc({alpha:!0,antialias:!0,powerPreference:"high-performance"});u.setPixelRatio(Math.min(devicePixelRatio||1,1.6)),u.setSize(innerWidth,innerHeight),u.outputColorSpace=Je,u.toneMapping=Wa,u.toneMappingExposure=1.18,e.prepend(u.domElement),h.add(new yr(8622262,1.15));let d=new Ds(13358591,3.4);d.position.set(-4,6,8),h.add(d);let p=new Ds(8141549,4.2);p.position.set(5,1,4),h.add(p);let _=new $t(new Ji(30,30),new Ei({color:461076,roughness:.28,metalness:.48}));_.rotation.x=-Math.PI/2,_.position.y=-2.7,h.add(_);let m=Aw(h);m.vault.scale.setScalar(innerWidth<700?.72:.9),m.vault.position.y=-.2,m.vault.rotation.y=-.1,m.debris.scale.copy(m.vault.scale),m.debris.position.copy(m.vault.position);let g=!1,x=!1,v=0,M=new ka,E=()=>{if(x)return;let D=Math.min(.035,M.getDelta());if(m.particles.rotation.z+=D*(g?.5:1.35),!g)m.particles.scale.multiplyScalar(.9982),m.particles.scale.x<.38&&m.particles.scale.setScalar(1);else{let F=m.particleGeometry.attributes.position;for(let L=0;L<F.count;L++)F.array[L*3]+=m.velocities[L].x,F.array[L*3+1]+=m.velocities[L].y,F.array[L*3+2]+=m.velocities[L].z;F.needsUpdate=!0,m.particleMaterial.opacity*=.993}m.core.rotation.y+=D*2.4,u.render(h,f),v=requestAnimationFrame(E)};E();let S=D=>{i.textContent=D},w=th.timeline({defaults:{overwrite:"auto"}});w.to(e,{opacity:1,duration:.38,ease:"power2.out"},0),w.from(m.vault.scale,{x:.25,y:.25,z:.25,duration:.9,ease:"back.out(1.4)"},.05),w.to(o,{width:"100%",duration:12.55,ease:"none"},.1),w.to(m.lockingHandle.rotation,{z:Math.PI*1.6,duration:.85,ease:"power2.inOut"},.58),w.to(m.doorPivot.rotation,{y:-1.72,duration:1.08,ease:"power3.inOut"},1.05),w.to(s,{opacity:1,scale:1.35,duration:1.25,ease:"sine.out"},1.35),w.to(m.energyLight,{intensity:15,duration:1.4,ease:"power2.in"},1.35),m.vault.updateMatrixWorld(!0),f.updateMatrixWorld(!0);let T=m.core.getWorldPosition(new I).clone().project(f),R=(T.x*.5+.5)*innerWidth,P=(-T.y*.5+.5)*innerHeight;c.forEach(({card:D,rect:F,index:L,width:W})=>{let q=F.left+W/2,et=F.top+Math.min(F.height,52)/2,lt=Math.atan2(et-P,q-R);for(let mt=1;mt<=6;mt++){let Ft=mt/6,kt=lt+Ft*Math.PI*3.6,$=Math.hypot(q-R,et-P)*(1-Ft),_t=R+Math.cos(kt)*$-q,at=P+Math.sin(kt)*$-et;w.to(D,{x:F.left+_t,y:F.top+at,z:Ft*210,rotationZ:Ft*470,rotationY:Ft*110,scale:1-Ft*.72,duration:.48,ease:"sine.inOut"},2.02+L*.045+(mt-1)*.43)}w.to(D,{opacity:0,scale:.015,duration:.24,ease:"power4.in"},4.48+L*.045)}),w.call(()=>S("Messages spiral into vault"),null,1.78),w.call(()=>S("Messages disappear inside"),null,3.75),w.call(()=>S("Vault seals"),null,5.25),w.to(m.doorPivot.rotation,{y:0,duration:.82,ease:"power3.inOut"},5.28),w.to(m.lockingHandle.rotation,{z:Math.PI*3.2,duration:.58,ease:"power2.inOut"},5.92),w.call(()=>S("Vault shakes and cracks"),null,6.18),w.to(m.crackMaterial,{opacity:1,duration:.72,ease:"power3.in"},6.28),w.to(m.vault.position,{x:"+=.1",duration:.055,repeat:21,yoyo:!0,ease:"none"},6.25),w.to(m.vault.rotation,{z:"+=.045",duration:.065,repeat:17,yoyo:!0,ease:"none"},6.34),w.to(m.core.scale,{x:3.2,y:3.2,z:3.2,duration:1.12,ease:"power3.in"},6.38),w.to(m.energyLight,{intensity:30,duration:1.05,ease:"power4.in"},6.42),w.call(()=>{S("Vault explodes"),g=!0,m.debris.visible=!0,m.vault.visible=!1,m.core.visible=!1},null,7.58),w.to(a,{opacity:1,duration:.08,ease:"none"},7.56),w.to(a,{opacity:0,duration:.7,ease:"power3.out"},7.64),w.to(s,{opacity:.12,scale:2.4,duration:.65,ease:"power3.out"},7.58),m.debrisPieces.forEach((D,F)=>{let L=D.userData.target;w.to(D.position,{x:L.x,y:L.y,z:L.z,duration:1.15+Math.random()*.45,ease:"power3.out"},7.57+F*.003),w.to(D.rotation,{x:Math.random()*8,y:Math.random()*8,z:Math.random()*8,duration:1.35,ease:"power2.out"},7.57)}),w.call(()=>S("Messages burst out"),null,7.72),c.forEach(({card:D,rect:F,index:L,width:W})=>{let q=L/Math.max(1,c.length)*Math.PI*2+L%3*.12,et=Math.min(innerWidth,innerHeight)*(.29+L%4*.035),lt=F.left+W/2,mt=F.top+Math.min(F.height,52)/2,Ft=R+Math.cos(q)*et-lt,kt=P+Math.sin(q)*et-mt;w.set(D,{x:R-W/2,y:P-Math.min(F.height,52)/2,z:0,rotationZ:0,rotationY:0,opacity:0,scale:.03},7.66),w.to(D,{x:F.left+Ft,y:F.top+kt,z:90,rotationZ:(Math.random()-.5)*46,rotationY:(Math.random()-.5)*48,scale:.82,opacity:1,duration:1.25,ease:"power3.out"},7.7+L*.025),w.to(D,{x:F.left,y:F.top,z:0,rotationZ:0,rotationY:0,scale:1,opacity:1,duration:2.15,ease:"power2.inOut"},9.12+L*.02)}),w.call(()=>S("Messages return to chat"),null,9.18),w.to(m.debris.scale,{x:.2,y:.2,z:.2,duration:1.3,ease:"power2.inOut"},10.15),w.call(()=>l.forEach(({node:D,opacity:F})=>{D.isConnected&&(D.style.opacity=F)}),null,11.82),w.to(c.map(({card:D})=>D),{opacity:0,duration:.4,ease:"sine.inOut"},11.76),w.to(e,{opacity:0,duration:.7,ease:"sine.inOut"},12.05);let U=()=>{f.aspect=innerWidth/innerHeight,f.updateProjectionMatrix(),u.setSize(innerWidth,innerHeight),u.setPixelRatio(Math.min(devicePixelRatio||1,1.6))};addEventListener("resize",U);function z(){x||(x=!0,w.kill(),cancelAnimationFrame(v),removeEventListener("resize",U),l.forEach(({node:D,opacity:F})=>{D.isConnected&&(D.style.opacity=F)}),document.body.classList.remove("vault-effect-running"),Cw(h,u),e.remove(),eh?.stop===z&&(eh=null))}w.call(z,null,12.78);let k=Zx(Number(r||14e3)/1e3,12.78,18);return w.timeScale(12.78/k),eh={stop:z},eh}return ov(Pw);})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)

gsap/gsap-core.js:
  (*!
   * GSAP 3.15.0
   * https://gsap.com
   *
   * @license Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)

gsap/CSSPlugin.js:
  (*!
   * CSSPlugin 3.15.0
   * https://gsap.com
   *
   * Copyright 2008-2026, GreenSock. All rights reserved.
   * Subject to the terms at https://gsap.com/standard-license
   * @author: Jack Doyle, jack@greensock.com
  *)
*/
window.VaultEffectRuntime=VaultEffectRuntime;
