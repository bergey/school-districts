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
        .attr("id", "percapita-dist")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("../data/ex-vs-adm.csv", function(error, data) {
        data.forEach(function(d) {
            d.percapita = d.ex / d.adm;
            d.adm = +d.adm / 1000;
            d.AUN = +d.AUN;
        });

        data.sort(function(a, b) {
            return a.percapita - b.percapita;
        });

        data.forEach(function(d, i) {
            var left = data[i-1];  // previous element
            d.i = i;
            if (i === 0) {
                d.cumADM = 0;
            } else {
                d.cumADM = left.cumADM + left.adm;
            }
        });

        // console.log(data);
        x.domain(d3.extent([0,_.last(data).cumADM + _.last(data).adm])).nice();
        y.domain(d3.extent(data, _.property("percapita"))).nice();

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

        svg.selectAll(".bar")
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
                return y(d.percapita);
            })
            .attr("height", function(d) {
                return height - y(d.percapita);
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0, " + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Number of Students (x1000)");

    });
});
