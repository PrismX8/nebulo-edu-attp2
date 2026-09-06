import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {applyBrowserDeviceHeaders}=require('../argon/device-headers.cjs');

test('iPhone Safari does not acquire a desktop UA or Chromium hints',()=>{
  const ua='Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1';
  const outgoing=new Headers({'sec-ch-ua-mobile':'?0','sec-ch-ua-platform':'"Windows"','sec-ch-ua':'"Chromium";v="131"'});
  applyBrowserDeviceHeaders(outgoing,{'user-agent':ua,'accept-language':'es-ES,es;q=0.9'});
  assert.equal(outgoing.get('user-agent'),ua);
  assert.equal(outgoing.get('accept-language'),'es-ES,es;q=0.9');
  assert.equal(outgoing.has('sec-ch-ua-mobile'),false);
  assert.equal(outgoing.has('sec-ch-ua-platform'),false);
  assert.equal(outgoing.has('sec-ch-ua'),false);
});
test('Android device hints stay consistent across all forwarding paths',()=>{
  const source=new Headers({'user-agent':'Mozilla/5.0 (Linux; Android 14; Pixel 7) Chrome/131.0.0.0 Mobile Safari/537.36','sec-ch-ua-mobile':'?1','sec-ch-ua-platform':'"Android"','sec-ch-ua':'"Chromium";v="131"'});
  const outgoing=applyBrowserDeviceHeaders(new Headers({'range':'bytes=1-10'}),source);
  for(const [name,value] of source) assert.equal(outgoing.get(name),value);
  assert.equal(outgoing.get('range'),'bytes=1-10');
});
test('desktop browser identity is preserved; missing UA has a fallback',()=>{
  const ua='Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/142.0';
  assert.equal(applyBrowserDeviceHeaders(new Headers(),{'user-agent':ua}).get('user-agent'),ua);
  assert.match(applyBrowserDeviceHeaders(new Headers(),{}).get('user-agent'),/Mozilla/);
});
test('about:blank wrapper contains a device viewport and does not disable pinch zoom',()=>{
  const source=fs.readFileSync(new URL('../public/assets/js/cloaking.js',import.meta.url),'utf8');
  const wrapper=source.split('\n').find(line=>line.includes('doc.write(`<!doctype html>'));
  assert.match(wrapper,/<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.doesNotMatch(wrapper,/user-scalable=no|maximum-scale=1/);
});
