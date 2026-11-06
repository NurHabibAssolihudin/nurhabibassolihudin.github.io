import {useEffect,useState} from 'react';
export function useCreatorActivity(){
  const [active,setActive]=useState(false),[fine,setFine]=useState(false);
  useEffect(()=>{
    const pointer=matchMedia('(hover:hover) and (pointer:fine)');
    const sync=()=>{setActive(document.documentElement.dataset.world==='creator'&&!document.hidden);setFine(pointer.matches);};
    sync();window.addEventListener('nur:world',sync);document.addEventListener('visibilitychange',sync);pointer.addEventListener('change',sync);
    return()=>{window.removeEventListener('nur:world',sync);document.removeEventListener('visibilitychange',sync);pointer.removeEventListener('change',sync);};
  },[]);
  return {active,fine};
}
