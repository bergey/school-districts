/* global define */

// clean data, make things numbers
define(function() {
    "use strict";
    return function(data) {
        
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
            d.i = i;
            if (i === 0) {
                d.cumADM = 0;
            } else {
                d.cumADM = left.cumADM + left.adm;
            }
        });
        
    };
});
