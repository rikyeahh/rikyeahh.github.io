
function update(chemical) {
    document.getElementById("lineSM").innerHTML = '';
    d3.csv(`${chemical}_tot.csv`).then(function (data) {

        const margin = { top: 30, right: 10, bottom: 30, left: 50 }
        const width = document.documentElement.clientWidth / 5 - 20 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        console.log(data);
        // group the data: I want to draw one line per group
        const sumstat = d3.group(data, d => d.name) // nest function allows to group the calculation per level of a factor

        // What is the list of groups?
        allKeys = new Set(data.map(d => d.name))

        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
        const svg = d3.select("#lineSM")
            .selectAll("uniqueChart")
            .data(sumstat)
            .enter()
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                `translate(${margin.left},${margin.top})`);

        // Add X axis
        console.log("EXTENT", d3.extent(data, function (d) { return parseInt(d.year); }));
        const x = d3.scaleLinear()
            .domain(d3.extent(data, function (d) { return parseInt(d.year); }))
            .range([0, width])
        const xAxis = d3.axisBottom()
            .ticks(5)
            .scale(x)
            .tickFormat((d, i) => d)
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        //Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.n; })])
            .range([height, 0]);
        const yAxis = d3.axisLeft()
            .ticks(5)
            .scale(y.nice())
            .tickFormat((d, i) => d / 1000 + "K");
        svg.append("g")
            .call(yAxis);

        // color palette
        const color = d3.scaleOrdinal()
            //.domain(allKeys)
            .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

        // Draw the line
        svg.append("path")
            .attr("fill", "black")
            .attr("stroke", "black")
            .attr("stroke-width", 1.9)
            .attr("d", function (d) {
                return d3.area()
                    .x(d => x(d.year))
                    .y0(d => y(+d.n))
                    .y1(y(0))
                    (d[1])
            })

        // Add titles
        svg.append("text")
            .attr("text-anchor", "start")
            .attr("y", -5)
            .attr("x", 0)
            .text(function (d) { return (d[0]) })
            .style("fill", "blue")

        d3.csv(`${chemical}_agri.csv`).then(function (data) {
            const sumstat = d3.group(data, d => d.name) // nest function allows to group the calculation per level of a factor
            svg.append("path")
                .data(sumstat)
                .attr("fill", "red")
                .attr("stroke", d => "red")
                .attr("stroke-width", 1.9)
                .attr("d", function (d) {
                    return d3.area()
                        .x(d => x(d.year))
                        .y0(d => y(+d.n))
                        .y1(y(0))
                        (d[1])
                })
        })
    })
}

update("nitro")