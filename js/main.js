/* global require */

"use strict";

var d3 = require("d3");
var _ = require("lodash");
var exAdm = require("./ex-adm");
var exPercapita = require("./ex-percapita");
var percapitaDist = require("./percapita-dist");
var percapitaCategories = require("./percapita-categories");
var clean = require("./clean");
var util = require("./util");

// load data from CSV
var load = function(year, displayGraph) {
    if (!year) {
        year = util.years[this.selectedIndex];
    }

    // reset before redrawing
    // d3.select("#nav").html("");
    // d3.select("#graphs").html("");

    d3.csv("/data/" + year.path, function(error, data) {
        if (data) {
            clean(data);
            percapitaCategories.draw(data);
            percapitaDist.draw(data);
            exPercapita.draw(data);
            exAdm.draw(data);
            util.writeDetails(_.find(data, {county: "Philadelphia"}));
            if (displayGraph) { // show only the given graph
                util.showGraph(displayGraph.nav, displayGraph.svg);
            }
        } else {
            d3.select("body").html(
                "<h3>Error " + error.status +
                    "</h3><p>" + error.responseText +
                    "</p><p>" + error.responseURL + "</p>");
        }
    });
};

var pickYear = d3.select("#sidebar").append("select")
    .on("change", load)
    .attr("style", "margin-top: 3em;");

pickYear.selectAll("option")
    .data(util.years).enter()
    .append("option")
    .text(_.property("text"));

load(util.years[0], percapitaDist); // load most recent data
