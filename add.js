const fetch = require("node-fetch");

function add(a, b) {
	return a + b;
}

async function url_to_json(url) {
	try {
    	const response = await fetch(url);
    	const data = await response.json();
		return data;
	} catch (error) {
		// Bad URL or malformed JSON
		return null;
	}
}

function get_sir_from_date(population, dataset, date) {
	// foobar!
}

module.exports = {
    add, url_to_json, get_sir_from_date
}
