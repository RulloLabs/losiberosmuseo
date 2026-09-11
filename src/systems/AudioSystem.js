/**
 * AudioSystem.js
 * Manages all synthetic ambient audio using Web Audio API.
 * Generates sound without requiring audio files.
 */
export class AudioSystem {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.roomNodes = {};
    this.currentRoom = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 1.0;
    this.masterGain.connect(this.ctx.destination);
    this._buildOriginAudio();
    this._buildWarriorAudio();
    this._buildRitualAudio();
    this.initialized = true;
  }

  _buildOriginAudio() {
    // Wind: filtered pink noise
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const d = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      d[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = d[i];
      d[i] *= 3.5;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'bandpass';
    filter1.frequency.value = 600;
    filter1.Q.value = 0.4;

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'highshelf';
    filter2.frequency.value = 3000;
    filter2.gain.value = -12;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    src.connect(filter1).connect(filter2).connect(gain).connect(this.masterGain);
    src.start();
    this.roomNodes['origen'] = { gain, targetVol: 0.18 };
  }

  _buildWarriorAudio() {
    // Tension: sawtooth drone + metal rattle pulse
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.value = 56.5; // Slight detune for beating

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 180;

    // LFO for tremolo
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.4;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 30;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain).connect(this.masterGain);
    osc1.start();
    osc2.start();
    this.roomNodes['guerra'] = { gain, targetVol: 0.35 };
  }

  _buildRitualAudio() {
    // Cave: low sub drone + reverb-like delay chain
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 38;

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = 57;

    const delay1 = this.ctx.createDelay(2);
    delay1.delayTime.value = 0.8;
    const delay2 = this.ctx.createDelay(2);
    delay2.delayTime.value = 1.4;

    const fb = this.ctx.createGain();
    fb.gain.value = 0.6;
    delay1.connect(fb).connect(delay2).connect(fb);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 300;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(delay1);
    filter.connect(gain);
    delay2.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc2.start();
    this.roomNodes['ritual'] = { gain, targetVol: 0.45 };
  }

  transitionTo(roomId, duration = 2.5) {
    if (!this.initialized || this.currentRoom === roomId) return;

    const now = this.ctx.currentTime;
    Object.entries(this.roomNodes).forEach(([id, node]) => {
      const target = id === roomId ? node.targetVol : 0;
      node.gain.gain.cancelScheduledValues(now);
      node.gain.gain.setValueAtTime(node.gain.gain.value, now);
      node.gain.gain.linearRampToValueAtTime(target, now + duration);
    });
    this.currentRoom = roomId;
  }

  narrate(text) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'es-ES';
    utter.pitch = 0.6;
    utter.rate = 0.8;
    utter.volume = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }

  setMasterVolume(v) {
    if (this.masterGain) this.masterGain.gain.value = v;
  }
}
