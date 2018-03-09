#!/usr/bin/env bash

set -ex

cd $(dirname $0)/data

BAB_TAG=v$(node -p 'require("babylon/package.json").version')

if [ ! -d babylon ]
then
    git clone --branch "$BAB_TAG" --depth 1 \
        https://github.com/babel/babel.git
    mv babel/packages/babylon .
    rm -rf babel
fi

# Hard-code this for now.
TS_TAG=v2.7.2

if [ ! -d typescript-compiler ]
then
    git clone --branch "$TS_TAG" --depth 1 \
        https://github.com/Microsoft/TypeScript.git
    mv TypeScript/src/compiler typescript-compiler
    rm -rf TypeScript
fi

cd .. # back to the ast-types/test/ directory

exec mocha --reporter spec --full-trace $@ run.js
