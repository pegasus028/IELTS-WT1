// Concatenate bot files into one bundle + FNV hash; emit chunk files for localStorage upload.
const fs=require('fs'),path=require('path');
const files=['bot-core.js'].concat(fs.readdirSync('bot').filter(f=>/^rooms-.*\.js$/.test(f)).sort()).concat(['plan.js']);
const code=files.map(f=>fs.readFileSync(path.join('bot',f),'utf8')).join('\n;\n');
fs.writeFileSync('out/bundle.js',code);
function fnv(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h.toString(16);}
console.log('bundle',code.length,'chars fnv',fnv(code));
for(const lv of ['a1','a2','b1','b2','c1']){const d=fs.readFileSync(`personas/${lv}.json`,'utf8');console.log(lv,d.length,'fnv',fnv(d));}
