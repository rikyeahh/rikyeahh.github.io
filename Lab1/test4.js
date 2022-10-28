// set the dimensions and margins of the graph
const margin = { top: 30, right: 30, bottom: 70, left: 200 },
    width = 560 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// create box for the svg graph with specified margins and dimentions
const svg = d3.select("#graph4")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// get the data
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data1.csv").then(function (data) {
    

    data = data.slice(0, 10) // just top 10 tree species
    console.log(data);

    const labels = data.map(e => e.name)
    console.log(labels);

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

})