/* Pure diagnosis logic: no DOM, storage or network access. */
(function (root) {
  "use strict";
  const typeConfig = {
    cloud: {
      title: "クラウド分野を目指すタイプ",
      text: "現在の経験を土台に、AWS / Azureなどのクラウド分野へ段階的に広げるための準備を整理しましょう。資格だけでなく、構築経験や業務上の改善経験をセットで整理すると強みを伝えやすくなります。",
      services: [
        "ITエンジニア特化型",
        "クラウド・インフラ求人を扱うサービス",
        "20代のキャリアアップ支援型"
      ]
    },
    upstream: {
      title: "設計・構築など上流工程を目指すタイプ",
      text: "これまでの実務経験を、設計・構築・要件整理など上流工程へつなげる方向が候補です。担当作業だけでなく、障害対応、改善提案、手順整備などの経験も言語化すると評価材料になります。",
      services: [
        "ITエンジニア特化型",
        "インフラ・SIer求人を扱うサービス",
        "キャリアアップ支援型"
      ]
    },
    developer: {
      title: "開発分野を目指すタイプ",
      text: "開発経験や学習実績を軸に、実装だけでなく設計・テスト・クラウド連携まで経験を広げる方向が候補です。使用技術だけでなく、自分が担当した機能と改善内容を整理すると転職時に伝わりやすくなります。",
      services: [
        "ITエンジニア特化型",
        "開発職求人を多く扱うサービス",
        "20代キャリアアップ支援型"
      ]
    },
    salary: {
      title: "市場価値と年収を見直すタイプ",
      text: "年収だけでなく、次の3年間で積める経験まで含めて求人を比較するのが重要です。現在のスキルがどの求人で評価されるかを確認し、年収と仕事内容の両方で選択肢を整理しましょう。",
      services: [
        "ITエンジニア特化型",
        "年収・市場価値を比較しやすいサービス",
        "求人数の多い総合型"
      ]
    },
    internal: {
      title: "社内SE・自社側のIT職を目指すタイプ",
      text: "社内利用者の課題整理、システム導入・運用、ベンダー調整など、求人ごとの担当範囲を確認して経験をつなげましょう。",
      services: ["ITエンジニア特化型", "求人数の多い総合型", "キャリアアップ支援型"]
    },
    career: {
      title: "キャリア整理・選択肢比較タイプ",
      text: "現時点では一つの方向に絞るより、求人を見ながら『今の経験で狙える仕事』『不足している経験』『優先したい条件』を整理する段階です。転職するかどうかを決める前の情報収集から始めるのが適しています。",
      services: [
        "求人数の多い総合型",
        "ITエンジニア特化型",
        "20代向けキャリア相談型"
      ]
    }
  };

  function buildStrengths(a) {
    const items = [];

    if (a.experience === "3-5" || a.experience === "5+") {
      items.push("複数年のIT実務経験があり、担当業務を具体化しやすい");
    } else if (a.experience === "1-3") {
      items.push("1年以上の実務経験を担当作業・工夫・成果として整理できる");
    } else {
      items.push("経験が浅い分、今後伸ばしたい分野を明確にすると方向性を作りやすい");
    }

    const workStrengths = {
      monitoring: "監視・定型業務を通じてシステム運用の基礎を経験している",
      operation: "運用・保守や障害対応の経験を職務経歴に落とし込める",
      build: "構築・設定変更の経験があり、上流工程への接続材料がある",
      design: "設計・要件整理の経験があり、上流工程の実績を示せる",
      development: "開発・実装経験を成果物や担当機能として説明できる",
      mixed: "複数工程の経験があり、対応範囲の広さを示しやすい",
      other: "現在の担当業務を具体的な作業・成果に分解することで強みに変えられる"
    };
    items.push(workStrengths[a.work]);

    const studyStrengths = {
      none: "これから希望分野に向けて伸ばせる経験を整理する段階",
      uncertain: "学習・経験と興味のある分野のつながりを整理する段階",
      studying: "希望分野の資格・技術学習に取り組んでおり、志望分野への関心を示せる",
      certified: "関連資格を取得しており、基礎知識の裏付けとして使える",
      handson: "希望分野のハンズオン・個人開発があり、実際に手を動かした経験を示せる",
      work: "希望分野を業務でも経験しており、転職時の直接的な強みになりやすい"
    };
    items.push(studyStrengths[a.study]);

    return items.slice(0, 3);
  }

  const choices = {
    age: ['20-21', '22-24', '25-27', '28-29', '30+'],
    experience: ['0-1', '1-3', '3-5', '5+'],
    job: ['infra', 'developer', 'ops', 'internal', 'other'],
    arrangement: ['ses', 'dispatch', 'other', 'unknown'],
    work: ['monitoring', 'operation', 'build', 'design', 'development', 'mixed', 'other'],
    target: ['cloud', 'upstream', 'developer', 'internal', 'undecided'],
    salary: ['under300', '300-399', '400-499', '500+'],
    purpose: ['skill', 'salary', 'environment', 'career', 'undecided'],
    study: ['none', 'studying', 'certified', 'handson', 'work', 'uncertain'],
    timing: ['asap', '3m', '6m', '1y', 'undecided']
  };
  const targetNames = { cloud: 'クラウド分野', upstream: '設計・構築など上流工程', developer: '開発分野', internal: '社内SE・自社側のIT職' };

  function validate(a) {
    if (!a || Object.entries(choices).some(([key, values]) => !values.includes(a[key]))) {
      throw new TypeError('すべての項目で有効な回答を選択してください。');
    }
  }

  function calculate(a) {
    validate(a);
    // Explicit intent is authoritative; age, income and contract never override it.
    const type = a.target !== 'undecided' ? a.target : a.purpose === 'salary' ? 'salary' : 'career';
    const related = a.target !== 'undecided' && ['handson', 'work'].includes(a.study);
    const readiness = a.target === 'undecided' ? 'clarify' : related ? 'compare' : 'prepare';
    return { type, readiness, earlyExperience: ['0-1', '1-3'].includes(a.experience) };
  }

  function buildIssues(a, type) {
    const items = [];
    if (a.purpose === 'environment') items.push('改善したい勤務時間・配属・職場環境と、譲れない条件を具体化する');
    if (a.target === 'undecided') items.push('興味のある求人を比較し、希望する仕事内容を整理する');
    else if (a.study === 'none' || a.study === 'uncertain') items.push('希望分野に関連する経験の有無を整理し、不足する学習テーマを絞る');
    if (type === 'cloud' && a.study !== 'work') items.push(a.study === 'handson' ? '作成したクラウド環境の設計理由・運用方法を説明できるようにする' : 'クラウド構築の実践経験を確認し、不足していれば小さな環境で補う');
    if (type === 'upstream' && a.study !== 'work' && a.work !== 'design') items.push('設定変更・改善提案の経験を整理し、設計判断に関われる機会を探す');
    if (type === 'developer' && a.study !== 'work') items.push(a.study === 'handson' ? '成果物の設計・テスト・改善内容を説明できるようにする' : '希望する開発分野の経験を確認し、不足部分を小さな成果物で補う');
    if (type === 'internal') items.push('求人ごとに社内サポート・開発・インフラ・ベンダー調整の担当範囲を確認する');
    if (a.purpose === 'salary') items.push('基本給・賞与・固定残業代と担当業務を分けて比較する');
    if (a.experience === '0-1') items.push('転職を考える背景と、次に積みたい経験を自分の言葉で整理する');
    items.push('担当範囲・工夫・成果を具体的に整理し、職務経歴書に反映する');
    return [...new Set(items)];
  }

  function buildActions(a, type) {
    const experienced = a.study === 'work';
    const practiced = a.study === 'handson';
    const actionsByType = {
      cloud: [experienced ? '業務で担当したクラウド構成・設計判断・改善成果を整理する' : practiced ? 'ハンズオンで作った構成の設計理由と運用・アクセス制御を説明できるようにする' : 'AWS / Azureで小さな構成を作り、ネットワークやアクセス制御を確認する', 'クラウド求人の必須経験と現在の経験を比較する'],
      upstream: [experienced || a.work === 'design' ? '設計判断・要件調整・改善成果と自分の担当範囲を整理する' : '設定変更・障害対応・改善提案の経験から、設計につながる材料を整理する', '設計・構築求人で任される工程と必要経験を確認する'],
      developer: [experienced ? '業務で担当した機能・設計・テスト・改善成果を整理する' : practiced ? '成果物の実装・テスト・設計理由を説明できるようにする' : '希望分野で小さな成果物を作り、実装とテストを経験する', '希望する開発求人の使用技術・担当範囲と経験を比較する'],
      internal: [experienced || a.job === 'internal' ? '社内利用者への対応・システム改善・部門間調整の実績を整理する' : '利用者対応・業務改善・関係者調整につながる経験を棚卸しする', '社内SE求人の担当範囲・チーム体制・外部委託範囲を確認する'],
      salary: ['現在の経験で応募を検討できる求人の年収レンジと要件を確認する', '基本給・賞与・固定残業代・仕事内容を比較表にまとめる'],
      career: ['興味のある求人を保存し、仕事内容の共通点を整理する', '現職と転職先候補で今後積める経験を比較する']
    };
    const actions = [...actionsByType[type]];
    if (a.purpose === 'environment') actions.unshift('希望する勤務時間・配属・働き方を書き出し、求人や面談で確認する');
    if (a.purpose === 'salary' && type !== 'salary') actions.push('現在の年収と求人の基本給・賞与・固定残業代を同じ条件で比較する');
    if (a.arrangement === 'ses' || a.arrangement === 'dispatch') actions.push('配属の決め方・変更の相談先・待機時の条件を求人や面談で確認する');
    actions.push(['asap', '3m'].includes(a.timing) ? '今週中に職務経歴書の初稿を作り、応募条件との差分を確認する' : '担当業務・工夫・成果を整理して職務経歴書の材料を作る');
    return actions;
  }

  function buildResult(a) {
    const c = calculate(a);
    const config = typeConfig[c.type];
    let title = config.title;
    let text = config.text;
    if (a.target !== 'undecided') {
      title = a.study === 'work' ? `${targetNames[a.target]}の実務経験を広げるタイプ` : `${targetNames[a.target]}を目指すタイプ`;
      text = a.study === 'work' ? '希望分野を業務で経験している回答をもとに、担当範囲と成果の整理、次に広げたい経験の比較を提案します。' : '希望する方向を軸に、今ある経験と求人に必要な経験の差を整理する提案です。未経験の部分は学習や実践で補う計画を立てましょう。';
    }
    const reasons = [a.target !== 'undecided' ? `希望する職種・工程で「${targetNames[a.target]}」を選んでいるためです。` : a.purpose === 'salary' ? '希望職種が未定で、年収アップを最優先しているため、まず条件と求人の比較を提案しています。' : '希望職種が未定のため、経験だけで進路を決めず、選択肢の整理を提案しています。'];
    const priorities = { skill: 'スキル・経験の幅', salary: '年収', environment: '働き方・職場環境', career: '将来のキャリア整理', undecided: '優先条件の整理' };
    reasons.push(`優先したいことは「${priorities[a.purpose]}」として行動に反映しています。`);
    if (a.target !== 'undecided') reasons.push({none:'希望分野の学習・経験はまだない回答のため、準備の具体化を提案しています。', studying:'希望分野を勉強中のため、学習と実践をつなげる準備を提案しています。', certified:'希望分野の資格取得を、実践経験につなげる準備を提案しています。', handson:'希望分野のハンズオン経験を、説明できる実績に整理する提案です。', work:'希望分野の業務経験があるため、実績整理と求人比較を提案しています。', uncertain:'希望分野との関連が不明なため、経験の対応関係の確認を提案しています。'}[a.study]);
    let readinessText = { clarify: '希望する仕事内容と優先条件を整理しながら、求人を比較する段階です。', compare: '関連する実践経験を整理し、求人要件との比較と応募準備を進めましょう。', prepare: '希望分野の求人要件を確認し、学習・実践と職務経歴書の準備を並行して進めましょう。' }[c.readiness];
    if (a.purpose === 'environment') readinessText += ' 職場環境の改善が目的の場合は、学習の完了を待たず、条件確認や相談・応募準備を進められます。';
    const timingText = {asap:'できるだけ早い転職を希望しているため、条件整理と応募準備を今週から並行して進める案です。', '3m':'3か月以内を目安に、今週は書類作成、その後は求人比較と準備を進めましょう。', '6m':'半年以内を目安に、最初の1か月で求人要件を確認し、不足する経験を補う計画を立てましょう。', '1y':'1年以内を目安に、学習・実務の目標を決め、3か月ごとに進み具合を見直しましょう。', undecided:'時期は未定のままでも、情報収集から始められます。気になる求人が見つかったら準備計画を見直しましょう。'}[a.timing];
    let experienceNote = c.earlyExperience ? '実務経験が浅い方向け：担当作業と次に身につけたい経験を具体化しましょう。年齢・IT経験だけでは第二新卒かどうかは判定しません。' : '実務経験を整理する際は、経験年数に加えて担当範囲と成果を具体化しましょう。';
    if (a.age === '30+') experienceNote += ' 本診断は主に20代向けのため、求人・支援サービスの対象条件を個別に確認してください。';
    return {...c, title, text, reasons, readinessText, timingText, experienceNote, strengths: buildStrengths(a), issues: buildIssues(a, c.type), actions: buildActions(a, c.type), services: config.services};
  }
  const api = { choices, calculate, buildResult };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CareerDiagnosis = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
