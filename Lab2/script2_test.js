// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 180},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graph2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data5.csv", function (data) {
    console.log(data)
    //max and min values for the height
    const xMin = 0
    const xMax = 40

    // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
    const sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) {
            return d.name;
        })
        .rollup(function (d) {
            q1 = d3.quantile(d.map(function (g) {
                return parseFloat(g.height);
            }).sort(d3.ascending), .25)
            median = d3.quantile(d.map(function (g) {
                return parseFloat(g.height);
            }).sort(d3.ascending), .5)
            q3 = d3.quantile(d.map(function (g) {
                return parseFloat(g.height);
            }).sort(d3.ascending), .75)
            interQuantileRange = q3 - q1
            min = q1 - 1.5 * interQuantileRange
            max = q3 + 1.5 * interQuantileRange

            newMax = Math.max(min, xMin);
            newMin = Math.min(max, xMax);
            return ({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: newMin, max: newMax})
        })
        .entries(data)

    // Show the Y scale
    const y = d3.scaleBand()
        .range([height, 0])
        .domain(data.map(d => d.name))
        //.domain(["Tilia x europaea", "Tilia cordata", "Platanus x hispanica", "Celtis australis", "Carpinus betulus", "Aesculus hippocastanum"])
        .padding(.1);

    svg.append("g")
        .attr("transform", "translate(-50," + (-15) + ")")
        .call(d3.axisLeft(y).tickSize(0))
        .select(".domain").remove()

    // Show the X scale
    const x = d3.scaleLinear()
        .domain([0, xMax])
        .range([0, width]).nice();

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
        .select(".domain").remove()

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 30)
        .text("Height (m)");

    // Show the main vertical line
    svg
        .selectAll("vertLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("x1", function(d){return(x(d.value.min))})
        .attr("x2", function(d){return(x(d.value.max))})
        .attr("y1", function(d){return(y(d.key) + y.bandwidth()/2)})
        .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
        .attr("stroke", "black")
        .style("width", 40)

    // rectangle for the main box
    svg
        .selectAll("boxes")
        .data(sumstat)
        .enter()
        .append("rect")
        .attr("x", function(d){return(x(d.value.q1))}) // console.log(x(d.value.q1)) ;
        .attr("width", function(d){ ; return(x(d.value.q3)-x(d.value.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth() )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)

    // Show the median
    svg
        .selectAll("medianLines")
        .data(sumstat)
        .enter()
        .append("line")
        .attr("y1", function(d){return(y(d.key))})
        .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
        .attr("x1", function(d){return(x(d.value.median))})
        .attr("x2", function(d){return(x(d.value.median))})
        .attr("stroke", "black")
        .style("width", 80)

    // Add individual points with jitter
    const jitterWidth = 20
    svg
        .selectAll("indPoints")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) {return (x(d.height))})
        .attr("cy", function (d) {return (y(d.name) + (y.bandwidth() / 2) - jitterWidth / 2 + Math.random() * jitterWidth)})
        .attr("r", 3)
        .style("fill", "white")
        .attr("stroke", "black")
})