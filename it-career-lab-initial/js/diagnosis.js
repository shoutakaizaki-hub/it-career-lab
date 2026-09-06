const form = document.getElementById("diagnosisForm");
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const resultPoints = document.getElementById("resultPoints");

function renderPoints(items) {
  resultPoints.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    resultPoints.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const age = document.getElementById("age").value;
  const experience = document.getElementById("experience").value;
  const job = document.getElementById("job").value;
  const target = document.getElementById("target").value;
  const salary = document.getElementById("salary").value;

  let title = "キャリア整理タイプ";
  let text = "転職を急いで決めるより、現在の経験と希望を整理して、選択肢を比較する段階です。";
  let points = [
    "現在担当している業務を具体的に書き出す",
    "興味のある求人で求められる経験を確認する",
    "転職する場合と現職に残る場合の両方を比較する"
  ];

  if ((job === "infra" || job === "ops" || job === "ses") && target === "cloud") {
    title = "インフラ経験を活かすクラウド転職タイプ";
    text = "現在のインフラ・運用経験を土台に、AWSやAzureなどのクラウド分野へ広げる方向が考えられます。";
    points = [
      "Linux・ネットワーク・障害対応など現在の実務経験を整理する",
      "AWS / Azureを実際に触り、構築経験を増やす",
      "運用だけでなく設計・構築に関われる求人を確認する"
    ];
  } else if ((age === "22-24" || age === "25-27") && (experience === "0-1" || experience === "1-3")) {
    title = "20代・第二新卒キャリア見直しタイプ";
    text = "経験年数が比較的浅いため、現在のスキルだけでなく、ポテンシャルや今後の方向性も含めて検討しやすい段階です。";
    points = [
      "転職理由を仕事内容・成長環境・働き方に分けて整理する",
      "第二新卒・20代向けの求人も比較する",
      "次の会社で身につけたいスキルを明確にする"
    ];
  } else if (target === "upstream") {
    title = "上流工程へのステップアップタイプ";
    text = "これまでの運用・開発経験を活かし、設計や構築など担当範囲を広げる方向が考えられます。";
    points = [
      "要件整理・設計・構築に近い業務経験を洗い出す",
      "現職で上流工程に挑戦できる余地も確認する",
      "求人票では担当工程と配属後の業務範囲を見る"
    ];
  } else if (target === "salary" && (salary === "under300" || salary === "300-399")) {
    title = "年収・市場価値チェックタイプ";
    text = "年収だけで判断せず、現在の経験が市場でどの程度評価されるかを確認するところから始めると整理しやすいです。";
    points = [
      "同年代・同職種の求人年収を複数確認する",
      "年収アップにつながる経験・資格を整理する",
      "仕事内容と年収の両方を比較する"
    ];
  }

  resultTitle.textContent = title;
  resultText.textContent = text;
  renderPoints(points);
  result.classList.remove("hidden");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
});
