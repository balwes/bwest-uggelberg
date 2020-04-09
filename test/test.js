
var assert = require("assert");
var expect = require("chai").expect;
var main = require("../add.js");

describe("add", function () {
    it("description", function () {
		expect(main.add(1,2)).to.be.equal(3);
    });
});

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
        var link = "https://pomber.github.io/covid19/timeseries.json";
        var json = await main.url_to_json(link);
        // Accessing a non-existent member should return undefined
        expect(json.foobar).to.be.equal(undefined);
        // Accessing an existent member should not return undefined
        expect(json.Sweden).to.not.be.equal(undefined);
    });
});

describe("get_sir_from_date", function() {
    const pop = 1000
    const dataset = {
        "Sweden": [
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
        ]
    };
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
        expect(sir[0]).to.be.greaterThan(pop-10);
        expect(sir[1]).to.be.greaterThan(10);
        expect(sir[2]).to.be.greaterThan(30);
        
        var date = "2020-1-23";
        var sir = main.get_sir_from_date(pop, dataset, date);
        expect(sir[0]).to.be.equal(pop-100);
        expect(sir[1]).to.be.equal(100);
        expect(sir[2]).to.be.equal(300);
    });
});
