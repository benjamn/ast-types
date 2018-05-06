#!/usr/bin/env bash

set -ex

cd $(dirname $0)/data

if [ ! -d babylon-typescript-fixtures ]
then
	if [ -d babel ]
	then
    	rm -rf babel
	fi
    git clone --depth 1 https://github.com/babel/babel.git
    mv babel/packages/babylon/test/fixtures/typescript \
       babylon-typescript-fixtures
    rm -rf babel
fi

if [ ! -d typescript-compiler ]
then
	if [ -d TypeScript ]
	then
    	rm -rf TypeScript
    fi
    git clone --depth 1 https://github.com/Microsoft/TypeScript.git
    mv TypeScript/src/compiler typescript-compiler
    rm -rf TypeScript
fi

cd .. # back to the ast-types/test/ directory

exec mocha --check-leaks --reporter spec --full-trace $@ run.js
