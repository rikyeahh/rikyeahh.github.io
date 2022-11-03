const svg4 = d3.select("#graph4")
    .append("svg")
    .attr("width", 1000 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Parse the Data
d3.csv("../assets/data2.csv").then(function(data) {

    // List of subgroups = header of the csv files = plants
    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
    // List of groups = species here = value of the first column called group -> I show them on the Y axis
    const circoscrizioni = data.map(d => d.circoscrizione)
    // scales
    const x = d3.scaleLinear()
        .domain([0, 100]).nice()
        .range([0, width]);
    const y = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, height])
        .padding([0.1])
    const color = d3.scaleOrdinal()
        .domain(plants)
        .range(d3.schemeTableau10);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg4.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
    svg4.append("g")
        .call(yAxis)

    // Normalize the data -> sum of each group must be 100!
    dataNormalized = []
    data.forEach(function(d){
        // Compute the total
        tot = 0
        for (i in plants){ name=plants[i] ; tot += +d[name]}
        // Now normalize
        for (i in plants){ name=plants[i] ; d[name] = d[name] / tot * 100}
    })

    // stack the data
    const stackedData = d3.stack()
        .keys(plants)
        (data)

    const layers = svg4.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));

    const tooltip2 = [];
    for (let i = 0; i < plants.length; i++) {

        tooltip2[i] = d3.select("body")
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
    }

    layers.each(function (_, i) {

        d3.select(this)
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d.data.circoscrizione))
            .attr('height', y.bandwidth())
            .attr('width', d => (x(d[1]) - x(d[0])))
            .on("mouseover", function (d, j) {
                    tooltip2[i].html(`${plants[i]} : ${Math.floor((j[1]-j[0])*10)/10+"%"}`)
                        .style("visibility", "visible");
                    d3.select(this).attr("fill", "red");
            })
            .on("mousemove", function () {
                tooltip2[i]
                    .style("top", (event.pageY - 10) + "px")
                    .style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function () {
                tooltip2[i].html(``).style("visibility", "hidden");
                d3.select(this).attr("fill", function () {
                    return "" + d3.schemeTableau10[i] + "";
                })
            });
    });
    for (let i = 0; i < plants.length; i++) {
        svg4.append("circle")
            .attr("cx", 550)
            .attr("cy", 100 + i*18)
            .attr("r", 6)
            .style("fill", color(i))
        svg4.append("text")
            .attr("x", 570)
            .attr("y", 100 + i * 18)
            .text(plants[i])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
    }
})
