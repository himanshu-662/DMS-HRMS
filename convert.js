const fs = require('fs');
const path = require('path');

const babelPath = path.join(__dirname, 'frontend', 'node_modules', '@babel', 'core');
const babel = require(babelPath);

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const srcDir = path.join(__dirname, 'frontend', 'src');

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        const isTSX = filePath.endsWith('.tsx');
        const code = fs.readFileSync(filePath, 'utf8');
        
        try {
            const result = babel.transformSync(code, {
                filename: filePath,
                retainLines: true,
                plugins: [
                    [require(path.join(__dirname, 'frontend', 'node_modules', '@babel', 'plugin-syntax-jsx'))],
                    [require(path.join(__dirname, 'frontend', 'node_modules', '@babel', 'plugin-transform-typescript')), { isTSX: true, allExtensions: true }]
                ]
            });
            
            if (result && result.code) {
                const newFilePath = filePath.replace(/\.tsx?$/, isTSX ? '.jsx' : '.js');
                fs.writeFileSync(newFilePath, result.code, 'utf8');
                fs.unlinkSync(filePath); // Delete old TS file
                console.log(`Converted: ${filePath} -> ${newFilePath}`);
            }
        } catch (e) {
            console.error(`Error transforming ${filePath}:`, e.message);
        }
    }
});
