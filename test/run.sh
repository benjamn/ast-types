#!/usr/bin/env bash

set -ex

cd $(dirname $0)/data

if [ ! -d typescript ]
then
    git clone --depth 1 https://github.com/babel/babel.git
    mv babel/packages/babylon/test/fixtures/typescript ./
    rm -rf babel
fi

cd .. # back to the ast-types/test/ directory

exec mocha --reporter spec --full-trace $@ run.js
