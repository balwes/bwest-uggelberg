
var assert = require("assert");
var expect = require("chai").expect;
var main = require("../script.js");

describe("url_to_json", function () {
    it("return null in the case of a bad link", async function () {
        var json = await main.url_to_json("bad link");
        expect(json).to.be.equal(null);
    });
    it("return null if null is given", async function () {
        var json = await main.url_to_json(null);
        expect(json).to.be.equal(null);
    });
    it("return null for an empty string", async function () {
        var json = await main.url_to_json("");
        expect(json).to.be.equal(null);
    });
    it("return null given a valid link to non-json data", async function () {
        var link = "https://duckduckgo.com/";
        var json = await main.url_to_json("link");
        expect(json).to.be.equal(null);
    });
    it("return json data given a valid link to json data", async function () {
        var link = main.url_to_covid_data;
        var json = await main.url_to_json(link);
        // Accessing a non-existent member should return undefined
        expect(json.foobar).to.be.equal(undefined);
        // Accessing an existent member should not return undefined
        expect(json.Sweden).to.not.be.equal(undefined);
    });
});

describe("get_index_of_date", async function() {
    const dataset = [
        {
            "date": "2020-1-22",
            "confirmed": 1,
            "deaths": 2,
            "recovered": 3,
        },
        {
            "date": "2020-4-13",
            "confirmed": 4,
            "deaths": 5,
            "recovered": 6,
        },
        {
            "date": "2030-1-5",
            "confirmed": 7,
            "deaths": 8,
            "recovered": 9,
        }
    ];
    it("a valid date returns a valid index in the dataset", async function() {
        var date = "2030-1-5";
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(2);
    });
    it("an invalid date returns an index of -1", async function() {
        var date = "2010-1-5";
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(-1);
    });
    it("an empty string returns an index of -1", async function() {
        var date = "";
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(-1);
    });
    it("giving null returns an index of -1", async function() {
        var date = null;
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(-1);
    });
    it("a non-string date returns an index of -1", async function() {
        var date = 100;
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(-1);
    });
});

describe("get_sir_from_index", async function() {
    const pop = 1000;
    const dataset = [
        {
            "date": "2020-1-22",
            "confirmed": 10,
            "deaths": 20,
            "recovered": 30,
        },
        {
            "date": "2020-1-23",
            "confirmed": 100,
            "deaths": 200,
            "recovered": 300,
        },
        {
            "date": "2030-4-13",
            "confirmed": 1000,
            "deaths": 2000,
            "recovered": 3000,
        }
    ];
    it("return [\"\",-1,-1,-1] for an index that's too small", async function() {
        var sir = main.get_sir_from_index(pop, dataset, -1);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return [\"\",-1,-1,-1] for an index of wrong type", async function() {
        var sir = main.get_sir_from_index(pop, dataset, "hello world");
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return [\"\",-1,-1,-1] from an index that's too big", async function() {
        var sir = main.get_sir_from_index(pop, dataset, 1000);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return SIR data from correct input", async function() {
        var sir = main.get_sir_from_index(pop, dataset, 1);
        expect(sir[0]).to.be.equal("2020-1-23");
        expect(sir[1]).to.be.equal(pop-100-300);
        expect(sir[2]).to.be.equal(100);
        expect(sir[3]).to.be.equal(300);
    });
    it("return [\"\",-1,-1,-1] from a population of wrong type", async function() {
        var sir = main.get_sir_from_index("population string", dataset, 1);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return [\"\",-1,-1,-1] from a dataset of wrong type", async function() {
        var sir = main.get_sir_from_index(pop, "wrong type", 1);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
});

describe("get_population", async function() {

    const json_data = [
        {
            name: "Sweden",
            continent: "Europe",
            population: 1337,
        }
    ];

    it("return -1 given incorrect data", async function() {
        const pop = main.get_population([{name: "Turkey"}]);
        expect(pop).to.be.equal(-1);
    });
    it("return -1 given null data", async function() {
        const pop = main.get_population(null);
        expect(pop).to.be.equal(-1);
    });
    it("return the population given correct data", async function() {
        const pop = main.get_population(json_data);
        expect(pop).to.be.equal(1337);
    });
});

describe("make_chart", function() {

    const sir_data = [
        ["2020-1-22", 100,10,1],
        ["2020-1-22", 90,20,1],
        ["2020-1-22", 70,30,11]
    ];

    const line_chart_susceptible = {
        type: 'line',
        data: {
            labels: ["2020-01-22", "2020-01-23", "2020-01-24"],
            datasets: [{
                label: 'label',
                data: [100, 90, 70]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true
        }
    };

    const line_chart_infected = {
        type: 'line',
        data: {
            labels: ["2020-01-22", "2020-01-23", "2020-01-24"],
            datasets: [{
                label: 'label',
                data: [10, 20, 30]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true
        }
    };

    const line_chart_removed = {
        type: 'line',
        data: {
            labels: ["2020-01-22", "2020-01-23", "2020-01-24"],
            datasets: [{
                label: 'label',
                data: [1,1,11]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true
        }
    };

    it("return line chart of susceptible", function() {
        const chart = main.make_chart(sir_data, 1);
        expect(line_chart_susceptible).to.deep.equal(chart);
    });
    it("return line chart of infected", function() {
        const chart = main.make_chart(sir_data, 2);
        expect(line_chart_infected).to.deep.equal(chart);
    });
    it("return line chart of removed", function() {
        const chart = main.make_chart(sir_data, 3);
        expect(line_chart_removed).to.deep.equal(chart);
    });
});