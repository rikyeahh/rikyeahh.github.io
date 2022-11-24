// Dot density Map - 1 color

// load both geometric and tree data
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
]).then(function (loadData) {

    const margin_1 = { top: 50, right: 20, bottom: 0, left: 20 },
        width_1 = 1024 - margin_1.left - margin_1.right,
        height_1 = 500 - margin_1.top - margin_1.bottom;

    const svg = d3.select("#graph4")
        .append("svg")
        .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) + ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
        .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

    // projection reflecting the Y to match d3 requirements
    var projection = d3.geoIdentity().reflectY(true)

    let topo = loadData[0]
    projection.fitSize([width_1, height_1], topo);


    svg.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each region
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .attr("fill", "white")
        .style("stroke", "black")

    const remapX = (lon) => {
        var fromRange = [11.04, 11.17]
        var toRange = [320, 650]
        return (
            ((lon - fromRange[0]) * (toRange[1] - toRange[0])) /
            (fromRange[1] - fromRange[0]) + toRange[0]
        );
    };

    const remapY = (lat) => {
        var fromRange = [46, 46.14]
        var toRange = [10, 370]
        return (
            ((lat - fromRange[0]) * (toRange[1] - toRange[0])) /
            (fromRange[1] - fromRange[0]) + toRange[0]
        );
    };

    // draw trees as points
    d3.csv("../assets/data9.csv").then(function (locationData) {
        console.log(locationData);
        svg.append('g')
            .selectAll("dot")
            .data(locationData)
            .join("circle")
            .attr("cx", function (d) {
                // compute x on svg from latitude
                var c = [d.latitude, d.longitude];
                var x = projection(c)[0]
                console.log("x", x);
                return remapX(d.longitude)
            })
            .attr("cy", function (d) {
                // compute y on svg from latitude
                return -remapY(d.latitude) + 400;
            })
            .attr("r", 1)
            .style("fill", "green")
            .style("opacity", "0.7")
    })
})