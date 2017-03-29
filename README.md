[![Build Status](https://travis-ci.com/studykik/web.svg?token=ep486uxesfywHQ7s7j7H&branch=master)](https://travis-ci.com/studykik/web) master
[![Build Status](https://travis-ci.com/studykik/web.svg?token=ep486uxesfywHQ7s7j7H&branch=develop)](https://travis-ci.com/studykik/web) develop

You will need to install packages first and install the Postgres database to run the server. You'll also need to have some environment variables defined in a .env file (which you should NOT commit to the repository).

### Environment variables
Create a file named `.env` at the root of this project that includes the following values:
```
NODE_ENV=development
API_URL=http://localhost:3000/api/v1
SOCKET_URL=http://localhost:3000
HTTP=true
```
If you like inline source maps, and debugging anywhere in the app with Chrome Dev Tools, enter this line into the .env file as well:
```
SOURCEMAP=true
```

If you want to develop with Redux Dev Tools, then have this value in the .env as well:
```
DEVTOOLS=true
```
You will also need to install the associated Chrome extension for Redux Dev Tools to use it.
https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd

If you want to use staging to test the web repo, change your config to:
```
API_URL=http://api-staging.studykik.com/api/v1
```

### Install packages
```
npm install
```
for correct installation of package 'git-validate' it may be necessary
to manually create a pre-commit file in ./.git/hooks directory and change
the rights for it.

### Running the app:
```
npm start
```

### Running tests:
```
# unit tests
npm test

# integration tests
npm run browsers

# all tests
npm run test
```

# Cucumber
https://cucumber.io/

Documentation about how to use the command line tools:
https://github.com/cucumber/cucumber-js/blob/master/docs/cli.md

### Folder Structure
Inspired by

1. https://gist.github.com/ryanflorence/daafb1e3cb8ad740b346
1. https://medium.com/@ryanflorence/welcome-to-future-of-web-application-delivery-9750b7564d9f#.513yw7csp

## Style Guide

Most of our style is handled by eslint, however, there are some extra bits to consider.

There is a pre-commit hook installed for running lint so that we always commit eslint-clean code.
However you can run the linter anytime and check styles.
```
npm run lint
```

#### Configuration
Various IDEs provide linting plugins. For Sublime Text,

1. [SublimeLinter](http://www.sublimelinter.com/en/latest/)
1. [SublimeLinter-contrib-eslint](https://github.com/roadhump/SublimeLinter-eslint)

For Jetbrains Webstorm, support is built-in, but you will need to enable it in settings after you run
```
npm install
```
to install the necessary dependencies. You will also need to enable it in the settings for Webstorm, as shown in the screenshot below.
![Webstorm ESLint Settings](https://studykik.atlassian.net/wiki/download/attachments/5210114/eslint%20webstorm.png?version=1&modificationDate=1467068787645&api=v2)

Jetbrains also has a good support document on using ESLint in Webstorm.

[https://www.jetbrains.com/help/webstorm/11.0/using-javascript-code-quality-tools.html#ESLint](https://www.jetbrains.com/help/webstorm/11.0/using-javascript-code-quality-tools.html#ESLint)

#### Imports
Imports should be added in the following order:

1. React
1. NPM packages
1. Constants
1. PropTypes
1. Actions
1. Reducers
1. shared components
1. child components
1. styles

If there are more than 5 import statements, feel free to add a line break between at any of the break points above so that the imports are easier to digest.

## Tech Used

- [Cucumber](https://cucumber.io/) for BDD testing
- [ESLint](http://eslint.org/) for linting
- [Express](http://expressjs.com/) for web server
- [React](https://github.com/facebook/react) for all the goodness.
- [Redux](https://github.com/gaearon/redux) for the _Atomic Flux_ architecture.
- [React-Router](https://github.com/rackt/react-router) for routing goodness.
- [React-Transform](https://github.com/gaearon/babel-plugin-react-transform) for development fun (and productivity).
- [Webpack](https://github.com/webpack/webpack) for asset management and production builds.