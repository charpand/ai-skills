const { execSync } = require('child_process');
const glob = require('glob');

try {
  const files = glob.sync('**/*.md', { ignore: 'node_modules/**' });
  if (files.length === 0) {
    console.log('✓ No markdown files to check');
    process.exit(0);
  }

  console.log('Checking markdown links...\n');
  files.forEach(file => {
    try {
      execSync(`npx markdown-link-check --quiet --config .markdown-link-check.json "${file}"`, { stdio: 'pipe' });
    } catch (e) {
      // Continue checking other files
      console.error(`⚠ Issues in ${file}`);
    }
  });
  console.log('✓ Link validation complete');
} catch (err) {
  console.error('Error validating links:', err.message);
  process.exit(1);
}
