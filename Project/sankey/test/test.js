// set the dimensions and margins of the data
var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(10)
    .nodePadding(10)
    .size([width, height]);

data = {
    "nodes": [
        { "node": 0, "name": "A" },
        { "node": 1, "name": "B" },
        { "node": 2, "name": "C" }
    ],
    "links": [
        { "source": 0, "target": 1, "value": 2 },
        { "source": 1, "target": 2, "value": 1 }
    ]
}

// Constructs a new Sankey generator with the default settings.
sankey
    .nodes(data.nodes)
    .links(data.links)
    .layout(1);

// add in the links
svg.append("g")
    .selectAll(".link")
    .data(data.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", sankey.link())
    .style("stroke-width", function (d) { return Math.max(1, d.dy); })

// add in the nodes
var node = svg.append("g")
    .selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    
// add the rectangles for the nodes
node.append("rect")
    .attr("height", function (d) { return d.dy; })
    .attr("width", sankey.nodeWidth())

// add in the title for the nodes
node.append("text")
    .attr("x", -6)
    .attr("y", function (d) { return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function (d) { return d.name; })
    .filter(function (d) { return d.x < width / 2; })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start")
