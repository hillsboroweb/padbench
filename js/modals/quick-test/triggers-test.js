'use strict';

import { l } from '../../translations.js';

/** Live travel check for the two analog trigger inputs. */
export class TriggersTest {
  static id = 'triggers';
  static testName = 'Analog triggers';
  static icon = 'fas fa-gamepad';

  constructor(host) {
    this.host = host;
    this.values = { l2: 0, r2: 0 };
  }

  content() {
    return `
      <p>${l('Check that both triggers respond through their full range.')}</p>
      <p><strong>${l('Instructions')}:</strong> ${l('Press and release L2 and R2 slowly. Watch each reading change from 0% to 100%.')}</p>
      <div class="row g-3 mb-3">
        ${this._triggerPanel('l2', 'L2')}
        ${this._triggerPanel('r2', 'R2')}
      </div>
      <div class="d-flex gap-2 mt-3">
        <button type="button" class="btn btn-success" onclick="markTestResult('triggers', true)"><i class="fas fa-check me-1"></i>${l('Pass')}</button>
        <button type="button" class="btn btn-danger" onclick="markTestResult('triggers', false)"><i class="fas fa-times me-1"></i>${l('Fail')}</button>
        <button type="button" class="btn btn-outline-primary" onclick="quickTestAction('triggers', 'reset')"><i class="fas fa-redo me-1"></i>${l('Restart')}</button>
      </div>`;
  }

  _triggerPanel(key, label) {
    return `
      <div class="col-md-6">
        <div class="border rounded p-3">
          <div class="d-flex justify-content-between mb-2">
            <span class="fw-semibold">${label}</span>
            <span class="font-monospace"><span id="triggers-${key}-value">0</span>%</span>
          </div>
          <div class="progress" role="progressbar" aria-label="${label} trigger position" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" id="triggers-${key}-bar" style="width: 0%"></div>
          </div>
        </div>
      </div>`;
  }

  start() {
    this.host.startIconAnimation('triggers');
  }

  stop() {
    this.host.stopIconAnimation('triggers');
  }

  reset() {
    this.values = { l2: 0, r2: 0 };
    this._render('l2');
    this._render('r2');
  }

  handleInput(changes) {
    ['l2', 'r2'].forEach(key => {
      const inputKey = `${key}_analog`;
      if (inputKey in changes) {
        this.values[key] = Math.max(0, Math.min(255, Number(changes[inputKey]) || 0));
        this._render(key);
      }
    });
  }

  _render(key) {
    const percent = Math.round(this.values[key] / 255 * 100);
    const value = document.getElementById(`triggers-${key}-value`);
    const bar = document.getElementById(`triggers-${key}-bar`);
    if (value) value.textContent = percent;
    if (bar) {
      bar.style.width = `${percent}%`;
      bar.parentElement.setAttribute('aria-valuenow', String(percent));
    }
  }
}
