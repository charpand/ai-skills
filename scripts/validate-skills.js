const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

try {
  // Find all skill files
  const dirs = ['engineering', 'explaining', 'governance', 'meta'];
  const files = [];

  for (const dir of dirs) {
    const pattern = path.join(dir, '**/*.md');
    const found = glob.sync(pattern, { ignore: '**/README.md' });
    files.push(...found);
  }

  if (files.length === 0) {
    console.log('✓ No skill files to validate');
    process.exit(0);
  }

  // Run mdschema check with --schema flag
  const cmd = `npx mdschema check --schema .mdschema.yml ${files.join(' ')}`;
  console.log('Validating 7-section skill structure...\n');
  execSync(cmd, { stdio: 'inherit' });
  console.log('\n✓ All skills have valid 7-section structure');
} catch (err) {
  process.exit(1);
}
