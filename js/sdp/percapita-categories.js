/* global define */

define(["d3", "lodash", "sdp/util"], function(d3, _, util) {
    "use strict";

    var percapitaCategories = {}; // module return value

    // set by init
    var data;
    var x, y, xAxis, yAxis, color;
    var graph, dataPane, district, bars, legend;  // d3 selections
    var initialized = false;

    var init = function() {
        // partially define axes based on output size, not data domain
        x = d3.scale.linear()
            .range([0,util.width])
            .domain(d3.extent([0,_.last(data).cumADM + _.last(data).adm])).nice();

        y = d3.scale.linear()
            .range([util.height,0])
            .domain([0,30000]);

        color = d3.scale.category10()
            .domain(["instruction", "support", "other", "facilities", "financing"]);

        xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("s"));

        yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // create SVG
        percapitaCategories.svg = d3.select("#graphs").append("svg")
            .attr("id", "percapita-categories")
            .attr("width", util.width + util.margin.left + util.margin.right)
            .attr("height", util.height + util.margin.top + util.margin.bottom);

        graph = percapitaCategories.svg.append("g")
            .attr("transform", "translate(" + util.margin.left + "," + util.margin.top + ")");

        // navigation button
        d3.select("#nav").append("li")
            .text("Distribution of Expenditures by Category")
            .classed("nav", true)
            .on("click", function() {
                util.showGraph(d3.select(d3.event.target), percapitaCategories.svg);
            });

        // create axis groups; don't draw tick marks yet
        util.xaxis("Number of Students")(graph);
        util.yaxis("Expenditure Per Student (USD)")(graph);

        // draw legend
        legend = graph.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", 24)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

        legend.append("rect")
            .attr("x", 24 + 18 + 2)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", function(d) {
                return d3.hsl(color(d)).brighter(1).toString();
            });

        legend.append("text")
            .attr("x", 24 + 18*2 + 8)
            .attr("y", 9)
            .attr("dy", "0.35em")
            // .style("text-anchor", "end")
            .text(function(cat) {
                return util.headers[cat];
            });

        dataPane = util.dataPane(graph);

        d3.behavior.zoom().x(x).scaleExtent([1,5]).on("zoom", percapitaCategories.draw)(percapitaCategories.svg);

        initialized = true;
    };

    percapitaCategories.draw = function(newData) {
        if (newData) {
            data = newData;
        }
        if (!initialized) {
            init();
        }

            graph.select("g.x.axis").call(xAxis);
            graph.select("g.y.axis").call(yAxis);

            // draw data markers
        district = dataPane.selectAll(".district") .data(data);

            district.enter().append("g") .attr("class", "district");

            district.attr("transform", function(d) {
                return "translate(" + x(d.cumADM) + ",0)";
            })
                .on("mouseover", util.writeDetails);

        bars = district.selectAll("rect")
                .data(_.property("stackedCosts"));

            bars.enter().append("rect");

            bars.attr("width", function(d) {
                return x(d.adm + d.cumADM) - x(d.cumADM);
            })
                .attr("y", function(d) {
                    return y(d.y1);
                })
                .attr("height", function(d) {
                    return y(d.y0) - y(d.y1);
                })
                .style("fill", function(d) {
                    var c = color(d.category);
                    return d.i % 2 ? c : d3.hsl(c).brighter(1).toString();
                });
        };

    return percapitaCategories;
});
