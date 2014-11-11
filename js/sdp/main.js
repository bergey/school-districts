/* global require */

require(["d3", "lodash", "sdp/ex-adm", "sdp/ex-percapita", "sdp/percapita-dist", "sdp/percapita-categories", "sdp/clean", "sdp/util"],
        function(d3, _, exAdm, exPercapita, percapitaDist, percapitaCategories, clean, util) {
            "use strict";

            // load data from CSV
            var load = function(selection) {
                if (!selection) {
                    selection = util.years[this.selectedIndex];
                }

                // reset before redrawing
                d3.select("#nav").html("");
                d3.select("#graphs").html("");
                
                d3.csv("/data/" + selection.path, function(error, data) {
                    if (data) {
                        clean(data);
                        percapitaCategories(data);
                        var initial = percapitaDist(data);
                        exPercapita(data);
                        exAdm(data);
                        util.showGraph(initial.nav, initial.image);
                        util.writeDetails(_.find(data, {county: "Philadelphia"}));
                    } else {
                        d3.select("body").html(
                            "<h3>Error " + error.status +
                                "</h3><p>" + error.responseText +
                                "</p><p>" + error.responseURL + "</p>");
                    }
                });
            };

            var pickYear = d3.select("body").append("select")
                .on("change", load);

            pickYear.selectAll("option")
                .data(util.years).enter()
                .append("option")
                .text(_.property("text"));

            load(util.years[0]); // load most recent data
            
        });
