import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const helpers=require('../chat-git-main/services/chat/attachments');
const local='/api/upload/image/12345678-abcd-1234';

test('native image markup stays off the upstream text service',()=>{
  const media=helpers.prepareNativeMediaMessage(`A photo\n[img:${local}]`,[{url:local,name:'photo.png'}]);
  assert.equal(media.upstreamBody,'A photo');
  assert.equal(media.nativeBody,`A photo\n[img:${local}]`);
  assert.deepEqual(media.nativeUrls,[local]);
  assert.equal(media.attachments[0].url,local);
  assert.equal(helpers.prepareNativeMediaMessage(`[img:${local}]`,[]).upstreamBody,'Image attachment');
});

test('plain text is unchanged and external image URLs are not laundered as native',()=>{
  for(const body of ['hello','[img:https://example.com/image.png]']) {
    const media=helpers.prepareNativeMediaMessage(body,[]);
    assert.equal(media.upstreamBody,body);assert.equal(media.nativeBody,null);
  }
});

test('attachment URLs reject script URLs, traversal and unrelated local endpoints',()=>{
  for(const url of ['javascript:alert(1)','//evil.test/a','/api/auth','/api/upload/image/../../auth','/api/upload/image/short','https://user:pass@example.com/a','data:image/png;base64,AA']) assert.equal(helpers.attachmentUrl(url),'');
  assert.equal(helpers.attachmentUrl(local),local);
  assert.equal(helpers.attachmentUrl('https://example.com/a.png'),'https://example.com/a.png');
});

// Run the real persistence module with an in-memory filesystem so tests never
// read, normalize, or modify any real user's messages or profiles.
function isolatedStore(files=new Map()) {
  const fakeFs={existsSync:p=>files.has(p),readFileSync:p=>files.get(p),mkdirSync(){},writeFileSync:(p,s)=>files.set(p,s),renameSync:(a,b)=>{files.set(b,files.get(a));files.delete(a);}};
  const module={exports:{}};
  vm.runInNewContext(fs.readFileSync(new URL('../chat-git-main/services/chat/messageFeatureStore.js',import.meta.url),'utf8'),{
    module,exports:module.exports,__dirname:'/isolated/services/chat',console,
    require:n=>n==='fs'?fakeFs:n==='path'?path:n==='./attachments'?helpers:require(n),Date,Set,Map,URL,
  });
  return {store:module.exports,files};
}

test('native images and reply thumbnails survive persistence, polling and edits',()=>{
  let {store,files}=isolatedStore();
  const body=`Photo\n[img:${local}]`;
  store.recordMessage('room',{id:'123',body,userId:'u1',username:'alice'},
    {attachments:[{url:local}],nativeBody:body,reply:{messageId:'100',author:'bob',imageUrl:local}});
  ({store}=isolatedStore(files));
  const decorated=store.decorateMessages('room',[{id:'123',body:'[filtered]'}],{id:'u1'})[0];
  assert.equal(decorated.body,body);
  assert.equal(decorated.attachments[0].url,local);
  assert.equal(decorated.reply.imageUrl,local);
  assert.equal(store.getRoomMessageHistory('room').messages[0].body,body);
  store.editMessage('room','123',{id:'u1',username:'alice'},'Updated caption');
  ({store}=isolatedStore(files));
  const edited=store.decorateMessages('room',[{id:'123',body:'Image attachment'}],{id:'u1'})[0];
  assert.equal(edited.body,'Updated caption');
  assert.equal(edited.attachments[0].url,local);
  const deleted=store.decorateMessages('room',[{id:'123',body:'Deleted',deleted:true}],{id:'u1'})[0];
  assert.equal(deleted.body,'Deleted');assert.equal(deleted.attachments.length,0);
});
