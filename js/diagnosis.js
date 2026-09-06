(() => {
  "use strict";

  const form = document.getElementById("diagnosisForm");
  const result = document.getElementById("result");
  const retryButton = document.getElementById("retryButton");

  if (!form || !result) return;

  const typeConfig = {
    cloud: {
      title: "インフラ経験を活かすクラウド転職タイプ",
      text: "現在の経験を土台に、AWS / Azureなどのクラウド分野へ段階的に広げる方向と相性があります。資格だけでなく、構築経験や業務上の改善経験をセットで整理すると強みを伝えやすくなります。",
      services: [
        "ITエンジニア特化型",
        "クラウド・インフラ求人を扱うサービス",
        "20代のキャリアアップ支援型"
      ]
    },
    upstream: {
      title: "運用・実装経験を上流工程につなげるタイプ",
      text: "これまでの実務経験を、設計・構築・要件整理など上流工程へつなげる方向が候補です。担当作業だけでなく、障害対応、改善提案、手順整備などの経験も言語化すると評価材料になります。",
      services: [
        "ITエンジニア特化型",
        "インフラ・SIer求人を扱うサービス",
        "キャリアアップ支援型"
      ]
    },
    developer: {
      title: "開発スキルを軸に専門性を伸ばすタイプ",
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
    secondCareer: {
      title: "20代・第二新卒キャリア整理タイプ",
      text: "経験年数が浅い段階では、完成された専門性よりも、これまで担当した業務と今後伸ばしたい分野を具体的に示すことが重要です。若手向け求人を確認しながら、次に積みたい経験を整理しましょう。",
      services: [
        "20代・第二新卒支援型",
        "IT分野のキャリアチェンジ支援型",
        "若手ITエンジニア求人を扱うサービス"
      ]
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

  function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  }

  function add(scores, key, value) {
    scores[key] += value;
  }

  function getAnswers() {
    return {
      age: document.getElementById("age").value,
      experience: document.getElementById("experience").value,
      job: document.getElementById("job").value,
      work: document.getElementById("work").value,
      target: document.getElementById("target").value,
      salary: document.getElementById("salary").value,
      purpose: document.getElementById("purpose").value,
      study: document.getElementById("study").value,
      timing: document.getElementById("timing").value
    };
  }

  function calculate(answers) {
    const scores = {
      cloud: 0,
      upstream: 0,
      developer: 0,
      salary: 0,
      secondCareer: 0,
      career: 10
    };

    let readiness = 10;

    // 年齢・経験
    if (answers.age === "22-24") add(scores, "secondCareer", 30);
    if (answers.age === "25-27") add(scores, "secondCareer", 22);
    if (answers.age === "28-29") add(scores, "career", 8);

    if (answers.experience === "0-1") {
      add(scores, "secondCareer", 30);
      readiness += 5;
    }
    if (answers.experience === "1-3") {
      add(scores, "secondCareer", 22);
      readiness += 15;
    }
    if (answers.experience === "3-5") readiness += 25;
    if (answers.experience === "5+") readiness += 30;

    // 現職
    if (answers.job === "infra") {
      add(scores, "cloud", 22);
      add(scores, "upstream", 12);
    }
    if (answers.job === "ops") {
      add(scores, "cloud", 14);
      add(scores, "upstream", 10);
      add(scores, "secondCareer", 8);
    }
    if (answers.job === "ses") {
      add(scores, "secondCareer", 12);
      add(scores, "salary", 5);
      add(scores, "career", 8);
    }
    if (answers.job === "developer") add(scores, "developer", 24);
    if (answers.job === "internal") add(scores, "career", 10);

    // 現在の仕事内容
    if (answers.work === "monitoring") {
      add(scores, "cloud", 8);
      add(scores, "upstream", 8);
      readiness += 5;
    }
    if (answers.work === "operation") {
      add(scores, "cloud", 12);
      add(scores, "upstream", 12);
      readiness += 10;
    }
    if (answers.work === "build") {
      add(scores, "cloud", 18);
      add(scores, "upstream", 22);
      readiness += 20;
    }
    if (answers.work === "design") {
      add(scores, "upstream", 32);
      readiness += 25;
    }
    if (answers.work === "development") {
      add(scores, "developer", 30);
      readiness += 20;
    }
    if (answers.work === "mixed") {
      add(scores, "career", 10);
      readiness += 20;
    }

    // 希望方向
    if (answers.target === "cloud") add(scores, "cloud", 42);
    if (answers.target === "upstream") add(scores, "upstream", 42);
    if (answers.target === "developer") add(scores, "developer", 42);
    if (answers.target === "salary") add(scores, "salary", 38);
    if (answers.target === "internal") add(scores, "career", 20);
    if (answers.target === "undecided") add(scores, "career", 28);

    // 年収
    if (answers.salary === "under300") add(scores, "salary", 20);
    if (answers.salary === "300-399") add(scores, "salary", 14);
    if (answers.salary === "400-499") add(scores, "salary", 6);

    // 目的
    if (answers.purpose === "skill") {
      add(scores, "upstream", 10);
      add(scores, "developer", 8);
      add(scores, "cloud", 8);
    }
    if (answers.purpose === "salary") add(scores, "salary", 35);
    if (answers.purpose === "environment") add(scores, "career", 20);
    if (answers.purpose === "career") add(scores, "career", 25);
    if (answers.purpose === "cloud") add(scores, "cloud", 30);
    if (answers.purpose === "undecided") add(scores, "career", 18);

    // 学習状況
    if (answers.study === "none") readiness += 0;
    if (answers.study === "studying") {
      readiness += 10;
      if (answers.target === "cloud") add(scores, "cloud", 8);
      if (answers.target === "developer") add(scores, "developer", 8);
    }
    if (answers.study === "certified") {
      readiness += 15;
      if (answers.target === "cloud") add(scores, "cloud", 12);
    }
    if (answers.study === "handson") {
      readiness += 22;
      if (answers.target === "cloud") add(scores, "cloud", 18);
      if (answers.target === "developer") add(scores, "developer", 18);
      if (answers.target === "upstream") add(scores, "upstream", 10);
    }
    if (answers.study === "work") {
      readiness += 28;
      if (answers.target === "cloud") add(scores, "cloud", 25);
      if (answers.target === "developer") add(scores, "developer", 25);
      if (answers.target === "upstream") add(scores, "upstream", 20);
    }

    // 転職時期
    if (answers.timing === "asap") readiness += 15;
    if (answers.timing === "3m") readiness += 12;
    if (answers.timing === "6m") readiness += 8;
    if (answers.timing === "1y") readiness += 5;

    if (answers.purpose !== "undecided") readiness += 5;
    if (answers.target !== "undecided") readiness += 5;

    readiness = clamp(readiness);

    const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    let type = ranked[0][0];

    // 若手判定だけが強すぎて、明確な希望方向を上書きしないよう補正
    if (answers.target === "cloud" && scores.cloud >= scores[type] - 12) type = "cloud";
    if (answers.target === "upstream" && scores.upstream >= scores[type] - 12) type = "upstream";
    if (answers.target === "developer" && scores.developer >= scores[type] - 12) type = "developer";
    if (answers.target === "salary" && scores.salary >= scores[type] - 12) type = "salary";

    const topScore = scores[type];
    const directionScore = clamp(Math.round((topScore / 110) * 100));

    return { type, scores, readiness, directionScore };
  }

  function buildStrengths(a) {
    const items = [];

    if (a.experience === "3-5" || a.experience === "5+") {
      items.push("複数年のIT実務経験があり、担当業務を具体化しやすい");
    } else if (a.experience === "1-3") {
      items.push("若手として実務経験があり、今後の伸びしろも示しやすい");
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
      none: "これから学習テーマを絞れば、志望分野に合わせた準備を始められる",
      studying: "資格・技術学習を継続しており、志望分野への関心を示せる",
      certified: "関連資格を取得しており、基礎知識の裏付けとして使える",
      handson: "ハンズオン・個人開発があり、実際に手を動かした経験を示せる",
      work: "希望分野を業務でも経験しており、転職時の直接的な強みになりやすい"
    };
    items.push(studyStrengths[a.study]);

    return items.slice(0, 3);
  }

  function buildIssues(a, type) {
    const items = [];

    if (a.study === "none") {
      items.push("希望分野に対する学習実績やハンズオン経験を作る");
    }

    if (type === "cloud" && !["build", "design"].includes(a.work) && a.study !== "work") {
      items.push("クラウドの構築経験を、ハンズオンでもよいので具体的に作る");
    }

    if (type === "upstream" && !["build", "design", "mixed"].includes(a.work)) {
      items.push("手順通りの作業だけでなく、改善・設定変更・設計に近い経験を増やす");
    }

    if (type === "developer" && a.work !== "development" && !["handson", "work"].includes(a.study)) {
      items.push("小さくても動く成果物を作り、GitHub等で説明できる状態にする");
    }

    if (type === "salary") {
      items.push("年収だけでなく、仕事内容・技術・次に積める経験も求人ごとに比較する");
    }

    if (a.experience === "0-1") {
      items.push("短期離職に見えないよう、転職理由と次に身につけたい経験を整理する");
    }

    if (a.target === "undecided" || a.purpose === "undecided") {
      items.push("求人を10〜20件見て、興味がある仕事内容と避けたい条件を整理する");
    }

    items.push("職務経歴書で『何を担当したか・どう工夫したか・何が変わったか』を具体化する");

    return [...new Set(items)].slice(0, 3);
  }

  function buildActions(a, type) {
    const actions = [];

    const typeActions = {
      cloud: [
        "AWS / AzureでVM・ネットワーク・IAMなどを一度自分で構築する",
        "インフラ経験とクラウド学習をつなげて職務経歴書に整理する",
        "クラウド求人を10件以上見て、必須スキルとの差分を確認する"
      ],
      upstream: [
        "現在の業務から、設定変更・障害対応・改善・設計に近い経験を洗い出す",
        "構築・設計工程を含む求人を確認して不足スキルを整理する",
        "職務経歴書を作り、担当範囲と成果を数字・具体例で書く"
      ],
      developer: [
        "希望技術で小さな成果物を作り、説明できる状態にする",
        "業務・個人開発で担当した機能と使用技術を整理する",
        "求人票から頻出スキルを確認し、優先して学習する"
      ],
      salary: [
        "現在の経験で応募できる求人の年収レンジを確認する",
        "年収だけでなく、仕事内容・技術・働き方を比較表にする",
        "職務経歴書を作成し、転職サービス等で市場価値の見方を確認する"
      ],
      secondCareer: [
        "これまで担当した作業をすべて書き出し、実務経験を棚卸しする",
        "次の3年間で身につけたい技術・工程を1〜2個に絞る",
        "20代・第二新卒向け求人を見て、応募条件との差分を確認する"
      ],
      career: [
        "興味のある求人を10〜20件保存し、共通する仕事内容を確認する",
        "年収・仕事内容・働き方のうち、優先順位を3つ決める",
        "転職する場合と現職に残る場合で、1年後に積める経験を比較する"
      ]
    };

    actions.push(...typeActions[type]);

    if (a.timing === "asap" || a.timing === "3m") {
      actions[2] = "今週中に職務経歴書の初稿を作り、応募条件との差分を確認する";
    }

    return actions;
  }

  function readinessText(score) {
    if (score >= 75) return "応募準備を進めながら、実際の求人を比較しやすい状態です。";
    if (score >= 55) return "情報収集と応募準備を並行して進めるとよい段階です。";
    if (score >= 35) return "まずは経験の棚卸しと学習実績づくりを優先すると進めやすいです。";
    return "転職を急ぐより、希望条件と次に積みたい経験を整理するところから始める段階です。";
  }

  function fillList(id, items, ordered = false) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = "";
    items.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      el.appendChild(item);
    });
  }

  function render(answers, calculated) {
    const config = typeConfig[calculated.type];

    document.getElementById("resultTitle").textContent = config.title;
    document.getElementById("resultText").textContent = config.text;

    document.getElementById("readinessScore").textContent = `${calculated.readiness}/100`;
    document.getElementById("directionScore").textContent = `${calculated.directionScore}/100`;
    document.getElementById("readinessBar").style.width = `${calculated.readiness}%`;
    document.getElementById("directionBar").style.width = `${calculated.directionScore}%`;
    document.getElementById("readinessLabel").textContent = readinessText(calculated.readiness);

    fillList("strengthsList", buildStrengths(answers));
    fillList("issuesList", buildIssues(answers, calculated.type));
    fillList("actionsList", buildActions(answers, calculated.type), true);
    fillList("serviceTypes", config.services);

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const answers = getAnswers();
    const calculated = calculate(answers);
    render(answers, calculated);
  });

  if (retryButton) {
    retryButton.addEventListener("click", () => {
      result.classList.add("hidden");
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
})();
