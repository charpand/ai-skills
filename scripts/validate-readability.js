const retext = require('retext');
const readability = require('retext-readability');
const english = require('retext-english');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const issues = [];

async function validateReadability() {
  const files = await glob('**/*.md', {
    ignore: ['node_modules/**', '.git/**']
  });

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');

    const result = await retext()
      .use(english)
      .use(readability)
      .process(content);

    if (result.messages.length > 0) {
      for (const msg of result.messages) {
        if (msg.source === 'retext-readability' && msg.ruleId) {
          issues.push({
            file,
            line: msg.line,
            message: msg.message,
            ruleId: msg.ruleId
          });
        }
      }
    }
  }

  if (issues.length > 0) {
    console.error('\n❌ Readability Issues Found:\n');
    issues.forEach(issue => {
      console.error(`  ${issue.file}:${issue.line} - ${issue.ruleId}: ${issue.message}`);
    });
    process.exit(1);
  } else {
    console.log('✓ Readability validation passed');
  }
}

validateReadability().catch(err => {
  console.error('Readability validation error:', err);
  process.exit(1);
});
