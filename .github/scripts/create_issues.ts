import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';

// GitHub APIのURL
const api_url = "https://api.github.com";

// リポジトリの所有者とリポジトリ名
const owner = "kazuki1023";
const repo = "github-issue-";

// GitHubのパーソナルアクセストークン
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

      // タイトルと本文を抽出
      const title_match = content.match(/^## (.+)$/m);
      const body_match = content.replace(/^## .+$/m, '').trim();

      if (title_match) {
        const issue_title = title_match[1].trim();
        const issue_body = body_match;

        // イシューを作成するためのデータ
        const data = {
          title: issue_title,
          body: issue_body
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
