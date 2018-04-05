# Contributing
All contributions are welcomed!

## Opening Issues
Click the below links to create a new issue:

- [Report a bug][create-bug-url]
- [Request an enhancement][create-enhancement-url]
- [Ask a question][create-question-url]

## Developing
All that is needed to work with this repo is [Node.js][nodejs-url] and your favorite editor or IDE, although we recommend [VS Code][vscode-url]

### Building
To build and/or work on this project:

Clone the repo, change into the directory where you cloned the directory, and lastly run the developer setup script
```sh     
git clone https://github.com/swellaby/gulp-vsts-bump.git
cd gulp-vsts-bump 
npm run dev:setup
```

### Submitting Changes
Swellaby members should create a branch within the repository, make changes there, and then submit a PR. 

Outside contributors should fork the repository, make changes in the fork, and then submit a PR.

### git hooks
This repo utilizes the [husky][husky-url] module for the [git pre-commit hook][git-hook-url]. As such, when you run a `git commit`, the pre-commit hook will run a script to ensure the linter still passes and that code coverage is still at 100%. If the script fails your commit will be rejected, and you will need to fix the issue(s) before attempting to commit again.  

You can optionally skip this hook by including the `-n` switch (i.e. `git commit -n -m "..."`) if you are only trying to commit non-code content, like a markdown or package.json file.

[create-bug-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=BUG_TEMPLATE.md&labels=bug,unreviewed&title=Bug:%20
[create-question-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=QUESTION_TEMPLATE.md&labels=question,unreviewed&title=Q:%20
[create-enhancement-url]: https://github.com/swellaby/gulp-vsts-bump/issues/new?template=ENHANCEMENT_TEMPLATE.md&labels=enhancement,unreviewed&title=E:%20
[nodejs-url]:https://nodejs.org/en/download/
[vscode-url]: https://code.visualstudio.com/
[husky-url]: https://www.npmjs.com/package/husky
[git-hook-url]: https://git-scm.com/docs/githooks#_pre_commit