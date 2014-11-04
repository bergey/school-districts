/* global define */

define(["d3", "lodash"], function(d3, _) {
    "use strict";

    return function(data) {

        // standard margins
        var margin = {top: 20, right: 20, bottom: 30, left: 80};
        var width = 960 - margin.left - margin.right;
        var height = 500 - margin.top - margin.bottom;

        // partially define axes based on output size, not data domain
        var x = d3.scale.linear()
            .range([0,width]);

        var y = d3.scale.linear()
            .range([height,0]);

        // var color = d3.scale.ordinal()
        //     .domain(["instruction", "support", "other", "facilities", "financing"])
        //     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var color = d3.scale.category10()
            .domain(["instruction", "support", "other", "facilities", "financing"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("s"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // create SVG
        var svg = d3.select("body").append("svg")
            .attr("id", "percapita-dist")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // finish defining axes, depends on data and column assignments
        x.domain(d3.extent([0,_.last(data).cumADM + _.last(data).adm])).nice();
        // y.domain(d3.extent(data, _.property("percapita"))).nice();
        y.domain([0,30000]);

        // draw y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Expenditure Per Student (USD)");

        // draw data markers
        var district = svg.selectAll(".district")
            .data(data)
            .enter().append("g")
            .attr("class", "district")
            .attr("transform", function(d) {
                return "translate(" + x(d.cumADM) + ",0)";
            });

        district.selectAll("rect")
            .data(_.property("stackedCosts"))
            .enter().append("rect")
            .attr("width", function(d) {
                return x(d.adm);
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

        // draw x Axis (over data)
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Number of Students");

        // draw legend
        var legend = svg.selectAll(".legend")
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
                return {
                    instruction: "Instruction",
                    support: "Support Services",
                    other: "Non-Instructional, Current",
                    facilities: "Facilities Acquisition & Construction",
                    financing: "Other Financing Uses"
                }[cat];
            });
    };
});
