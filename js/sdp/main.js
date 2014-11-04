/* global require */

require(["d3", "sdp/ex-adm", "sdp/ex-percapita", "sdp/percapita-dist", "sdp/clean"],
        function(d3, exAdm, exPercapita, percapitaDist, clean) {
            "use strict";

            // load data from CSV
            d3.csv("../data/percapita.csv", function(error, data) {
                clean(data);
                exAdm(data);
                exPercapita(data);
                percapitaDist(data);
            });
        });
