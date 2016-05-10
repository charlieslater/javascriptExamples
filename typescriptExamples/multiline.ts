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

function check_input(d) {
        d.seconds = +d.seconds;
        d.voltage = +d.voltage;
        //console.log("check_input.csv: d.seconds = " + d.seconds);
        //console.log("check_input.csv: d.voltage = " + d.voltage);
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

function setup() {
    loadFiles(["sine.csv"]);
    svg = d3.select("body").append("svg")
        .attr("width", page.width + page.margin.left + page.margin.right)
        .attr("height", page.height + page.margin.top + page.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + page.margin.left +
              "," + page.margin.top + ")");
    console.log("setup: svg = " + svg);
}

window.onload = setup;

class LineData {
    data: SecondsVoltage[];
    color: string;
    filename: string;
    constructor(public fname: string, colorname: string) {
       this.color = colorname;
       this.filename = fname;
    }
    drawlinemethod() {
        console.log("LineData:drawline");
        console.log("LineData:drawline: this.data[0] = "  + this.data[0]);
        console.log("LineData:drawline: this.data[1] = "  + this.data[1]);
        console.log("LineData:drawline: this.data[0].seconds = " + this.data[0].seconds);
        console.log("LineData:drawline: this.data[0].voltage = " + this.data[0].voltage);
        drawline(this.data, this.color);
    }
}
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
    console.log("drawit: append x axis: height = " + page.height);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + page.height + ")")
        .call(xAxis);
    console.log("drawit: append y axis");
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
    console.log("plotdata starting ...");
    var xmin = d3.min(data, function (d) { return d.seconds; });
    var xmax = d3.max(data, function (d) { return d.seconds; });
    var ymin = d3.min(data, function (d) { return d.voltage; });
    var ymax = d3.max(data, function (d) { return d.voltage; });
    console.log("d3.csv: xmin = " + xmin);
    console.log("d3.csv: xmax = " + xmax);
    console.log("d3.csv: ymin = " + ymin);
    console.log("d3.csv: ymax = " + ymax);
    if (ymin > 0.0) {
        ymin = 0.0;
    }
    x = d3.scale.linear().domain([xmin, xmax]).range([0, page.width]);
    y = d3.scale.linear().domain([ymin, ymax]).range([page.height, 0]);
    //logdata(data);
    drawit(data);
    console.log("sineline = " + sineline + ": drawline");
    sineline.drawlinemethod();
    squareline.drawlinemethod();
}
function makecharts(data) {
    console.log("makecharts: sineline = " + sineline);
    console.log("makecharts: calling plotdata");
    plotdata(data);
}

function makelines(error, data1, data2, data3) {
    console.log("makelines: data1[0] = " + data1[0]);
    data1.forEach(function(d) {
        check_input(d);
    });
    data = data1
    data2.forEach(function(d) {
        check_input(d);
    });
    console.log("makelines: data2[0].seconds = " + data2[0].seconds);
    console.log("makelines: data2[0].voltage = " + data2[0].voltage);
    sineline.data = data2;
    data3.forEach(function(d) {
        check_input(d);
    });
    squareline.data = data3;
    console.log("makelines: calling makecharts");
    makecharts(data);
}
function loadFiles(names){
  var q = d3_queue.queue(3);
  q.defer(d3.csv,"pulse.csv")
   .defer(d3.csv,"sine.csv")
   .defer(d3.csv,"square.csv")
   .await(makelines);
  console.log("loadFiles: waiting to run makelines");
}  

// demonstrate that a line that looks like it runs last runs sooner
console.log("page.width = " + page.width);

//# sourceMappingURL=multiline.js.map
