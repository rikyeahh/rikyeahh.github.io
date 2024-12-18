// Histogram

d3.csv("../assets/data4.csv").then(function (data) {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 40 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("#graph1")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left},${0})`);
    // X axis: scale and draw:
    const x = d3.scaleLinear()
        .domain([0, Math.max(...data.map(e => e.tree_height))]).nice()     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, width]);
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))

    svg.append("text")
        .attr("x", width / 2 - 50)
        .attr("y", height + 30)
        .text("Tree height (m)")

    // Y axis: initialization
    const y = d3.scaleLinear()
        .range([height, 0]);
    const yAxis = svg.append("g")


    // A function that builds the graph for a specific value of bin
    function update(nBin) {

        // set the parameters for the histogram
        const histogram = d3.histogram()
            .value(function (d) { return d.tree_height; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        const bins = histogram(data);

        // Y axis: update now that we know the domain
        y.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        yAxis.call(d3.axisLeft(y));

        // Join the rect with the bins data
        const u = svg.selectAll("rect")
            .data(bins)

        // Manage the existing bars and eventually the new ones:
        u.join("rect") // Add a new rect for each new elements
            .attr("x", 1)
            .attr("transform", function (d) { return `translate(${x(d.x0)}, ${y(d.length)})` })
            .attr("width", function (d) {
                var diff = x(d.x1) - x(d.x0) - 1
                return diff <= 0 ? 0 : diff;
            })
            .attr("height", function (d) { return height - y(d.length); })
            .style("fill", "#69b3a2")
    }

    // Initialize with 20 bins
    update(20)

    // Listen to the button -> update if user change it
    d3.select("#nBin").on("input", function () {
        update(+this.value);
    });

});