import * as d3 from 'd3';
import { blueColor, redColor, greenColor } from './colors';


// normal line - fragments are same 
// dashed line - fragments deleted 
//  double line - fragments added 


// code for clone change type legend
export default function(rootId) {

    let legends = [
            ['solid', 'clone fragments same'],
            ['double', 'clone fragments added'],
            ['dashed', 'clone fragments deleted']
        ],
        globalLegendRoot = d3.select(rootId);

    let globalLegends = globalLegendRoot.append('div')
        .attr('class', 'legendContainer')
        .selectAll('.changeLegend')
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
                .attr('class', 'changeLegend')
                .style("border-color", greenColor)
                .style("border-style", (d) => (d[0] + " none none none"));

            legendBox.append('span')
                .attr('class', 'globalLegendText')
                .text((d) => d[1]);
        })

}