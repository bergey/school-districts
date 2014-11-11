/* global define */

define(["d3", "lodash", "sdp/util"], function(d3, _, util) {
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
            .orient("left")
            .tickFormat(d3.format("s"));

        // create SVG
        var svg = d3.select("#graphs").append("svg")
            .attr("id", "ex-adm")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        var graph = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // navigation button
        d3.select("#nav").append("li")
            .text("Total Expenditures vs Enrollment")
            .classed("nav", true)
            .on("click", function() {
                util.showGraph(d3.select(d3.event.target), svg);
            });

        // finish defining axes, depends on data and column assignments
        x.domain(d3.extent(data, _.property("adm"))).nice();
        y.domain(d3.extent(data, _.property("timesEnrollment"))).nice();

        // draw x Axis
        graph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .append("text")
            .attr("class", "label")
            .attr("x", width / 2)
            .attr("y", margin.bottom)
            .style("text-anchor", "middle")
            .text("Number of Students");

        // draw y Axis
        graph.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", height / -2 ) // down, due to rotate above
            .attr("y", 18-margin.left) // left
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Total Expenditures (USD)");

        var draw = function() {
            // draw axis ticks
            graph.select("g.x.axis").call(xAxis);
            graph.select("g.y.axis").call(yAxis);

            // draw data markers
            var markers = graph.selectAll(".dot")
                .data(data);

            markers.enter(). append("circle")
                .attr("class", "dot")
                .attr("r", 2)
                .on("mouseover", util.writeDetails);

            markers.attr("cx", function(d) {
                    return x(d.adm);
                })
                .attr("cy", function(d) {
                    return y(d.timesEnrollment);
                });

        };

        draw();
        (d3.behavior.zoom().x(x).y(y).on("zoom", draw)).center([0,height]).scaleExtent([1,100])(svg);

    };
});
