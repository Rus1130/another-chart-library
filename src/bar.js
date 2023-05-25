import { Chart } from '../main.js';

/**
 * @class BarChart
 * @param {string}            chartTitle the title of the chart
 * @param {string}            xAxisLabel the label for the x axis
 * @param {string}            yAxisLabel the label for the y axis
 * @param {number}            yMin       the minimum value for the y axis
 * @param {number}            yMax       the maximum value for the y axis
 * @param {number}            yStep      the step value for the y axis
 * @param {string[]|number[]} xAxisData  the data for the x axis
 * @param {string[]|number[]} yAxisData  the data for the y axis
 * @param {string}            [barColor] the color of the bars
 * @example
 *     let bar = new Chart('bar')
        .appendTo("#bar-chart")
        .setData("Motor Vehicle Deaths by Month (2021)", "Month", "Deaths", 500, 8000, 1000, 
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            [3099, 2561, 3214, 3557, 3768, 3789, 3879, 4013, 3861, 4101, 3599, 3498]
        , 'red')
*/
export class BarChart {
    constructor(chartTitle, xAxisLabel, yAxisLabel, yStep, xAxisData, yAxisData, options, barColor) {
        let draw = options.draw

        barColor = barColor || '#4285f4';

        if(xAxisData.length !== yAxisData.length) throw new Error('xAxis and yAxis data must be the same length')

        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let xCenter = Chart.measureLines.xCenterLine;
        let yCenter = Chart.measureLines.yCenterLine;

        // X Axis Label
        draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(xCenter.attr('x1'))
        .cy(options.height - (options.height - xLine.attr('y1')) / 2)

        // Y Axis Label
        draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
        .cy(yCenter.attr('y1'))
        .rotate(-90)

        let heights = []
        for(let i = 0; i < yAxisData.length; i++){
            heights.push(yAxisData[i])
        }

        let yMax = Math.max(...heights) + (yStep - (Math.max(...heights) % yStep))

        let yMeasureStep = (yLine.attr('y1') - (yLine.attr('y2')  - (yLine.attr('y2') / Chart.precision))) / yMax;

        function drawBar(height, x, width, barLabel) {
            let rect = draw.rect(width, -yMeasureStep * height)
            .x(yLine.attr('x1') + x)
            .y(xLine.attr('y1') + yMeasureStep * height)

            rect.attr('fill', barColor)

            // Label Text
            draw.text(barLabel).font({ family: 'Helvetica', size: 12 })
            .cx(rect.attr('x') + rect.attr('width') / 2)
            .cy(xLine.attr('y1') + 10)

            // when hovered over for 1 second, show the value
            rect.mouseover(function() {
                let text = draw.text(height).font({ family: 'Helvetica', size: 12 })
                .cx(rect.attr('x') + rect.attr('width') / 2)
                .cy(rect.attr('y') - 10)
                
                setTimeout(() => {
                    text.remove()
                }, 500)
            })
        }

        // get a list of all the heights


        for(let i = 0; i <= yMax; i += (yStep / 4)) {
            if(i == 0) continue;
            let measureLine = draw.line(yLine.attr('x1') - 5, xLine.attr('y1') + yMeasureStep * i, yLine.attr('x1') + 5, xLine.attr('y2') + yMeasureStep * i)
            .stroke({ width: 1, color: '#000' })

            if(i % yStep == 0) {
                measureLine.attr('x1', measureLine.attr('x1') - 1.5)
                measureLine.attr('x2', measureLine.attr('x2') + 1.5)
                let text = draw.text(i).font({ family: 'Helvetica', size: 10 })

                text.x(measureLine.attr('x1') - text.bbox().width - 2)
                .cy(xLine.attr('y1') + yMeasureStep * i)
            }

        }

        let barPositionStep = (yCenter.attr('x2') - yCenter.attr('x1')) / xAxisData.length

        for(let i = 0; i < xAxisData.length; i++){
            drawBar(yAxisData[i], barPositionStep * i + 18, barPositionStep - 18, xAxisData[i])
        }

        var title = draw.text(function(add) {
            add.tspan(chartTitle).fill('#8e8e8e')
        })
        .y(10)
        .font({ family: 'Helvetica', size: options.height / 30  })

        title.cx(xCenter.attr('x1'))

    }
}