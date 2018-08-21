#!/bin/bash
# shellcheck disable=SC2103

set -eux

if ! git diff --exit-code || ! git diff --cached --exit-code; then
    echo "ERROR: UNCOMMITTED CHANGES"
    exit 1
fi

cd native-package
npm version --no-git-tag-version "$1"
sed 's|"react-native-activity-feed-core": "[^"]\+"|"react-native-activity-feed-core": "'"$1"'"|g' -i.bak package.json
rm package.json.bak
cd ../expo-package
npm version --no-git-tag-version "$1"
sed 's|"react-native-activity-feed-core": "[^"]\+"|"react-native-activity-feed-core": "'"$1"'"|g' -i.bak package.json
rm package.json.bak
cd ..
git add {expo,native}-package/package.json
npm version "$1" --force


npm publish

cd native-package
npm publish

cd ../expo-package
npm publish

git push --follow-tags
