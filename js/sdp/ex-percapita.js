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

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("s"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // create SVG
        var svg = d3.select("body").append("svg")
            .attr("id", "ex-percapita")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // finish defining axes, depends on data and column assignments
        x.domain(d3.extent(data, _.property("adm"))).nice();
        y.domain(d3.extent(data, _.property("total"))).nice();

        // draw x Axis
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
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2)
            .attr("cx", function(d) {
                return x(d.adm);
            })
            .attr("cy", function(d) {
                return y(d.total);
            });

    };
});
