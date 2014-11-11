/* global define */

// some utility code
define(["d3"], function(d3) {
    "use strict";

    var util = {};

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
