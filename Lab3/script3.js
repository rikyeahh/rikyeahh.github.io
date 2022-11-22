// Choropleth Map - Absolute tree count

// Data and color scale

let data3 = new Map()
// Load external data and boot
Promise.all([
    d3.json("../assets/circoscrizioni.json"),
    d3.csv("../assets/data7.csv", function (d) {
        data3.set(d.code, d.pop)
        if(d.name == 'Zambia'){
            console.log(d)
        }
    })
]).then(function (loadData) {
    //console.log("data", data1);
    //loadData = loadData[0]
    console.log("loadData", loadData);
    
    const margin = { top: 10, right: 30, bottom: 10, left: 50 },
    width = 700 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

    const svg3 = d3.select("#graph3")
        .append("svg")
        .attr("width", 700 + margin.left + margin.right)
        .attr("height", 700 + margin.top + margin.bottom)
        .append("g");

    // Map and projection
    const projection = d3.geoMercator()
        .scale(40)
        .center([0, 20])
        .translate([width / 2, height / 2]);
    const colorScale = d3.scaleThreshold()
        .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
        .range(d3.schemeBlues[7]);
    let topo = loadData[0]
    //console.log("loadData[0]", topo.features);

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
        .attr("fill", function (d) {
            d.total = data3.get(d.properties.nome) || 0;
            return colorScale(d.total);
        })
})