import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';


/*
Data Format:

[x_axis_label, y_axis_label, ymin, ymax, ystep, [...x_axis_data], [...y_axis_data]]



*/
class BarChart {
    constructor(data, options) {
        let draw = options.draw

        let xAxisLabel = data[0];
        let yAxisLabel = data[1];

        let ymin = data[2];
        let ymax = data[3];
        let ystep = data[4];

        // put a label between xAxisLine2 and the bottom of the chart

        let xLine = Chart.measureLines.xAxisLine;
        let yLine = Chart.measureLines.yAxisLine;

        let xCenter = Chart.measureLines.xCenterLine;
        let yCenter = Chart.measureLines.yCenterLine;

        let xLabel = draw.text(xAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(xCenter.attr('x1'))
        .cy(options.height - (options.height - xLine.attr('y1')) / 2 * 0.75)

        let yLabel = draw.text(yAxisLabel).font({ family: 'Helvetica', size: 16 })
        .cx(yLine.attr('x2') / 2 * 0.75)
        .cy(yCenter.attr('y1'))
        .rotate(-90)

    }
}

class LineChart {
    constructor(data, options) {
        let draw = Chart.options.draw

        this.data = data;
    }
}

export class Chart {
    static SVGData = ''
    static type = ''
    static draw = null;
    static measureLines = []

    static fullScreen = false;
    static width = 500;
    static height = 500;

    static options = null;

    constructor(type) {
        this.type = type;
    }

    appendTo(element, options) {
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;
        options.precision = 6;

        Chart.options = options;

        this.draw = SVG().addTo(element).size(options.width, options.height);
        options.draw = this.draw

        if(this.type == 'bar') {
            let h = options.height;
            let w = options.width;
            let p = options.precision;

            let xAxisLine = this.draw.line(5, h - h / p, w - 5, h - h / p).stroke({ width: 1, color: '#000' });
            let yAxisLine = this.draw.line(w / p, 5, w / p, h - 5).stroke({ width: 1, color: '#000' });

            let rect = this.draw.rect(xAxisLine.attr('x2') - yAxisLine.attr('x1') - 5, xAxisLine.attr('y1') - 10)
            .move(yAxisLine.attr('x1') + 5, yAxisLine.attr('y1')).fill('none')

            // create a line going down the middle of rect
            let xCenterLine = this.draw.line(rect.attr('x') + rect.attr('width') / 2, rect.attr('y'), rect.attr('x') + rect.attr('width') / 2, h - 5).stroke('none');
            let yCenterLine = this.draw.line(5, rect.attr('y') + rect.attr('height') / 2, w - 5, rect.attr('y') + rect.attr('height') / 2).stroke('none');

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

    setData(data) {
        let chart = new classes[this.type](data, Chart.options);
    }
}

const classes = {
    'bar': BarChart,
    'line': LineChart
}

