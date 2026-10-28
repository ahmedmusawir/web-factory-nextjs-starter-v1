const fs=require('fs'), path=require('path'), assert=require('assert'), crypto=require('crypto');
const p=JSON.parse(fs.readFileSync('package.json')), lock=JSON.parse(fs.readFileSync('package-lock.json'));
const data={direct:{},paths:{}};
for(const group of ['dependencies','devDependencies'])for(const [name,version] of Object.entries(p[group])){
 const actual=JSON.parse(fs.readFileSync(path.join('node_modules',name,'package.json'))).version;
 assert.strictEqual(lock.packages[''][group][name],version);assert.strictEqual(lock.packages['node_modules/'+name].version,version);assert.strictEqual(actual,version);data.direct[name]=actual;
}
const req=require('module').createRequire(path.join(process.cwd(),'node_modules/next/package.json'));
data.paths.postcss={path:req.resolve('postcss'),version:req('postcss/package.json').version};
data.paths.sharp={path:req.resolve('sharp'),version:req('sharp').versions.sharp,native:req('sharp').versions.vips};
assert.strictEqual(data.paths.postcss.version,'8.5.23');assert.strictEqual(data.paths.sharp.version,'0.35.5');
assert(!fs.existsSync('node_modules/next/node_modules/postcss'));assert(!lock.packages['node_modules/next/node_modules/postcss']);
data.allPostcssSharpPaths=Object.entries(lock.packages).filter(([k])=>k.endsWith('/postcss')||k.endsWith('/sharp')).map(([k,v])=>({path:k,version:v.version}));
data.lockfileHash=crypto.createHash('sha256').update(fs.readFileSync('package-lock.json')).digest('hex');
assert.strictEqual(data.lockfileHash,'a4db1b8de41f412581f7af81216060cc6e2ff1c64bed27c9a365df7bf614e279');
console.log(JSON.stringify(data,null,2));
