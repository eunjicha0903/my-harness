#!/usr/bin/env node
// 판정 스크립트. rules.json만 규칙으로 읽는다 (R4 SSOT).
// 사용법: node harness/scripts/judge.js <프로젝트> <화면> <preflight|G1|G2|G5>
// 종료 코드: 0 통과 / 1 실패 / 2 실행 오류
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const [project, screen, gate] = process.argv.slice(2);

function die(msg) {
  console.error(`[judge] ${msg}`);
  process.exit(2);
}

if (!project || !screen || !gate) die('사용법: judge.js <프로젝트> <화면> <preflight|G1|G2|G5>');

const projectDir = path.join(ROOT, 'projects', project);
const screenDir = path.join(projectDir, 'screens', screen);
const rulesPath = path.join(projectDir, 'rules.json');

function readText(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
}

function loadRules() {
  const txt = readText(rulesPath);
  if (txt === null) return null;
  try {
    return JSON.parse(txt);
  } catch (e) {
    die(`rules.json 파싱 실패: ${e.message}`);
  }
}

// ---------- 마크다운 표 ----------

// "## 제목" 섹션 본문을 돌려준다 (다음 "## "까지).
function section(md, title) {
  const lines = md.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === `## ${title}`);
  if (start < 0) return null;
  const body = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) break;
    body.push(lines[i]);
  }
  return body.join('\n');
}

// 섹션 안 첫 번째 표를 [{머리글: 값}] 으로. 빈 행은 버린다.
function table(sectionText) {
  if (!sectionText) return [];
  const rows = sectionText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|'));
  if (rows.length < 2) return [];
  const cells = (l) => l.replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
  const head = cells(rows[0]);
  return rows
    .slice(2)
    .map((r) => {
      const c = cells(r);
      const o = {};
      head.forEach((h, i) => (o[h] = c[i] || ''));
      return o;
    })
    .filter((o) => Object.values(o).some((v) => v !== ''));
}

const splitList = (s) =>
  String(s || '')
    .split(/[,，、\s]+/)
    .map((x) => x.trim())
    .filter(Boolean);

const numbers = (s) => (String(s || '').match(/\d+/g) || []).map(Number);

// ---------- 결과 ----------

const violations = [];
function fail(rule, detail, returnTo, extra = {}) {
  violations.push({ rule, detail, returnTo, ...extra });
}

function finish(outFile) {
  const order = ['S1', 'S2', 'S3', 'S4'];
  const returnTo = violations.length
    ? order.find((s) => violations.some((v) => v.returnTo === s)) || null
    : null;
  const result = {
    project,
    screen,
    gate,
    pass: violations.length === 0,
    violationCount: violations.length,
    returnTo,
    violations,
    judgedAt: new Date().toISOString(),
  };
  if (outFile) {
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(result, null, 2) + '\n');
  }
  console.log(JSON.stringify(result, null, 2));
  process.exit(result.pass ? 0 : 1);
}

// ---------- preflight (시작 조건) ----------

function preflight() {
  const rules = loadRules();
  if (!rules) fail('preflight.rules', 'rules.json 없음 — "rules 만들어줘"로 먼저 생성', null);
  for (const doc of ['prd.md', 'story-service.md', 'story-work.md', 'design.md']) {
    const p = path.join(projectDir, 'docs', doc);
    const txt = readText(p);
    if (txt === null) {
      fail('preflight.docs', `docs/${doc} 없음`, null);
      continue;
    }
    if (txt.includes('<서비스명>')) fail('preflight.docs', `docs/${doc}에 뼈대 자리표시자 <서비스명>이 남아 있음`, null);
    const tpl = readText(path.join(ROOT, 'harness', 'templates', 'project', doc));
    if (tpl !== null && tpl.trim() === txt.trim()) fail('preflight.docs', `docs/${doc}가 뼈대와 같음 — 내용 입력 필요`, null);
  }
  if (rules && !(rules.screens && rules.screens[screen])) {
    fail('preflight.screen', `화면 "${screen}"이 rules.json screens에 없음 (가능: ${Object.keys(rules.screens || {}).join(', ')})`, null);
  }
  finish(null);
}

// ---------- G1 (S1 레퍼런스) ----------

function g1(rules) {
  const p = path.join(screenDir, 's1', 'references.md');
  const md = readText(p);
  if (md === null) {
    fail('G1.file', 's1/references.md 없음', 'S1');
    return finish(path.join(screenDir, 's5', 'gate-G1.json'));
  }
  const refs = table(section(md, '레퍼런스')).filter((r) => r['ID']);
  const ids = new Set(refs.map((r) => r['ID']));
  const services = new Set(refs.map((r) => r['서비스명']).filter(Boolean));
  const { minCount, minDistinctServices } = rules.references;

  if (refs.length < minCount) fail('G1.refCount', `레퍼런스 ${refs.length}개 < 최소 ${minCount}개`, 'S1');
  if (services.size < minDistinctServices)
    fail('G1.serviceCount', `서로 다른 서비스 ${services.size}개 < 최소 ${minDistinctServices}개`, 'S1');

  const items = table(section(md, '반영 항목'));
  if (items.length === 0) fail('G1.items', '반영 항목 0개', 'S1');
  items.forEach((it, i) => {
    const label = `반영 항목 #${it['#'] || i + 1} "${it['항목']}"`;
    if (numbers(it['유저스토리']).length === 0) fail('G1.itemStory', `${label}: 유저스토리 번호 없음`, 'S1');
    const refIds = splitList(it['레퍼런스 ID']);
    if (refIds.length === 0) fail('G1.itemRef', `${label}: 레퍼런스 ID 없음`, 'S1');
    refIds.filter((r) => !ids.has(r)).forEach((r) => fail('G1.itemRefUnknown', `${label}: 레퍼런스 표에 없는 ID ${r}`, 'S1'));
  });
  finish(path.join(screenDir, 's5', 'gate-G1.json'));
}

// ---------- G2 (S2 화면 설계) ----------

function g2(rules) {
  const p = path.join(screenDir, 's2', 'spec.md');
  const md = readText(p);
  if (md === null) {
    fail('G2.file', 's2/spec.md 없음', 'S2');
    return finish(path.join(screenDir, 's5', 'gate-G2.json'));
  }
  const conf = rules.screens[screen];
  const listed = new Set(table(section(md, '연결 유저스토리')).flatMap((r) => numbers(r['번호'])));
  conf.stories.filter((n) => !listed.has(n)).forEach((n) => fail('G2.story', `연결 유저스토리에 ${n}번 없음`, 'S2'));

  const states = table(section(md, '상태 목록')).map((r) => r['상태 ID']).filter(Boolean);
  if (states.length === 0) fail('G2.states', '상태 목록 0개', 'S2');
  (conf.requiredStates || [])
    .filter((s) => !states.includes(s))
    .forEach((s) => fail('G2.requiredState', `필수 상태 "${s}" 없음`, 'S2'));
  finish(path.join(screenDir, 's5', 'gate-G2.json'));
}

// ---------- G5 (S4 결과 판정) ----------

function normHex(h) {
  if (typeof h !== 'string') return null;
  let x = h.trim().toUpperCase();
  if (!x.startsWith('#')) x = '#' + x;
  if (/^#[0-9A-F]{3}$/.test(x)) x = '#' + x.slice(1).split('').map((c) => c + c).join('');
  if (/^#[0-9A-F]{8}$/.test(x)) x = x.slice(0, 7); // 알파는 판정하지 않음
  return /^#[0-9A-F]{6}$/.test(x) ? x : h;
}

function g5(rules) {
  const p = path.join(screenDir, 's4', 'frames.json');
  const txt = readText(p);
  if (txt === null) {
    fail('G5.file', 's4/frames.json 없음', 'S4');
    return finish(path.join(screenDir, 's5', 'verdict.json'));
  }
  let data;
  try {
    data = JSON.parse(txt);
  } catch (e) {
    fail('G5.file', `s4/frames.json 파싱 실패: ${e.message}`, 'S4');
    return finish(path.join(screenDir, 's5', 'verdict.json'));
  }
  const d = rules.design;
  const allowedHex = new Set(Object.values(d.colors).flat().map(normHex));
  const exempt = new Set(d.marginExemptLayers || []);
  const frames = (data.frames || []).filter((f) => String(f.name || '').startsWith(`${screen}/`));

  if (frames.length === 0) fail('G5.frames', `"${screen}/<상태>" 이름의 프레임 0개`, 'S4');

  for (const f of frames) {
    const at = { frame: f.name };
    if (f.width !== d.frame.width || f.height !== d.frame.height)
      fail('G5.frameSize', `프레임 ${f.width}×${f.height} ≠ ${d.frame.width}×${d.frame.height}`, 'S4', at);

    for (const n of f.nodes || []) {
      const where = { frame: f.name, node: n.name, nodeId: n.id };
      for (const c of [...(n.fills || []), ...(n.strokes || [])]) {
        const hex = normHex(c);
        if (!allowedHex.has(hex)) fail('G5.color', `허용되지 않은 색 ${c}`, 'S4', where);
      }
      if (n.fontSize != null && !d.fontSizes.includes(n.fontSize))
        fail('G5.fontSize', `글자 크기 ${n.fontSize}`, 'S4', where);
      if (n.fontWeight != null && !d.fontWeights.includes(n.fontWeight))
        fail('G5.fontWeight', `굵기 ${n.fontWeight}`, 'S4', where);
      if (n.fontFamily != null && n.fontFamily !== d.fontFamily)
        fail('G5.fontFamily', `폰트 ${n.fontFamily}`, 'S4', where);
      const radii = Array.isArray(n.radius) ? n.radius : n.radius != null ? [n.radius] : [];
      radii.filter((r) => !d.radii.includes(r)).forEach((r) => fail('G5.radius', `모서리 ${r}`, 'S4', where));

      const isExempt = exempt.has(n.name) || (n.ancestors || []).some((a) => exempt.has(a));
      if (!isExempt && typeof n.x === 'number' && typeof n.width === 'number') {
        const right = d.frame.width - d.sideMargin;
        if (n.x < d.sideMargin || n.x + n.width > right)
          fail('G5.margin', `x=${n.x}, x+너비=${n.x + n.width} (허용 ${d.sideMargin}~${right})`, 'S4', where);
      }
    }
  }

  // requiredStates 프레임 존재
  for (const s of rules.screens[screen].requiredStates || []) {
    if (!frames.some((f) => f.name === `${screen}/${s}`))
      fail('G5.requiredFrame', `필수 상태 프레임 "${screen}/${s}" 없음`, 'S4');
  }

  // 서비스 규칙 ★
  for (const sr of rules.serviceRules || []) {
    if (sr.screen !== screen) continue;
    for (const ck of sr.checks) {
      const f = frames.find((x) => x.name === ck.frame);
      const rule = `G5.service.${sr.id}`;
      if (ck.type === 'frameExists') {
        if (!f) fail(rule, `프레임 "${ck.frame}" 없음`, sr.returnTo);
        continue;
      }
      if (!f) {
        if (ck.type === 'countAtLeast' || (ck.minCount || 0) > 0) fail(rule, `프레임 "${ck.frame}" 없음`, sr.returnTo);
        continue;
      }
      const layers = (f.nodes || []).filter((n) => n.name === ck.layer);
      if (ck.type === 'countAtLeast' && layers.length < ck.value)
        fail(rule, `"${ck.frame}"의 ${ck.layer} ${layers.length}개 < ${ck.value}개`, sr.returnTo, { frame: f.name });
      if (ck.type === 'allStateEquals') {
        if (layers.length < (ck.minCount || 0))
          fail(rule, `"${ck.frame}"의 ${ck.layer} ${layers.length}개 < ${ck.minCount}개`, sr.returnTo, { frame: f.name });
        layers
          .filter((n) => n.state !== ck.value)
          .forEach((n) =>
            fail(rule, `"${ck.frame}"의 ${ck.layer} state=${n.state ?? '없음'} (필요: ${ck.value})`, sr.returnTo, {
              frame: f.name,
              nodeId: n.id,
            })
          );
      }
    }
  }
  finish(path.join(screenDir, 's5', 'verdict.json'));
}

// ---------- 실행 ----------

if (gate === 'preflight') preflight();
const rules = loadRules();
if (!rules) die('rules.json 없음 — preflight 먼저 실행');
if (!rules.screens || !rules.screens[screen]) die(`화면 "${screen}"이 rules.json screens에 없음`);
if (gate === 'G1') g1(rules);
else if (gate === 'G2') g2(rules);
else if (gate === 'G5') g5(rules);
else die(`알 수 없는 게이트: ${gate}`);
