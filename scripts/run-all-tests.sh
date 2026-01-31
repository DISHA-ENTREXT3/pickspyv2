#!/bin/bash
set -e

echo "🚀 Running all tests..."

node tests/api.test.js
node tests/network.test.js

# k6 run --out json=load-test-result.json tests/load.test.js || true

# docker run --rm -v $(pwd):/zap owasp/zap2docker-stable \
#   zap-baseline.py -t $BASE_URL -J zap-report.json || true

echo "✅ All tests completed."
