function categoryToColor(category) {
    switch (category) {
        case "Chemistry":
            return "#8B0017";
        case "Economic Sciences":
            return "#00468B";
        case "Physics":
            return "seagreen";
        case "Literature":
            return "goldenrod";
        case "Medicine":
            return "#660066";
        case "Peace":
            return "salmon";
        default:
            return "lightgray";
    }
}

d3.csv("../my_graph.csv", function (error, links) {
    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // targets list
    const targets = links.map(d => d.target);
    var inDegree = targets.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    const sources = links.map(d => d.target);
    // add to inDegree
    sources.forEach(source => {
        if (!inDegree[source]) {
            inDegree[source] = 0;
        }
    });

    const max_indegree = Math.max(...Object.values(inDegree));
    const min_indegree = 1;
    // function to scale them to (1, 30)
    const scale = d3.scaleLinear().domain([min_indegree, max_indegree]).range([2, 30]);

    // nodes names
    var names = links.map(d => d.source).concat(links.map(d => d.target));
    names = [...new Set(names)];
    var n = names.length;
    var nodes = d3.range(n).map(function (i) { return { index: i, size: 1, color: "blue", name: names[i] } });
    // remove the one with name ""
    var links = links.map(function (d) {
        return {
            source: names.indexOf(d.source),
            target: names.indexOf(d.target)
        };
    });

    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-50))
        .force("link", d3.forceLink(links).distance(81).strength(2).iterations(2))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .stop();

    var loading = svg.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .text("Simulating. One moment please…");


    // Use a timeout to allow the rest of the page to load first.
    d3.timeout(function () {
        console.log("begin...");

        loading.remove();

        // See https://github.com/d3/d3-force/blob/master/README.md#simulation_tick
        for (var i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
            simulation.tick();
        }

        g.append("g")
            .attr("stroke", "#000")
            .attr("stroke-width", 0.5)
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("x1", function (d) { return d.source.x; })
            .attr("y1", function (d) { return d.source.y; })
            .attr("x2", function (d) { return d.target.x; })
            .attr("y2", function (d) { return d.target.y; });

        // dot with text on the side
        g.append("g")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return scale(inDegree[d.name] ?? 1) })
            .attr("fill", function (d) { return categoryToColor(d.name) })
            .attr("name", function (d) { return d.name; });

        console.log(inDegree);
        console.log(inDegree["Medicine"]);
        g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("x", function (d) { return d.x - 10; })
            .attr("y", function (d) { return d.y; })
            .text(function (d) { return (scale(inDegree[d.name] ?? 1) > 2 ? d.name : "") });
        
        console.log("...done");
    });
});