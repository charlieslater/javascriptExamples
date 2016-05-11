///<reference path="d3.d.ts" />

console.log("multiline.ts starting ...");
// global variables
var svg;
var x;
var y;
var data;

class SecondsVoltage {
    seconds: number;
    voltage: number;
}

interface MyPoint {
  seconds: number;
  voltage: number;
}

let point: MyPoint;

class PageData {
    width: number;
    height: number;
    margin = { top: 20, right: 20, bottom: 30, left: 50 };
    constructor() {
        this.margin = { top: 20, right: 20, bottom: 30, left: 50 };
        this.width = 960 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
    }
}
var page = new PageData();

function configChart(data) {
    if (svg) {d3.select("svg").remove();}
    svg = d3.select("body").append("svg")
        .attr("width", page.width + page.margin.left + page.margin.right)
        .attr("height", page.height + page.margin.top + page.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + page.margin.left +
              "," + page.margin.top + ")");
    //console.log("setup: svg = " + svg);
    var xmin = d3.min(data, function (d) { return d["seconds"]; });
    var xmax = d3.max(data, function (d) { return d["seconds"]; });
    var ymin = d3.min(data, function (d) { return d["voltage"]; });
    var ymax = d3.max(data, function (d) { return d["voltage"]; });
    //console.log("d3.csv: xmin = " + xmin);
    //console.log("d3.csv: xmax = " + xmax);
    //console.log("d3.csv: ymin = " + ymin);
    //console.log("d3.csv: ymax = " + ymax);
    if (ymin > 0.0) {
        ymin = 0.0;
    }
    x = d3.scale.linear().domain([xmin, xmax]).range([0, page.width]);
    y = d3.scale.linear().domain([ymin, ymax]).range([page.height, 0]);
}

function setup() {
    loadFiles();
}

window.onload = setup;

function convert_point(d) {
        d.seconds = +d.seconds;
        d.voltage = +d.voltage;
        //console.log("convert_point.csv: d.seconds = " + d.seconds);
        //console.log("convert_point.csv: d.voltage = " + d.voltage);
        return d;
}

function drawline(data, colorname) {
    var line = d3.svg.line()
        .x(function (d) { return x(d["seconds"]); })
        .y(function (d) { return y(d["voltage"]); });
    svg.append("path")
        .attr("class", "line")
        .attr("d", line(data))
        .style("stroke", colorname);
}
function logdata(data) {
    var arrayLength = data.length;
    for (var i = 0; i < arrayLength; i++) {
        console.log("data[" + i + "].seconds = " + data[i].seconds);
        console.log("data[" + i + "].voltage = " + data[i].voltage);
    }
}

class LineData {
    data: SecondsVoltage[];
    fulldata: SecondsVoltage[];
    color: string;
    filename: string;
    zoomfactor: number
    constructor(public fname: string, colorname: string) {
       this.color = colorname;
       this.filename = fname;
       this.zoomfactor = 1.0;
    }
    zoomdata(factor) {
       this.zoomfactor = factor;
       let totalPoints = this.fulldata.length;
       let halfPoints = this.zoomfactor * totalPoints/2;
       let leftIndex = halfPoints
       let rightIndex = totalPoints - halfPoints;
       this.data = this.fulldata.slice(leftIndex,rightIndex)
    }
    
    drawlinemethod() {
      var line = d3.svg.line()
        .x(function (d) { return x(d["seconds"]); })
        .y(function (d) { return y(d["voltage"]); });
      svg.append("path")
        .attr("class", "line")
        .attr("d", line(this.data))
        .style("stroke", this.color);
    }
}
var pulseline = new LineData("sine.csv","green");
var sineline = new LineData("sine.csv","green");
var squareline = new LineData("square.csv","red");

function drawit(data) {
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    var line = d3.svg.line()
        .x(function (d) { return x(d["seconds"]); })
        .y(function (d) { return y(d["voltage"]); });
    //console.log("drawit: append x axis: height = " + page.height);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + page.height + ")")
        .call(xAxis);
    //console.log("drawit: append y axis");
    svg.append("text")
        .attr("transform", "translate(" + (page.width / 2) + " ," + (page.height + page.margin.bottom) + ")")
        .style("text-anchor", "middle")
        .text("Seconds");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - page.margin.left)
        .attr("x", 0 - page.height/2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Volts");
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}

function plotdata(data: Array<SecondsVoltage>) {
    //console.log("plotdata starting ...");
    //logdata(data);
    drawit(pulseline.data);
    sineline.drawlinemethod();
    squareline.drawlinemethod();
}

function zoom(factor) {
    //console.log("zoom starting ... factor = " + factor);
    pulseline.zoomdata(factor);
    sineline.zoomdata(factor);
    squareline.zoomdata(factor);
}

function makecharts(data) {
    plotdata(data);
}

function makechart(error, data1, data2, data3) {
    //console.log("makechart: data1[0] = " + data1[0]);
    data1.forEach(function(d) {
        convert_point(d);
    });
    data = data1
    pulseline.fulldata = pulseline.data = data1;
    data2.forEach(function(d) {
        convert_point(d);
    });
    //console.log("makechart: data2[0].seconds = " + data2[0].seconds);
    //console.log("makechart: data2[0].voltage = " + data2[0].voltage);
    sineline.fulldata = sineline.data = data2;
    data3.forEach(function(d) {
        convert_point(d);
    });
    squareline.fulldata = squareline.data = data3;
    zoom(0.5);
    configChart(pulseline.data);
    //console.log("makechart: calling makecharts");
    makecharts(pulseline.data);
}



function loadFiles(){
  var q = d3_queue.queue(3);
  q.defer(d3.csv,"pulse.csv")
   .defer(d3.csv,"sine.csv")
   .defer(d3.csv,"square.csv")
   .await(makechart);
  //console.log("loadFiles: waiting to run makechart");
}  

// demonstrate that a line that looks like it runs last runs sooner
console.log("page.width = " + page.width);

class ZoomStatus {
    partial: number;
    factor: number;
    constructor(factor: number) {
       console.log("ZoomChart:constructor: factor =", factor);
       this.factor = factor;
       this.partial = factor * 100; 
    }
    zoomOut() {
        if (this.partial > 0) {
            this.factor = (--this.partial)/100;
            this.zoomChart();
        }
    }
    zoomIn() {
        if (this.partial < 98) { 
            this.factor = (++this.partial)/100;
            this.zoomChart();
        }
    }
    zoomChart() {
        zoom(this.factor);
        configChart(pulseline.data);
        makecharts(pulseline.data);
    }
}
var zoomWidget = new ZoomStatus(0.5);

$(document.body).on('keydown', function(e) {
            switch (e.which) {
                // key code for left arrow
                case 37:
                    console.log('left arrow key pressed!');
                    break;
                case 38:
                    console.log('up arrow key pressed!');
                    break;
                // key code for right arrow
                case 39:
                    console.log('right arrow key pressed!');
                    break;
                case 40:
                    console.log('down arrow key pressed!');
                    break;
                case 187:
                    zoomWidget.zoomIn();
                    break;
                case 189:
                    zoomWidget.zoomOut();
                    break;
                default:
                    console.log('key code = ' + e.which);
            }
});

//# sourceMappingURL=multiline.js.map
