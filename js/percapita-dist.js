/* global require, module */

"use strict";

var d3 = require("d3");
var _ = require("lodash");
var util = require("./util");

var percapitaDist = {}; // module return value

// set by init
var data;
var x, y, xAxis, yAxis;
var graph, dataPane, district;  // d3 selections
var initialized = false;

var init = function() {

    // partially define axes based on output size, not data domain
    x = d3.scale.linear()
        .range([0,util.width]);

    y = d3.scale.linear()
        .range([util.height,0]);

    xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(d3.format("s"));

    yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // create SVG
    percapitaDist.svg = d3.select("#graphs").append("svg")
        .attr("id", "percapita-dist")
        .attr("width", util.width + util.margin.left + util.margin.right)
        .attr("height", util.height + util.margin.top + util.margin.bottom);

    graph = percapitaDist.svg.append("g")
        .attr("transform", "translate(" + util.margin.left + "," + util.margin.top + ")");

    // navigation button
    percapitaDist.nav = d3.select("#nav").append("li")
        .text("Distribution of Per-capita Expenditure")
        .classed("nav", true)
        .on("click", function() {
            util.showGraph(d3.select(d3.event.target), percapitaDist.svg);
        });

    // finish defining axes, depends on data and column assignments
    x.domain(d3.extent([0,_.last(data).cumADM + _.last(data).adm])).nice();
    // y.domain(d3.extent(data, _.property("percapita"))).nice();
    y.domain([0,30000]);


    // create axis groups; don't draw tick marks yet
    util.xaxis("Number of Students")(graph);
    util.yaxis("Expenditure Per Student (USD)")(graph);

    dataPane = util.dataPane(graph);

    d3.behavior.zoom().x(x).scaleExtent([1,5]).on("zoom", percapitaDist.draw)(percapitaDist.svg);

    initialized = true;
};

percapitaDist.draw = function(newData) {
    if (newData) {
        data = newData;
    }
    if (!initialized) {
        init();
    }

    graph.select("g.x.axis").call(xAxis);
    graph.select("g.y.axis").call(yAxis);

    // draw data markers
    district = dataPane.selectAll(".bar") .data(data);

    district.enter().append("rect")
        .attr("class", "bar")
        .style("fill", function(d) {
            return d.i % 2 ? "rgba(0,0,255,0.5)" : "rgba(0,0,255,0.4)";
        })
        .on("mouseover", util.writeDetails);

    district.attr("x", function(d) {
        return x(d.cumADM);
    })
        .attr("width", function(d) {
            return x(d.adm + d.cumADM) - x(d.cumADM);
        })
        .attr("y", function(d) {
            return y(d.total);
        })
        .attr("height", function(d) {
            return util.height - y(d.total);
        });

};

module.exports = percapitaDist;
