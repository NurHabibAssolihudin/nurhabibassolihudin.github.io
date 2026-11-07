interface Turnstile {
  render(container:HTMLElement,options:Record<string,unknown>):string;
  execute(id:string):void;
  remove(id:string):void;
}
let loading:Promise<Turnstile>|undefined;
function loadTurnstile():Promise<Turnstile>{
  const api=()=> (window as Window & {turnstile?:Turnstile}).turnstile;
  if(api())return Promise.resolve(api()!);
  if(!loading)loading=new Promise<Turnstile>((resolve,reject)=>{
    const script=document.createElement('script');
    script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;
    const timer=setTimeout(()=>{script.remove();reject(new Error('verification_timeout'));},20000);
    script.onload=()=>{clearTimeout(timer);api()?resolve(api()!):reject(new Error('verification_unavailable'));};
    script.onerror=()=>{clearTimeout(timer);script.remove();reject(new Error('verification_unavailable'));};
    document.head.append(script);
  }).catch(error=>{loading=undefined;throw error;});
  return loading;
}
async function challenge(form:HTMLFormElement,formId:string,signal?:AbortSignal){
  const sitekey=import.meta.env.PUBLIC_CONTACT_TURNSTILE_SITE_KEY?.trim();
  if(!sitekey)throw new Error('verification_not_configured');
  const api=await loadTurnstile();signal?.throwIfAborted();
  const host=document.createElement('div');host.className='contact-verification';
  host.setAttribute('aria-label','Cloudflare verification');form.append(host);
  return new Promise<string>((resolve,reject)=>{
    let widget:string|undefined,finished=false;
    const finish=(token?:string)=>{if(finished)return;finished=true;clearTimeout(timer);signal?.removeEventListener('abort',cancel);if(widget)api.remove(widget);host.remove();token?resolve(token):reject(new Error('verification_failed'));};
    const cancel=()=>finish();
    const timer=setTimeout(cancel,120000);
    signal?.addEventListener('abort',cancel,{once:true});
    try{widget=api.render(host,{sitekey,action:'sendme',cData:formId,execution:'execute',appearance:'interaction-only',size:'flexible',callback:(token:string)=>finish(token),'error-callback':()=>{finish();return true;},'expired-callback':cancel,'timeout-callback':cancel});api.execute(widget);}catch{finish();}
  });
}
const receipts=new WeakMap<HTMLFormElement,{fingerprint:string;key:string}>();
/** Both worlds use the same public Sendme protocol; no private key reaches the browser. */
export async function sendContact(form:HTMLFormElement,endpoint:string,payload:Record<string,string>,signal?:AbortSignal){
  const formId=new URL(endpoint).pathname.match(/^\/v1\/forms\/([^/]+)\/messages$/)?.[1];
  const fingerprint=JSON.stringify([endpoint,payload]);
  let receipt=receipts.get(form);
  if(!receipt||receipt.fingerprint!==fingerprint){receipt={fingerprint,key:crypto.randomUUID()};receipts.set(form,receipt);}
  const token=formId?await challenge(form,formId,signal):undefined;
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'omit',referrerPolicy:'origin',signal:signal?AbortSignal.any([signal,AbortSignal.timeout(15000)]):AbortSignal.timeout(15000),body:JSON.stringify({...payload,...(formId?{turnstileToken:token,_submissionId:receipt.key}:{})})});
  const result:unknown=await response.json();
  const ok=response.ok&&typeof result==='object'&&result!==null&&'ok'in result&&result.ok===true;
  if(ok)receipts.delete(form);
  return {ok,status:response.status};
}

