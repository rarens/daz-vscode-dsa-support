const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '..', '..', 'types');
const targetDir = path.resolve(__dirname, '..', 'types');
const fileNames = ['index.d.ts', 'daz-dz.d.ts', 'daz-dz-globals.d.ts'];

fs.mkdirSync(targetDir, { recursive: true });

for (const fileName of fileNames) {
	const sourcePath = path.join(sourceDir, fileName);
	const targetPath = path.join(targetDir, fileName);
	fs.copyFileSync(sourcePath, targetPath);
}

console.log(`Synced ${fileNames.length} DAZ declaration files into ${targetDir}`);