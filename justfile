export PATH := "./node_modules/.bin:" + env_var('PATH')

install-dependencies:
    yarn --ignore-engines

build:
    rm -rf lib
    node build.js

test: build
    jest --detectOpenHandles

test-only file: build
    jest --detectOpenHandles {{file}}

emit-types:
    tsc # see tsconfig.json

publish: build emit-types
    npm publish

format:
    prettier --plugin-search-dir . --write .