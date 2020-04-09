
const fetch = require("node-fetch");


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

module.exports = {
    url_to_json
}


async function changeText() {
	document.getElementById("data").innerHTML = "Data from JS";
}

changeText();
