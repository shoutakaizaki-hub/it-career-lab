(() => {
  'use strict';
  const form = document.getElementById('diagnosisForm');
  const result = document.getElementById('result');
  const status = document.getElementById('diagnosisStatus');
  if (!form || !result) return;
  const core = window.CareerDiagnosis;
  if (!core) {
    status.textContent = '診断を読み込めませんでした。ページを再読み込みしてください。';
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }
  function fillList(id, items) {
    const el = document.getElementById(id);
    el.replaceChildren(...items.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  }
  function moveTo(el) {
    el.focus({ preventScroll: true });
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }
  function invalidate() {
    if (!result.classList.contains('hidden')) {
      result.classList.add('hidden');
      status.textContent = '回答を変更しました。「診断結果を見る」で再診断してください。';
    }
  }
  function render(data) {
    for (const [id, key] of Object.entries({resultTitle:'title', resultText:'text', experienceNote:'experienceNote', readinessLabel:'readinessText', timingText:'timingText'})) {
      document.getElementById(id).textContent = data[key];
    }
    for (const [id, key] of Object.entries({reasonsList:'reasons', strengthsList:'strengths', issuesList:'issues', actionsList:'actions', serviceTypes:'services'})) fillList(id, data[key]);
    result.classList.remove('hidden');
    status.textContent = '';
    moveTo(document.getElementById('resultTitle'));
  }
  form.addEventListener('change', invalidate);
  form.addEventListener('input', invalidate);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const answers = Object.fromEntries(Object.keys(core.choices).map(key => [key, document.getElementById(key).value]));
    try {
      render(core.buildResult(answers));
    } catch (error) {
      result.classList.add('hidden');
      status.textContent = '回答を確認して、もう一度診断してください。';
    }
  });
  document.getElementById('retryButton').addEventListener('click', () => {
    invalidate();
    moveTo(document.getElementById('age'));
  });
})();
