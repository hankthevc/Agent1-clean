# AI Agent Ready for Iteration

This repository contains the workflow and code for the Trivia Tiles game.

## Continuous Improvement

The GitHub Actions workflow `ai-agent-iteration.yml` now runs every five
minutes. During each run it executes `scripts/continuous-improvement.sh`
which applies a small code enhancement and records progress in
`ai-reports/improvement_index.txt`.

To manually trigger an iteration run:

```bash
gh workflow run ai-agent-iteration.yml --ref main --field mode=iteration
```
