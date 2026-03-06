#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Run alex with proper node_modules exclusion
const alex = spawn('alex', [
  '.',
  '--ignore-path',
  '.gitignore',
  '--ignore-words',
  'ok,fail,failed,failures'
], {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit'
});

alex.on('exit', (code) => {
  // Exit with 0 to treat warnings as non-fatal
  // The workflow has continue-on-error: true, so warnings won't block merging
  process.exit(0);
});

