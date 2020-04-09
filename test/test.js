
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
        var link = "https://pomber.github.io/covid19/timeseries.json";
        var json = await main.url_to_json(link);
        // Accessing a non-existent member should return undefined
        expect(json.foobar).to.be.equal(undefined);
        // Accessing an existent member should not return undefined
        expect(json.Sweden).to.not.be.equal(undefined);
    });
});