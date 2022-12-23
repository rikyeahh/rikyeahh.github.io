d3.csv("datasets/animals_weight_normalized.csv").then(function (data) {
//d3.csv("datasets/animals_per_country.csv").then(function (data) {


    var margin = { top: 10, right: 0, bottom: 10, left: 100 },
        width = 900 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    const svg = d3.select("#graph2")
        .append("svg")
        .attr("width", 1000 + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const animals = Object.keys(data[0]).filter(d => d != "Country");
    const circoscrizioni = data.map(d => d.Country)
    // scales
    const x = d3.scaleLinear()
        .domain([0, 100]).nice()
        .range([0, width]);
    const y = d3.scaleBand()
        .domain(circoscrizioni)
        .range([0, height])
        .padding([0.1])
    const color = d3.scaleOrdinal()
        .domain(animals)
        .range(d3.schemeTableau10);

    // axes
    const xAxis = d3.axisBottom(x).ticks(5, '~s');
    const yAxis = d3.axisLeft(y);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
    svg.append("g")
        .call(yAxis)

    // Normalize the data -> sum of each group must be 100!
    dataNormalized = []
    data.forEach(function (d) {
        // Compute the total
        tot = 0
        for (i in animals) {
            var name = animals[i];
            tot += +d[name]
        }
        // Now normalize
        for (i in animals) {
            var name = animals[i];
            d[name] = d[name] / tot * 100
        }
    })

    // stack the data
    const stackedData = d3.stack()
        .keys(animals)
        (data)

    const layers = svg.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', d => color(d.key));

    const tooltip2 = [];
    for (let i = 0; i < animals.length; i++) {

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

    // actually build the layers
    layers.each(function (_, i) {

        d3.select(this)
            .selectAll('rect')
            .data(d => d)
            .join('rect')
            .attr('x', d => x(d[0]))
            .attr('y', d => y(d.data.Country))
            .attr('height', y.bandwidth())
            .attr('width', d => (x(d[1]) - x(d[0])))
            .on("mouseover", function (d, j) {
                tooltip2[i].html(`${animals[i]} : ${Math.floor((j[1] - j[0]) * 10) / 10 + "%"}`)
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

    // legend
    var cx = 850;
    var cy = 100;
    for (let i = 0; i < animals.length; i++) {
        svg.append("circle")
            .attr("cx", cx)
            .attr("cy", cy + i * 18)
            .attr("r", 6)
            .style("fill", d3.schemeTableau10[i])
        svg.append("text")
            .attr("x", cx + 20)
            .attr("y", cy + i * 18)
            .text(animals[i])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
            .on
    }
})


