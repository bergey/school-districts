/* global define */

// clean data, make things numbers
define(function() {
    "use strict";
    return function(data) {
        
        data.forEach(function(d) {
            d.ex = +d.ex;
            d.adm = +d.adm;
            d.percapita = d.ex / d.adm;
            d.AUN = +d.AUN;
        });

        data.sort(function(a, b) {
            return a.percapita - b.percapita;
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
