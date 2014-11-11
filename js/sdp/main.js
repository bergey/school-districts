/* global require */

require(["d3", "sdp/ex-adm", "sdp/ex-percapita", "sdp/percapita-dist", "sdp/percapita-categories", "sdp/clean"],
        function(d3, exAdm, exPercapita, percapitaDist, percapitaCategories, clean) {
            "use strict";

            // load data from CSV
            d3.csv("/data/percapita.csv", function(error, data) {
                if (data) {
                    clean(data);
                    percapitaCategories(data);
                    percapitaDist(data);
                    exPercapita(data);
                    exAdm(data);
                } else {
                    d3.select("body").html(
                        "<h3>Error " + error.status +
                            "</h3><p>" + error.responseText +
                            "</p><p>" + error.responseURL + "</p>");
                }
            });
        });
