import {useEffect, useRef, useState} from 'react';
import {useReducedMotion} from 'motion/react';
import RotatingText from './react-bits/RotatingText';
import {motionTiming} from '../lib/motion-settings';

/** React Bits' plain-CSS component, paused by the surrounding form lifecycle. */
export default function ContactTopics({topics}: {topics: string[]}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active,setActive] = useState(false);
  const reduce = useReducedMotion();
  useEffect(()=>{
    const node=ref.current, form=node?.closest('form');
    if(!node || !form)return;
    let visible=false;
    const refresh=()=>setActive(visible&&!document.hidden&&!form.matches(':focus-within')&&!form.hasAttribute('aria-busy')&&document.documentElement.dataset.world==='builder');
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();},{root:document.getElementById('professional-scroll'),threshold:.5});
    observer.observe(node);
    const busy=new MutationObserver(refresh);busy.observe(form,{attributes:true,attributeFilter:['aria-busy']});
    const afterFocus=()=>queueMicrotask(refresh);
    form.addEventListener('focusin',refresh);form.addEventListener('focusout',afterFocus);
    document.addEventListener('visibilitychange',refresh);window.addEventListener('nur:world',refresh);
    return()=>{observer.disconnect();busy.disconnect();form.removeEventListener('focusin',refresh);form.removeEventListener('focusout',afterFocus);document.removeEventListener('visibilitychange',refresh);window.removeEventListener('nur:world',refresh);};
  },[]);
  return <span className="contact-topic-bit" ref={ref}><RotatingText texts={topics} auto={active&&!reduce} rotationInterval={motionTiming.contact.topicHold*1000} splitBy="words" staggerDuration={.035} effect="slide" mainClassName="contact-topic-text" /></span>;
}

