const fetch = require("node-fetch");

function add(a, b) {
	return a + b;
}

async function url_to_json(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

module.exports = {
    add, url_to_json
}
