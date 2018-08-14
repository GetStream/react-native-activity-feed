set -ex
yarn
yarn lint
yarn build
git push origin master
sed 's="main": "./src/index.js",="main": "./lib/index.js",=g'
