# CONTRIBUTORS

## Issues & PR's

Please fill out associated templates clearly and as detailed as possible for the
requested actions. It is important that you articulate WHAT you are trying to do
and WHY so your request will be considered. Before submission, search and review
all open and previously closed tickets before opening another one. This saves
everyone time!

## Development Environment

- Use `nvm` for node version management (see `.nvmrc` for version requirement)
- Use latest npm version via `nvm install-latest-npm`

## Guidelines

- Code (including Markdown) must pass a linting checks
- Developmental repository must be compatible with NodeJS v12 LTS & `npm@^7.0.0`
- Distribution build must be compatible with v10
- Must have successful build & pass all test cases in both Node.js v10 LTS, v12
  LTS, & v14 LTS
- New features & bugs should include a Test Driven Development (TDD) test case
  that replicates the issue or tests the new feature
- Releases will have all non-breaking changes in dependencies up-to-date

## Testing

### Local Testing

```sh
# Production build & Executes all test cases
npm run build

# Verifies build process once, then runs tests against local files
npm test
npm run unit-test-watch   # enable test watch mode

# Monitor build process & interactive lint
npm run build:watch
```

An quick and easy Test Driven Development (TDD) strategy is to open 2 terminals
and run `npm run unit-test-watch` and then `npm run build:watch` in the other. I
have configured unit-testing to only watch for a new bundle and modified test
files whereas build monitors the entrypoint and subsequent source code files.

### GitHub CI Pipeline

Upon an open Pull Request (PR), GitHub will automatically run the configured CI
actions in order to evaluate and enforce the project standards. You can review
the action steps at `.github/workflows/ci.yml`. The actions will line up with
the guidelines stated above. PR's will not be accepted until there are no merge
conflicts with the master branch nor failing pipeline actions. Please do your
due diligence.
