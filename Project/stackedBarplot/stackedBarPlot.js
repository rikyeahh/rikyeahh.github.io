d3.csv("/Project/stackedBarplot/emissionsByFood.csv").then(function (data) {

    const margin = { top: 20, right: 100, bottom: 40, left: 90 }
    const width = 700 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('#stackedBarPlot')
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
        .range(d3.schemeTableau10);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

    svg.append("g")
        .call(yAxis)
        .style("font-size", "11px")

    // draw bars
    const layers = svg.append('g')
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
    for (let i = 0; i < plants.length; i++) {
        svg.append("circle")
            .attr("cx", 250)
            .attr("cy", 100 + i * 18)
            .attr("r", 6)
            .style("fill", d3.schemeTableau10[i])
        svg.append("text")
            .attr("x", 270)
            .attr("y", 100 + i * 18)
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
                tooltip2[i].html(`${plants[i]} : ${j[1] - j[0]} kg`)
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
            })

        // text for total
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Methane"]) + x(d["Other Greenhouse gases"]) + 5)
            .attr("y", d => y(d.circoscrizione) + 1)
            .text(d => Math.round(parseFloat(d.Methane)) + Math.round(parseFloat(d["Other Greenhouse gases"])) + " Kg")
            .attr("transform", `translate(-2, 13)`)

        // text for methane
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Methane"]) / 2 + x(d["Other Greenhouse gases"]))
            .attr("y", d => y(d.circoscrizione) + 1)
            .text(d => { return d["Methane"] <= 4 ? '' : d["Methane"] + " kg" }) // to avoid text overlap
            .attr("transform", `translate(-13, 12)`)
            .attr("fill", "white")
            .style("font-size", "12px")

        // text for other GHG
        svg.append('g')
            .selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr("x", d => x(d["Other Greenhouse gases"]) / 2)
            .attr("y", d => y(d.circoscrizione) + 1)
            .text(d => d["Other Greenhouse gases"] < 10 ? '' : d["Other Greenhouse gases"] + " kg") // to avoid text overlap
            .attr("transform", `translate(-20, 12)`)
            .attr("fill", "white")
            .style("font-size", "12px")
    });
    // x axis label
    svg.append("text")
        .attr("x", 160)
        .attr("y", height + 30)
        .text("Emissions per kg of food product")
})