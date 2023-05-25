import { Chart } from '../main.js';
import { PathArray } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/*




    data schema:
    title, xAxisLabel, yAxisLabel, yStep, xStep, data
    data format:
    [
        {
            color: 'red',
            label: 'line 1',
            points: [
                ...[x, y],
            ]
            smooth: false
        },
        {
            label: 'line 2',
            color: 'blue',
            points: [
                ...[x, y],
            ]
            smooth: true
        }
    ]
*/

export class LineChart {
    constructor(chartTitle, xAxisLabel, yAxisLabel, yStep, xStep, data, options){
        let draw = Chart.options.draw
        this.data = data;

        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let xCenter = Chart.measureLines.xCenterLine;
        let yCenter = Chart.measureLines.yCenterLine;

        draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(xCenter.attr('x1'))
        .cy(options.height - (options.height - xLine.attr('y1')) / 2)

        // Y Axis Label
        draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2)
        .cy(yCenter.attr('y1'))
        .rotate(-90)

        let yData = []
        let xData = []
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < data[i].points.length; j++){
                yData.push(data[i].points[j][1])
                xData.push(data[i].points[j][0])

            }
        }

        


        var title = draw.text(function(add) {
            add.tspan(chartTitle).fill('#8e8e8e')
        })
        .y(10)
        .font({ family: 'Helvetica', size: options.height / 30  })

        title.cx(xCenter.attr('x1'))
    }
}