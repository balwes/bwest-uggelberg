
var assert = require("assert");
var expect = require("chai").expect;
var main = require("../add.js");

describe("add", function () {
    it("description", function () {
		expect(main.add(1,2)).to.be.equal(3);
    });
});

describe("url_to_json", function () {
    it("return null in the case of a bad link", function () {
        var json = main.url_to_json("bad link");
        assert(json === null);
    });
    it("return null if null is given", function () {
        var json = main.url_to_json(null);
        assert(json === null);
    });
    it("return null for an empty string", function () {
        var json = main.url_to_json("");
        assert(json === null);
    });
    it("return null given a valid link to non-json data", function () {
        var link = "https://duckduckgo.com/";
        var json = main.url_to_json("link");
        assert(json === null);
    });
    it("return json data given a valid link to json data", function () {
        var link = "https://pomber.github.io/covid19/timeseries.json";
        var json = main.url_to_json(link);
        // Accessing a non-existent member should return undefined
        assert(json.foobar === undefined);
        // Accessing an existent member should not return undefined
        assert(json.Sweden !== undefined);
    });
});
