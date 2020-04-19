
var assert = require("assert");
var expect = require("chai").expect;
var main = require("../script.js");

const dataset = [
    {
        "date": "2020-1-22",
        "confirmed": 1,
        "deaths": 2,
        "recovered": 3,
    },
    {
        "date": "2020-1-23",
        "confirmed": 4,
        "deaths": 5,
        "recovered": 6,
    },
    {
        "date": "2020-1-24",
        "confirmed": 7,
        "deaths": 8,
        "recovered": 9,
    },
    {
        "date": "2020-1-25",
        "confirmed": 10,
        "deaths": 11,
        "recovered": 12,
    },
    {
        "date": "2020-1-26",
        "confirmed": 13,
        "deaths": 14,
        "recovered": 15,
    }
];

describe("get_start_and_end_date", function() {
    it("get correct dates given correct data", async function () {
        var dates = main.get_start_and_end_date(dataset);
        expect(dates).to.have.members(["2020-1-22","2020-1-26"]);
    });
    it("get [] given null", async function () {
        var dates = main.get_start_and_end_date(null);
        expect(dates).to.be.empty;
        expect(dates).to.be.an("array");
    });
    it("get [] given input of wrong type", async function () {
        var dates = main.get_start_and_end_date("wrooong");
        expect(dates).to.be.empty;
        expect(dates).to.be.an("array");
    });
    it("get [] given an empty JSON object", async function () {
        var dates = main.get_start_and_end_date({});
        expect(dates).to.be.empty;
        expect(dates).to.be.an("array");
    });
    it("get [] given JSON without the \"date\" member", async function () {
        var badDataset = [
            {"notdate": "xyz"},
            {"notdate": "bnm"},
        ];
        var dates = main.get_start_and_end_date(badDataset);
        expect(dates).to.be.empty;
        expect(dates).to.be.an("array");
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
        this.timeout(1000);
        var link = "https://duckduckgo.com/";
        var json = await main.url_to_json(link);
        expect(json).to.be.equal(null);
    });
    it("return null for wrong input type", async function () {
        var json = await main.url_to_json(1234);
        expect(json).to.be.equal(null);
    });
    it("return json data given a valid link to json data", async function () {
        this.timeout(1000);
        var link = main.url_to_covid_data;
        var json = await main.url_to_json(link);
        // Accessing a non-existent member should return undefined
        expect(json.foobar).to.be.equal(undefined);
        // Accessing an existent member should not return undefined
        expect(json.Sweden).to.not.be.equal(undefined);
    });
});

describe("get_index_of_date", async function() {
    it("a valid date returns a valid index in the dataset", async function() {
        var date = "2020-1-26";
        var i = main.get_index_of_date(dataset, date);
        expect(i).to.be.equal(4);
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
    it("a dataset of wrong type returns an index of -1", async function() {
        var date = "2010-1-5";
        var i = main.get_index_of_date(1234, date);
        expect(i).to.be.equal(-1);
    });
    it("a null dataset returns an index of -1", async function() {
        var date = "2010-1-5";
        var i = main.get_index_of_date(null, date);
        expect(i).to.be.equal(-1);
    });
});

describe("get_sir_from_index", async function() {
    const pop = 1000;
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
        var sir = main.get_sir_from_index(pop, dataset, 3);
        expect(sir[0]).to.be.equal("2020-1-25");
        expect(sir[1]).to.be.equal(pop-10-12);
        expect(sir[2]).to.be.equal(-13);
        expect(sir[3]).to.be.equal(12+11);
    });
    it("return [\"\",-1,-1,-1] from a population of wrong type", async function() {
        var sir = main.get_sir_from_index("population string", dataset, 1);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return [\"\",-1,-1,-1] from a dataset of wrong type", async function() {
        var sir = main.get_sir_from_index(pop, "wrong type", 1);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
    it("return [\"\",-1,-1,-1] for any null input", async function() {
        var sir = main.get_sir_from_index(null, dataset, 3);
        expect(sir).to.have.members(["",-1,-1,-1]);

        sir = main.get_sir_from_index(pop, null, 3);
        expect(sir).to.have.members(["",-1,-1,-1]);

        sir = main.get_sir_from_index(pop, dataset, null);
        expect(sir).to.have.members(["",-1,-1,-1]);
    });
});

describe("get_sirs_between_dates", async function() {
    it("[] is returned when any input is of the wrong type", async function() {
        var sirs = main.get_sirs_between_dates("wrong type", {}, "2020-4-1", "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, "wrong type", "2020-4-1", "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, {}, 1337, "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, {}, "2020-4-1", 1337);
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
    });

    it("[] is returned when any input is null", async function() {
        var sirs = main.get_sirs_between_dates(null, {}, "2020-4-1", "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, null, "2020-4-1", "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, {}, null, "2020-4-2");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
        
        sirs = main.get_sirs_between_dates(1000, {}, "2020-4-1", null);
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
    });

    it("[] is returned when giving a non-existent date", async function() {
        var sirs = main.get_sirs_between_dates(1000, dataset, "4000-4-1", "2020-1-25");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");

        var sirs = main.get_sirs_between_dates(1000, dataset, "2020-1-25", "4000-4-1");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
    });

    it("[] is returned when the start date comes after the end date", async function() {
        var sirs = main.get_sirs_between_dates(1000, dataset, "2020-1-26", "2020-1-22");
        expect(sirs).to.be.empty;
        expect(sirs).to.be.an("array");
    });

    it("correct data is returned given correct input", async function() {
        // Note: We only check the validity of the dates in the SIR data.

        var sirs = main.get_sirs_between_dates(1000, dataset, "2020-1-22", "2020-1-26");
        expect(sirs).to.be.an("array");
        expect(sirs.length).to.be.equal(5);
        expect(sirs[0][0]).to.be.equal("2020-1-22");
        expect(sirs[1][0]).to.be.equal("2020-1-23");
        expect(sirs[2][0]).to.be.equal("2020-1-24");
        expect(sirs[3][0]).to.be.equal("2020-1-25");
        expect(sirs[4][0]).to.be.equal("2020-1-26");

        sirs = main.get_sirs_between_dates(1000, dataset, "2020-1-23", "2020-1-25");
        expect(sirs).to.be.an("array");
        expect(sirs.length).to.be.equal(3);
        expect(sirs[0][0]).to.be.equal("2020-1-23");
        expect(sirs[1][0]).to.be.equal("2020-1-24");
        expect(sirs[2][0]).to.be.equal("2020-1-25");

        sirs = main.get_sirs_between_dates(1000, dataset, "2020-1-24", "2020-1-24");
        expect(sirs).to.be.an("array");
        expect(sirs.length).to.be.equal(1);
        expect(sirs[0][0]).to.be.equal("2020-1-24");
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
    it("return -1 given wrong input type data", async function() {
        const pop = main.get_population("WRONG!");
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
        ["2020-1-23", 90,20,1],
        ["2020-1-24", 70,30,11]
    ];

    const line_chart = {
        type: 'line',
        data: {
            labels: ["2020-1-22", "2020-1-23", "2020-1-24"],
            datasets: [{
                label: "susceptible",
                borderColor: "green",
                data: [100, 90, 70]
            },
            {
                label: "infected",
                borderColor: "red",
                data: [10, 20, 30]
            },
            {
                label: "removed",
                borderColor: "blue",
                data: [1,1,11]
            }]
        },
        options: {
            responsive: false,
            maintainAspectRatio: true,
            legend: {
                labels: {
                    fontColor: "white"
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

    it("return an object", function() {
        const chart = main.make_chart(sir_data);
        expect(chart).to.be.an('object');
    });

    it("return line chart of SIR data", function() {
        const s_color = "green";
        const i_color = "red";
        const r_color = "blue";
        const chart = main.make_chart(sir_data);

        line_chart.data.datasets[0].label = "susceptible";
        line_chart.data.datasets[0].borderColor = s_color;
        line_chart.data.datasets[0].data = [100, 90, 70];

        line_chart.data.datasets[1].label = "infected";
        line_chart.data.datasets[1].borderColor = i_color;
        line_chart.data.datasets[1].data = [10, 20, 30];

        line_chart.data.datasets[2].label = "removed";
        line_chart.data.datasets[2].borderColor = r_color;
        line_chart.data.datasets[2].data = [1,1,11];

        expect(line_chart).to.deep.equal(chart);
    });
});

describe("make_prediction", function() {

    const sir_data = [
        ["2020-1-22", 100,10,1],
        ["2020-1-23", 90,20,1],
        ["2020-1-24", 70,30,11]
    ];

    it("return empty list if sir_data is empty", function() {
        var prediction = main.make_prediction([], 3);
        expect(prediction).to.be.empty;
        expect(prediction).to.be.an("array");
    });

    it("return array of correct length of predicted data", function() {
        var prediction = main.make_prediction(sir_data, 10);
        expect(prediction).to.be.an("array");
        expect(prediction.length).to.be.equal(13);
    });
});

describe("remove_date_padding", function() {

    var padded_date = "2020-03-01";
    var unpadded_date = "2020-3-1";

    var early_padded_date = "1990-01-01";

    it("return valid unpadded date from valid padded date", function() {
        var date = main.remove_date_padding(padded_date);
        expect(date).to.be.equal(unpadded_date);
    });

    it("return date of first data if date is too early", function() {
        var date = main.remove_date_padding(early_padded_date);
        expect(date).to.be.equal("2020-1-22");
    });

});

describe("pad_date", function() {
    it("return \"\" for wrong input type", function() {
        var padded = main.pad_date(1234);
        expect(padded).to.be.equal("");
    });
    it("return \"\" for null input", function() {
        var padded = main.pad_date(null);
        expect(padded).to.be.equal("");
    });
    it("return \"\" for badly formatted date", function() {
        var padded = main.pad_date("2020-01-01-01");
        expect(padded).to.be.equal("");
    });
    it("return the same string if date is already padded", function() {
        var date = "2020-04-19";
        var padded = main.pad_date(date);
        expect(padded).to.be.equal(date);
    });
    it("return the padded string for an un-padded date", function() {
        var padded = main.pad_date("2020-4-19");
        expect(padded).to.be.equal("2020-04-19");
        
        padded = main.pad_date("2020-04-9");
        expect(padded).to.be.equal("2020-04-09");
    });
});

describe("days_between_dates", function() {

    var date1 = "2020-2-1";
    var date2 = "2020-3-1";
    var diff = 29;

    it("return 0 if both dates are null", function() {
        var result = main.days_between_dates(null, null);
        expect(result).to.be.equal(0);
    });

    it("return 0 if date1 is null", function() {
        var result = main.days_between_dates(null, date2);
        expect(result).to.be.equal(0);
    });

    it("return 0 if date2 is null", function() {
        var result = main.days_between_dates(date1, null);
        expect(result).to.be.equal(0);
    });

    it("return correct number of days between dates", function() {
        var result = main.days_between_dates(date1, date2);
        expect(result).to.be.equal(diff);
    });

});
