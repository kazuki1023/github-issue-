"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var dotenv = __importStar(require("dotenv"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var process = __importStar(require("process"));
// GitHub APIのURL
var api_url = "https://api.github.com";
// リポジトリの所有者とリポジトリ名
var owner = "kazuki1023";
var repo = "github-issue-";
// GitHubのパーソナルアクセストークン
dotenv.config();
var token = process.env.GITHUB_TOKEN;
// イシューテンプレートファイルがあるディレクトリのパス
var template_dir = "docs/issues";
// ヘッダーにトークンを設定
var headers = {
    Authorization: "token ".concat(token),
    Accept: "application/vnd.github.v3+json"
};
// 指定されたディレクトリ内の全てのMarkdownファイルを読み込む
fs.readdir(template_dir, function (err, files) {
    if (err) {
        console.log("Unable to scan directory: " + err);
        return;
    }
    files.forEach(function (file) {
        if (path.extname(file) === '.md') {
            var filePath = path.join(template_dir, file);
            var content = fs.readFileSync(filePath, 'utf8');
            var title_match = content.match(/^## (.+)$/m);
            var label_match = content.match(/^## labels\s*\n\[([^\]]+)\]/m);
            var contentWithoutLabels = label_match ? content.split(label_match[0])[1] : content;
            // 本文を抽出（ラベルの後のすべてのテキスト）
            var body_match = contentWithoutLabels ? contentWithoutLabels.split(/^## [^\n]+$/m)[1].trim() : '';
            if (title_match) {
                var issue_title = title_match[1].trim();
                var issue_body = body_match;
                var labels = label_match ? label_match[1].split(',').map(function (label) { return label.trim(); }) : [];
                // イシューを作成するためのデータ
                var data = {
                    title: issue_title,
                    body: issue_body,
                    labels: labels
                };
                axios_1.default.post("".concat(api_url, "/repos/").concat(owner, "/").concat(repo, "/issues"), data, { headers: headers })
                    .then(function (response) {
                    console.log("Issue created from ".concat(file, ": ").concat(response.data.html_url));
                })
                    .catch(function (error) {
                    console.log("Failed to create issue from ".concat(file, "."));
                    console.error("Error:", error);
                });
            }
            else {
                console.log("Failed to parse the issue template in ".concat(file, "."));
            }
        }
    });
});
