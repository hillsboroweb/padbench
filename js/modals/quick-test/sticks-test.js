'use strict';

import { l } from '../../translations.js';

/** Live position check for both analog sticks. */
export class SticksTest {
  static id = 'sticks';
  static testName = 'Analog sticks';
  static icon = 'fas fa-gamepad';

  constructor(host) {
    this.host = host;
  }

  content() {
    return `
      <p>${l('Check that each stick moves smoothly and returns near the center.')}</p>
      <p><strong>${l('Instructions')}:</strong> ${l('Move each stick around its full range, then release it.')}</p>
      <div class="row g-3 mb-3">
        ${this._stickPanel('left', l('Left stick'))}
        ${this._stickPanel('right', l('Right stick'))}
      </div>
      <div class="d-flex gap-2 mt-3">
        <button type="button" class="btn btn-success" onclick="markTestResult('sticks', true)"><i class="fas fa-check me-1"></i>${l('Pass')}</button>
        <button type="button" class="btn btn-danger" onclick="markTestResult('sticks', false)"><i class="fas fa-times me-1"></i>${l('Fail')}</button>
        <button type="button" class="btn btn-outline-primary" onclick="quickTestAction('sticks', 'reset')"><i class="fas fa-redo me-1"></i>${l('Restart')}</button>
      </div>`;
  }

  _stickPanel(side, label) {
    return `
      <div class="col-md-6">
        <div class="border rounded p-3 h-100">
          <div class="fw-semibold mb-2">${label}</div>
          <div class="stick-test-pad mx-auto" aria-label="${label} live position">
            <span class="stick-test-axis stick-test-axis-x"></span>
            <span class="stick-test-axis stick-test-axis-y"></span>
            <span class="stick-test-center"></span>
            <span class="stick-test-dot" id="sticks-${side}-dot"></span>
          </div>
          <div class="d-flex justify-content-between font-monospace small mt-2">
            <span>X <span id="sticks-${side}-x">0.00</span></span>
            <span>Y <span id="sticks-${side}-y">0.00</span></span>
          </div>
        </div>
      </div>`;
  }

  start() {
    this.host.startIconAnimation('sticks');
  }

  stop() {
    this.host.stopIconAnimation('sticks');
  }

  reset() {
    ['left', 'right'].forEach(side => this._render(side, { x: 0, y: 0 }));
  }

  handleInput(changes) {
    if (!changes.sticks) return;
    ['left', 'right'].forEach(side => {
      if (changes.sticks[side]) this._render(side, changes.sticks[side]);
    });
  }

  _render(side, position) {
    const x = Math.max(-1, Math.min(1, Number(position.x) || 0));
    const y = Math.max(-1, Math.min(1, Number(position.y) || 0));
    const dot = document.getElementById(`sticks-${side}-dot`);
    const xReadout = document.getElementById(`sticks-${side}-x`);
    const yReadout = document.getElementById(`sticks-${side}-y`);
    if (dot) {
      dot.style.left = `${50 + x * 46}%`;
      dot.style.top = `${50 - y * 46}%`;
    }
    if (xReadout) xReadout.textContent = x.toFixed(2);
    if (yReadout) yReadout.textContent = y.toFixed(2);
  }
}
