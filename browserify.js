(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
"use strict";

// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof global !== 'undefined') { return global; }
	throw new Error('unable to locate global object');
}

var global = getGlobal();

module.exports = exports = global.fetch;

// Needed for TypeScript and Webpack.
exports.default = global.fetch.bind(global);

exports.Headers = global.Headers;
exports.Request = global.Request;
exports.Response = global.Response;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){

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
    if (dataset == null) {
        return -1;
    }
    for (var i = 0; i < dataset.length; i++) {
        if (dataset[i].date == date) {
            return i;
        }
    }
    return -1;
}

/*
 * Return [date,S,I,R] from a given index,
 * or ["",-1,-1,-1] if the input was bad.
 */
function get_sir_from_index(population, dataset, index) {
    if (typeof(population) != "number" || typeof(dataset) != "object" || typeof(index) != "number") {
        return ["",-1,-1,-1]
    }
    if (dataset == null) {
        return ["",-1,-1,-1]
    }
    if (index < 0 || index > dataset.length-1) {
        return ["",-1,-1,-1]
    }
    let data = dataset[index];
    let sir = [];
    sir[0] = data.date;
    // susceptible
    sir[1] = population - data.confirmed - data.recovered;
    // infectious
    sir[2] = data.confirmed;
    // removed
    sir[3] = data.recovered + data.deaths;
    return sir;
}

/*
 * Returns an array of SIR data points between two dates (inclusive)
 * Returns [] if
 *     (1) any input is of the wrong type,
 *     (2) any date doesn't exist, or
 *     (3) if the start date comes after the end date.
 */
function get_sirs_between_dates(population, dataset, startDate, endDate) {
    if (dataset == null) {
        return [];
    }
    if (Date(startDate) > Date(endDate)) {
        return [];
    }
    // Note: we assume that the dates come in chronological order in
    // the JSON data, and this is true for the COVID-19 data.
    var startIndex = get_index_of_date(dataset, startDate);
    var endIndex   = get_index_of_date(dataset, endDate);
    if (startIndex == -1 || endIndex == -1) {
        return [];
    }
    var sirs = [];
    for (var i = startIndex; i <= endIndex; i++) {
        var sir = get_sir_from_index(population, dataset, i);
        sirs.push(sir);
    }
    return sirs;
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

function make_chart(sir_data, category, color) {

    if(sir_data === null) {
        return null;
    }

    if(category < 1 || category > 3) {
        return null;
    }

    var dates = [];
    var data = [];

    var i;
    for(i = 0; i < sir_data.length; i++) {
        dates.push(sir_data[i][0]);
        data.push(sir_data[i][category]);
    }

    var chart = {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: category,
                borderColor: color, 
                data: data
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
            legend: {
                labels: {
                    fontColor: color
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        fontColor: "white",
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: "white",
                    }
                }]
            }
        }
    };

    return chart;
}


async function updateHTML() {
    try {
        document.getElementById("data").innerHTML = "Data from JS";
        var ctx = document.getElementById('chart').getContext('2d');

        var pop = 10000000
        var json = await url_to_json(url_to_covid_data);
        var dataset = json.Sweden;
        var startDate = "2020-1-30";
        var endDate = "2020-3-30";

        var sir_data = get_sirs_between_dates(pop, dataset, startDate, endDate);

        var chart = make_chart(sir_data, 2, "red");

        var lineChart = new Chart(ctx, chart);

    }
    catch (error) {}
}

module.exports = {
    url_to_covid_data, url_to_population_data, url_to_json,
    get_sir_from_index, get_population, get_index_of_date,
    make_chart, get_sirs_between_dates
}


updateHTML();


},{"node-fetch":1}]},{},[2]);
