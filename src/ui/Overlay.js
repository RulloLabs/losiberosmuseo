import gsap from 'gsap';

/**
 * Overlay.js
 * Full-screen start screen with title, narrative intro, and mode selection.
 */
export class Overlay {
  constructor() {
    this.el = this._build();
    document.body.appendChild(this.el);
  }

  _build() {
    const el = document.createElement('div');
    el.id = 'overlay';
    el.innerHTML = `
      <div class="overlay-bg"></div>
      <div class="overlay-content">
        <div class="overlay-eyebrow">Experiencia Inmersiva</div>
        <h1 class="overlay-title">ÍBEROS</h1>
        <div class="overlay-divider"></div>
        <p class="overlay-tagline">Tres salas. Tres mundos.<br>Una civilización olvidada.</p>

        <div class="overlay-actions">
          <button id="btn-explore" class="btn-primary">
            <span class="btn-icon">⚔</span>
            Explorar Libremente
          </button>
          <button id="btn-narrative" class="btn-secondary">
            <span class="btn-icon">▶</span>
            Tour Guiado
          </button>
        </div>

        <div class="overlay-controls">
          <div class="ctrl-item"><kbd>W A S D</kbd> Moverse</div>
          <div class="ctrl-item"><kbd>🖱</kbd> Mirar</div>
          <div class="ctrl-item"><kbd>ESC</kbd> Pausa</div>
        </div>
      </div>

      <div class="overlay-footer">
        <div class="lore-line">Los íberos. Primeros guerreros de la Península.</div>
      </div>
    `;
    return el;
  }

  onStart(callback) {
    this.el.querySelector('#btn-explore').addEventListener('click', () => {
      this._hide(() => callback('explore'));
    });
    this.el.querySelector('#btn-narrative').addEventListener('click', () => {
      this._hide(() => callback('narrative'));
    });
  }

  _hide(cb) {
    gsap.to(this.el, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.in',
      onComplete: () => {
        this.el.style.display = 'none';
        cb?.();
      }
    });
  }

  show() {
    this.el.style.display = 'flex';
    gsap.fromTo(this.el, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  }
}
