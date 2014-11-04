/* global require */

require(["d3", "lodash"], function(d3, _) {
    "use strict";
    
    var margin = {top: 20, right: 20, bottom: 30, left: 80};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0,width]);

    var y = d3.scale.linear()
        .range([height,0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body").append("svg")
        .attr("id", "ex-adm")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("../data/ex-vs-adm.csv", function(error, data) {
        data.forEach(function(d) {
            d.ex = +d.ex / 1000000;
            d.adm = +d.adm / 1000;
            d.AUN = +d.AUN;
        });

        x.domain(d3.extent(data, _.property("adm"))).nice();
        y.domain(d3.extent(data, _.property("ex"))).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Enrollment (x1000)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Total Expenditures (x1M USD)");

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 2)
            .attr("cx", function(d) {
                return x(d.adm);
            })
            .attr("cy", function(d) {
                return y(d.ex);
            });           
        
    });

    
});
