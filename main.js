import { SVG, extend as SVGextend, Element as SVGElement, PathArray } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';

/**
 * @todo
 * - Make font scale with chart size
 */
/**
 * @class BarChart
 * @param {string} chartTitle the title of the chart
 * @param {string} xAxisLabel the label for the x axis
 * @param {string} yAxisLabel the label for the y axis
 * @param {number} yMin the minimum value for the y axis
 * @param {number} yMax the maximum value for the y axis
 * @param {number} yStep the step value for the y axis
 * @param {string[]|number[]} xAxisData the data for the x axis
 * @param {string[]|number[]} yAxisData the data for the y axis
 * @param {string} [barColor] the color of the bars
 * @description Parameters for <code>.setData()</code> when the chart type is bar
*/
class BarChart {
    constructor(chartTitle, xAxisLabel, yAxisLabel, yMin, yMax, yStep, xAxisData, yAxisData, options, barColor) {
        let draw = options.draw

        barColor = barColor || '#4285f4';

        if(xAxisData.length !== yAxisData.length) throw new Error('xAxis and yAxis data must be the same length')

        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let xCenter = Chart.measureLines.xCenterLine;
        let yCenter = Chart.measureLines.yCenterLine;

        let xLabel = draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(xCenter.attr('x1'))
        .cy(options.height - (options.height - xLine.attr('y1')) / 2)

        let yLabel = draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2 - yLine.attr('x1') / 4)
        .cy(yCenter.attr('y1'))
        .rotate(-90)

        let yMeasureStep = (yLine.attr('y1') - (yLine.attr('y2')  - (yLine.attr('y2') / Chart.precision))) / yMax;

        function drawBar(height, x, width, barLabel) {
            let rect = draw.rect(width, -yMeasureStep * height)
            .x(yLine.attr('x1') + x)
            .y(xLine.attr('y1') + yMeasureStep * height)

            rect.attr('fill', barColor)

            let text = draw.text(barLabel).font({ family: 'Helvetica', size: 16 })
            .cx(rect.attr('x') + rect.attr('width') / 2)
            .cy(xLine.attr('y1') + 10)
        }

        Chart.drawMeasureLines(yMin, yMax, yStep);

        let barPositionStep = (yCenter.attr('x2') - yCenter.attr('x1')) / xAxisData.length

        for(let i = 0; i < xAxisData.length; i++){
            drawBar(yAxisData[i], barPositionStep * i + 15, barPositionStep - 15, xAxisData[i])
        }

        var title = draw.text(function(add) {
            add.tspan(chartTitle).fill('#8e8e8e')
        })
        .cy(25)
        .font({ family: 'Helvetica', size: 20 })

        title.cx(xCenter.attr('x1'))

    }
}

/*

data cheme: ...{arcLength: number, color: string, label: string}[]



*/

/**
 * @class PieChart
 * @param {object[]} data the data for the pie chart
 * @param {number} data[].arc the length of the arc (in percent)
 * @param {string} data[].color the color of the arc
 * @param {string} data[].label the label for the arc
 */
class PieChart {
    constructor(data, options) {
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


        // sort the array so that the largest arc is first
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
        for(let i = 0; i < arcs.length; i++){
            let startingAngle = 0;
            for(let j = 0; j < i; j++){
                startingAngle += arcs[j];
            }
            
            let endAngle = startingAngle + arcs[i];

            let arc = draw.path(getD(circle.attr('r'), startingAngle, endAngle)).fill(colors[i])
            .dx(circle.attr('cx') - circle.attr('r'))
            .dy(circle.attr('cy') - circle.attr('r'))

            arc.stroke({ width: 7, color: '#fff' });
            arc.on('mouseover', () => {
                arc.front();
                arc.stroke('none');

            })

            arc.on('mouseout', () => {
                arc.stroke({ width: 7, color: '#fff' });
            })
        }
    }
}

/**
 * @class Chart
 * @description A class for creating charts
 * @param {string} type - The type of chart to create
 * @example
 * let chart = new Chart('bar')
 */
export class Chart {
    static SVGData = ''
    static type = ''
    static draw = null;
    static measureLines = []
    static precision = 6;
    static drawMeasureLines (min, max, step){
        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let draw = Chart.options.draw;
        let yMeasureStep = (yLine.attr('y1') - (yLine.attr('y2')  - (yLine.attr('y2') / Chart.precision))) / max;
        for(let i = min; i <= max; i += step) {
            let measureLine = draw.line(yLine.attr('x1') - 5, xLine.attr('y1') + yMeasureStep * i, yLine.attr('x1') + 5, xLine.attr('y2') + yMeasureStep * i)
            .stroke({ width: 1, color: '#000' })

            let text = draw.text(i).font({ family: 'Helvetica', size: 10 })

            text.x(measureLine.attr('x1') - text.bbox().width - 2)
            .cy(xLine.attr('y1') + yMeasureStep * i)
        }
    }

    static fullScreen = false;
    static width = 500;
    static height = 500;

    static options = null;

    constructor(type) {
        if(!Object.keys(classes).includes(type)) throw new Error('Invalid chart type');
        this.type = type;
    }

    /**
     * @method appendTo
     * @description Append the chart to an element
     * @param {string} element - The element to append the chart to
     * @param {object} options - The options for the chart
     * @param {number} options.width - The width of the chart
     * @param {number} options.height - The height of the chart
     */
    appendTo(element, options) {
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;

        Chart.options = options;

        this.draw = SVG().addTo(element).size(options.width, options.height);
        options.draw = this.draw
        

        if(this.type == 'bar') {
            let h = options.height;
            let w = options.width;
            let p = Chart.precision;

            let xAxisLine = this.draw.line(5, h - h / p, w - 5, h - h / p).stroke({ width: 1, color: '#000' });
            let yAxisLine = this.draw.line(w / p, 0, w / p, h - 5).stroke({ width: 1, color: '#000' });

            let rect = this.draw.rect(xAxisLine.attr('x2') - yAxisLine.attr('x1'), xAxisLine.attr('y1'))
            .move(yAxisLine.attr('x1'), yAxisLine.attr('y1')).fill('none')

            // create a line going down the middle of rect
            let xCenterLine = this.draw.line(rect.attr('x') + rect.attr('width') / 2, rect.attr('y'), rect.attr('x') + rect.attr('width') / 2, h - yAxisLine.attr('x1')).stroke('none')
            let yCenterLine = this.draw.line(yAxisLine.attr('x1') + 15, rect.attr('y') + rect.attr('height') / 2, w - 5, rect.attr('y') + rect.attr('height') / 2).stroke('none');

            Chart.measureLines = {
                xAxisLine: xAxisLine,
                yAxisLine: yAxisLine,
                rect: rect,
                xCenterLine: xCenterLine,
                yCenterLine: yCenterLine
            }
        }

        if(this.type == 'pie'){
            let xCenterLine = this.draw.line(options.width / 2, 0, options.width / 2, options.height).stroke('none');
            let yCenterLine = this.draw.line(0, options.height / 2, options.width, options.height / 2).stroke('none');
            
            let circle = this.draw.circle(options.width / 2)
            .cx(options.width / 2)
            .cy(options.height / 2)
            .fill('none')

            Chart.measureLines = {
                xCenterLine: xCenterLine,
                yCenterLine: yCenterLine,
                circle: circle
            }
        }

        return this;
    }

    /**
     * @method setData
     * @description Set the data for the chart
     * @param {object} args - The arguments for the data
     * @description the arguments for the data, depending on the type of chart
     */
    setData(args) {
        if(this.type == 'bar') {
            let chartTitle = arguments[0];
            let xAxisLabel = arguments[1];
            let yAxisLabel = arguments[2];
            let yMin = arguments[3];
            let yMax = arguments[4];
            let yStep = arguments[5];
            let xAxisData = arguments[6];
            let yAxisData = arguments[7];
            let barColor = arguments[8];
            let chart = new classes[this.type](chartTitle, xAxisLabel, yAxisLabel, yMin, yMax, yStep, xAxisData, yAxisData, Chart.options, barColor);
        }

        if(this.type == 'pie') {
            let data = arguments[0];
            let chart = new classes[this.type](data, Chart.options);
        }

    }
}

const classes = {
    'bar': BarChart,
    'pie': PieChart,
}



