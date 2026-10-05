#!/usr/bin/env node
// 새 프로젝트 뼈대 생성 (R6). 이미 있는 파일은 덮어쓰지 않는다.
// 사용법: node harness/scripts/new-project.js <프로젝트>
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const name = process.argv[2];
if (!name || !/^[a-z0-9-]+$/.test(name)) {
  console.error('사용법: new-project.js <프로젝트> (영문 소문자, 숫자, - 만)');
  process.exit(2);
}
const projectDir = path.join(ROOT, 'projects', name);
const tplDir = path.join(ROOT, 'harness', 'templates', 'project');

for (const d of ['docs', 'concept', 'screens']) fs.mkdirSync(path.join(projectDir, d), { recursive: true });
for (const f of fs.readdirSync(tplDir)) {
  const dest = path.join(projectDir, 'docs', f);
  if (fs.existsSync(dest)) console.log(`건너뜀 (이미 있음): ${path.relative(ROOT, dest)}`);
  else {
    fs.copyFileSync(path.join(tplDir, f), dest);
    console.log(`생성: ${path.relative(ROOT, dest)}`);
  }
}
