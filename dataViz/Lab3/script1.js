// Choropleth Map - Absolute tree count

const data1 = new Map();

// load both geometric and aggregated data
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data7.csv", function (d) {
        data1.set(d.name, +d.pop)
    })
]).then(function (loadData) {

    const margin_1 = { top: 50, right: 20, bottom: 0, left: 20 },
        width_1 = 1024 - margin_1.left - margin_1.right,
        height_1 = 500 - margin_1.top - margin_1.bottom;

    const svg = d3.select("#graph1")
        .append("svg")
        .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) + ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
        .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

    // projection reflecting the Y to match d3 requirements
    var projection = d3.geoIdentity().reflectY(true)

    const colorScale = d3.scaleThreshold()
        .domain([39, 100, 300, 500, 1000, 2000, 3024]) // from min count to max, with
        .range(d3.schemeGreens[8]);


    
    Legend(d3.scaleThreshold([39, 100, 300, 500, 1000, 2000, 3024], d3.schemeGreens[8]), "#graph1")
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
        .attr("fill", (d) => colorScale(data1.get(d.properties.nome)))
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
                Number of trees: ${data1.get(d.properties.nome)}<br>
                Area: ${d.properties.area} m^2`)
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