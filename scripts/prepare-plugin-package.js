const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', 'dsa-tsserver-plugin');
const targetDir = path.resolve(__dirname, '..', 'node_modules', '@mydaz', 'dsa-tsserver-plugin');

fs.rmSync(targetDir, { recursive: true, force: true });
fs.mkdirSync(targetDir, { recursive: true });

for (const fileName of ['index.js', 'package.json']) {
	fs.copyFileSync(path.join(sourceDir, fileName), path.join(targetDir, fileName));
}

console.log(`Prepared packaged tsserver plugin at ${targetDir}`);