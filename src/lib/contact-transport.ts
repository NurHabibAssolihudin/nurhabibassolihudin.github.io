type Draft={at:number;key:string;payload:Record<string,string>;returnTo:string};
const ttl=15*60*1000;
function hostedEndpoint(endpoint:string){
  const url=new URL(endpoint);
  url.pathname=url.pathname.replace(/^\/v1\/forms\/([^/]+)\/messages$/,'/f/$1');
  if(!/^\/f\/[a-f0-9-]{36}$/.test(url.pathname)||url.username||url.password||url.search||url.hash||!(url.protocol==='https:'||(url.protocol==='http:'&&['localhost','127.0.0.1'].includes(url.hostname))))throw Error('invalid_endpoint');
  return url;
}
const storageKey=(endpoint:string,fragment:string)=>'sendme-draft:'+hostedEndpoint(endpoint).href+':'+fragment;
const read=(key:string):Draft|undefined=>{try{const value=JSON.parse(sessionStorage.getItem(key)||'null');if(value&&Number.isFinite(value.at)&&value.at<=Date.now()&&value.at>Date.now()-ttl&&value.payload&&typeof value.key==='string')return value;sessionStorage.removeItem(key);}catch{}return undefined;};
/** Native top-level navigation: customer sites never mount a Turnstile widget. */
export async function sendContact(form:HTMLFormElement,endpoint:string,payload:Record<string,string>,signal?:AbortSignal){
  signal?.throwIfAborted();
  const url=hostedEndpoint(endpoint),fragment=form.hasAttribute('data-creator-form')?'#play':'#contact';
  const back=new URL(location.href);back.search='';back.hash=fragment;
  const storage=storageKey(endpoint,fragment),previous=read(storage);
  const key=previous&&JSON.stringify(previous.payload)===JSON.stringify(payload)?previous.key:crypto.randomUUID();
  try{sessionStorage.setItem(storage,JSON.stringify({at:Date.now(),key,payload,returnTo:back.href}));}catch{}
  const transport=document.createElement('form');transport.method='POST';transport.action=url.href;transport.hidden=true;
  for(const [name,value] of Object.entries({...payload,_submissionId:key,_returnTo:back.href})){
    const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;transport.append(input);
  }
  document.body.append(transport);HTMLFormElement.prototype.submit.call(transport);
  return {ok:false,status:0,navigating:true};
}
/** A URL parameter alone cannot show success. */
export async function resumeContact(form:HTMLFormElement,endpoint:string):Promise<'accepted'|'draft'|undefined>{
  const fragment=form.hasAttribute('data-creator-form')?'#play':'#contact',key=storageKey(endpoint,fragment),draft=read(key);
  const here=new URL(location.href),receipt=here.searchParams.get('__sendme');
  if(here.hash!==fragment)return;
  for(const [name,value] of Object.entries(draft?.payload??{})){
    const field=form.elements.namedItem(name);
    if((field instanceof HTMLInputElement||field instanceof HTMLTextAreaElement)&&!field.value)field.value=value;
  }
  if(!receipt)return draft?'draft':undefined;
  here.searchParams.delete('__sendme');history.replaceState(history.state,'',here.href);
  const match=/^([a-f0-9-]{36})\.(sm_[a-f0-9]{64})$/.exec(receipt);
  if(!match)return 'draft';
  try{
    const response=await fetch(new URL('/api/submission-receipts/'+match[1],hostedEndpoint(endpoint)),{headers:{'X-Sendme-Receipt':match[2]},credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(10000)});
    const result=await response.json();
    if(response.ok&&result.ok===true&&result.accepted===true&&result.formId===hostedEndpoint(endpoint).pathname.split('/').pop()){
      if(draft&&Object.entries(draft.payload).filter(([name])=>['name','email','message'].includes(name)).every(([name,value])=>(form.elements.namedItem(name) as HTMLInputElement|null)?.value===value))form.reset();
      try{sessionStorage.removeItem(key);}catch{}return 'accepted';
    }
  }catch{}
  return 'draft';
}
