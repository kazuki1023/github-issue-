import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// GitHub APIのURL
const api_url = "https://api.github.com";

// リポジトリの所有者とリポジトリ名
const owner = "kazuki1023";
const repo = "github-issue-";

// GitHubのパーソナルアクセストークン
dotenv.config();
const token = process.env.GITHUB_TOKEN;

// イシューテンプレートファイルがあるディレクトリのパス
const template_dir = "docs/issues";

// ヘッダーにトークンを設定
const headers = {
  Authorization: `token ${token}`,
  Accept: "application/vnd.github.v3+json"
};

// 指定されたディレクトリ内の全てのMarkdownファイルを読み込む
fs.readdir(template_dir, (err, files) => {
  if (err) {
    console.log("Unable to scan directory: " + err);
    return;
  }

  files.forEach(file => {
    if (path.extname(file) === '.md') {
      const filePath = path.join(template_dir, file);
      const content = fs.readFileSync(filePath, 'utf8');

      const title_match = content.match(/^## (.+)$/m);
      const label_match = content.match(/^## labels\s*\n\[([^\]]+)\]/m);
      const contentWithoutLabels = label_match ? content.split(label_match[0])[1] : content;
    // 本文を抽出（ラベルの後のすべてのテキスト）
    const body_match = contentWithoutLabels ? contentWithoutLabels.split(/^## [^\n]+$/m)[1].trim() : '';

      if (title_match) {
        const issue_title = title_match[1].trim();
        const issue_body = body_match;
        const labels = label_match ? label_match[1].split(',').map(label => label.trim()) : [];

        // イシューを作成するためのデータ
        const data = {
          title: issue_title,
          body: issue_body,
          labels: labels
        };

        axios.post(`${api_url}/repos/${owner}/${repo}/issues`, data, { headers })
          .then(response => {
            console.log(`Issue created from ${file}: ${response.data.html_url}`);
          })
          .catch(error => {
            console.log(`Failed to create issue from ${file}.`);
            console.error("Error:", error);
          });
      } else {
        console.log(`Failed to parse the issue template in ${file}.`);
      }
    }
  });
});
