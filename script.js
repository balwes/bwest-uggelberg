
const fetch = require("node-fetch");
const url_to_covid_data = "https://pomber.github.io/covid19/timeseries.json";
const url_to_population_data = "https://restcountries.eu/rest/v2/name/sweden";


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

/*
 * Find where the date is inside the dataset.
 * Returns -1 if not found or the input is wrong.
 */
function get_index_of_date(dataset, date) {
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].date == date) {
            return i;
        }
    }
    return -1;
}

/*
 * Return [S,I,R] from a given date. The date format is YYYY-MM-DD,
 * HOWEVER do not pad single-digit months and days with zeroes.
 * [-1,-1,-1] is returned if the input is bad.
 */
function get_sir_from_date(population, dataset, date) {
    var i = get_index_of_date(dataset, date)
    if (i == -1) {
        return [-1,-1,-1];
    }
    let data = dataset[i];
    let sir = [];
    // susceptible
    sir[0] = population - data.confirmed - data.recovered;
    // infectious
    sir[1] = data.confirmed;
    // removed
    sir[2] = data.recovered;
    return sir;
}

/*
 * Input: parsed JSON data
 * Output: the population, or -1 if anything goes wrong
 */
function get_population(data) {
    if (data === null)  return -1;
    if (data.length == 0)  return -1;
    if (data[0].population === undefined)  return -1;
    return data[0].population;
}

module.exports = {
    url_to_covid_data, url_to_population_data, url_to_json,
    get_sir_from_date, get_population, get_index_of_date
}


async function changeText() {
	try {
		document.getElementById("data").innerHTML = "Data from JS";
	}
	catch (error) {}
}

changeText();
