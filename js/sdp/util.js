/* global define */

// some utility code
define(["d3"], function(d3) {
    "use strict";

    var util = {};

    // standard margins
    util.margin = {top: 20, right: 20, bottom: 30, left: 80};
    util.width = 960 - util.margin.left - util.margin.right;
    util.height = 500 - util.margin.top - util.margin.bottom;


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

    /** Add an SVG group which clips to the data region of the graph.
        Note that the axes are drawn *outside* this area.
     * @param {d3.selection} selection - the parent of the new <g> element.
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

    util.dollars = d3.format("$,.2f");
    util.commaFormat = d3.format(",.0f");

    // show the GRAPH, and hide other graphs
        // highlight the NAV appropriately
        // NB: hardcodes the ID which encloses the graphs
        // and only hides SVGs
        util.showGraph = function(nav, graph) {
            d3.selectAll("#graphs svg").classed("hidden", true);
            graph.classed("hidden", false);
            d3.selectAll("#nav li").classed("selected", false);
            nav.classed("selected", true);
        };

        // update the details table with the given District
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

    return util;

});
