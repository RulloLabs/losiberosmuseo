import gsap from 'gsap';
import { ROOMS, ROOM_ORDER } from '../data/rooms.js';

/**
 * HUD.js
 * Heads-up display: room name, progress tracker, narration text,
 * objective checklist, and discovery flash animations.
 */
export class HUD {
  constructor() {
    this.objectiveIds = [];
    this.el = this._build();
    document.body.appendChild(this.el);
  }

  _build() {
    const hud = document.createElement('div');
    hud.id = 'hud';
    hud.innerHTML = `
      <!-- Room Banner -->
      <div id="room-banner">
        <div id="room-name"> </div>
        <div id="room-subtitle"> </div>
      </div>

      <!-- Narrator text -->
      <div id="narrator-text"> </div>

      <!-- Journey progress -->
      <div id="journey-progress">
        ${ROOM_ORDER.map((id, i) => `
          <div class="progress-dot" data-room="${id}" title="${ROOMS[id].name}">
            <div class="dot-inner"></div>
            <div class="dot-label">${ROOMS[id].name}</div>
          </div>
          ${i < ROOM_ORDER.length - 1 ? '<div class="progress-line"></div>' : ''}
        `).join('')}
      </div>

      <!-- Objectives -->
      <div id="objectives">
        <div id="obj-title">🎯 Artefactos</div>
        <div id="obj-list"></div>
      </div>

      <!-- Discovery flash -->
      <div id="discovery-flash"> </div>

      <!-- Completion banner -->
      <div id="completion-banner" class="hidden">
        <div class="comp-icon">✦</div>
        <div class="comp-text">Viaje Completado</div>
        <div class="comp-sub">Has desvelado los secretos íberos</div>
      </div>

      <!-- Controls hint -->
      <div id="controls-hint">WASD • Ratón para mirar • E para explorar</div>
    `;
    return hud;
  }

  setObjectives(ids) {
    this.objectiveIds = ids;
    const list = this.el.querySelector('#obj-list');
    list.innerHTML = ids.map(id => `
      <div class="obj-item" id="obj-${id}">
        <span class="obj-check">○</span>
        <span class="obj-name" data-id="${id}"> </span>
      </div>
    `).join('');
  }

  setObjectiveName(id, name) {
    const el = this.el.querySelector(`.obj-name[data-id="${id}"]`);
    if (el) el.textContent = name;
  }

  markDiscovered(id) {
    const item = this.el.querySelector(`#obj-${id}`);
    if (!item) return;
    item.querySelector('.obj-check').textContent = '✓';
    item.classList.add('discovered');
    gsap.fromTo(item, { x: -8, opacity: 0.5 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
  }

  flashDiscovery(id) {
    const flash = this.el.querySelector('#discovery-flash');
    const name = this.el.querySelector(`.obj-name[data-id="${id}"]`)?.textContent || 'Artefacto';
    flash.textContent = `✦ ${name} descubierto`;
    gsap.killTweensOf(flash);
    gsap.fromTo(flash,
      { opacity: 0, y: -20, scale: 0.9 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)',
        yoyo: true, repeat: 1, repeatDelay: 2.2,
        onComplete: () => { flash.textContent = ''; }
      }
    );
  }

  setRoom(roomId) {
    const room = ROOMS[roomId];
    if (!room) return;

    // Room banner
    const nameEl = this.el.querySelector('#room-name');
    const subEl = this.el.querySelector('#room-subtitle');

    gsap.to([nameEl, subEl], {
      opacity: 0, y: -10, duration: 0.3,
      onComplete: () => {
        nameEl.textContent = room.name;
        subEl.textContent = room.subtitle;
        gsap.fromTo([nameEl, subEl],
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.1 }
        );
      }
    });

    // Progress dots
    this.el.querySelectorAll('.progress-dot').forEach(dot => {
      const isActive = dot.dataset.room === roomId;
      const roomOrder = ROOMS[dot.dataset.room]?.order ?? 0;
      const activeOrder = room.order;
      dot.classList.toggle('active', isActive);
      dot.classList.toggle('visited', roomOrder < activeOrder);
    });

    // Narrative text
    this.showNarrator(room.narration);

    // Auto-hide controls hint after first room move
    const hint = this.el.querySelector('#controls-hint');
    gsap.to(hint, { opacity: 0, delay: 7, duration: 2 });
  }

  showNarrator(text) {
    const el = this.el.querySelector('#narrator-text');
    gsap.killTweensOf(el);
    el.textContent = text;
    gsap.fromTo(el,
      { opacity: 0, y: 8 },
      {
        opacity: 1, y: 0, duration: 1.2, ease: 'power2.out',
        delay: 0.5,
        onComplete: () => {
          gsap.to(el, { opacity: 0, duration: 1.5, delay: 7 });
        }
      }
    );
  }

  showCompletion() {
    const banner = this.el.querySelector('#completion-banner');
    banner.classList.remove('hidden');
    gsap.fromTo(banner,
      { opacity: 0, scale: 0.85 },
      { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)', delay: 0.5 }
    );
  }
}
