import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source=readFileSync(new URL('../src/lib/contact-transport.ts',import.meta.url),'utf8').replace('import.meta.env.PUBLIC_CONTACT_TURNSTILE_SITE_KEY',"'test-public-key'");
const {sendContact}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
test('Sendme uses fresh challenges and keeps the receipt for unchanged failed retries',async()=>{
  const originals={window:globalThis.window,document:globalThis.document,fetch:globalThis.fetch};
  let options,token=0,status=502;const requests=[];
  globalThis.window={turnstile:{render:(_,value)=>{options=value;return 'widget';},execute:()=>queueMicrotask(()=>options.callback('token-'+ ++token)),remove:()=>{}}};
  globalThis.document={createElement:()=>({setAttribute(){},remove(){}})};
  globalThis.fetch=async(url,init)=>{requests.push({url,body:JSON.parse(init.body)});return new Response(JSON.stringify({ok:status===202}),{status});};
  try{
    const form={append(){}},endpoint='http://127.0.0.1:8787/v1/forms/example/messages',payload={name:'QA',email:'qa@example.net',message:'hello'};
    assert.equal((await sendContact(form,endpoint,payload)).ok,false);
    status=202;assert.equal((await sendContact(form,endpoint,payload)).ok,true);
    assert.equal(options.action,'sendme');assert.equal(options.cData,'example');
    assert.equal(requests[0].body._submissionId,requests[1].body._submissionId);
    assert.notEqual(requests[0].body.turnstileToken,requests[1].body.turnstileToken);
    await sendContact(form,endpoint,{...payload,message:'changed'});
    assert.notEqual(requests[1].body._submissionId,requests[2].body._submissionId);
    status=200;globalThis.fetch=async()=>new Response(JSON.stringify({ok:false}),{status});
    assert.equal((await sendContact(form,endpoint,payload)).ok,false);
  }finally{for(const [key,value] of Object.entries(originals)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}}
});
