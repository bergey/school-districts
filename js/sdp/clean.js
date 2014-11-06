/* global define */

// clean data, make things numbers
define(["lodash"], function(_) {
    "use strict";
    return function(data) {

        var costCats = ["instruction", "support", "other", "facilities", "financing"];

        data.forEach(function(d) {
            d.adm = +d.adm;
            d.wadm = +d.wadm;
            d.instruction = +d.instruction;
            d.support = +d.support;
            d.other = +d.other;
            d.current = +d.current;
            d.facilities = +d.facilities;
            d.financing = +d.financing;
            d.total = +d.total; // total expense per student
            d.timesEnrollment = d.total * d.adm; // all others are per student
            d.AUN = +d.AUN;
        });

        data.sort(function(a, b) {
            return a.total - b.total;
        });

        // add up # of students with lower per-capita expenditure
        data.forEach(function(d, i) {
            var left = data[i-1];  // previous element
            var acc = 0;  // for fold over costCats
            d.i = i;
            if (i === 0) {
                d.cumADM = 0;
            } else {
                d.cumADM = left.cumADM + left.adm;
            }
            d.stackedCosts = _.map(costCats, function(category) { // more like a fold
                var y0 = acc;
                acc += Math.max(0, d[category]);
                var y1 = acc;
                return {
                    category: category,
                    y0: y0,
                    y1: y1,
                    adm: d.adm, // ugly duplication
                    cumADM: d.cumADM,
                    i: i
                };
            });

        });

    };
});
