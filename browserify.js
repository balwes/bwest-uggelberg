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
 * Below is the format of date. HOWEVER! The month and day is not
 * padded to be two digits.
 * Input: "YYYY-MM-DD"
 * Output: [S,I,R], or [-1,-1,-1] if the input was bad.
 */
function get_sir_from_date(population, data_set, date) {
    for (var i = 0; i < data_set.length; i++) {
		let day_data = data_set[i];
        if (day_data.date == date) {
            let sir = [];
            // susceptible
            sir[0] = population - day_data.confirmed - day_data.recovered;
            // infectious
            sir[1] = day_data.confirmed;
            // removed
            sir[2] = day_data.recovered;
            return sir;
        }
    }
    return [-1,-1,-1];
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
    url_to_covid_data, url_to_population_data,
    url_to_json, get_sir_from_date, get_population
}

async function drawGraph() {
    try {
        var ctx = document.getElementById('graph').getContext('2d');
        var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Scatter Dataset',
                    data: [{
                        x: -10,
                        y: 0
                    }, {
                        x: 0,
                        y: 10
                    }, {
                        x: 10,
                        y: 5
                    }]
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: true
            }
        });
    }
    catch (error) {}
}


async function changeText() {
	try {
		document.getElementById("data").innerHTML = "Data from JS";
	}
	catch (error) {}
}

drawGraph();
changeText();

},{"node-fetch":1}]},{},[2]);
