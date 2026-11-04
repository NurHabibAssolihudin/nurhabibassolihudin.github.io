import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createWheelNavigation} from '../src/lib/wheel-navigation.ts';

test('one burst of fast equal wheel events advances only one section',()=>{
 const wheel=createWheelNavigation(9);
 assert.equal(wheel.input(120,0,2),3);
 for(const time of [30,60,90,120,150])assert.equal(wheel.input(120,time,2),null);
 assert.equal(wheel.arrive(3),undefined);
 assert.equal(wheel.arrive(3),undefined);
});
test('a sustained coarse wheel gesture cannot rearm at 80–130ms intervals',()=>{
 for(const spacing of [80,100,120,130])for(const step of [1,-1]){
  const wheel=createWheelNavigation(9),start=4;
  assert.equal(wheel.input(step*120,0,start),start+step);
  for(let time=spacing;time<=600;time+=spacing)wheel.input(step*120,time,start);
  wheel.arrive(start+step);
  for(let time=spacing*Math.floor(600/spacing)+spacing;time<=1600;time+=spacing){
   assert.equal(wheel.input(step*120,time,start+step),null,`${spacing}ms tail at ${time}ms`);
  }
  assert.equal(wheel.input(step*120,1900,start+step),start+step*2);
 }
});
test('arrival cannot execute a wheel command received during movement',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);
 wheel.input(120,200,2);wheel.input(120,400,2);
 assert.equal(wheel.arrive(3),undefined);
});
test('a new same-direction command after a pause advances normally',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);wheel.input(120,120,2);wheel.input(120,240,2);
 wheel.arrive(3);
 assert.equal(wheel.input(120,400,3),4);
 wheel.input(120,520,3);wheel.arrive(4);
 // Arrival itself is not a gesture boundary: pause beyond the previous tail.
 assert.equal(wheel.input(120,680,4),5);
});
test('the same fast burst cannot restart just because the section arrived',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);
 for(let time=30;time<=300;time+=30)wheel.input(120,time,2);
 wheel.arrive(3);
 for(let time=330;time<=900;time+=30)assert.equal(wheel.input(120,time,3),null);
 assert.equal(wheel.input(120,1100,3),4);
});
test('one continuous fine trackpad gesture does not skip a section',()=>{
 const wheel=createWheelNavigation(9);
 for(let i=0;i<11;i++)assert.equal(wheel.input(5,i*18,2),null);
 assert.equal(wheel.input(5,198,2),3);
 for(let i=12;i<30;i++)wheel.input(5,i*18,2);
 wheel.arrive(3);
 for(let i=30;i<90;i++)assert.equal(wheel.input(5,i*18,3),null);
 for(let i=0;i<11;i++)assert.equal(wheel.input(5,1900+i*18,3),null);
 assert.equal(wheel.input(5,2098,3),4);
});
test('decaying momentum after arrival remains part of the old gesture',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);wheel.arrive(3);
 for(const [time,delta]of[[102,50],[231,35],[315,20],[380,12],[426,8],[485,4],[541,2]])assert.equal(wheel.input(delta,time,3),null);
});
test('a renewed trackpad push after arrival can navigate without reversing',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);wheel.arrive(3);
 for(const [i,delta]of[30,12,4,2].entries())wheel.input(delta,(i+1)*18,3);
 assert.equal(wheel.input(12,90,3),null);
 assert.equal(wheel.input(20,108,3),null);
 assert.equal(wheel.input(30,126,3),4);
});
test('intentional reverse input interrupts instead of skipping a prior section',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);wheel.input(120,120,2);
 assert.equal(wheel.input(-120,160,2),2);
 wheel.arrive(2);
 assert.equal(wheel.input(-120,360,2),1);
});
test('tiny opposite noise does not reverse or queue movement',()=>{
 const wheel=createWheelNavigation(9);
 wheel.input(120,0,2);
 assert.equal(wheel.input(-8,30,2),null);
 assert.equal(wheel.input(20,60,2),null);
 assert.equal(wheel.arrive(3),undefined);
});
test('boundaries and explicit reset cannot retain hidden movement',()=>{
 const wheel=createWheelNavigation(9);
 assert.equal(wheel.input(-120,0,0),null);
 assert.equal(wheel.input(120,50,0),1);
 wheel.input(120,150,0);wheel.reset();
 assert.equal(wheel.arrive(1),undefined);
 assert.equal(wheel.input(-120,200,8),7);
});
