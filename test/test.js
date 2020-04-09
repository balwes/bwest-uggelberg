
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

describe("get_sir_from_date", async function() {
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
        }
    ];
    it("return [-1,-1,-1] from a non-existent date", async function() {
        var date = "2100-1-1";
        var sir = main.get_sir_from_date(pop, dataset, date);
        expect(sir).to.have.members([-1,-1,-1]);
    });
    it("return [-1,-1,-1] from badly formatted date", async function() {
        var date = "2020-04-09"; // The JSON data does not pad zeroes to the month and day. Therefore this should fail.
        var sir = main.get_sir_from_date(pop, dataset, date);
        expect(sir).to.have.members([-1,-1,-1]);
    });
    it("return SIR data from a correct date", async function() {
        var date = "2020-1-22";
        var sir = main.get_sir_from_date(pop, dataset, date);
        expect(sir[0]).to.be.equal(pop-10-30);
        expect(sir[1]).to.be.equal(10);
        expect(sir[2]).to.be.equal(30);
        
        var date = "2020-1-23";
        var sir = main.get_sir_from_date(pop, dataset, date);
        expect(sir[0]).to.be.equal(pop-100-300);
        expect(sir[1]).to.be.equal(100);
        expect(sir[2]).to.be.equal(300);
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
