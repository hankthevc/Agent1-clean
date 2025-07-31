#!/bin/bash
# Simple script to apply small iterative improvements
# Reads progress from ai-reports/improvement_index.txt
# and applies the next update to the codebase.

set -e

PROGRESS_FILE="ai-reports/improvement_index.txt"
INDEX=1
if [ -f "$PROGRESS_FILE" ]; then
  INDEX=$(cat "$PROGRESS_FILE")
fi

NEXT_INDEX=$((INDEX + 1))

case $INDEX in
  1)
    # Improvement 1: add last updated comment to homepage
    sed -i "1i// Last improved on $(date -u +%Y-%m-%d)" trivia-tiles/client/pages/index.tsx
    ;;
  2)
    # Improvement 2: add placeholder dark mode toggle comment
    echo "\n// TODO: implement dark mode toggle" >> trivia-tiles/client/pages/index.tsx
    ;;
  3)
    # Improvement 3: add placeholder scoreboard comment
    echo "// TODO: add scoreboard" >> trivia-tiles/client/pages/index.tsx
    ;;
  4)
    # Improvement 4: add placeholder social sharing comment
    echo "// TODO: enable social sharing" >> trivia-tiles/client/pages/index.tsx
    ;;
  *)
    echo "All predefined improvements applied." && exit 0
    ;;
esac

mkdir -p ai-reports
echo $NEXT_INDEX > "$PROGRESS_FILE"

exit 0
