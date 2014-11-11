/* global define */

// some utility code
define(["d3"], function(d3) {
    "use strict";

    return {
        headers: {
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
        },

        // show the GRAPH, and hide other graphs
        // highlight the NAV appropriately
        // NB: hardcodes the ID which encloses the graphs
        // and only hides SVGs
        showGraph: function(nav, graph) {
            d3.selectAll("#graphs svg").classed("hidden", true);
            graph.classed("hidden", false);
            d3.selectAll("#nav li").classed("selected", false);
            nav.classed("selected", true);
        }
     };
});
