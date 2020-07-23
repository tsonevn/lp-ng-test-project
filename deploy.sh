#!/usr/bin/env sh

set -e

ng build --prod --base-href /lp-ng-test-project/

cd dist/lp-ng-test-project

git init
git add -A
git commit -m 'deploy'

git push -f https://github.com/tsonevn/lp-ng-test-project.git master:gh-pages

cd -