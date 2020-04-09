## Modeling COVID-19 spread
This project models and presents recent data of the COVID-19 spread in Sweden.

### Website of this repo
https://bwest-uggelberg.github.io/covid19/

### Testing
`npm test` runs the test suite.

### Running the website locally
Set up a local HTTP server, we use http-server:

`npm install -g http-server`

`http-server`

Then connect to the server's IP in the browser.

### Changing the scripts
If you wish to make changes to the scripts that affect the browser side,
install browserify and uniq:

`npm install -g browserify`

`npm install uniq`

And run `browserify script.js -o browserify.js` after each change.
