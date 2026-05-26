const fs = require('fs');
const code = fs.readFileSync('e:/trpc-monorepo/apps/api/dist/index.js', 'utf8');
const requires = [...code.matchAll(/require\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
console.log('Unique requires in dist/index.js:');
console.log([...new Set(requires)].sort().join('\n'));
