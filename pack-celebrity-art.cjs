// Store the extra sprites in text assets so they can be edited/published through
// GitHub's text editor as well as ordinary Git. Credits remain per celebrity.
// Usage: node pack-celebrity-art.cjs /path/to/celebrity-faces-6.webp [...]
const fs = require('node:fs');
const path = require('node:path');
for(const input of process.argv.slice(2)) {
  const bytes=fs.readFileSync(input);
  if(bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw Error('Expected a WebP image: '+input);
  fs.writeFileSync(input.replace(/\.webp$/,'.json'),JSON.stringify({file:path.basename(input),data:'data:image/webp;base64,'+bytes.toString('base64')}));
}
