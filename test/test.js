
var assert = require("assert");
var expect = require("chai").expect;
var add = require("../add.js");

describe("add", function () {
    it("description", function () {
		expect(add(1,2)).to.be.equal(3);
    });
});

