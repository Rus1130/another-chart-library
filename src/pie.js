import { Chart } from '../main.js';

/**
 * @class PieChart
 * @param {string}   chartTitle        the title of the chart
 * @param {object[]} data              the data for the pie chart
 * @param {number}   data[].arc        the length of the slice (in percent)
 * @param {string}   data[].color      the color of the slice
 * @param {string}   data[].label      the label for the slice
 * @param {number}   [hoverPopout]     the amount of popout the slice has
 * @param {boolean}  [showPercentages] whether or not to show the percentages of the slices
 * @example 
    let chart = new Chart('pie')
    .appendTo('#pie-chart')
    .setData("Favorite Color", [
        { arc: 42, color: 'blue', label: 'Blue' },
        { arc: 14, color: 'green', label: 'Green' },
        { arc: 14, color: 'purple', label: 'Purple' },
        { arc: 8, color: 'red', label: "Red"},
        { arc: 7, color: 'black', label: "Black"},
        { arc: 5, color: 'orange', label: 'Orange'},
        { arc: 10, color: 'grey', label: "Other"},
    ], 2, true)
*/
export class PieChart {
    constructor(chartTitle, data, popout, showPercentages) {
        popout = popout || 0;
        showPercentages = showPercentages || false;

        

        function getD(radius, startAngle, endAngle) {
            const isCircle = endAngle - startAngle === 360;
            if (isCircle) {
                endAngle--;
            }
            const start = polarToCartesian(radius, startAngle);
            const end = polarToCartesian(radius, endAngle);
            const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
            const d = [
                "M", start.x, start.y,
                "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
            ];

            if (isCircle) {
                d.push("Z");
            } else {
                d.push("L", radius, radius, "L", start.x, start.y, "Z");
            }
            return d.join(" ");
        }

        function polarToCartesian(radius, angleInDegrees) {
            var radians = (angleInDegrees - 90) * Math.PI / 180;
            return {
                x: radius + (radius * Math.cos(radians)),
                y: radius + (radius * Math.sin(radians))
            };
        }

        let draw = Chart.options.draw
        this.data = data;

        

        let title = draw.text(function(add) {
            add.tspan(chartTitle).fill('#8e8e8e')
        })

        title.x(10)
        .y(10)
        .font({ family: 'Helvetica', size: 20 })


        this.data.sort((a, b) => {
            return b.arc - a.arc;
        })

        let circle = Chart.measureLines.circle;
        let arcs = [];
        let colors = [];
        let labels = [];

        for(let i = 0; i < data.length; i++){
            arcs.push(data[i].arc * 3.6);
            colors.push(data[i].color);
            labels.push(data[i].label);
        }

        let arcList = []
        let labelElements = []
        for(let i = 0; i < arcs.length; i++){
            let startingAngle = 0;
            for(let j = 0; j < i; j++){
                startingAngle += arcs[j];
            }
            
            let endAngle = startingAngle + arcs[i];


            // get the point that is parallel to the center of the circle and the end of the arc
            

            let arc = draw.path(getD(circle.attr('r'), startingAngle, endAngle)).fill(colors[i])
            .dx(circle.attr('cx') - circle.attr('r'))
            .dy(circle.attr('cy') - circle.attr('r'))
            .stroke({ width: 1, color: '#fff' })


            arcList.push(arc);
        }

        for(let i = 0; i < arcList.length; i++){
            let percentage = Math.round((Math.round(arcs[i] / 360 * 10000) / 10000) * 100) * 10000 / 10000

            let label = labels[i]

            if(showPercentages) label += ` (${percentage}%)`

            let angle = 0;
            for(let j = 0; j < i; j++){
                angle += arcs[j];
            }

            angle += arcs[i] / 2;

            let text = draw.text(label).font({ family: 'Helvetica', size: 12 })
            .cx(circle.attr('cx'))
            .cy(circle.attr('cy')/2 - 35)

            text.rotate(angle, circle.attr('cx'), circle.attr('cy'))
            text.rotate(-angle)

            arcList[i].remember('originalX', arcList[i].x())
            arcList[i].remember('originalY', arcList[i].y())

            text.remember('originalX', text.x())
            text.remember('originalY', text.y())


            arcList[i].on('mouseenter', function() {
                arcList[i].animate(100)
                .dx(circle.attr('cx') - Math.cos((angle + 90) * Math.PI / 180) * popout - circle.attr('r') * 2)
                .dy(circle.attr('cy') - Math.sin((angle + 90) * Math.PI / 180) * popout - circle.attr('r') * 2)



                text.animate(100)
                .dx(circle.attr('cx') - Math.cos((angle + 90) * Math.PI / 180) * popout - circle.attr('r') * 2)
                .dy(circle.attr('cy') - Math.sin((angle + 90) * Math.PI / 180) * popout - circle.attr('r') * 2)


            })

            arcList[i].on('mouseleave', function() {
                arcList[i].animate(100)
                .x(arcList[i].remember('originalX'))
                .y(arcList[i].remember('originalY'))

                text.animate(100)
                .x(text.remember('originalX'))
                .y(text.remember('originalY'))
            })







            labelElements.push(text)
        }
    }
}