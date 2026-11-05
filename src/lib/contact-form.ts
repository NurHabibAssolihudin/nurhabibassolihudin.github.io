import {sections,t,type Locale} from '../data/professional';

export function initContactForm() {
  const form=document.querySelector<HTMLFormElement>('[data-contact-form]');
  if(!form||form.dataset.ready)return;
  form.dataset.ready='true';
  const status=form.querySelector<HTMLElement>('[data-contact-status]')!;
  const endpoint=form.dataset.endpoint;
  const language:Locale=form.dataset.language==='id'?'id':'en';
  const copy=sections.contact;
  if(!endpoint)return;
  let pending=false,keyboard=false;
  form.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')keyboard=true;});
  form.addEventListener('pointerdown',()=>{keyboard=false;});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(pending||!form.reportValidity())return;
    pending=true;form.setAttribute('aria-busy','true');
    const quiet=keyboard||matchMedia('(prefers-reduced-motion: reduce)').matches;
    const publish=(state:string)=>{form.dataset.state=state;form.dispatchEvent(new CustomEvent('nur:contact-state',{detail:{state,quiet}}));};
    publish('sending');status.textContent=t(copy.sending,language);
    const fields=new FormData(form);
    try{
      const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'omit',referrerPolicy:'origin',signal:AbortSignal.timeout(15000),body:JSON.stringify({name:String(fields.get('name')||'').trim(),email:String(fields.get('email')||'').trim(),message:String(fields.get('message')||'').trim(),website:String(fields.get('website')||''),language})});
      const result:unknown=await response.json();
      if(!response.ok||!result||typeof result!=='object'||!('ok'in result)||result.ok!==true){status.textContent=t(response.status===429?copy.limited:copy.failed,language);publish('error');return;}
      const latest=new FormData(form);
      if(['name','email','message'].every(field=>latest.get(field)===fields.get(field)))form.reset();
      status.textContent=t(copy.sent,language);publish('sent');
    }catch{status.textContent=t(copy.failed,language);publish('error');}
    finally{pending=false;form.removeAttribute('aria-busy');}
  });
}
