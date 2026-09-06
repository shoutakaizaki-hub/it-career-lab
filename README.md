# IT研究室

20代・若手ITエンジニア向けのキャリア・転職情報サイト。

## 構成

- `index.html` トップページ
- `diagnosis.html` 転職タイプ診断
- `compare.html` 転職サービス比較
- `articles/` キャリア記事
- `css/style.css` 共通スタイル
- `js/diagnosis.js` 診断ロジック
- `privacy.html` プライバシーポリシー
- `advertising.html` 広告・PR表記
- `about.html` 運営者情報
- `contact.html` お問い合わせ

## ローカル確認

VS CodeのLive Server等で `index.html` を開くか、任意の簡易HTTPサーバーで確認してください。

## 公開予定

Azure Static Web Apps + GitHub Actions を利用予定。

## 注意

アフィリエイトリンク・サービス名・成果条件等は、ASPでの提携承認後に最新条件を確認して追加します。


## 診断の検証

`node --test tests/diagnosis.test.cjs` で判定・文章生成・画面接続の回帰テストを実行できます（追加パッケージ不要）。

- `js/diagnosis-core.js`: 回答検証、希望方向の判定、結果文生成。DOM・通信に依存しません。
- `js/diagnosis.js`: フォーム入力、結果表示、フォーカス移動、回答変更時の結果無効化。
- 希望職種を優先し、年齢・年収・契約形態で進路を上書きしません。希望未定の場合は条件整理を案内します。
- 数値の適性評価は行いません。転職時期は行動計画だけに反映します。
- ブラウザでは未入力、結果見出しへのフォーカス、回答変更、再診断、狭い画面での表示を確認してください。
