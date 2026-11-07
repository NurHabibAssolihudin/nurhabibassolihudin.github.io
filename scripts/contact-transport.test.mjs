import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
const source=readFileSync(new URL('../src/lib/contact-transport.ts',import.meta.url),'utf8');
const {sendContact,resumeContact}=await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
test('hosted handoff preserves unchanged draft key without loading customer Turnstile',async()=>{
  const names=['document','location','sessionStorage','HTMLFormElement','HTMLInputElement','HTMLTextAreaElement','history','fetch'];
  const original=Object.fromEntries(names.map(name=>[name,globalThis[name]]));
  const stored=new Map(),posted=[];
  class Input{value='';name='';type='';}class Textarea extends Input{}
  class Form{children=[];append(input){this.children.push(input);}submit(){posted.push({action:this.action,fields:Object.fromEntries(this.children.map(i=>[i.name,i.value]))});}}
  globalThis.HTMLFormElement=Form;globalThis.HTMLInputElement=Input;globalThis.HTMLTextAreaElement=Textarea;
  globalThis.document={createElement:tag=>tag==='form'?new Form():new Input(),body:{append(){}}};
  globalThis.location={href:'https://portfolio.example/id/?utm_source=campaign#contact'};
  globalThis.sessionStorage={getItem:key=>stored.get(key),setItem:(key,value)=>stored.set(key,value),removeItem:key=>stored.delete(key)};
  try{
    const endpoint='https://sendme.example/v1/forms/12345678-1234-1234-1234-123456789abc/messages';
    const form={hasAttribute:()=>false},payload={name:'QA',email:'qa@example.net',message:'hello'};
    assert.equal((await sendContact(form,endpoint,payload)).navigating,true);
    await sendContact(form,endpoint,payload);
    assert.equal(posted[0].action,'https://sendme.example/f/12345678-1234-1234-1234-123456789abc');
    assert.equal(posted[0].fields._submissionId,posted[1].fields._submissionId);
    assert.equal(posted[0].fields._returnTo,'https://portfolio.example/id/#contact');
    assert.equal('turnstileToken' in posted[0].fields,false);
    await sendContact(form,endpoint,{...payload,message:'changed'});
    assert.notEqual(posted[1].fields._submissionId,posted[2].fields._submissionId);
    const inputs=Object.fromEntries(Object.entries({...payload,message:'changed'}).map(([k,v])=>{const i=new Input();i.value=v;return[k,i];}));
    const returning={...form,elements:{namedItem:name=>inputs[name]},reset(){throw Error('must not reset unverified receipt');}};
    location.href='https://portfolio.example/id/?__sendme=12345678-1234-1234-1234-123456789abc.sm_'+'a'.repeat(64)+'#contact';
    globalThis.history={state:null,replaceState(){}};globalThis.fetch=async()=>new Response(JSON.stringify({ok:false}),{status:403});
    assert.equal(await resumeContact(returning,endpoint),'draft');
    assert.equal(inputs.message.value,'changed');
    globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,accepted:true,formId:'another-form'}));
    assert.equal(await resumeContact(returning,endpoint),'draft');
    let reset=0;returning.reset=()=>{reset++;};
    globalThis.fetch=async()=>new Response(JSON.stringify({ok:true,accepted:true,formId:'12345678-1234-1234-1234-123456789abc'}));
    assert.equal(await resumeContact(returning,endpoint),'accepted');assert.equal(reset,1);assert.equal(stored.size,0);
    // A blocked storage API does not prevent server-verified status confirmation.
    globalThis.sessionStorage={getItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}};
    assert.equal(await resumeContact(returning,endpoint),'accepted');
  }finally{for(const [name,value] of Object.entries(original)){if(value===undefined)delete globalThis[name];else globalThis[name]=value;}}
});
