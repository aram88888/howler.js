const fs = require('fs');
const { execSync } = require('child_process');

// Read version from package.json
const version = 'v' + require('../package.json').version;

// Update version comments in source files
const files = [
    { path: 'src/howler.core.js', line: 2, text: ` *  howler.js ${version}` },
    { path: 'src/plugins/howler.spatial.js', line: 4, text: ` *  howler.js ${version}` }
];

files.forEach(({ path, line, text }) => {
    const content = fs.readFileSync(path, 'utf-8').split('\n');
    content[line - 1] = text;
    fs.writeFileSync(path, content.join('\n'));
    console.log(`Updated version in ${path}`);
});

// Define preambles
const preambleCore = `/*! howler.js ${version} | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`;
const preambleSpatial = `/*! howler.js ${version} | Spatial Plugin | (c) 2013-2020, James Simpson of GoldFire Studios | MIT License | howlerjs.com */`;

// Minify core and spatial files
execSync(`npx uglifyjs src/howler.core.js -c -m --output dist/howler.core.min.js --preamble "${preambleCore}"`);
execSync(`npx uglifyjs src/plugins/howler.spatial.js -c -m --output dist/howler.spatial.min.js --preamble "${preambleSpatial}"`);
console.log('Minification completed.');

// Combine core and spatial source files into dist/howler.js
const coreContent = fs.readFileSync('src/howler.core.js', 'utf-8');
const spatialContent = fs.readFileSync('src/plugins/howler.spatial.js', 'utf-8');

// Append content with a separator comment
const combinedContent = `${coreContent}\n\n/*! Spatial Plugin */\n\n${spatialContent}`;

// Write to dist/howler.js
fs.writeFileSync('dist/howler.js', combinedContent);
console.log('Updated dist/howler.js');