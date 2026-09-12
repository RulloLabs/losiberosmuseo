/* Los Íberos — mobile touch layer for the Antigravity Three.js experience. */
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const coarse = window.matchMedia('(pointer: coarse)').matches;
if (coarse) {
  try {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
    Object.defineProperty(window, 'devicePixelRatio', { configurable: true, get: () => dpr });
  } catch {}

  const originalLock = PointerLockControls.prototype.lock;
  PointerLockControls.prototype.lock = function () {
    if (this.isLocked) return;
    this.isLocked = true;
    this.dispatchEvent({ type: 'lock' });
  };
  PointerLockControls.prototype.unlock = function () {
    if (!this.isLocked) return;
    this.isLocked = false;
    this.dispatchEvent({ type: 'unlock' });
  };

  let lastControls = null;
  const originalAdd = PointerLockControls.prototype.addEventListener;
  PointerLockControls.prototype.addEventListener = function (type, listener) {
    lastControls = this;
    return originalAdd.call(this, type, listener);
  };

  const layer = document.createElement('div');
  layer.id = 'mobile-controls';
  layer.innerHTML = `
    <div class="mobile-look-zone" aria-hidden="true"></div>
    <div class="mobile-joystick" aria-label="Joystick de movimiento"><div class="mobile-stick"></div></div>
    <button class="mobile-action" type="button" aria-label="Interactuar">◉</button>
    <button class="mobile-help" type="button" aria-label="Controles">i</button>
  `;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(layer), { once: true });

  const style = document.createElement('style');
  style.textContent = `
    #mobile-controls{display:none;position:fixed;inset:0;z-index:200;pointer-events:none;touch-action:none;font-family:Inter,system-ui,sans-serif}
    @media(pointer:coarse){#mobile-controls{display:block}.mobile-look-zone{position:absolute;inset:0 0 0 40%;pointer-events:auto;touch-action:none}.mobile-joystick{position:absolute;left:18px;bottom:22px;width:108px;height:108px;border:1px solid rgba(200,169,110,.38);border-radius:50%;background:rgba(8,6,4,.34);backdrop-filter:blur(8px);pointer-events:auto;touch-action:none}.mobile-stick{position:absolute;left:50%;top:50%;width:48px;height:48px;border-radius:50%;border:1px solid rgba(200,169,110,.8);background:rgba(200,169,110,.22);transform:translate(-50%,-50%)}.mobile-action,.mobile-help{position:absolute;right:18px;border:1px solid rgba(200,169,110,.48);border-radius:50%;background:rgba(8,6,4,.48);color:#c8a96e;backdrop-filter:blur(8px);pointer-events:auto;touch-action:manipulation}.mobile-action{bottom:30px;width:64px;height:64px;font-size:1.3rem}.mobile-help{bottom:108px;width:40px;height:40px}.mobile-help:active,.mobile-action:active{transform:scale(.94)}}
  `;
  document.head.appendChild(style);

  let joyId = null, lookId = null, lastX = 0, lastY = 0;
  const pressed = new Set();
  const max = 42;
  const emitKey = (code, down) => document.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, bubbles: true }));

  const activate = () => {
    if (lastControls && !lastControls.isLocked && document.getElementById('hud')?.style.display === 'block') lastControls.lock();
  };

  const waitForUi = () => {
    const joy = document.querySelector('.mobile-joystick');
    const stick = document.querySelector('.mobile-stick');
    const look = document.querySelector('.mobile-look-zone');
    const action = document.querySelector('.mobile-action');
    const help = document.querySelector('.mobile-help');
    if (!joy || !stick || !look || !action || !help) return setTimeout(waitForUi, 30);
    setInterval(activate, 100);

    const update = e => {
      const r=joy.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);
      const len=Math.min(Math.hypot(dx,dy),max),a=Math.atan2(dy,dx),x=Math.cos(a)*len,y=Math.sin(a)*len;
      stick.style.transform=`translate(calc(-50% + ${x}px),calc(-50% + ${y}px))`;
      const want=new Set();
      if(x/max<-.22)want.add('KeyA');else if(x/max>.22)want.add('KeyD');
      if(y/max<-.22)want.add('KeyW');else if(y/max>.22)want.add('KeyS');
      for(const code of want)if(!pressed.has(code)){pressed.add(code);emitKey(code,true)}
      for(const code of [...pressed])if(!want.has(code)){pressed.delete(code);emitKey(code,false)}
    };
    const release=()=>{for(const code of [...pressed]){pressed.delete(code);emitKey(code,false)}stick.style.transform='translate(-50%,-50%)';joyId=null};
    joy.addEventListener('pointerdown',e=>{e.preventDefault();joyId=e.pointerId;joy.setPointerCapture?.(e.pointerId);update(e)});
    joy.addEventListener('pointermove',e=>{if(e.pointerId===joyId){e.preventDefault();update(e)}});
    joy.addEventListener('pointerup',release);joy.addEventListener('pointercancel',release);

    look.addEventListener('pointerdown',e=>{e.preventDefault();lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;look.setPointerCapture?.(e.pointerId)});
    look.addEventListener('pointermove',e=>{if(e.pointerId!==lookId)return;e.preventDefault();const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;document.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,clientX:e.clientX,clientY:e.clientY,movementX:dx,movementY:dy}))});
    const releaseLook=()=>{lookId=null};look.addEventListener('pointerup',releaseLook);look.addEventListener('pointercancel',releaseLook);

    action.addEventListener('pointerdown',e=>{e.preventDefault();activate();document.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:e.clientX,clientY:e.clientY}))});
    help.addEventListener('pointerdown',e=>{e.preventDefault();const hint=document.getElementById('hint');if(hint){hint.textContent='Joystick: mover · Arrastra: mirar · ◉: interactuar';hint.style.opacity='1'}});
  };
  waitForUi();
}
