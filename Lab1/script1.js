// set the dimensions and margins of the graph

var WIDTH = 750, HEIGHT = 600;

const margin = { top: 30, right: 30, bottom: 70, left: 200 }
width = WIDTH - margin.left - margin.right,
height = HEIGHT - margin.top - margin.bottom;

// create box for the svg graph with specified margins and dimentions
const svg = d3.select("#graph1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// get the data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data1.csv").then(function (data) {

    data = data.slice(0, 10) // just top 10 tree species

    // build X axis, linear on quantity
    const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(e => e.count))]) // ticks
        .range([0, width]); // width on page
    // put x axis to bottom
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        // and style its text
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // build Y axis, adapted on categories
    const y = d3.scaleBand()
        .domain(data.map(d => d.name)) // ticks, category names
        .range([0, height]) // height on page
        .padding(.1); // separate bars with small padding
    // put it on the left
    svg.append("g")
        .call(d3.axisLeft(y))

    // add tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "d3-tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("padding", "15px")
        .style("background", "rgba(0,0,0,0.6)")
        .style("border-radius", "5px")
        .style("color", "#fff")
        .text("a simple tooltip");

    // put bars on graph
    // build a "myRect" for each datum
    svg.selectAll("myRect")
        .data(data)
        // with shape rect
        .join("rect")
        // and dimentions from specified axes
        .attr("x", x(0)) // x(0) == 0 since start on left side
        .attr("y", d => y(d.name))
        .attr("width", d => x(d.count)) // length of horizontal bars
        .attr("height", y.bandwidth()) // automatic height based on total svg height
        .attr("fill", "#69b3a2") // color
        // on mouseover: red bar and show tooltip
        .on("mouseover", function (d, i) {
            tooltip.html(`Mean canopy size : ${Math.round(i.mean_canopy_cover * 100) / 100}`)
                .style("visibility", "visible");
            d3.select(this).attr("fill", "red");
        })
        // move tooltip on move
        .on("mousemove", function () {
            tooltip
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        // on mouseout: blue bar and hide tooltip
        .on("mouseout", function () {
            tooltip.html(``).style("visibility", "hidden");
            d3.select(this).attr("fill", "#69b3a2");
        });

    // add grid
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .ticks(5)
            .tickSize(-height)
            .tickFormat("") // no further label
        );
});