import { SVG, extend as SVGextend, Element as SVGElement, PathArray } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';
import { BarChart } from './src/bar.js';
import { PieChart } from './src/pie.js';
import { LineChart } from './src/line.js';

// CONTINUE
/**
 * @class Chart
 * @classdesc Create different types of charts from the given data. You can currently create {@link Chart.BarChart|bar charts}, {@link Chart.LineChart|line charts}, and {@link Chart.PieChart|pie charts}.
 * @param {string} type type of chart
 * @example
 * let chart = new Chart('bar')
 */
export class Chart {
    static SVGData = ''
    static type = ''
    static draw = null;
    static measureLines = []
    static precision = 10;

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
     * @memberof Chart
     * @description Append the chart to an element
     * @param {string} element        element to append the chart to
     * @param {object} options        options for the chart
     * @param {number} options.width  width of the chart
     * @param {number} options.height height of the chart
     */
    appendTo(element, options) {
        options = options || {};
        options.width = options.width || 600;
        options.height = options.height || 600;

        Chart.options = options;

        this.draw = SVG().addTo(element).size(options.width, options.height);
        options.draw = this.draw
        

        if(this.type == 'bar') {
            let h = options.height;
            let w = options.width;
            let p = Chart.precision;

            let xAxisLine = this.draw.line(h / p, h - h / p, w - 50, h - h / p).stroke({ width: 1, color: '#000' });
            let yAxisLine = this.draw.line(w / p, 50, w / p, h - h / p).stroke({ width: 1, color: '#000' });

            let rect = this.draw.rect(xAxisLine.attr('x2') - yAxisLine.attr('x1'), xAxisLine.attr('y1'))
            .move(yAxisLine.attr('x1'), yAxisLine.attr('y1')).fill('none')

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

        if(this.type == 'line') {
            let h = options.height;
            let w = options.width;
            let p = Chart.precision;

            let xAxisLine = this.draw.line(h / p, h - h / p, w - 100, h - h / p).stroke({ width: 1, color: '#000' });
            let yAxisLine = this.draw.line(w / p, 50, w / p, h - h / p).stroke({ width: 1, color: '#000' });

            let rect = this.draw.rect(xAxisLine.attr('x2') - yAxisLine.attr('x1'), xAxisLine.attr('y1'))
            .move(yAxisLine.attr('x1'), yAxisLine.attr('y1')).fill('none')

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

        return this;
    }

    /**
     * @method setData
     * @memberof Chart
     * @param {object} args the arguments for the data
     * @description the arguments for the data, depending on the type of chart
     */
    setData(args) {
        if(this.type == 'bar') {
            let chartTitle = arguments[0];
            let xAxisLabel = arguments[1];
            let yAxisLabel = arguments[2];
            let yStep = arguments[3];
            let xAxisData = arguments[4];
            let yAxisData = arguments[5];
            let barColor = arguments[6];
            new classes[this.type](chartTitle, xAxisLabel, yAxisLabel, yStep, xAxisData, yAxisData, barColor);
        }

        if(this.type == 'pie') {
            let chartTitle = arguments[0];
            let data = arguments[1];
            let popout = arguments[2];
            let showPercentages = arguments[3];
            new classes[this.type](chartTitle, data, popout, showPercentages);
        }

        if(this.type == 'line'){
            let chartTitle = arguments[0]
            let xAxisLabel = arguments[1]
            let yAxisLabel = arguments[2]
            let yStep = arguments[3]
            let xStep = arguments[4]
            let data = arguments[5]
            new classes[this.type](chartTitle, xAxisLabel, yAxisLabel, yStep, xStep, data)
        }

    }
}

const classes = {
    'bar': BarChart,
    'pie': PieChart,
    'line': LineChart
}