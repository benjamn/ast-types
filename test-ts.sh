#!/usr/bin/env bash
if [ -e node_modules/.bin/tsc ]; then
    echo "Compiling Typescript Test Files"
    TS_FAILURE=0
    for i in $(ls test/ts/*.ts); do
        ./node_modules/.bin/tsc --outDir out/tests/ $i
        let "TS_FAILURE= $? || $TS_FAILURE"
    done
    if [ $TS_FAILURE -ne 0 ]; then
        echo "There Were Typescript Failures"
        exit 1
    else
        echo "All Typscript Tests Compiled Successfully"
    fi
else
    echo "Typescript Not Installed Locally."
    echo "Either you have an old version of node, or forgot to call 'npm install'"
fi