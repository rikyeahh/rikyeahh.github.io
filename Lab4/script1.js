// linechart

d3.csv("../assets/data10.csv").then(function (data) {
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 70, bottom: 30, left: 60 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    // group the data: I want to draw one line per group
    const sumstat = d3.group(data, d => d.year); // nest function allows to group the calculation per level of a factor

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain([1, 12])
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(12).tickFormat((d,i) => months[i]));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return +d.temp; }), d3.max(data, function (d) { return +d.temp; })])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).scale(y).tickFormat((d,i) => d + "°C"));

    // color palette
    const colors = {
        '1993_min': '#cf0202',
        '1993_max': '#fc7979',
        '1997_min': '#cfa602',
        '1997_max': '#fae078',
        '2001_min': '#0bb502',
        '2001_max': '#80fc79',
        '2005_min': '#039687',
        '2005_max': '#77f7ea',
        '2009_min': '#032096',
        '2009_max': '#6380f2',
        '2013_min': '#4a02b0',
        '2013_max': '#955ffa',
        '2017_min': '#b00293',
        '2017_max': '#fc5be2',
        '2021_min': '#333233',
        '2021_max': '#a6a4a5'
    }

    // Draw the line
    svg.selectAll(".line")
        .data(sumstat)
        .join("path")
        .attr("fill", "none")
        .attr("stroke", function (d) { return colors[d[0]] })
        .attr("stroke-width", 1.5)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) { return x(d.month); })
                .y(function (d) { return y(+d.temp); })
                (d[1])
        })
    
    // legend
    const years = [1993, 1997, 2001, 2005, 2009, 2013, 2017, 2021]
    for (let i = 0; i < years.length * 2; i+=2) {
        svg.append("circle")
            .attr("cx", 530)
            .attr("cy", 0 + i * 9)
            .attr("r", 6)
            .style("fill", Object.entries(colors)[i][1])
        svg.append("circle")
            .attr("cx", 520)
            .attr("cy", 0 + i * 9)
            .attr("r", 6)
            .style("fill", Object.entries(colors)[i + 1][1])
        svg.append("text")
            .attr("x", 480)
            .attr("y", 0 + i * 9)
            .text(years[i / 2])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
    }
})