d3.csv("./finalChart/finalChart.csv").then(function (data) {

    const margin = { top: 20, right: 70, bottom: 60, left: 200 }
    const width = 700 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#finalChart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const landUsage = Object.keys(data[0]).filter(d => d != "Diet");
    const diet = data.map(d => d.Diet);

    const stackedData = d3.stack()
        .keys(landUsage)(data);

    const xMax = d3.max(stackedData[stackedData.length - 1], d => d[1]);

    // scales
    const x = d3.scaleLinear()
        .domain([0, xMax]).nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(diet)
        .range([0, height])
        .padding(0.1);
    const color = d3.scaleOrdinal()
        .domain(landUsage)
        .range(["#b38074", "#5a7a5b"]);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .style("font-size", "20px")

    svg.append("g")
        .call(yAxis)
        .style("font-size", "15px")


    // draw bars
    const layers = svg.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));


    // add legend
    const legendX = 360
    for (let i = 0; i < landUsage.length; i++) {
        svg.append("circle")
            .attr("cx", legendX)
            .attr("cy", 205 + i * 18)
            .attr("r", 6)
            .style("fill", color(i))
        svg.append("text")
            .attr("x", legendX + 10)
            .attr("y", 205 + i * 18)
            .text(landUsage[i])
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
            .attr('y', d => y(d.data.Diet))
            .attr('height', y.bandwidth())
            .attr('width', d => (x(d[1]) - x(d[0])))

        // text for total
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Pasture"]) + x(d["Cropland"]) + 5)
            .attr("y", d => y(d.Diet) + y.bandwidth() / 2 + 3)
            .text(d => (parseFloat(d.Pasture) == 0 ? '' : (parseFloat(d.Pasture) + (parseFloat(d["Cropland"])) + " billion ha")))

        // text for cropland
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => 10)
            .attr("y", d => y(d.Diet) + y.bandwidth() / 2 + 3)
            .text(d => d["Cropland"] + " billion ha") // to avoid text overlap
            .attr("fill", "white")

        // text for pasture
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Cropland"]) + x(d["Pasture"]) / 2 - 50)
            .attr("y", d => y(d.Diet) + y.bandwidth() / 2 + 3)
            .text(d => d["Pasture"] == '0' ? '' : d["Pasture"] + " billion ha") // to avoid text overlap
            .attr("fill", "white")
    });

    svg.append("text")
        .attr("x", x(data[0]["Cropland"]) / 2 - 50)
        .attr("y", 0)
        .text("CROPLAND")
        .attr("fill", color(0))
        .style("font-weight", "bold")

    svg.append("text")
        .attr("x", x(data[0]["Cropland"]) + x(data[0]["Pasture"]) / 2 - 50)
        .attr("y", 0)
        .text("PASTURE")
        .attr("fill", color(1))
        .style("font-weight", "bold")
    
    svg.append("text")
        .attr("x", 100)
        .attr("y", 460)
        .text("Billion hectares needed by type of diet")
        
    // TODO fix larghezza
})