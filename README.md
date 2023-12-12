# github-issue-test
githubActionsでissueを作成できます

## 使い方
.envファイルに以下の内容を記述してください
```
GITHUB_TOKEN=
```

github-tokenの取得方法は[こちら](https://docs.github.com/ja/github/authenticating-to-github/creating-a-personal-access-token)

作成時、以下のスコープを選択してください
- repo
- workflow

リポジトリの設定のSecretsで `` New repository secret `` を選択して、
``TOKEN`` で作成したトークンを登録してください
