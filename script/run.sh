#!/usr/bin/env bash

set -ex

exec babel-node --extensions ".ts" script/$@.ts
