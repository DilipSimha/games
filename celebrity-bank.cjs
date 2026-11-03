// Shared Node loader for validation and browser tests. The browser fetches the
// same category files listed in the public index; each category is kept small.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const index = require('./celebrity-data.json');
assert.equal(index.count,975);
assert.equal(index.categories.length,13);
const people=index.categories.flatMap(category=>{
  assert.equal(category.count,75);
  const entries=JSON.parse(fs.readFileSync(path.join(__dirname,category.file),'utf8'));
  assert.equal(entries.length,category.count);
  assert(entries.every(x=>x.category===category.name));
  return entries;
});
assert.equal(people.length,index.count);
module.exports=people;
