// Choropleth Map - Density values

const data2 = new Map();
const data2nTrees = new Map();

// load both geometric and aggregated data
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data8.csv", function (d) {
        data2.set(d.circoscrizioni, +d.tree_density);
        data2nTrees.set(d.circoscrizioni, +d.pop);
    })
]).then(function (loadData) {

    const margin_1 = { top: 50, right: 20, bottom: 0, left: 20 },
        width_1 = 1024 - margin_1.left - margin_1.right,
        height_1 = 500 - margin_1.top - margin_1.bottom;

    const svg = d3.select("#graph2")
        .append("svg")
        .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) + ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
        .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

    // projection reflecting the Y to match d3 requirements
    var projection = d3.geoIdentity().reflectY(true)

    const colorScale = d3.scaleThreshold()
        .domain([0, 0.0001, 0.0003, 0.0009, 0.0126, 0.015, 0.03]) // from min count to max, with
        .range(d3.schemeGreens[8]);


    Legend(d3.scaleThreshold([0, 0.0001, 0.0003, 0.0009, 0.0126, 0.015, 0.03], d3.schemeGreens[8]), "#graph2")

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
        .attr("fill", (d) => colorScale(data2.get(d.properties.nome)))
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "black")

    // reactiveness
    // add tooltip
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

    svg.join("g")
        .selectAll("path")
        .on("mouseover", function (event, d) {
            var circo = d.properties.numero_cir;
            // make all regions' color duller and delete stroke
            svg.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")

            // make hovered ragion (id corresponding to hovered element) color normal
            svg.selectAll(`.circo${circo}`)
                .style("fill-opacity", "1")
                .style("stroke", "black")
                .style("stroke-width", "2px")
            // and show tooltip
            tooltip.html(`${d.properties.nome}<br>
                Tree density: ${data2.get(d.properties.nome)}<br>
                Number of trees: ${data2nTrees.get(d.properties.nome)}<br>
                Area: ${d.properties.area}<br>`)
                .style("visibility", "visible");
        })
        .on("mousemove", function () {
            // move tooltip
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function (event, d) {
            // reset stroke and color
            svg.selectAll("path")
                .style("stroke", "black")
                .style("stroke-width", "1")
                .style("fill-opacity", "1")
            tooltip.html(``).style("visibility", "hidden");
        });
})