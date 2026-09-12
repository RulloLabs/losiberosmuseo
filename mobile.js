/* Los Íberos — touch controls + mobile quality guard for the Antigravity Three.js experience. */
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
const coarse = window.matchMedia('(pointer: coarse)').matches;
window.__IBERO_MOBILE__ = coarse;
if (coarse) {
  try { const dpr = Math.min(window.devicePixelRatio || 1, 1.25); Object.defineProperty(window, 'devicePixelRatio', { configurable:true, get:()=>dpr }); } catch {}
  PointerLockControls.prototype.lock = function(){ if(this.isLocked)return; this.isLocked=true; this.dispatchEvent({type:'lock'}); };
  PointerLockControls.prototype.unlock = function(){ if(!this.isLocked)return; this.isLocked=false; this.dispatchEvent({type:'unlock'}); };
  let activeControls=null;
  const originalAdd=PointerLockControls.prototype.addEventListener;
  PointerLockControls.prototype.addEventListener=function(type,listener){activeControls=this;return originalAdd.call(this,type,listener);};
  const layer=document.createElement('div');
  layer.id='mobile-controls';
  layer.innerHTML=`<div class="mobile-look-zone" aria-label="Arrastra para mirar"></div><div class="mobile-joystick" aria-label="Joystick de movimiento"><div class="mobile-stick"></div></div><button class="mobile-action" type="button" aria-label="Interactuar">◉</button><button class="mobile-help" type="button" aria-label="Mostrar controles">i</button>`;
  const style=document.createElement('style');
  style.textContent=`#mobile-controls{display:none;position:fixed;inset:0;z-index:200;pointer-events:none;touch-action:none;font-family:Inter,system-ui,sans-serif}@media(pointer:coarse){#mobile-controls{display:block}.mobile-look-zone{position:absolute;inset:0 0 0 36%;pointer-events:auto;touch-action:none}.mobile-joystick{position:absolute;left:18px;bottom:max(20px,env(safe-area-inset-bottom));width:112px;height:112px;border:1px solid rgba(200,169,110,.42);border-radius:50%;background:rgba(8,6,4,.34);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);pointer-events:auto;touch-action:none}.mobile-stick{position:absolute;left:50%;top:50%;width:48px;height:48px;border-radius:50%;border:1px solid rgba(200,169,110,.9);background:rgba(200,169,110,.24);box-shadow:0 4px 18px rgba(0,0,0,.25);transform:translate(-50%,-50%);transition:transform .06s linear}.mobile-action,.mobile-help{position:absolute;right:18px;border:1px solid rgba(200,169,110,.55);border-radius:50%;background:rgba(8,6,4,.5);color:#c8a96e;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.mobile-action{bottom:max(28px,calc(env(safe-area-inset-bottom) + 8px));width:66px;height:66px;font-size:1.25rem}.mobile-help{bottom:112px;width:42px;height:42px;font-size:1rem}.mobile-action:active,.mobile-help:active{transform:scale(.94)}}`;
  document.head.appendChild(style);
  const mount=()=>document.body.appendChild(layer); if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  let joyId=null,lookId=null,lastX=0,lastY=0;const pressed=new Set(),max=42;
  const emitKey=(code,down)=>document.dispatchEvent(new KeyboardEvent(down?'keydown':'keyup',{code,bubbles:true}));
  const activate=()=>{if(activeControls&&!activeControls.isLocked&&document.getElementById('hud')?.style.display==='block')activeControls.lock();};
  const releaseMovement=()=>{for(const code of pressed)emitKey(code,false);pressed.clear();const stick=document.querySelector('.mobile-stick');if(stick)stick.style.transform='translate(-50%,-50%)';joyId=null;};
  const bind=()=>{
    const joy=document.querySelector('.mobile-joystick'),stick=document.querySelector('.mobile-stick'),look=document.querySelector('.mobile-look-zone'),action=document.querySelector('.mobile-action'),help=document.querySelector('.mobile-help');if(!joy||!stick||!look||!action||!help)return;
    const updateJoystick=e=>{const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.min(Math.hypot(dx,dy),max),a=Math.atan2(dy,dx),x=Math.cos(a)*len,y=Math.sin(a)*len;stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;const want=new Set();if(x/max<-.22)want.add('KeyA');else if(x/max>.22)want.add('KeyD');if(y/max<-.22)want.add('KeyW');else if(y/max>.22)want.add('KeyS');for(const code of want)if(!pressed.has(code)){pressed.add(code);emitKey(code,true)}for(const code of [...pressed])if(!want.has(code)){pressed.delete(code);emitKey(code,false)}};
    joy.addEventListener('pointerdown',e=>{e.preventDefault();activate();joyId=e.pointerId;joy.setPointerCapture?.(e.pointerId);updateJoystick(e)});joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId){e.preventDefault();updateJoystick(e)}});joy.addEventListener('pointerup',releaseMovement);joy.addEventListener('pointercancel',releaseMovement);
    look.addEventListener('pointerdown',e=>{e.preventDefault();activate();lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;look.setPointerCapture?.(e.pointerId)});look.addEventListener('pointermove',e=>{if(e.pointerId!==lookId)return;e.preventDefault();const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;document.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:e.clientX,clientY:e.clientY,movementX:dx,movementY:dy}))});const releaseLook=()=>{lookId=null};look.addEventListener('pointerup',releaseLook);look.addEventListener('pointercancel',releaseLook);
    action.addEventListener('pointerdown',e=>{e.preventDefault();activate();document.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:e.clientX,clientY:e.clientY}))});
    help.addEventListener('pointerdown',e=>{e.preventDefault();const hint=document.getElementById('hint');if(hint){hint.textContent='Joystick: mover · Arrastra: mirar · ◉: interactuar';hint.style.opacity='1';setTimeout(()=>hint.style.opacity='0',4500)}});
  };bind();
}
