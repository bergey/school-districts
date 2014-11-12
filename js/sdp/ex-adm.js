/* global define */

define(["d3", "lodash", "sdp/util"], function(d3, _, util) {
    "use strict";

    return function(data) {

        // partially define axes based on output size, not data domain
        var x = d3.scale.linear()
            .range([0,util.width]);

        var y = d3.scale.linear()
            .range([util.height,0]);

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
            .attr("width", util.width + util.margin.left + util.margin.right)
            .attr("height", util.height + util.margin.top + util.margin.bottom);

        var graph = svg.append("g")
            .attr("transform", "translate(" + util.margin.left + "," + util.margin.top + ")");

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
            .attr("transform", "translate(0, " + util.height + ")")
            .append("text")
            .attr("class", "label")
            .attr("x", util.width / 2)
            .attr("y", util.margin.bottom)
            .style("text-anchor", "middle")
            .text("Number of Students");

        // draw y Axis
        graph.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", util.height / -2 ) // down, due to rotate above
            .attr("y", 18-util.margin.left) // left
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Total Expenditures (USD)");

        var dataPane = util.dataPane(graph);

        var draw = function() {
            // draw axis ticks
            graph.select("g.x.axis").call(xAxis);
            graph.select("g.y.axis").call(yAxis);

            // draw data markers
            var markers = dataPane.selectAll(".dot")
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
        (d3.behavior.zoom().x(x).y(y).on("zoom", draw)).center([0,util.height]).scaleExtent([1,100])(svg);

    };
});
