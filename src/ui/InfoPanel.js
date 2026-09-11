import gsap from 'gsap';

/**
 * InfoPanel.js
 * Glassmorphism exhibit info panel.
 * Appears when user looks at an exhibit.
 * Supports Explorer/Expert mode toggle.
 */
export class InfoPanel {
  constructor() {
    this.mode = 'explorer'; // 'explorer' | 'expert'
    this.currentExhibit = null;
    this.el = this._build();
    document.body.appendChild(this.el);
  }

  _build() {
    const panel = document.createElement('div');
    panel.id = 'info-panel';
    panel.innerHTML = `
      <div class="panel-inner">
        <div class="panel-header">
          <span id="panel-title"> </span>
          <span id="panel-period"> </span>
        </div>
        <div id="panel-short-desc" class="panel-desc"> </div>
        <div id="panel-expert-desc" class="panel-expert hidden"> </div>
        <div class="panel-meta">
          <span id="panel-location">📍 </span>
          <span id="panel-material">🏺 </span>
        </div>
        <div class="panel-actions">
          <button id="mode-toggle" class="btn-mode">Modo Experto</button>
        </div>
      </div>
      <div class="crosshair" id="crosshair">
        <div class="ch-dot"></div>
        <div class="ch-ring"></div>
      </div>
    `;

    panel.querySelector('#mode-toggle').addEventListener('click', () => {
      this.toggleMode();
    });

    return panel;
  }

  setExhibit(metadata) {
    if (!metadata) {
      this._hidePanel();
      this.currentExhibit = null;
      return;
    }
    if (this.currentExhibit === metadata) return;
    this.currentExhibit = metadata;

    this.el.querySelector('#panel-title').textContent = metadata.title;
    this.el.querySelector('#panel-period').textContent = metadata.period;
    this.el.querySelector('#panel-short-desc').textContent = metadata.shortDesc;
    this.el.querySelector('#panel-expert-desc').textContent = metadata.expertDesc;
    this.el.querySelector('#panel-location').textContent = `📍 ${metadata.location}`;
    this.el.querySelector('#panel-material').textContent = `🏺 ${metadata.material}`;

    this._applyMode();
    this._showPanel();
    this._activateCrosshair();
  }

  _showPanel() {
    const inner = this.el.querySelector('.panel-inner');
    gsap.killTweensOf(inner);
    gsap.fromTo(inner,
      { opacity: 0, y: 20, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
    );
    inner.style.display = 'flex';
  }

  _hidePanel() {
    const inner = this.el.querySelector('.panel-inner');
    gsap.killTweensOf(inner);
    gsap.to(inner, {
      opacity: 0, y: 14, scale: 0.97,
      duration: 0.35, ease: 'power2.in',
      onComplete: () => { inner.style.display = 'none'; }
    });
    this._deactivateCrosshair();
  }

  _activateCrosshair() {
    this.el.querySelector('#crosshair').classList.add('active');
  }

  _deactivateCrosshair() {
    this.el.querySelector('#crosshair').classList.remove('active');
  }

  toggleMode() {
    this.mode = this.mode === 'explorer' ? 'expert' : 'explorer';
    this._applyMode();
    const btn = this.el.querySelector('#mode-toggle');
    btn.textContent = this.mode === 'explorer' ? 'Modo Experto' : 'Modo Explorador';
    gsap.fromTo(btn, { scale: 0.92 }, { scale: 1, duration: 0.25, ease: 'back.out(2)' });
  }

  _applyMode() {
    const expert = this.el.querySelector('#panel-expert-desc');
    const short = this.el.querySelector('#panel-short-desc');
    if (this.mode === 'expert') {
      expert.classList.remove('hidden');
      short.classList.add('hidden');
    } else {
      expert.classList.add('hidden');
      short.classList.remove('hidden');
    }
  }
}
