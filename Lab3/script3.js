// Choropleth Map - Absolute tree count

// Data and color scale

const data3 = new Map();
// Load external data and boot
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data8.csv", function (d) {
        data3.set(d.circoscrizioni, +d.oxygen_production)
    })
]).then(function (loadData) {
    
    const margin_1 = { top: 50, right: 20, bottom: 0, left: 20 },
    width_1 = 1024 - margin_1.left - margin_1.right,
    height_1 = 500 - margin_1.top - margin_1.bottom;


    const svg3 = d3.select("#graph3")
        .append("svg")
        .attr("viewBox", '0 0 ' + (width_1 + margin_1.left + margin_1.right) + ' ' + (height_1 + margin_1.top + margin_1.bottom))
        .append("g")
        .attr("transform", `translate(${margin_1.left}, ${margin_1.top})`);
   
    // Map and projection
    var projection = d3.geoIdentity().reflectY(true)

    const colorScale = d3.scaleThreshold()
        .domain([500, 2000, 4000, 10000, 250000, 40000, 55000])
        .range(d3.schemeBlues[7]);
  
    let topo = loadData[0]
    projection.fitSize([width_1, height_1], topo);
    console.log(data3)

    // Draw the map
    svg3.append("g")
        .selectAll("path")
        .data(topo.features)
        .join("path")
        // draw each country
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        // set the color of each country
        .attr("fill", (d) => colorScale(data3.get(d.properties.nome)))
        .attr("class", (d) => `circo${d.properties.numero_cir}`)
        .style("stroke", "black")


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


        Legend(d3.scaleThreshold([500, 2000, 4000, 10000, 250000, 40000, 55000], d3.schemeBlues[7]), "#graph3")

    svg3.join("g")
        .selectAll("path")
        .on("mouseover", function (event, d) {
            var circo = d.properties.numero_cir;
            // make all regions' color duller and delete stroke
            svg3.selectAll("path")
                .style("stroke", "transparent")
                .style("fill-opacity", "0.5")

            // make hovered ragion (id corresponding to hovered element) color normal
            svg3.selectAll(`.circo${circo}`)
                .style("fill-opacity", "1")
                .style("stroke", "black")
                .style("stroke-width", "2px")
            // and show tooltip
            tooltip.html(`${d.properties.nome}<br>
                Oxygen production: ${Math.round(data3.get(d.properties.nome)*100)/100}<br>
                Area: ${d.properties.area} km^2`)
                .style("visibility", "visible");
        })
        .on("mousemove", function () {
            // move tooltip
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function (event, d) {
            // reset stroke and color
            svg3.selectAll("path")
                .style("stroke", "black")
                .style("stroke-width", "1")
                .style("fill-opacity", "1")
            tooltip.html(``).style("visibility", "hidden");

        });
})