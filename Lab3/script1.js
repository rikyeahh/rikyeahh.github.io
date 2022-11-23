// Choropleth Map - Absolute tree count

// Data and color scale
const data1 = new Map();

// Load external data and boot
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data7.csv", function (d) {
        data1.set(d.name, +d.pop)
    })
]).then(function (loadData) {

    // Set the dimensions and margins of the graph
    const margin_1 = { top: 50, right: 20, bottom: 0, left: 20 },
        width_1 = 1024 - margin_1.left - margin_1.right,
        height_1 = 500 - margin_1.top - margin_1.bottom;

    // Append the svg_1 object to the page
    const svg_1 = d3.select("#graph1")
        .append("svg")
        .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) + ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
        .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);

    // Map and projection
    var projection = d3.geoIdentity().reflectY(true)

    const colorScale = d3.scaleThreshold()
        .domain([10, 100, 300, 500, 1000, 2000, 3024])
        .range(d3.schemeGreens[8]);

    let topo = loadData[0]
    projection.fitSize([width_1, height_1], topo);

    // Draw the map
    svg_1.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", (d) => colorScale(data1.get(d.properties.nome)))
        .style("fill-opacity", "0.9")
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "white")

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

    svg_1.join("g")
        .selectAll("path")
        .on("mouseover", function (event, d) {
            // Select all the rect with this specific class (tree species)
            var circo = d.properties.numero_cir;
            svg_1.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")
                .transition("selected")

            svg_1.selectAll(`.circo${circo}`)
                .style("fill-opacity", "1")
                .style("stroke", "#000")
                .style("stroke-width", "2px")
            console.log(d.properties);
            tooltip.html(`${d.properties.nome}<br>
                Tree abundance: ${data1.get(d.properties.nome)}<br>
                Area: ${d.properties.area} km^2`)
                .style("visibility", "visible");
        })
        .on("mousemove", function () {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function (event, d) {
            // Select all the rect with this specific class (tree species)

            svg_1.selectAll("path")
                .style("stroke", "white")
                .style("stroke-width", "1")
                .style("fill-opacity", "0.9")
                .transition("selected")
                .duration(300);
            tooltip.html(``).style("visibility", "hidden");

        });

})