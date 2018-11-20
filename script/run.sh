#!/usr/bin/env bash

set -ex

exec ./node_modules/.bin/babel-node --extensions ".ts" script/$@.ts
