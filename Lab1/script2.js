
const svg2 = d3.select('#graph2')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("../assets/data2.csv").then(function (data) {

    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");
    const circoscrizioni = data.map(d => d.circoscrizione);

    const stackedData = d3.stack()
        .keys(plants)(data);

    const xMax = d3.max(stackedData[stackedData.length - 1], d => d[1]);

    // scales
    const x = d3.scaleLinear()
        .domain([0, xMax]).nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, height])
        .padding(0.1);
    const color = d3.scaleOrdinal()
        .domain(plants)
        .range(d3.schemeTableau10);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg2.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

    svg2.append("g")
        .call(yAxis)

    // draw bars

    const layers = svg2.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));

    // transition for bars
    const duration = 0;
    const t = d3.transition()
        .duration(duration)
        .ease(d3.easeLinear);

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

    // add legend
    for (let i = 0; i < plants.length; i++) {
        svg2.append("circle")
            .attr("cx", 250)
            .attr("cy", 100 + i*18)
            .attr("r", 6)
            .style("fill", color(i))
        svg2.append("text")
            .attr("x", 270)
            .attr("y", 100 + i * 18)
            .text(plants[i])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
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

                tooltip2[i].html(`${plants[i]} : ${j[1] - j[0]}`)
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

})