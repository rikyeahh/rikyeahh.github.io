const margin = { top: 30, right: 0, bottom: 30, left: 50 };

//Read the data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function (data) {
    //console.log("INIT DATA", data);
    toPlot = []
    Object.entries(data[1])
        .slice(1) // delete header
        .forEach(d => toPlot.push({'species': d[0], 'count': d[1]}))
    //console.log("TO PLOT", toPlot);
    buildWaffle("graph4", toPlot)
})


function buildWaffle(anchor, data) {

    
    var total = 0;
    var width,
        height,
        widthSquares = 10,
        heightSquares = 10,
        squareSize = 25,
        squareValue = 0,
        gap = 1,
        theData = [];

    var color = d3.scaleOrdinal(d3.schemeCategory10);
    total = d3.sum(data, function (d) { return d.count; });

    //value of a square
    squareValue = total / (widthSquares * heightSquares);

    //remap data
    data.forEach(function (d, i) {
        d.count =+ d.count;
        d.units = Math.floor(d.count / squareValue);
        theData = theData.concat(
            Array(d.units + 1).join(1).split('').map(function () {
                return {
                    squareValue: squareValue,
                    units: d.units,
                    count: d.count,
                    groupIndex: i
                };
            })
        );
    });

    width = (squareSize * widthSquares) + widthSquares * gap + 25;
    height = (squareSize * heightSquares) + heightSquares * gap + 25;

    var waffle = d3.select("#" + anchor)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .selectAll("div")
        .data(theData)
        .enter()
        .append("rect")
        .attr("width", squareSize)
        .attr("height", squareSize)
        .attr("fill", function (d) {
            return color(d.groupIndex);
        })
        .attr("x", function (d, i) {
            //group n squares for column
            col = Math.floor(i / heightSquares);
            return (col * squareSize) + (col * gap);
        })
        .attr("y", function (d, i) {
            row = i % heightSquares;
            return (heightSquares * squareSize) - ((row * squareSize) + (row * gap))
        })
        .append("title")
        .text(function (d, i) {
            return "Species: " + data[d.groupIndex].species + " | " + d.count + " , " + d.units + "%"
        });

    //add legend with categorical data
    var legend = d3.select("#legend")
        .append("svg")
        .attr('width', 300)
        .attr('height', 200)
        .append('g')
        .selectAll("div")
        .data(data)
        .enter()
        .append("g")
        .attr('transform', function (d, i) { return "translate(0," + i * 20 + ")"; });
    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) { return color(i) });
    legend.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .text(function (d) { return d.species });

    //add value of a unit square
    var legend2 = d3.select("#legend")
        .select('svg')
        .append('g')
        .attr('transform', "translate(100,0)");

    legend2.append("text")
        .attr('y', '14')
        .attr('font-size', '18px')
        .text("Total: " + total)
        .attr("fill", "#444444");
};