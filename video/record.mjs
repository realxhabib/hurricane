// Renders the showcase video frame by frame.
//
//   node video/record.mjs --out frames --fps 30 --width 1920 --height 1080
//   ffmpeg -framerate 30 -i frames/%04d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -movflags +faststart hurricane.mp4
//
// The page is opened with #capture, which stops its clock. Every frame advances time by exactly 1/fps,
// so the result is smooth however slowly the machine renders. Set PLAYWRIGHT_MODULE and CHROMIUM_PATH
// to point at a specific Playwright install and browser; CHROMIUM_ARGS adds launch flags (for example
// "--use-angle=swiftshader" on a machine without a GPU).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, all) => (v.startsWith('--') ? [...a, [v.slice(2), all[i + 1]]] : a), []));
const OUT = args.out || 'frames';
const FPS = +(args.fps || 30);
const W = +(args.width || 1920), H = +(args.height || 1080);
const DURATION = +(args.duration || 26.5);

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const page_url = pathToFileURL(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'index.html')).href + '#capture';

// What happens when, in seconds. Each entry runs inside the page, where window.__app drives the app.
const EVENTS = [
  [0.2, `__app.startGrow(22, 150, 6.6)`],
  [7.0, `__app.stopGrow(); __app.setAutoRotate(false); __app.select('eye')`],
  [9.4, `__app.setAutoRotate(true, 0.9)`],
  [11.5, `__app.setAutoRotate(false); __app.select('engine')`],
  [13.4, `__app.setAutoRotate(true, 0.35)`],
  [16.0, `__app.setAutoRotate(false); __app.setKt(89); __app.select('surge')`],
  [21.0, `__app.setView('whole', true); __app.select('canopy'); __app.setImg('ir')`],
  [22.6, `__app.setAutoRotate(true, 0.6)`],
  [24.2, `__app.setAutoRotate(false); __app.setImg('visible'); __app.select('overview')`],
];
// Continuous changes, evaluated every frame inside their window. u runs 0 → 1.
const RAMPS = [
  [17.2, 20.6, `__app.setKt(89 + (155 - 89) * (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2))`],
];

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: (process.env.CHROMIUM_ARGS || '').split(' ').filter(Boolean),
  proxy: process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined,
});
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', (e) => console.error('page error:', e.message));
await page.goto(page_url);
await page.waitForFunction(() => window.__app);
await page.evaluate(() => {
  __app.setKt(22); __app.snap();
  const c = __app.camera;
  c.position.set(96, 50, 180); __app.controls.target.set(0, 6, 0);
  __app.flight = { from: { pos: c.position.clone(), target: __app.controls.target.clone() }, toPos: __app.HOME.pos.clone(), toTarget: __app.HOME.target.clone(), t: 0, dur: 6.5 };
  __app.step(0, 6);   // warm up shaders and the temporal accumulation without moving time
});

const frames = Math.round(DURATION * FPS);
const fired = new Set();
const started = Date.now();
for (let i = 0; i < frames; i++) {
  const T = i / FPS;
  for (const [at, code] of EVENTS) if (T >= at && !fired.has(at)) { fired.add(at); await page.evaluate(code); }
  for (const [a, b, code] of RAMPS) if (T >= a && T <= b + 1 / FPS) {
    const u = Math.min(1, (T - a) / (b - a));
    await page.evaluate(`(() => { const u = ${u}; ${code}; })()`);
  }
  await page.evaluate((dt) => __app.step(dt), 1 / FPS);
  await page.screenshot({ path: path.join(OUT, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 94, timeout: 600000 });
  if (i % 10 === 0) {
    const per = (Date.now() - started) / (i + 1) / 1000;
    console.log(`frame ${i + 1}/${frames}  ${per.toFixed(1)} s/frame  ~${((frames - i - 1) * per / 60).toFixed(0)} min left`);
  }
}
await browser.close();
console.log('done');
