import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import Fastify from 'fastify';
const require=createRequire(import.meta.url);
const argonPlugin=require('../argon/argon-module.js');

test('Argon forwards the actual mobile device to an upstream page and its API',async t=>{
  const observed=[];
  const realFetch=globalThis.fetch;
  const target='mobile-fixture.test';
  // Exercise the complete Argon request pipeline; replace only its final
  // upstream network boundary so this regression does not need a live site.
  globalThis.fetch=async(input,init)=>{
    const req=new Request(input,init);
    assert.equal(new URL(req.url).hostname,target);
    observed.push(Object.fromEntries(req.headers));
    const isApi=new URL(req.url).pathname.startsWith('/api');
    return new Response(isApi?'{"ok":true}':'<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>Mobile fixture</body></html>',{headers:{'content-type':isApi?'application/json':'text/html'}});
  };
  const app=Fastify();
  t.after(async()=>{globalThis.fetch=realFetch;await app.close();});
  await app.register(argonPlugin,{proxy_url:'http://localhost:4019',token_prefix:'/ag/',use_not_found_fallback:false});
  const profiles=[
    {'user-agent':'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/131.0.0.0 Mobile Safari/537.36','sec-ch-ua-mobile':'?1','sec-ch-ua-platform':'"Android"'},
    {'user-agent':'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'},
  ];
  for(const headers of profiles) {
    observed.length=0;
    for(const path of ['/','/api/layout']) {
      const response=await app.inject({url:`/ag/http/${target}${path}`,headers:{...headers,'sec-fetch-dest':path==='/'?'iframe':'empty'}});
      assert.equal(response.statusCode,200,response.body.slice(0,300));
    }
    assert.equal(observed.length,2);
    for(const request of observed) {
      assert.equal(request['user-agent'],headers['user-agent']);
      assert.equal(request['sec-ch-ua-mobile'],headers['sec-ch-ua-mobile']);
      assert.equal(request['sec-ch-ua-platform'],headers['sec-ch-ua-platform']);
    }
  }
});
