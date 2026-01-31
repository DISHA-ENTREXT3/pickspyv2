#!/bin/bash
set -e
bash scripts/run-all-tests.sh
node prod-guard/bin/prod-guard.js --ci
