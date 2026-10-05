#!/usr/bin/env node
// 에이전트 편집 범위 확인 (R7). 단계 시작 전에 snapshot, 끝난 뒤 check.
// 사용법:
//   node harness/scripts/scope.js snapshot <프로젝트> <화면>
//   node harness/scripts/scope.js check <프로젝트> <화면> <허용 경로(프로젝트 기준)>
//   예) check innerbetter cart screens/cart/s1
// 종료 코드: 0 범위 안 / 1 범위 밖 변경 있음 / 2 실행 오류
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');
const [cmd, project, screen, allowed] = process.argv.slice(2);
if (!cmd || !project || !screen) {
  console.error('사용법: scope.js <snapshot|check> <프로젝트> <화면> [허용 경로]');
  process.exit(2);
}
const projectDir = path.join(ROOT, 'projects', project);
const snapFile = path.join(projectDir, 'screens', screen, '.scope-snapshot.json');
// 오케스트레이터가 쓰는 파일은 비교에서 뺀다.
const IGNORE = new Set([path.relative(projectDir, snapFile), `screens/${screen}/state.json`].map((p) => p.replace(/\\/g, '/')));

function walk(dir, out = {}) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else {
      const rel = path.relative(projectDir, full).replace(/\\/g, '/');
      if (!IGNORE.has(rel)) out[rel] = crypto.createHash('sha1').update(fs.readFileSync(full)).digest('hex');
    }
  }
  return out;
}

if (cmd === 'snapshot') {
  fs.mkdirSync(path.dirname(snapFile), { recursive: true });
  fs.writeFileSync(snapFile, JSON.stringify(walk(projectDir), null, 2));
  console.log(`snapshot 저장: ${path.relative(ROOT, snapFile)}`);
  process.exit(0);
}

if (cmd === 'check') {
  if (!allowed) {
    console.error('check에는 허용 경로가 필요');
    process.exit(2);
  }
  if (!fs.existsSync(snapFile)) {
    console.error('snapshot 없음 — 단계 시작 전에 snapshot 먼저');
    process.exit(2);
  }
  const before = JSON.parse(fs.readFileSync(snapFile, 'utf8'));
  const after = walk(projectDir);
  const changed = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((k) => before[k] !== after[k]);
  const prefix = allowed.replace(/\\/g, '/').replace(/\/$/, '') + '/';
  const outside = changed.filter((k) => !k.startsWith(prefix));
  console.log(JSON.stringify({ allowed: prefix, changed, outside, pass: outside.length === 0 }, null, 2));
  process.exit(outside.length === 0 ? 0 : 1);
}

console.error(`알 수 없는 명령: ${cmd}`);
process.exit(2);
