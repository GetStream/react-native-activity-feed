#!/bin/bash
# shellcheck disable=SC2103

set -eux

if ! git diff --exit-code || ! git diff --cached --exit-code; then
    echo "ERROR: UNCOMMITTED CHANGES"
    exit 1
fi

cd native-package
npm version --no-git-tag-version "$1"
cd ../expo-package
npm version --no-git-tag-version "$1"
cd ..
git add {expo,native}-package/package.json
npm version "$1" --force
