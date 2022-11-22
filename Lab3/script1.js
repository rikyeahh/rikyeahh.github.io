// Choropleth Map - Absolute tree count

// Data and color scale
const data = new Map();

// Load external data and boot
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data7.csv", function (d) {
        console.log(d.name);
        data.set(d.name, +d.pop)
    })
]).then(function (loadData) {
    //console.log("data", data1);
    //loadData = loadData[0]
    console.log("loadData", loadData);
    
    const svg = d3.select("#svg1"),
        width = + svg.attr("width"),
        height = + svg.attr("height");

    // Map and projection
    const projection = d3.geoMercator()
        .scale(40)
        .center([0, 20])
        .translate([width / 2, height / 2]);
    const colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);
    let topo = loadData[0]
    console.log("loadData[0]", topo.features);

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
            .attr("fill", (d) => { 
                console.log(d.properties.nome);
                return colorScale(data.get(d.properties.nome)) }
            )
            .style("fill-opacity", "0.9")
            .attr("class", (d) => `circo${d.properties.numero_cir}`)
            .style("stroke", "white")

        svg_1.join("g")
            .selectAll("path")
            .on("mouseover", function (event, d) {
                // Select all the rect with this specific class (tree species)
                var circo = d.properties.numero_cir;
                svg_1.selectAll("path")
                    .style("stroke", "transparent")
                    .style("fill-opacity", "0.5")
                    .transition("selected")
                    .duration(300)

                svg_1.selectAll(`.circo${circo}`)
                    .style("fill-opacity", "1")
                    .transition("selected")
                    .duration(300)
                    .style("stroke", "#000")
                    .style("stroke-width", "2px")

                tooltip_1.transition("appear-box")
                    .duration(300)
                    .style("opacity", .9)
                    .delay(1);

                console.log(d)

                // ---------------- TODO --------------------
                // Aggiungere l'area corretta nel tooltip
                tooltip_1.html("<span class='tooltiptext'>" + "<b>Name: " + d.properties.nome + "</b><br>Tree Abundance: " + data.get(d.properties.nome) +
                    "</span>")
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function (event, d) {
                // Select all the rect with this specific class (tree species)

                svg_1.selectAll("path")
                    .style("stroke", "white")
                    .style("stroke-width", "1")
                    .style("fill-opacity", "0.9")
                    .transition("selected")
                    .duration(300)

                tooltip_1.transition("disappear-box")
                    .duration(300)
                    .style("opacity", 0);
            });

    })