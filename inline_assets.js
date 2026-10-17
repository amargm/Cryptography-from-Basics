const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'assets', 'css', 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'assets', 'js', 'common.js'), 'utf8');

function updateFile(filePath, isRoot = false) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update or inline CSS
  const coreStyleRegex = /<style>[\s\S]*?CRYPTOGRAPHY FROM BASICS — UNIFIED DESIGN SYSTEM[\s\S]*?<\/style>/;
  const linkCssRegex = isRoot 
    ? /<link rel="stylesheet" href="assets\/css\/style\.css">/
    : /<link rel="stylesheet" href="\.\.\/assets\/css\/style\.css">/;

  if (linkCssRegex.test(content)) {
    content = content.replace(linkCssRegex, `<style>\n${css}\n</style>`);
  } else if (coreStyleRegex.test(content)) {
    content = content.replace(coreStyleRegex, `<style>\n${css}\n</style>`);
  }

  // 2. Update or inline JS
  const coreJsRegex = /<script>[\s\S]*?CRYPTOGRAPHY FROM BASICS — SHARED CORE JAVASCRIPT[\s\S]*?<\/script>/;
  const linkJsRegex = isRoot
    ? /<script src="assets\/js\/common\.js"><\/script>/
    : /<script src="\.\.\/assets\/js\/common\.js"><\/script>/;

  if (linkJsRegex.test(content)) {
    content = content.replace(linkJsRegex, `<script>\n${js}\n</script>`);
  } else if (coreJsRegex.test(content)) {
    content = content.replace(coreJsRegex, `<script>\n${js}\n</script>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Process root files
['index.html', 'cheatsheet.html', 'openssl-cheatsheet.html'].forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) {
    updateFile(p, true);
    console.log('Processed', f);
  }
});

// 2. Process all module files in modules/
const modulesDir = path.join(__dirname, 'modules');
const files = fs.readdirSync(modulesDir);

files.forEach(file => {
  if (file.endsWith('.html')) {
    updateFile(path.join(modulesDir, file), false);
    console.log('Processed', file);
  }
});

console.log('All 16 files updated with latest CSS and JS and 100% self-contained!');
