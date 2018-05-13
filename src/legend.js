import * as d3 from 'd3';
import { blueColor, redColor, greenColor } from './colors';
import _ from 'lodash';

// code for clone change type legend
export default function(rootId) {

    let legends = [
            [greenColor, 'no change'],
            [blueColor, 'consistent change'],
            [redColor, 'inconsistent change']
        ],
        globalLegendRoot = d3.select(rootId);

    let globalLegends = globalLegendRoot.append('div')
        .attr('class', 'legendContainer')
        .selectAll('.globalLegend')
        .data(legends)
        .enter()
        .each(function(legend) {
            let legendBox = d3.select(this).append('div')
                .attr('class', 'globalLegendBox')
                .style('width', () => {
                    if (document.body.clientWidth < 500) {
                        return '100%';
                    } else {
                        return ((100 / legends.length) + '%')
                    }
                })

            legendBox.append('div')
                .attr('class', 'globalLegend')
                .style("background", (d) => d[0]);

            legendBox.append('span')
                .attr('class', 'globalLegendText')
                .text((d) => d[1]);
        })

}