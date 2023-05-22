import { SVG, extend as SVGextend, Element as SVGElement } from 'https://cdnjs.cloudflare.com/ajax/libs/svg.js/3.1.2/svg.esm.js';


/*
Data Format:

[x_axis_label, y_axis_label, [...x_axis_data], [...y_axis_data]]



*/
class BarChart {
    constructor(data, options) {
        let draw = options.draw

        let xAxisLabel = data[0];
        let yAxisLabel = data[1];

        let xText = draw.text(xAxisLabel).font({ size: 12, family: 'Helvetica' })
        xText.move(options.width/2 - xText.bbox().width/2, options.height - (options.height / options.precision) / 2 - 5)

        let yText = draw.text(yAxisLabel).font({ size: 12, family: 'Helvetica' })
        yText.move((options.width / options.precision / 2 - yText.bbox().width / 2) - 5, options.height / 2 - yText.bbox().height / 2)
        yText.rotate(-90, options.width / options.precision / 2, options.height / 2)

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

    static options = null;

    constructor(type) {
        this.type = type;
    }

    appendTo(element, options) {
        options = options || {};
        options.width = options.width || 500;
        options.height = options.height || 500;
        options.fullscreen = options.fullscreen || false;
        options.precision = 9;

        Chart.options = options;

        if(options.fullscreen) {
            options.width = element.offsetWidth;
            options.height = element.offsetHeight;
            Chart.options = options;

            window.addEventListener('resize', () => {
                options.width = element.offsetWidth;
                options.height = element.offsetHeight;
                Chart.options = options;
            })
        }

        this.draw = SVG().addTo(element).size(options.width, options.height);
        options.draw = this.draw

        let xLine1 = this.draw.line(5, options.height - options.height/options.precision, options.width - 5, options.height - options.height/options.precision).stroke({ width: 1, color: '#000' });


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

