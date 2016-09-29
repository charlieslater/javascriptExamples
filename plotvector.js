    // define dimensions of graph
    // var m = [80, 80, 80, 80]; // margins
    // var w = 600 - m[1] - m[3]; // width
    // var h = 0.6*w - m[0] - m[2]; // height

    function buildChartWindow() {
        margins = {top: 80, right: 80, bottom: 80, left: 80};
        cw = {
            margins: margins,
            aspectRatio:  0.6,
            fullWidth:  600
        }
        cw['fullHeight'] = cw.aspectRatio * 600;
        cw['width'] = cw.fullWidth - margins.right - margins.left;
        cw['height'] = cw.fullHeight - margins.top - margins.bottom;
        return cw;
    }

    var chartWindow = buildChartWindow();
    
    var data = [3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3,
		-3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3,
		-3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3,
		3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3,
		-3, -3];


    graphData(data, "#sqWave1");

    data = [3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3,
	    -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3,
	    -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3,
	    3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3];

    graphData(data, "#sqWave2");

    data = [-3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3,
	    3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3,
	    -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3,
	    3, 3, -3, -3, -3, 3, 3, 3, -3, -3, -3, 3, 3, 3];

    var sqWave3Data = data;

    graphData(data, "#sqWave3");

    data = [3, 3, -3, -3, -3, -3, -3, -3, -3, -3, 3, 3, -3, -3, -3,
	    -3, -3, -3, -3, -3, 3, 3, -3, -3, -3, -3, -3, -3, -3,
	    -3, 3, 3, -3, -3, -3, -3, -3, -3, -3, -3, 3, 3, -3, -3,
	    -3, -3, -3, -3, -3, -3, 3, 3, -3, -3, -3, -3, -3, -3,
	    -3, -3];

    var pulseGraph = graphData(data, "#pulseWave1");
    addLine(pulseGraph, sqWave3Data);

    data = [0.0, 0.9816, 1.8551, 2.5244, 2.9158, 2.9862, 2.7279, 2.1693, 1.3718,
            0.4234, -0.5717, -1.5038, -2.2704, -2.787, -2.9969, -2.8768, -2.44,
            -1.7346, -0.8382, 0.1504, 1.1225, 1.971, 2.6025, 2.9475, 2.9681,
            2.6619, 2.0627, 1.2364, 0.274, -0.7186, -1.6321, -2.3658, -2.8392,
            -3.0, -2.8305, -2.3494, -1.6097, -0.6928, 0.3004, 1.2605, 2.0819,
            2.674, 2.9718, 2.9425, 2.5892, 1.9509, 1.0978, 0.1239, -0.8637,
            -1.7562, -2.4553, -2.8842, -2.9955, -2.7771, -2.253, -1.4808,
            -0.5456, 0.4496, 1.3954, 2.1875];

    graphData(data, "#sineWave1");

function lineScalesFromData(data) {
    //var xValues = d3.range(data.length);
    //console.log("xValues = ", xValues);
    //var x = d3.scale.ordinal().domain(xValues).rangePoints([0,chartWindow.width]);
    var x = d3.scale.linear().domain([0, data.length]).range([0, chartWindow.width]);
    var y = d3.scale.linear().domain([-4, 4]).range([chartWindow.height, 0]);
    var pxScalers = {
        xScaler: x,
        yScaler: y
    } 
    var line = d3.svg.line()
      .x(function(d,i) { 
        return x(i); 
      })
      .y(function(d) { 
        return y(d); 
      });
    return [line, pxScalers];
}
function graphData(data,tagID) {
    var [line, pxScalers] = lineScalesFromData(data);
    var graph = d3.select(tagID).append("svg:svg")
            .attr("width", chartWindow.fullWidth)
            .attr("height", chartWindow.fullHeight)
          .append("svg:g")
            .attr("transform", "translate(" + chartWindow.margins.left + "," + chartWindow.margins.top + ")");

    // create yAxis
    var xAxis = d3.svg.axis().scale(pxScalers.xScaler).tickSize(-chartWindow.height).tickSubdivide(true);
    // Add the x-axis.
    graph.append("svg:g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chartWindow.height + ")")
            .call(xAxis);


    // create left yAxis
    var yAxisLeft = d3.svg.axis().scale(pxScalers.yScaler).ticks(4).orient("left");
    // Add the y-axis to the left
    graph.append("svg:g")
            .attr("class", "y axis")
            .attr("transform", "translate(-25,0)")
            .call(yAxisLeft);
      
    graph.append("svg:path").attr("d", line(data)).attr("class","line");
    return graph
}

function addLine(graph, data) {
    var [line, pxScalers] = lineScalesFromData(data);
    graph.append("svg:path").transition()
                     .delay(2750)
                     .attr("class", "fatred").attr("d", line(data));
    //graph.append("svg:path").attr("d", line(data)).attr("class","line");
}

// [A - 2*A * (msecs/S%2) for msecs in msecValues]
function sqWave(msecValues,A,S) {
    ary = [];
    for (let msecs in msecValues) {
        ary.push(Math.round(A - 2*A * (Math.floor(msecs/S)%2)));
    }    
    return ary
}

var S = 3;
var A = 3;
msecValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
50, 51, 52, 53, 54, 55, 56, 57, 58, 59];

voltages = sqWave(msecValues,A,S);
console.log("generated square wave voltages = ", voltages);


// [A - 2*A * bool((msecs/W) % (C/W)) for msecs in msecValues]
function pulesWave(msecValues,A,W,C) {
    ary = [];
    for (let msecs in msecValues) {
        ary.push(Math.round(A - 2*A * Boolean(Math.floor(msecs/W) % Math.floor(C/W))));
    }    
    return ary
}

A = 3;
var C = 10;
var W = 2;
voltages = pulesWave(msecValues,A,W,C)
console.log("generated pulse wave voltages = ", voltages);

function sumSquareError(measured, generated) {
    var squaredErrors = measured.map(function (e, i) {
        return Math.pow(measured[i] - generated[i],2);
    });
    return d3.sum(squaredErrors);
}

var measured = [3,1,4,1,5,9];
var generated = [5,1,5,1,5,1];
console.log("sum of errors squared = ",sumSquareError(measured, generated));
