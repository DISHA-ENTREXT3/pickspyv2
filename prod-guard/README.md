# prod-guard 🛡️

A production-readiness CLI that:

- Runs critical checks
- Auto-fixes safe configuration issues
- Blocks unsafe deployments
- Works locally and in CI

## Install

```bash
npm install -D prod-guard
```

or globally:

```bash
npm install -g prod-guard
```

## Usage

```bash
prod-guard run
prod-guard run --ci
prod-guard run --only=cors,rate-limit
prod-guard run --dry
```

## What It Checks

- CORS safety
- Rate limiting
- Network timeouts & retries
- Load test thresholds
- Security scan results

## CI Example

```yaml
- name: Production Readiness Gate
  run: npx prod-guard run --ci
```

## Philosophy

prod-guard auto-fixes hygiene, blocks risk, and forces humans to handle logic and security.
