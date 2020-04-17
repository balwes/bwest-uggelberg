
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
 * Output: [date1, date2], or [] if anything goes wrong
 * Dates are a string YYYY-MM-DD (single-digit months and days not zero-padded).
 */
function get_start_and_end_date(dataset) {
    if (dataset == null ||
        typeof(dataset) != "object" ||
        dataset.length == undefined ||
        dataset[0].date == undefined ||
        dataset[dataset.length-1].date == undefined) {

        return [];
    }
    return [dataset[0].date, dataset[dataset.length-1].date];
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

    if(category != "susceptible" 
        && category != "infected" 
        && category != "removed") {
        return null;
    }

    if(color != "red" 
        && color != "blue" 
        && color != "green") {
        return null;
    }

    var dates = [];
    var data = [];

    var sir_pos;
    if(category === "susceptible") {
        sir_pos = 1;
    }
    if(category === "infected") {
        sir_pos = 2;
    }
    if(category === "removed") {
        sir_pos = 3;
    }

    var i;
    for(i = 0; i < sir_data.length; i++) {
        dates.push(sir_data[i][0]);
        data.push(sir_data[i][sir_pos]);
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

function s_change(b, S, I) {
    return S + (-b * (S * I));
}

function i_change(g, b, S, I, R) {
    return I + (b * S * I - (g * I));
}

function r_change(g, I, R) {
    return R + (g * I);
}

function make_prediction(sir_data, extra_days, past_days) {
    if(sir_data.length < 2) {
        return [];
    }

    var i;

    if(past_days > sir_data.length) {
        past_days = sir_data.length;
    }
    if(past_days < 2) {
        past_days = 2;
    }

    var bs = [];
    var gs = [];

    for(i = 0; i < past_days; i++) {
        var s0 = sir_data[sir_data.length-(i+2)][1];
        var s1 = sir_data[sir_data.length-(i+1)][1];
        var i0 = sir_data[sir_data.length-(i+2)][2];
        var r0 = sir_data[sir_data.length-(i+2)][3];
        var r1 = sir_data[sir_data.length-(i+1)][3];

        bs.push((s0-s1)/(s0*i0));
        gs.push((r1-r0)/i0);
    }

    var b_sum = 0;
    var g_sum = 0;
    for(i = 0; i < past_days; i++) {
        b_sum += bs[i];
        g_sum += gs[i];
    }

    var b = b_sum/past_days;
    var g = g_sum/past_days;

    var prediction = sir_data;

    var last_sir_index = sir_data.length-1
    var last_prediction_index = last_sir_index + extra_days;

    for(i = last_sir_index; i < last_prediction_index; i++) {
        var sprev = prediction[i][1];
        var iprev = prediction[i][2];
        var rprev = prediction[i][3];
        prediction.push([i-last_sir_index,
            s_change(b,sprev,iprev),
            i_change(g, b, sprev,iprev,rprev),
            r_change(g,iprev,rprev)]);
    }

    return prediction;
}

async function updateHTML() {
    try {
        document.getElementById("data").innerHTML = "Data from JS";
        var ctx = document.getElementById('chart').getContext('2d');

        var pop = 10000000
        var json = await url_to_json(url_to_covid_data);
        var dataset = json.Sweden;
        var startDate = "2020-2-28";
        var endDate = "2020-4-10";

        var sir_data = get_sirs_between_dates(pop, dataset, startDate, endDate);

        var prediction = make_prediction(sir_data, 500, 3);

        console.log(prediction);

        var chart = make_chart(prediction, "infected", "red");

        console.log(prediction);

        var lineChart = new Chart(ctx, chart);

    }
    catch (error) {}
}

module.exports = {
    url_to_covid_data, url_to_population_data, url_to_json,
    get_sir_from_index, get_population, get_index_of_date,
    make_chart, get_sirs_between_dates, get_start_and_end_date, make_prediction

}


updateHTML();

