const {test} = require('node:test');
const assert = require('node:assert/strict');
const {choices, calculate, buildResult} = require('../js/diagnosis-core.js');
const base = {age:'20-21', experience:'0-1', job:'other', arrangement:'ses', work:'monitoring', target:'cloud', salary:'under300', purpose:'salary', study:'none', timing:'asap'};
test('explicit direction survives every age, tenure, job, income and priority', () => {
  for (const target of ['cloud','upstream','developer','internal'])
  for (const age of choices.age) for (const experience of choices.experience)
  for (const job of choices.job) for (const salary of choices.salary)
  for (const purpose of choices.purpose)
    assert.equal(calculate({...base,target,age,experience,job,salary,purpose}).type,target);
});
test('urgency, age, income and contract do not change readiness', () => {
  for (const timing of choices.timing) for (const age of choices.age)
  for (const salary of choices.salary) for (const arrangement of choices.arrangement)
    assert.equal(calculate({...base,timing,age,salary,arrangement}).readiness,calculate(base).readiness);
  assert.notEqual(buildResult(base).timingText,buildResult({...base,timing:'1y'}).timingText);
});
test('unknown direction is not inferred from current job or age', () => {
  assert.equal(calculate({...base,target:'undecided',purpose:'skill',job:'infra'}).type,'career');
  assert.equal(calculate({...base,target:'undecided'}).type,'salary');
});
test('no unsupported infrastructure experience; senior applicants do not get beginner actions', () => {
  assert.doesNotMatch(buildResult(base).title,/インフラ経験/);
  for (const target of ['cloud','upstream','developer','internal']) {
    const r = buildResult({...base,target,study:'work',experience:'5+'});
    assert.match(r.actions[0],/実績|成果/);
    assert.equal(r.earlyExperience,false);
  }
});
test('environment concerns survive novice readiness and urgent timing', () => {
  const r = buildResult({...base,purpose:'environment'});
  assert.match(r.readinessText,/学習の完了を待たず/);
  assert.match(r.actions[0],/勤務時間/);
  assert.match(r.issues[0],/職場環境/);
});
test('all target, study, work and timing combinations produce complete copy', () => {
  for (const target of choices.target) for (const study of choices.study)
  for (const work of choices.work) for (const timing of choices.timing) {
    const r = buildResult({...base,target,study,work,timing});
    for (const key of ['title','text','readinessText','experienceNote','timingText']) assert.ok(r[key]);
    for (const key of ['strengths','issues','actions','services','reasons']) assert.ok(r[key].length && r[key].every(x=>typeof x === 'string' && x.length));
    assert.doesNotMatch(JSON.stringify(r),/undefined|NaN/);
  }
});
test('invalid and missing answers fail explicitly', () => {
  assert.throws(()=>buildResult({...base,target:'salary'}),TypeError);
  assert.throws(()=>buildResult({...base,study:''}),TypeError);
  assert.throws(()=>buildResult(null),TypeError);
});

test('HTML choices match validation and controller handles submit, edits and retry', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const html = fs.readFileSync(require('node:path').join(__dirname,'../diagnosis.html'),'utf8');
  const elements = {};
  let focused;
  for (const [,id] of html.matchAll(/id="([^"]+)"/g)) {
    assert.ok(!elements[id], `duplicate id ${id}`);
    const classes = new Set(id === 'result' ? ['hidden'] : []);
    elements[id] = {value:base[id], textContent:'', children:[], listeners:{},
      classList:{contains:x=>classes.has(x),add:x=>classes.add(x),remove:x=>classes.delete(x)},
      addEventListener(event,fn){this.listeners[event]=fn;},
      replaceChildren(...children){this.children=children;},
      focus(){focused=id;},scrollIntoView(){},reportValidity(){return this.valid !== false;}};
  }
  for (const [key,values] of Object.entries(choices)) {
    const select = html.match(new RegExp(`<select id="${key}"[^>]*>([\\s\\S]*?)</select>`));
    assert.ok(select,key);
    assert.deepEqual([...select[1].matchAll(/value="([^"]+)"/g)].map(x=>x[1]),values);
  }
  vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../js/diagnosis.js'),'utf8'), {
    document:{getElementById:id=>elements[id],createElement:()=>({textContent:''})},
    window:{CareerDiagnosis:require('../js/diagnosis-core.js'),matchMedia:()=>({matches:true})}
  });
  const form = elements.diagnosisForm;
  form.valid=false;
  form.listeners.submit({preventDefault(){}});
  assert.ok(elements.result.classList.contains('hidden'));
  form.valid=true;
  form.listeners.submit({preventDefault(){}});
  assert.equal(focused,'resultTitle');
  assert.equal(elements.result.classList.contains('hidden'),false);
  assert.ok(elements.reasonsList.children.length);
  elements.target.value='internal';
  form.listeners.change();
  assert.ok(elements.result.classList.contains('hidden'));
  assert.match(elements.diagnosisStatus.textContent,/再診断/);
  form.listeners.submit({preventDefault(){}});
  assert.match(elements.resultTitle.textContent,/社内SE/);
  elements.retryButton.listeners.click();
  assert.equal(focused,'age');
  assert.equal(elements.target.value,'internal');
  assert.ok(elements.result.classList.contains('hidden'));
});
