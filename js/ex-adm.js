/* global module, require */

/* exports:
 * - draw(data) - redraw with new data or new axis limits; initializes the first time called
 * - nav - d3 selection of the button to select this graph
 * - svg - d3 selection of the top SVG element of the graph
 */
"use strict";

var d3 = require("d3");
var _ = require("lodash");
var util = require("./util");

var exAdm = {}; // module return value

// set by init
var data;
var x, y, xAxis, yAxis;
var graph, dataPane, markers;  // d3 selections
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
        .orient("left")
        .tickFormat(d3.format("s"));

    // create SVG
    exAdm.svg = d3.select("#graphs").append("svg")
        .attr("id", "ex-adm")
        .attr("width", util.width + util.margin.left + util.margin.right)
        .attr("height", util.height + util.margin.top + util.margin.bottom);

    graph = exAdm.svg.append("g")
        .attr("transform", "translate(" + util.margin.left + "," + util.margin.top + ")");

    // navigation button
    exAdm.nav = d3.select("#nav").append("li")
        .text("Total Expenditures vs Enrollment")
        .classed("nav", true)
        .on("click", function() {
            util.showGraph(d3.select(d3.event.target), exAdm.svg);
        });

    // finish defining axes, depends on data and column assignments
    x.domain(d3.extent(data, _.property("adm"))).nice();
    y.domain(d3.extent(data, _.property("timesEnrollment"))).nice();

    // create axis groups; don't draw tick marks yet
    util.xaxis("Number of Students")(graph);
    util.yaxis("Total Expenditures (USD)")(graph);

    dataPane = util.dataPane(graph);

    (d3.behavior.zoom().x(x).y(y).on("zoom", exAdm.draw)).center([0,util.height]).scaleExtent([1,100])(exAdm.svg);

    initialized = true;

};

exAdm.draw = function(newData) {
    if (newData) {
        data = newData;
    }
    if (!initialized) {
        init();
    }

    // draw axis ticks
    graph.select("g.x.axis").call(xAxis);
    graph.select("g.y.axis").call(yAxis);

    // draw data markers
    markers = dataPane.selectAll(".dot")
        .data(data);

    markers.enter(). append("circle")
        .attr("class", "dot")
        .attr("r", 2)
        .on("mouseover", util.writeDetails);

    markers.attr("cx", function(d) {
        return x(d.adm);
    })
        .attr("cy", function(d) {
            return y(d.timesEnrollment);
        });

};

module.exports = exAdm;
