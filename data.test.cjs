const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const read = name => JSON.parse(fs.readFileSync(name+'.json','utf8'));
const exists = name => assert(fs.statSync(name).size > 0, name);
function unique(rows, field='id') { assert.equal(new Set(rows.map(x=>x[field])).size, rows.length); }
test('world: 195 countries, six continents, complete dated facts, flags and isolated clips', () => {
  const rows=read('world-data'), map=read('world-map'), clips=read('world-narration');
  assert.equal(rows.length,195); unique(rows); unique(rows,'flagIndex');
  assert.equal(new Set(rows.map(x=>x.continent)).size,6);
  for(const x of rows) {
    assert(map.features.some(f=>String(f.id)===x.id),x.id);
    for(const f of ['name','capital','independence','independenceSource','populationYear','populationSource','leadershipDate','leadershipSource']) assert(x[f],x.id+' '+f);
    assert(x.population>0); assert(x.leaders.length); assert(x.flagIndex>=0&&x.flagIndex<195);
    assert.match(clips[x.id],/^data:audio\/mpeg;base64,/);
  }
  exists('country-flags.png');
});
test('India: 28 states, 8 union territories, census totals and leadership fields',()=>{
  const rows=read('india-data'), map=read('india-map');
  assert.equal(rows.length,36); unique(rows);
  assert.equal(rows.filter(x=>x.type==='State').length,28);
  assert.equal(rows.filter(x=>x.type==='Union Territory').length,8);
  assert.equal(rows.reduce((n,x)=>n+x.population,0),1210854977);
  for(const x of rows) {
    assert(map.features.some(f=>String(f.id)===x.id),x.id);
    assert.equal(x.populationYear,2011); assert(x.populationSource&&x.leadershipNote);
    if(x.chiefMinister) assert(x.partyName&&x.partyCode&&x.cmSource);
  }
});
test('leaders: 47 presidencies, 18 PM tenures, ordered ranks and president facts',()=>{
  const data=read('leaders-data');
  for(const [mode,count] of [['us-presidents',47],['india-pm',18]]) {
    const rows=data[mode]; assert.equal(rows.length,count); unique(rows);
    rows.forEach((x,i)=>{assert.equal(x.rank,i+1);assert(x.name&&x.start&&x.end&&x.party&&x.fact&&x.entry);if(mode==='india-pm')assert(x.presidents.length&&x.presidentNote)});
  }
  exists('presidents-portraits.jpg'); exists('pm-portraits.jpg');
});
test('USA: 50 map features, admission histories and electoral data',()=>{
  const context={}; vm.createContext(context);
  vm.runInContext(fs.readFileSync('data.js','utf8')+fs.readFileSync('history.js','utf8')+';globalThis.result={states,admissionHistory,elections};',context);
  const {states,admissionHistory,elections}=context.result;
  assert.equal(states.length,50); unique(states,'code');
  const map=read('states'); assert.equal(map.features.filter(f=>states.some(s=>s.name===f.properties.name)).length,50);
  for(const x of states) {assert(map.features.some(f=>f.properties.name===x.name));const h=admissionHistory[x.code];assert(h.date&&h.president&&h.route&&h.story);assert(x.pop>0&&x.house>0)}
  assert(elections[2024]);
});
test('audio segments and celebrity sprite coordinates reference bundled assets',()=>{
  const segments=read('suite-audio');
  const all=[...read('india-data'),...Object.values(read('leaders-data')).flat()];
  for(const x of all) assert(segments[x.id],x.id);
  for(const [id,value] of Object.entries(segments))assert(value.length===2&&value[0]>=0&&value[1]>value[0],id);
  for(const x of read('celebrity-data')) {
    exists(x.portraitSheet); assert(Number.isInteger(x.portraitIndex)&&x.portraitIndex>=0&&x.portraitIndex<100);
    if(x.familiarity==='household')assert(Number.isInteger(x.eyeIndex)&&x.eyeIndex>=0&&x.eyeIndex<x.eyeRows*10);
  }
  for(const f of ['narration.mp3','suite-narration.mp3','tick.mp3','word-timeup.mp3','celebrity-eyes.webp']) exists(f);
});
