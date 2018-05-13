/* code courtesy of https://github.com/evoluteur/d3-dual-range-slider */
/* original developer - https://github.com/evoluteur */
import * as d3 from 'd3';
import { blueColor } from './colors';

export default function(v1, v2, max, change) {

    var sliderVals = [v1, v2],
        width = d3.select('#root').node().clientWidth * 0.40,
        svg = d3.select("#sliderContainer").append("svg")
        .attr('width', width + 50)
        .attr('height', 50);

    var x = d3.scaleLinear()
        .domain([1, max])
        .range([0, width])
        .clamp(true);

    var xMin = x(0),
        xMax = x(max),
        ticks = max > 20 ? x.ticks(20) : x.ticks(max);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(5,20)");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", 10 + x.range()[0])
        .attr("x2", 10 + x.range()[1])

    var selRange = slider.append("line")
        .attr("class", "sel-range")
        .attr("x1", 10 + x(sliderVals[0]))
        .attr("x2", 10 + x(sliderVals[1]))

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(10,24)")
        .selectAll("text")
        .data(ticks)
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", blueColor)
        .text(function(d) { return d; });

    var handle = slider.selectAll("rect")
        .data([0, 1])
        .enter().append("rect", ".track-overlay")
        .attr("class", "handle")
        .attr("y", -8)
        .attr("x", function(d) { return x(sliderVals[d]); })
        .attr("rx", 3)
        .attr("height", 16)
        .attr("width", 20)
        .call(
            d3.drag()
            .on("start", startDrag)
            .on("drag", drag)
            .on("end", endDrag)
        );

    function startDrag() {
        d3.select(this).raise().classed("active", true);
    }

    function drag(d) {
        var x1 = d3.event.x;
        if (x1 > xMax) {
            x1 = xMax
        } else if (x1 < xMin) {
            x1 = xMin
        }
        d3.select(this).attr("x", x1);
        var x2 = x(sliderVals[d == 0 ? 1 : 0])
        selRange
            .attr("x1", 10 + x1)
            .attr("x2", 10 + x2)
    }

    function endDrag(d) {
        var v = Math.round(x.invert(d3.event.x))
        var elem = d3.select(this)
        sliderVals[d] = v
        var v1 = Math.min(sliderVals[0], sliderVals[1]),
            v2 = Math.max(sliderVals[0], sliderVals[1]);
        elem.classed("active", false)
            .attr("x", x(v));
        selRange
            .attr("x1", 10 + x(v1))
            .attr("x2", 10 + x(v2))

        change(v1, v2);
    }

}