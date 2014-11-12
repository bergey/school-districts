/* global define */

define(["d3", "lodash", "sdp/util"], function(d3, _, util) {
    "use strict";
    return function(data) {

        // partially define axes based on output size, not data domain
        var x = d3.scale.linear()
            .range([0,util.width])
            .domain(d3.extent(data, _.property("adm"))).nice();

        var y = d3.scale.linear()
            .range([util.height,0])
            .domain(d3.extent(data, _.property("total"))).nice();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(d3.format("s"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // create SVG
        var svg = d3.select("#graphs").append("svg")
            .attr("id", "ex-percapita")
            .attr("width", util.width + util.margin.left + util.margin.right)
            .attr("height", util.height + util.margin.top + util.margin.bottom);

        var graph = svg.append("g")
            .attr("transform", "translate(" + util.margin.left + "," + util.margin.top + ")");

        // navigation button
        d3.select("#nav").append("li")
            .text("Per-student Expenditure vs Enrollment")
            .classed("nav", true)
            .on("click", function() {
                util.showGraph(d3.select(d3.event.target), svg);
            });

        // capture zoom events
        graph.append("rect")
            .attr("class", "overlay")
            .attr("width", util.width)
            .attr("height", util.height);

        // create axis groups; don't draw tick marks yet
        util.xaxis("Number of Students")(graph);
        util.yaxis("Expenditure Per Student (USD)")(graph);

        var dataPane = util.dataPane(graph);

        var draw = function() {
            // draw axis ticks
            graph.select("g.x.axis").call(xAxis);
            graph.select("g.y.axis").call(yAxis);

            // draw data markers
            var markers = dataPane.selectAll(".dot").data(data);

            markers.enter().append("circle").attr("class", "dot")
                .on("mouseover", util.writeDetails);

            markers.attr("r", 2)
                .attr("cx", function(d) {
                    return x(d.adm);
                })
                .attr("cy", function(d) {
                    return y(d.total);
                });
        };

        draw();
        (d3.behavior.zoom().x(x).on("zoom", draw)).center([0,0]).scaleExtent([1,100])(svg);
    };
});
