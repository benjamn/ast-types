#!/usr/bin/env bash

set -ex

cd $(dirname $0)/data

BAB_TAG=v$(node -p 'require("babylon/package.json").version')

if [ ! -d babylon-typescript-fixtures ]
then
    git clone --branch "$BAB_TAG" --depth 1 \
        https://github.com/babel/babel.git
    mv babel/packages/babylon/test/fixtures/typescript \
       babylon-typescript-fixtures
    rm -rf babel
fi

if [ ! -d typescript-compiler ]
then
    git clone --depth 1 https://github.com/Microsoft/TypeScript.git
    mv TypeScript/src/compiler typescript-compiler
    rm -rf TypeScript
fi

cd .. # back to the ast-types/test/ directory

exec mocha --reporter spec --full-trace $@ run.js
