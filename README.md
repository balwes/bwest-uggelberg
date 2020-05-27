## Modeling COVID-19 spread
[![Coverage Status](https://coveralls.io/repos/github/bwest-uggelberg/covid19/badge.svg?branch=coverage)](https://coveralls.io/github/bwest-uggelberg/covid19?branch=coverage)

This project models and presents the COVID-19 spread in Sweden.
It can also (primitively) predict future spread. View the
webpage of this repo here: https://bwest-uggelberg.github.io/covid19/

### Installing
`npm install` installs all packages.

### Testing
`npm test` runs the test suite.
Code coverage is included at the end of the output.

### Running the website locally
Set up a local HTTP server, we use http-server:

`npm install -g http-server`

`http-server`

Then connect to the server's IP in the browser.
Make sure to disable caching.

### Changing the scripts
If you wish to make changes to the scripts that affect the browser side,
install browserify and uniq:

`npm install -g browserify`

`npm install uniq`

And run `browserify script.js -o browserify.js` after each change.

### Tools
**Mocha** provides the testing framework used in test/test.js
and is used to run tests and report the results. **Chai** is an
assertion library used in the same file. Assertions performed
in a test case are used by Mocha to pass or fail the test.
Both of these tools are useful because the project uses
test-driven development, where the workflow is dependent on
a solid framework for testing.

**Nyc** (the command line interface of Istanbul) adds code coverage
info after running the test suite. The info is received by
**Coveralls** which is a web service that tracks coverage over time.
The badge at the top of this readme is updated according to the
latest coverage report.

**Node-fetch** brings the JavaScript function window.fetch
to Node.js. The function is used to download COVID-19 and
population data from a URL. Because we cannot use the
browser's window.fetch function we use the package
**Browserify**. It bundles all modules into a single file
which lets the browser access them. Essentially, Browserify
makes the program behave the same way both in Node.js and
the browser.

**Chart.js** is a library used to visualize our data and
prediction in an interactive and pretty graph.

### Architecture
| File | Purpose |
|:-----|:--------|
| script.js | The Node.js source code. The bundle of this file is imported by the browser and provides functionality to the webpage. |
| index.html | The HTML file that makes up the webpage. It imports JS and CSS files and contains information about the webpage. |
| browserify.js | A bundle of script.js and the modules it references |
| package.json | Metadata (e.g. dependencies) of the Node.js project |
| package-lock.json | Contains a complete dependency tree based on package.json. Ensures that installations of this project will behave the same for everyone. |
| .travis.yml | A configuration file used by Travis CI |
| test/ | Contains the test file |
| css/ | Contains CSS files for styling of the webpage |
| fonts/ | Contains custom fonts used by the webpage |
