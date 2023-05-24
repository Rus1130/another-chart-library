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
        .cy(options.height - (options.height - xLine.attr('y1')) / 2 + 9)

        // Y Axis Label
        draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
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

        let yMin = Math.min(...yData)
        let yMax = Math.max(...yData)

        let xMin = Math.min(...xData)
        let xMax = Math.max(...xData)

        Chart.drawYAxisMeasureLines(yMin, yMax, yStep)
        let measures = Chart.drawXAxisMeasureLines(xMin, xMax, xStep)


        var title = draw.text(function(add) {
            add.tspan(chartTitle).fill('#8e8e8e')
        })
        .y(10)
        .font({ family: 'Helvetica', size: options.height / 30  })

        title.cx(xCenter.attr('x1'))

        let xMeasureStep = (xLine.attr('x2') - (yLine.attr('x1') / Chart.precision)) / (xMax - (xMin));
        let yMeasureStep = (yLine.attr('y1') - (yLine.attr('y2')  - (yLine.attr('y2') / Chart.precision))) / yMax;

        let singleXUnit = (xLine.attr('x2') - (yLine.attr('x1') / Chart.precision)) / (xMax + 10)
        let singleYUnit = (yLine.attr('y1') - (yLine.attr('y2')  - (yLine.attr('y2') / Chart.precision))) / (yMax + 10)

        console.log(measures[0].attr('x1') - yLine.attr('x1'))
        let xFixer = measures[0].attr('x1') - yLine.attr('x1')


        function drawPoint(x, y, color, radius){
            let point = draw.circle(radius)
            .cx(yLine.attr('x1') +xFixer * (2 + (x - xMin)) / xStep)
    
            // y value
            .cy(xLine.attr('y1') + (singleYUnit * y))
            .fill(color)

            return point
        }

        let labels = []
        for(let i = 0; i < data.length; i++){
            let points = []
            console.log(data[i].label)
            let label = draw.text(function(add){
                add.tspan("██ ").fill(data[i].color).font({ family: 'Monospace', size: 12 })
                add.tspan(data[i].label).fill('#8e8e8e').font({ family: 'Helvetica', size: 12 })
            })
            
            labels.push(label)

            for(let j = 0; j < data[i].points.length; j++){
                points.push(drawPoint(data[i].points[j][0], data[i].points[j][1], data[i].color, data[i].pointRadius))
            }

            let patharray = []

            for(let j = 1; j < points.length; j++){
                patharray.push(['M', points[j-1].attr('cx'), points[j-1].attr('cy')])
                patharray.push(['L', points[j].attr('cx'), points[j].attr('cy')])
            }

            let path = draw.path(new PathArray(patharray)).stroke({ width: 1, color: data[i].color })
        }

        for(let i = 0; i < labels.length; i++){
            labels[i].cx(xLine.attr('x2') + (labels[i].bbox().width) / 2)
            labels[i].cy(xLine.attr('y1') + (singleYUnit * yMax) + 20 + (i * 20))
        }
    }
}