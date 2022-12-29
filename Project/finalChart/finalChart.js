d3.csv("/Project/finalChart/finalChart.csv").then(function (data) {

    const margin = { top: 20, right: 0, bottom: 60, left: 200 }
    const width = 700 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom;

    const svg2 = d3.select('#finalChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

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
        .range(["#b38074", "#5a7a5b"]);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg2.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .style("font-size", "20px")

    svg2.append("g")
        .call(yAxis)
        .style("font-size", "15px")


    // draw bars
    const layers = svg2.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));


    // tooltip
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
    const legendX = 360
    for (let i = 0; i < plants.length; i++) {
        svg2.append("circle")
            .attr("cx", legendX)
            .attr("cy", 205 + i * 18)
            .attr("r", 6)
            .style("fill", color(i))
        svg2.append("text")
            .attr("x", legendX + 10)
            .attr("y", 205 + i * 18)
            .text(plants[i])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
    }

    // actually build bars, layer by layer
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
                tooltip2[i].html(`${plants[i]}: ${Math.round((j[1] - j[0]) * 100) / 100}`)
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
                    return "" + color(i) + "";
                })
            })

        // text for total
        svg2.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Pasture"]) + x(d["Cropland"]) + 5)
            .attr("y", d => y(d.circoscrizione) + y.bandwidth() / 2 + 3)
            .text(d => (parseFloat(d.Pasture) == 0 ? '' : (parseFloat(d.Pasture) + (parseFloat(d["Cropland"])) + " billion ha")))

        // text for cropland
        svg2.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => 10)
            .attr("y", d => y(d.circoscrizione) + y.bandwidth() / 2 + 3)
            .text(d => d["Cropland"] + " billion ha") // to avoid text overlap
            .attr("fill", "white")

        // text for pasture
        svg2.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Cropland"]) + x(d["Pasture"]) / 2 - 50)
            .attr("y", d => y(d.circoscrizione) + y.bandwidth() / 2 + 3)
            .text(d => d["Pasture"] == '0' ? '' : d["Pasture"] + " billion ha") // to avoid text overlap
            .attr("fill", "white")
    });

    svg2.append("text")
        .attr("x", x(data[0]["Cropland"]) / 2 - 50)
        .attr("y", 0)
        .text("CROPLAND")
        .attr("fill", color(0))
        .style("font-weight", "bold")

    svg2.append("text")
        .attr("x", x(data[0]["Cropland"]) + x(data[0]["Pasture"]) / 2 - 50)
        .attr("y", 0)
        .text("PASTURE")
        .attr("fill", color(1))
        .style("font-weight", "bold")
    
    svg2.append("text")
        .attr("x", 100)
        .attr("y", 460)
        .text("Billion hectares needed by type of diet")
        
    // TODO fix larghezza
})