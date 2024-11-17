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
            return "black";
    }
}

// get the data
d3.csv("../my_graph.csv", function (error, links) {

    var nodes = {};

    // Compute the distinct nodes from the links.
    links.forEach(function (link) {
        link.type = "dominating";
        link.source = nodes[link.source] || (nodes[link.source] = {
            name: link.source
        });
        link.target = nodes[link.target] || (nodes[link.target] = {
            name: link.target
        });
        link.value = +link.value;
    });

    var width = window.innerWidth;
        height = window.innerHeight;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(20)
        .charge(-30)
        .on("tick", tick)
        .start();


    // Set the range
    var v = d3.scale.linear().range([0, 100]);

    // Scale the range of the data
    v.domain([0, d3.max(links, function (d) { return d.value; })]);

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    // Per-type markers, as they don't inherit styles.

    var path = svg.append("g")
        .selectAll("path")
        .data(force.links())
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "link " + d.type;
        })
        .attr("stroke-width", 20)
        .attr("opacity", 0.5)


    var circle = svg.append("g").selectAll("circle")
        .data(force.nodes())
        .enter().append("circle")
        .attr("r", function (d) {
            // remap (1-inf) to (1-10)
            return Math.log(d.weight) * 4;
        })
        .call(force.drag);

    // var text = svg.append("g")
    //     .selectAll("text")
    //     .data(force.nodes())
    //     .enter()
    //     .append("text")
    //     .attr("x", 8)
    //     .attr("y", ".31em")
    //     .text(function (d) {
    //         return d.name;
    //     });

    function tick() {
        path.attr("d", function (d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });
        path.attr("d", function (d) {
            var pl = this.getTotalLength(),
                r = 4 // (d.target.weight) * 4 + Math.sqrt(markerSize ** 2 + markerSize ** 2), // marker "size"
                m = this.getPointAtLength(pl - r);

            var dx = m.x - d.source.x,
                dy = m.y - d.source.y,
                dr = (d.straight == 0) ? Math.sqrt(dx * dx + dy * dy) : 0;

            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + m.x + "," + m.y;
        });
        circle.attr("transform", transform);
        //text.attr("transform", transform);
    }


    function transform(d) {
        return "translate(" + d.x + "," + d.y + ")";
    }

});