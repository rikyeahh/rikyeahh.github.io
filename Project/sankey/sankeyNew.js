d3.json("sankey1new.json", function (error, graph) {

    var margin = { top: 10, right: 0, bottom: 10, left: 10 },
        width = document.documentElement.clientWidth / 2 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#graph1").append("svg")
        .attr("width", 350 + width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var nodeColors = d => "#333333"//d3.scaleOrdinal(d3.schemeCategory10);
    var linkColor = link => {
        if ((link.source.node == 11) || (link.target.node == 11))
            return "#ff0000"
        return "#000000"
    };


    var sankey = d3.sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .nodeAlign(d3.sankeyLeft)
        .nodeSort(null)
        .linkSort(null)
        .extent([[1, 1], [width, height]]);

    var link = svg.append("g")
        .attr("class", "links")
        .attr("fill", "none")
        .selectAll(".path");

    var node = svg.append("g")
        .attr("class", "nodes")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .selectAll("g");

    sankey(graph);

    link = link.data(graph.links)
        .enter()
        .append("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("class", "sankeyLink")
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("stroke", d => linkColor(d))
        .on("mouseover", onMouseOverLinks)
        .on("mousemove", onMouseMoveLinks)
        .on("mouseout", onMouseOutLinks);

    node = node.data(graph.nodes)
        .enter()
        .append("g");

    node.append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("fill", d => nodeColors(d.name.replace(/ .*/, "")))
        .attr("stroke", "#000");

    node.append("text")
        .attr("x", d => d.x0 - 6)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d.name)
        .filter(d => d.x0 < width / 2)
        .attr("x", d => d.x1 + 6)
        .attr("text-anchor", "start");

    
    svg.append("text")
        .attr("x", 870)
        .attr("y", 350)
        .text("Agricolture makes up for")
        .style("font-weight", "bold")
        .style("font-size", "20px")
        .attr("fill", "#ffaaaa")

    svg.append("text")
        .attr("x", 870)
        .attr("y", 416)
        .text("78.8% of all CH₄")
        .style("font-weight", "bold")
        .style("font-size", "30px")
        .attr("fill", "#ffaaaa")

    svg.append("text")
        .attr("x", 870)
        .attr("y", 483)
        .text("53.2% of all N₂O")
        .style("font-weight", "bold")
        .style("font-size", "30px")
        .attr("fill", "#ffaaaa")



    /* TOOLTIP AND HOVER */
    const tooltip = d3.select("body")
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

    function onMouseOverLinks(event, d) {
        //console.log(d);
        var link = graph.links[d]
        if ((link.source.node == 7) || (link.target.node == 7))
            msg = `${Math.round(link.value / 1000)} tonnes of greenhouse gases`
        else
            msg = `${Math.round(link.value / 1000)} tonnes of ${link.target.name}`
        tooltip.html(msg)
            .style("visibility", "visible");
    }

    function onMouseMoveLinks() {
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    }

    function onMouseOutLinks(event, d) {
        tooltip.html(``).style("visibility", "hidden");
    }

})