## Modeling COVID-19 spread
This project models and presents the COVID-19 spread in Sweden.
It can also (primitively) predict future spread. View the
webpage of this repo here: https://bwest-uggelberg.github.io/covid19/

### Tools
**Mocha** provides the testing framework used in test/test.js
and is used to run tests and report the results. **Chai** is an
assertion library used in the same file. Assertions performed
in a test case are used by Mocha to pass or fail the test.
Both of these tools are useful because the project uses
test-driven development, where the workflow is dependent on
a solid framework for testing.

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

### Installing
`npm install` installs all packages.

### Testing
`npm test` runs the test suite.

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
