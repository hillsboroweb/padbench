const CAPTURE_MS = 20_000;
const SAMPLE_MS = 100;
let session = null;
let lastSampleAt = 0;
let timer = 0;

const status = () => document.getElementById('report-status');
const button = () => document.getElementById('report-start');

function finishCapture() {
  if (!session) return;
  window.clearInterval(timer);
  const completed = session;
  session = null;
  button().disabled = false;
  button().textContent = 'Start another capture';

  const report = {
    app: 'PadBench',
    capturedAt: new Date(completed.startedAt).toISOString(),
    durationSeconds: 20,
    controller: completed.model || 'PlayStation controller',
    sampleIntervalMs: SAMPLE_MS,
    sampleCount: completed.samples.length,
    summary: summarize(completed.samples),
    samples: completed.samples,
    note: 'Readings describe observed input. They do not diagnose the mechanical cause of drift.'
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `padbench-report-${new Date(completed.startedAt).toISOString().replaceAll(':', '-')}.json`;
  link.click();
  URL.revokeObjectURL(url);
  status().textContent = `${report.sampleCount} samples captured · report downloaded`;
}

function summarize(samples) {
  if (!samples.length) return { message: 'No samples were received.' };
  const axes = ['leftX', 'leftY', 'rightX', 'rightY'];
  const result = {};
  for (const axis of axes) {
    const values = samples.map(sample => sample[axis]);
    result[axis] = {
      min: Number(Math.min(...values).toFixed(4)),
      max: Number(Math.max(...values).toFixed(4)),
      average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(4))
    };
  }
  return result;
}

export function recordPadbenchFrame(sticks, model) {
  if (!session) return;
  const now = performance.now();
  if (now - lastSampleAt < SAMPLE_MS) return;
  lastSampleAt = now;
  session.samples.push({
    elapsedMs: Math.round(now - session.startedAtClock),
    leftX: Number(sticks.left.x.toFixed(4)),
    leftY: Number(sticks.left.y.toFixed(4)),
    rightX: Number(sticks.right.x.toFixed(4)),
    rightY: Number(sticks.right.y.toFixed(4))
  });
  session.model = model || session.model;
  const remaining = Math.max(0, CAPTURE_MS - (now - session.startedAtClock));
  status().textContent = `Capturing · ${(remaining / 1000).toFixed(1)} sec left · ${session.samples.length} samples`;
  if (!remaining) finishCapture();
}

function startCapture() {
  session = { startedAt: Date.now(), startedAtClock: performance.now(), samples: [], model: '' };
  lastSampleAt = 0;
  button().disabled = true;
  button().textContent = 'Capturing…';
  status().textContent = 'Move both sticks across their full range.';
  timer = window.setTimeout(finishCapture, CAPTURE_MS + 250);
}

window.addEventListener('DOMContentLoaded', () => {
  button()?.addEventListener('click', () => {
    if (!window.padbenchConnected?.()) {
      status().textContent = 'Connect a controller before capturing.';
      return;
    }
    startCapture();
  });
});
