/* global require, module */

// some utility code
"use strict";

var d3 = require("d3");

// exported value, and recommended import name
var util = {};

/**
* @typedef {{top: number, right: number, bottom: number, left: number}} Margin
*/

/** Uniform margins for all graphs in the application,
 * following Bostock's convention http://bl.ocks.org/mbostock/3019563
 * @const {Margin}
 */
util.margin = {top: 20, right: 20, bottom: 30, left: 80};

/**
 * uniform image width for all graphs
 * @const {number}
 */
util.width = 960 - util.margin.left - util.margin.right;

/**
 * uniform image height for all graphs
 * @const {number}
 */
util.height = 500 - util.margin.top - util.margin.bottom;

/**
 * @typedef Row
 * @property {number} AUN
 * @property {number} district
 * @property {number} county
 * @property {number} adm
 * @property {number} wadm
 * @property {number} instruction
 * @property {number} support
 * @property {number} other
 * @property {number} facilities
 * @property {number} financing
 * @property {number} total
 */

/**
 * Map from short data column names to human-friendly display names
 * @const {Object.<string, string>}
 */
util.headers = {
    AUN: "AUN",
    district: "School District",
    county: "County",
    adm: "Average Daily Enrollment",
    wadm: "Weighted Average Daily Enrollment",
    instruction: "Instruction",
    support: "Support Services",
    other: "Non-Instructional, Current",
    facilities: "Facilities Acquisition & Construction",
    financing: "Other Financing Uses",
    total: "Total Expenditures"
};

/**
 * @typedef DataSource
 * @property {string} text - display name describing this set of data
 * @property {string} path - path to CSV data, relative to $app/data/
 */

/**
 * CSV files for all years for which this application has data
 * @const {Object.<DataSource>}
 */
util.years = [
    {text: "2012-2013", path: "expenditures-2012-2013.csv"},
    {text: "2011-2012", path: "expenditures-2011-2012.csv"},
    {text: "2010-2011", path: "expenditures-2010-2011.csv"},
    {text: "2009-2010", path: "expenditures-2009-2010.csv"},
    {text: "2008-2009", path: "expenditures-2008-2009.csv"},
    {text: "2007-2008", path: "expenditures-2007-2008.csv"},
    {text: "2006-2007", path: "expenditures-2006-2007.csv"},
    {text: "2005-2006", path: "expenditures-2005-2006.csv"},
];

// keep XML element Id unique by numbering in order of creation
var nextClipNumber = 0;

/**
 * Add an SVG group which clips to the data region of the graph.
 * Note that the axes are drawn *outside* this area.
 * @param {d3.selection} selection - the parent of the new <g> element.
 * @return {d3.selection}
 */
util.dataPane = function(selection) {
    selection.append("defs").append("svg:clipPath")
        .attr("id", "dataPane" + nextClipNumber)
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", util.width)
        .attr("height", util.height);

    var dataPane = selection.append("g")
        .attr("clip-path", "url(#dataPane" + nextClipNumber + ")");

    nextClipNumber += 1;

    return dataPane;
};

/*
 * shared code between 2 axis defs
 * @param {d3.selection} selection - parent SVG element of axis
 * @return {{group: d3.selection, text: d3.selection}}
 */
var sharedAxis = function(selection) {
    var group = selection.append("g");
    var text = group.append("text")
        .attr("class", "label")
        .style("text-anchor", "middle");
    return { group: group, text: text};
};

/**
 * Add an x axis with the specified label.  This is meant to be called as:
 * graph.call(util.xaxis("some string"))
 * @param {string} label - The label for the axis, displayed below the tick labels
 * @param {d3.selection} selection - The parent SVG element of the new axis
 * @return {d3.selection} The <g> element which contains the axis
 */
util.xaxis = function(label) {
    return function(selection) {
        var axis = sharedAxis(selection);
        axis.group.attr("class", "x axis")
            .attr("transform", "translate(0, " + util.height + ")");
        axis.text.attr("class", "label")
            .attr("x", util.width / 2)
            .attr("y", util.margin.bottom)
            .text(label);
        return axis.group;
    };
};

/**
 * Add a y axis with the specified label.  This is meant to be called as:
 * graph.call(util.yaxis("some string"))
 * @param {string} label - The label for the axis, displayed left of the tick labels
 * @param {d3.selection} selection - The parent SVG element of the new axis
 * @return {d3.selection} The <g> element which contains the axis
 */
util.yaxis = function(label) {
    // curried to support selection.call(axisFunction) syntax
    return function(selection) {
        var axis = sharedAxis(selection);
        axis.group.attr("class", "y axis");
        axis.text.attr("transform", "rotate(-90)")
            .attr("x", util.height / -2 ) // down, due to rotate above
            .attr("y", 18-util.margin.left) // left
            .attr("dy", ".71em")
            .text(label);
        return axis.group;
    };
};

/**
 * A formatter for dollar amounts to the nearest cent,
 * with comma as thousands separator.
 * @param {number}
 * @return {string}
 */
util.dollars = d3.format("$,.2f");

/**
 * A formatter with comma as thousands separator
 * @param {number}
 * @return {string}
 */
util.commaFormat = d3.format(",.0f");

// show the GRAPH, and hide other graphs
// highlight the NAV appropriately
// NB: hardcodes the ID which encloses the graphs
// and only hides SVGs
/**
 * Show the specified graph, and hide the others,
 * by setting appropriate CSS classes on all children of #graphs.
 * Also highlight the button which selects this graph.
 * @param {d3.selection} nav - The navigation element to highlight
 * @param {d3.selection} graph - The graph to show
 */
util.showGraph = function(nav, graph) {
    d3.selectAll("#graphs svg").classed("hidden", true);
    graph.classed("hidden", false);
    d3.selectAll("#nav li").classed("selected", false);
    nav.classed("selected", true);
};

//
/**
 * Update the details table with the given District
 * @param {Row} d
 */
util.writeDetails = function(d) {
    d3.select("#details").html(
        "<tr><th>" + util.headers.district + "</th><td>" + d.district +
            "</td></tr><tr><th>" + util.headers.county + "</th><td>" + d.county +
            "</td></tr><tr><th>" + util.headers.adm + "</th><td>" + util.commaFormat(d.adm) +
            "</td></tr><tr><th>" + util.headers.instruction + "</th><td>" + util.dollars(d.instruction) +
            "</td></tr><tr><th>" + util.headers.support + "</th><td>" + util.dollars(d.support) +
            "</td></tr><tr><th>" + util.headers.financing + "</th><td>" + util.dollars(d.financing) +
            "</td></tr><tr><th>" + util.headers.total + "</th><td>" + util.dollars(d.total) +
            "</tr>");
};

module.exports = util;
