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
            .orient("left");

        // create SVG
        var svg = d3.select("#graphs").append("svg")
            .attr("id", "percapita-dist")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        var graph = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // navigation button
        var nav = d3.select("#nav").append("li")
            .text("Distribution of Per-capita Expenditure")
            .classed("nav", true)
            .on("click", function() {
                util.showGraph(d3.select(d3.event.target), svg);
            });

        // details about currently selected point
        var details = d3.select("#graphs").append("table")
            .attr("id", "percapita-dist-details")
            .attr("class", "details");

        var write_details = function(d) {
            // if (typeof d !== "undefined") {
            // var d = details.data();
            details.html("<tr><th>" + util.headers.district + "</th><td>" + d.district +
                "</td></tr><tr><th>" + util.headers.county + "</th><td>" + d.county +
                "</td></tr><tr><th>" + util.headers.adm + "</th><td>" + d.adm +
                "</td></tr><tr><th>" + util.headers.total + "</th><td>" + d.total +
                         "</tr>");
        // }
    };

        // finish defining axes, depends on data and column assignments
        x.domain(d3.extent([0,_.last(data).cumADM + _.last(data).adm])).nice();
        // y.domain(d3.extent(data, _.property("percapita"))).nice();
        y.domain([0,30000]);

        // draw y Axis
        graph.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("x", height / -2 ) // down, due to rotate above
            .attr("y", 18-margin.left) // left
            .attr("dy", ".71em")
            .style("text-anchor", "middle")
            .text("Expenditure Per Student (USD)");

        // draw data markers
        graph.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .style("fill", function(d) {
                return d.i % 2 ? "rgba(0,0,255,0.5)" : "rgba(0,0,255,0.4)";
            })
            .attr("x", function(d) {
                return x(d.cumADM);
            })
            .attr("width", function(d) {
                return x(d.adm);
            })
            .attr("y", function(d) {
                return y(d.total);
            })
            .attr("height", function(d) {
                return height - y(d.total);
            })
            .on("mouseover", write_details);

        // draw x Axis (over data)
        graph.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width / 2)
            .attr("y", margin.bottom)
            .style("text-anchor", "middle")
            .text("Number of Students");

        return {
            nav: nav,
            image: svg
        };
    };
});
