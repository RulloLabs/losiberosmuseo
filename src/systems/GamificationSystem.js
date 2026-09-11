import gsap from 'gsap';
import { ROOM_ORDER } from '../data/rooms.js';

/**
 * GamificationSystem.js
 * Tracks discoveries, objectives, room unlocks, and visual progress.
 */
export class GamificationSystem {
  constructor(hud) {
    this.hud = hud;
    this.discovered = new Set();
    this.objectiveIds = []; // set externally after exhibits are created
    this.onRoomUnlock = null; // callback
  }

  setObjectives(ids) {
    this.objectiveIds = ids;
    this.hud.setObjectives(ids);
  }

  onDiscover(exhibitId) {
    if (this.discovered.has(exhibitId)) return;
    this.discovered.add(exhibitId);

    this.hud.markDiscovered(exhibitId);
    this.hud.flashDiscovery(exhibitId);

    // Check if room objective is met
    const allMet = this.objectiveIds.every(id => this.discovered.has(id));
    if (allMet) {
      this.hud.showCompletion();
    }
  }

  isDiscovered(id) {
    return this.discovered.has(id);
  }

  getProgress() {
    const done = this.objectiveIds.filter(id => this.discovered.has(id)).length;
    return { done, total: this.objectiveIds.length };
  }
}
