import test from 'node:test';
import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import Fastify from 'fastify';
import { registerPlatinumGameMirrorRoutes, rewritePlatinumText } from '../services/platinumGameMirror.js';
import { repairGameExport } from '../services/gameCompatibility.js';

async function fixture(t, fetchImpl) {
  const cacheRoot = await fsp.mkdtemp(path.join(os.tmpdir(), 'nebulo-game-test-'));
  const app = Fastify();
  registerPlatinumGameMirrorRoutes(app, {cacheRoot, fetchImpl});
  await app.ready();
  t.after(async()=>{await app.close();await fsp.rm(cacheRoot,{recursive:true,force:true});});
  return {app,cacheRoot};
}

test('cached binary loads offline, supports HEAD, ranges, and conditional requests',async t=>{
  const {app,cacheRoot}=await fixture(t,()=>{throw new Error('must not contact upstream');});
  await fsp.mkdir(path.join(cacheRoot,'cdn','test'),{recursive:true});
  await fsp.writeFile(path.join(cacheRoot,'cdn','test','game.wasm'),Buffer.from([0,97,115,109,1,0,0,0]));
  const url='/games/platinum/cdn/test/game.wasm';
  const full=await app.inject({url});
  assert.equal(full.statusCode,200);assert.match(full.headers['content-type'],/application\/wasm/);
  assert.equal(full.rawPayload.length,8);
  const range=await app.inject({url,headers:{range:'bytes=2-4'}});
  assert.equal(range.statusCode,206);assert.equal(range.headers['content-range'],'bytes 2-4/8');
  assert.deepEqual([...range.rawPayload],[115,109,1]);
  const suffix=await app.inject({url,headers:{range:'bytes=-2'}});
  assert.equal(suffix.statusCode,206);assert.equal(suffix.rawPayload.length,2);
  assert.equal((await app.inject({url,headers:{range:'bytes=99-100'}})).statusCode,416);
  const head=await app.inject({url,method:'HEAD'});assert.equal(head.body,'');assert.equal(head.headers['content-length'],'8');
  assert.equal((await app.inject({url,headers:{'if-none-match':full.headers.etag}})).statusCode,304);
  assert.equal((await app.inject({url,headers:{range:'bytes=1-2','if-range':'"old"'}})).statusCode,200);
});

test('chunked HTML is rewritten and simultaneous requests share one cached download',async t=>{
  let calls=0;
  const {app}=await fixture(t,async()=>{calls++;await new Promise(r=>setTimeout(r,25));return new Response('<html><script src="/cdn/game.js"></script></html>',{headers:{'content-type':'text/html'}});});
  const url='/games/platinum/cdn/chunked/index.html';
  const responses=await Promise.all([app.inject({url}),app.inject({url}),app.inject({url})]);
  for(const r of responses){assert.equal(r.statusCode,200);assert.match(r.body,/src="\/games\/platinum\/cdn\/game.js"/);assert.equal(Number(r.headers['content-length']),Buffer.byteLength(r.body));}
  assert.equal(calls,1);await app.inject({url});assert.equal(calls,1);
});

test('an interrupted transfer never becomes a cached success; the next request retries',async t=>{
  let calls=0;
  const {app,cacheRoot}=await fixture(t,async()=>{
    calls++;
    if(calls===1) return new Response(new ReadableStream({start(c){c.enqueue(new Uint8Array([1]));c.error(new Error('disconnect'));}}));
    return new Response(new Uint8Array([1,2,3]));
  });
  const url='/games/platinum/cdn/test/file.data';
  const first=await app.inject({url});assert.equal(first.statusCode,502);assert.equal(first.headers['cache-control'],'no-store');
  const files=await fsp.readdir(path.join(cacheRoot,'cdn','test'));assert.equal(files.length,0);
  const second=await app.inject({url});assert.equal(second.statusCode,200);assert.deepEqual([...second.rawPayload],[1,2,3]);assert.equal(calls,2);
});

test('HTML error pages cannot poison cached engine assets',async t=>{
  const {app}=await fixture(t,async()=>new Response('<html>Not found</html>',{headers:{'content-type':'text/html'}}));
  assert.equal((await app.inject({url:'/games/platinum/cdn/test/game.wasm'})).statusCode,502);
});

test('ad cleanup preserves the enclosing Godot startup function',()=>{
  const input='<script>function start(){window.config={game:true};(function() {\n var KeY=\'\', iFD=494-483;\n function xsh(b){return b;}\n return 9309\n})()\n engine.startGame();}</script>';
  const fixed=rewritePlatinumText(input,'text/html');
  assert.match(fixed,/window.config=\{game:true\}/);assert.match(fixed,/engine.startGame\(\)/);assert.doesNotMatch(fixed,/xsh|KeY/);
  new Function(fixed.replace(/<\/?script>/g,''));
});

test('Construct script suffix checks survive URL rewriting and repair old cached rewrites',()=>{
  const input='if (url.endsWith("/games/platinum/scriptsInEvents.js")) load(); fetch("/cdn/data.json");';
  const fixed=rewritePlatinumText(input,'application/javascript');
  assert.match(fixed,/endsWith\("\/scriptsInEvents.js"\)/);
  assert.match(fixed,/fetch\("\/cdn\/data.json"\)/);
  assert.equal(rewritePlatinumText(fixed,'application/javascript'),fixed);
});

test('root asset redirects apply only to same-host mirrored game referrers', async t=>{
  const {app}=await fixture(t,()=>{throw new Error('unexpected upstream request');});
  const url='/cdn/example/game.js';
  const redirected=await app.inject({url,headers:{referer:'http://localhost:80/games/platinum/cdn/example/index.html'}});
  assert.equal(redirected.statusCode,307);
  assert.equal(redirected.headers.location,'/games/platinum/cdn/example/game.js');
  for(const referer of ['http://elsewhere.test/games/platinum/index.html','http://localhost:80/setup-v2']) {
    assert.equal((await app.inject({url,headers:{referer}})).statusCode,404);
  }
});

test('script charset is explicit and mislabeled binaries keep their bytes',async t=>{
  const {app}=await fixture(t,async url=>url.pathname.endsWith('.js')
    ? new Response('const greek=/^[Α-ώ]+$/i;', {headers:{'content-type':'application/javascript'}})
    : new Response(new Uint8Array([255,254,0,128]),{headers:{'content-type':'text/plain'}}));
  const script=await app.inject({url:'/games/platinum/cdn/test/main.js'});
  assert.match(script.headers['content-type'],/charset=utf-8/);
  new Function(script.body);
  const binary=await app.inject({url:'/games/platinum/cdn/test/game.pck'});
  assert.deepEqual([...binary.rawPayload],[255,254,0,128]);
});

test('Unity custom Brotli loader accepts already decoded data and still decompresses compressed data',()=>{
  const input='return decompress(Buffer.from(bytes));';
  const url=new URL('https://platinumunblocker.com/cdn/test/Build/game.loader.js');
  const fixed=repairGameExport(input,url);
  assert.equal(repairGameExport(fixed,url),fixed);
  let calls=0;
  const run=new Function('bytes','Buffer','decompress',fixed);
  for(const bytes of [[85,110,105,116,121],[0,97,115,109,1]]) {
    assert.deepEqual([...run(bytes,Buffer,()=>{calls++;})],bytes);
  }
  assert.equal(calls,0);
  assert.equal(run([99,33,22],Buffer,()=>{calls++;return 'decoded';}),'decoded');
  assert.equal(calls,1);
});

test('archived export repairs are scoped and idempotent',()=>{
  const source='<body><script src="scripts/game.min.js"></script><script src="scripts/bootstrap.min.js"></script></body>';
  const crossy=new URL('https://platinumunblocker.com/cdn/crossy-road/index.html');
  const result=repairGameExport(source,crossy);
  assert.doesNotMatch(result,/src="scripts\/game.min.js"/);
  assert.match(result,/bootstrap.min.js/);
  assert.equal(repairGameExport(result,crossy),result);
  assert.equal(repairGameExport(source,new URL('https://platinumunblocker.com/cdn/other/index.html')),source);
  const moto=repairGameExport('<body><script src="motox3m.min.js"></script></body>',new URL('https://platinumunblocker.com/cdn/motox3m-pool/index.html'));
  assert.match(moto,/<body id="content">/);
});
