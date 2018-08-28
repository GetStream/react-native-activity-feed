set -exu
sed -e 's="main": "./lib/index.js",="main": "./src/index.js",=g' -i.bak package.json
rm package.json.bak
