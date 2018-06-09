#!/usr/bin/env bash

set -ex

cd $(dirname $0)/data

BAB_TAG=v$(node -p 'require("@babel/parser/package.json").version')

if [ ! -d babylon ]
then
	if [ -d /tmp/babel ]
	then
    	rm -rf /tmp/babel
	fi
    git clone --branch "$BAB_TAG" --depth 1 \
        https://github.com/babel/babel.git /tmp/babel
    mv /tmp/babel/packages/babel-parser .
    rm -rf /tmp/babel
fi

# Hard-code this for now.
TS_TAG=v2.7.2

if [ ! -d typescript-compiler ]
then
	if [ -d /tmp/TypeScript ]
	then
    	rm -rf /tmp/TypeScript
    fi
    git clone --branch "$TS_TAG" --depth 1 \
        https://github.com/Microsoft/TypeScript.git /tmp/TypeScript
    mv /tmp/TypeScript/src/compiler typescript-compiler
    rm -rf /tmp/TypeScript
fi

cd .. # back to the ast-types/test/ directory

exec mocha --check-leaks --reporter spec --full-trace $@ run.js
