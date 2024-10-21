# Playwright workshop

TODO:

- Explain what is the purpose of the workshop
- Create step-by-step guide through to workshop

## Scripts

### `build-fe`

Builds the front-end

### `typecheck`

Runs the `TypeScript` compiler as type checker

### `format`

Runs the `prettier` formatter to format the code

### `format-check`

Runs the `prettier` formatter to check if the code is formatted

### `lint`

Runs the ESLint linter

### `lint:fix`

Runs the ESLint with `--fix` argument to automatically fix fixable code

### `build-tests`

Builds the tests from TypeScript to JavaScript

### `test`

Runs the `playwright` test runner against the already transpiled tests.
It uses the `run-script-os` package to run different browsers on different **platforms**:

- `windows` - Google Chrome, Firefox, Microsoft Edge
- `macos` - Google Chrome, Firefox, WebKit
- `linux` - Google Chrome, Firefox

### `test:debug`

Run tests only with `Google Chrome` in a `debug` mode.

- Browsers launch in headed mode
- Default timeout is set to 0 (= no timeout)

> **_NOTE:_** To speed up the debugging process you can add a [`page.pause()`](https://playwright.dev/docs/api/class-page#page-pause) method to your test. This way you won't have to step through each action of your test to get to the point where you want to debug.
> [Learn more about Debugging Tests](https://playwright.dev/docs/debug#run-in-debug-mode-1)

### `test:strict`

Run tests only with `Google Chrome` with `traces` and `0 retries`.

### `test:watch`

Run the `playwright` test runner in watch mode using [Playwright's experimental watch mode](https://github.com/microsoft/playwright/issues/21960) alongside the typescript compiler in watch mode.

### `test-report`

Open the last `playwright` test run report.
[Learn more about Test Reports](https://playwright.dev/docs/test-reporters#built-in-reporters)

### `install-browsers`

It installs all the required browsers for the specific platform:

- `windows` - Google Chrome, Firefox, Microsoft Edge
- `macos` - Google Chrome, Firefox, WebKit
- `linux` - Google Chrome, Firefox

> **_NOTE:_** By default Playwright will install `Chromium`, `WebKit` and `Firefox` browsers into OS-specific cache folders.
> [Managing browser binaries](https://playwright.dev/docs/browsers#managing-browser-binaries)
>
> For `Google Chrome` and `Microsoft Edge` Playwright will prefer to use the already installed version if there is any instead of downloading its own.
> [Learn More for Google Chrome & Microsoft Edge](https://playwright.dev/docs/browsers#google-chrome--microsoft-edge)

## Updating Playwright

To update Playwright and its browsers you simply update the package and rerun `install-browsers`.

```sh
# Update playwright
npm install -D @playwright/test@latest

# Install new browsers
npm run install-browsers
```

> **_NOTE:_** Playwright will delete stale browsers by default when you install browsers.
> [Stale Browser Removal](https://playwright.dev/docs/browsers#stale-browser-removal)

Check the [release notes](https://playwright.dev/docs/release-notes) to see what the latest version is and what changes have been released.

```sh
# See what version of Playwright you have by running the following command
npx playwright --version
```

[Learn more about updating Playwright](https://playwright.dev/docs/browsers#update-playwright-regularly)
