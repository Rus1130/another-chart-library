import { Chart } from '../main.js';
import { PathArray } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @class LineChart
 * @memberof Chart
 * @param {string}            chartTitle title of the chart
 * @param {string}            xAxisLabel label for the x axis
 * @param {string}            yAxisLabel label for the y axis
 * @param {number}            xStep      step value for the x axis
 * @param {number}            yStep      step value for the y axis
 * @param {object[]}          data       the data for the line chart
 * @description Has trouble with extremely small numbers (<0)
 * @example
let line = new Chart('line')
    .appendTo('#line-chart')
    .setData("Average Stock Prices (2000 - 2022)", 'Year', 'Price', 10, [
        {
            color: 'red',
            label: 'Apple',
            pointRadius: 1,
            lineWidth: 2,
            points: [
                [2000, 0.6937],
                [2001, 0.3068],
                [2002, 0.2905],
                [2003, 0.2814],
                [2004, 0.5391],
                [2005, 1.4167],
                [2006, 2.1492],
                [2007, 3.8933],
                [2008, 4.3092],
                [2009, 4.4560],
                [2010, 7.8866],
                [2011, 11.0480],
                [2012, 17.5266],
                [2013, 14.6700],
                [2014, 20.5310],
                [2015, 27.1667],
                [2016, 24.1638],
                [2017, 35.4349],
                [2018, 45.1771],
                [2019, 50.5541],
                [2020, 93.6424],
                [2021, 139.3947],
                [2022, 153.9328],
            ],
        }, {
            color: 'blue',
            label: 'Microsoft',
            pointRadius: 2,
            lineWidth: 1,
            points: [
                [2000, 23.8554],
                [2001, 19.5747],
                [2002, 17.0729],
                [2003, 16.4050],
                [2004, 17.3987],
                [2005, 18.3417],
                [2006, 18.8863],
                [2007, 22.1793],
                [2008, 19.6798],
                [2009, 17.3973],
                [2010, 20.8738],
                [2011, 20.5793],
                [2012, 24.2010],
                [2013, 27.1941],
                [2014, 36.5584],
                [2015, 41.2965],
                [2016, 50.1958],
                [2017, 67.0252],
                [2018, 95.8759],
                [2019, 125.5735],
                [2020, 187.8096],
                [2021, 271.0883],
                [2022, 266.2800],
            ],
        }
    ])
 */
    export class LineChart {
        constructor(chartTitle, xAxisLabel, yAxisLabel, yStep, xStep, data){
            let draw = Chart.options.draw
            this.data = data;
    
            let xLine = Chart.measureLines.xAxisLine;
            let yLine = Chart.measureLines.yAxisLine;
    
            let xCenter = Chart.measureLines.xCenterLine;
            let yCenter = Chart.measureLines.yCenterLine;
            
            // X Axis Label
            let xLabel = draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
            .cx(xLine.attr('x1') + (xLine.attr('x2') - xLine.attr('x1')) / 2)
            .cy(Chart.options.height - (Chart.options.height - xLine.attr('y1')) / 2)
    
            // Y Axis Label
            let yLabel = draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
            .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
            .cy(yLine.attr('y1') - (yLine.attr('y1') - yLine.attr('y2')) / 2)

            yLabel.x(yLabel.x() + 3)
            .rotate(-90)
    
            let yData = []
            let xData = []
            for(let i = 0; i < data.length; i++){
                for(let j = 0; j < data[i].points.length; j++){
                    yData.push(Math.round(data[i].points[j][1] * 100) / 100)
                    xData.push(data[i].points[j][0])
    
                }
            }
            
            let yMax = Math.max(...yData) + yStep
            let yMin = Math.floor(Math.min(...yData) - (yStep - (Math.min(...yData) % yStep)) + yStep)
            let yMeasureStep = (yLine.attr('y1') - yLine.attr('y2')) / (yMax - yMin)
            let yMeasureCount = 0;

            let xMax = Math.max(...xData) + 1
            let xMin = Math.floor(Math.min(...xData) - (xStep - (Math.min(...xData) % xStep)) + xStep)
            let xMeasureStep = (xLine.attr('x2') - xLine.attr('x1')) / (xMax - xMin)
            let xMeasureCount = 0;


            for(let i = yMin; i <= yMax; i += yStep ) {
                if(i < yMin) continue;
                
                let measureLine = draw.line(yLine.attr('x1') - 5, xLine.attr('y1') + yMeasureStep * (i - yMin), yLine.attr('x1') + 5, xLine.attr('y2') + yMeasureStep * (i - yMin))
                .stroke({ width: 1, color: '#000' })

                if(i == 0) measureLine.attr("x2",measureLine.attr('x2') - 5)
                
                let text = i.toString()
                if(text.split('.')[1] && text.split('.')[1].length > 2) text = Math.round(i * 100) / 100

                if(yMeasureCount % yStep == 0) {
                    let measureLabel = draw.text(text).font({ family: 'Helvetica', size: 10 })

                    measureLabel.x(measureLine.attr('x1') - measureLabel.bbox().width - 2)
                    .cy(xLine.attr('y1') + yMeasureStep * (i - yMin))
                } else {
                    let measureLabel = draw.text().tspan(text).fill('#5C5858').font({ family: 'Helvetica', size: 8 })
                    measureLabel.x(measureLine.attr('x1') - measureLabel.bbox().width - 2)
                    .cy(xLine.attr('y1') + yMeasureStep * i)
                }

                // horizontal lines
                draw.line(measureLine.attr('x2'), measureLine.attr('y1'), xLine.attr('x2'), measureLine.attr('y1'))
                .stroke({ width: 1, color: '#DCDCDC' })

                yMeasureCount++;
            }

            let measureLineArray = []
            let textArray = []

            for(let i = xMin; i <= xMax; i += xStep ) {
                if(i <= xMin) continue;
                
                let measureLine = draw.line(yLine.attr('x1') + xMeasureStep * (i - xMin), xLine.attr('y1'), yLine.attr('x1') + xMeasureStep * (i - xMin), xLine.attr('y1') + 5)
                .stroke({ width: 1, color: '#000' })


                measureLine.attr('y1', measureLine.attr('y1') - 1.5)
                measureLine.attr('y2', measureLine.attr('y2') + 1.5)
                let measureLabel = draw.text(i.toString()).font({ family: 'Helvetica', size: 10 })

                measureLabel.x(yLine.attr('x1') + xMeasureStep * (i - xMin) - measureLabel.bbox().width / 2)
                .y(measureLine.attr('y1') + measureLabel.bbox().height + 2)
                .dx(-5)
                .dy(5)
                .rotate(-45)

                measureLineArray.push(measureLine)
                textArray.push(measureLabel)

               

                xMeasureCount++;
            }

            xLabel.y(xLabel.y() + 14)

            measureLineArray[measureLineArray.length - 1].remove()
            textArray[textArray.length - 1].remove()

            measureLineArray.pop()
            measureLineArray.pop()

            textArray.pop()
            textArray.pop()
            

            function plot(x, y, color, r){
                let point = draw.circle(r).fill(color)
                point.cx(measureLineArray[0].attr('x1') + (xData.indexOf(x) * xMeasureStep))
                let yPlot = (measureLineArray[0].attr('y1') + 6) + y * yMeasureStep

                yPlot > xLine.attr('y1') ? yPlot = xLine.attr('y1') - 1 : yPlot = yPlot

                point.cy(yPlot)
                return point
            }

            let points = []
            let pointLabels = []
            let hoverPoints = []
            for(let i = 0; i < data.length; i++){
                let line = data[i]
                points.push([])
                for(let j = 0; j < line.points.length; j++){
                    let point = plot(line.points[j][0], line.points[j][1], line.color, line.pointRadius)
                    let hoverPoint = draw.circle(line.pointRadius * 10).fill('transparent')
                    hoverPoint.cx(point.attr('cx'))
                    hoverPoint.cy(point.attr('cy'))

                    pointLabels.push(line.points[j][1])
                    hoverPoints.push(hoverPoint)

                    points[i].push(point)
                }
            }

            for(let i = 0; i < points.length; i++){
                let path = []
                for(let j = 1; j < points[i].length; j++){
                    path.push(["M", points[i][j - 1].attr('cx'), points[i][j - 1].attr('cy')])
                    path.push(["L", points[i][j].attr('cx'), points[i][j].attr('cy')])
                }
                draw.path(new PathArray(path)).stroke({ width: data[i].lineWidth, color: data[i].color })

                let colorDisplay = draw.rect(20, 20).fill(data[i].color)
                .x(xLine.attr('x2') + 10)
                .y(yLine.attr('y1') + 30 * i)
                .radius(2)

                let displayLabel = draw.text(data[i].label).font({ family: 'Helvetica', size: 12 })
                .x(xLine.attr('x2') + 10 + colorDisplay.bbox().width + 5)
                .y(yLine.attr('y1') + 30 * i + colorDisplay.bbox().height / 2 - 6)
            }

            // title
            draw.text().tspan(chartTitle).fill('#8e8e8e')
            .y(10)
            .x(10)
            .font({ family: 'Helvetica', size: Chart.options.height / 30  })
        }
    }