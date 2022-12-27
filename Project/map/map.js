var drawMap = (id, data_url, colormap, mapYear, chemical) => {
    const data = new Map();
    Promise.all([
        d3.json("https://gist.githubusercontent.com/spiker830/3eab0cb407031bf9f2286f98b9d0558a/raw/7edae936285e77be675366550e20f9166bed0ed5/europe_features.json"),
        d3.csv(data_url, function (d) { data.set(d.Country, +d[mapYear]) })
    ]).then(function (loadData) {

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

        var height = 1000;
        var width = document.documentElement.clientWidth / 2 - 20;
        const svg = d3.select(id)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        let projection = d3.geoMercator()
            .center([7, 52])
            .scale([width / 1.3])
            .translate([width / 2, height / 2])
        const color = colormap
        let topo = loadData[0]

        let mouseOver = function (event, d) {
            d3.selectAll(".Country")
                .style("opacity", .5)
            d3.select(this)
                .style("opacity", 1)
                .style("stroke", "black")
            var percValue = Math.round(data.get(d.properties.name))
            percValue = (percValue != 0) && percValue ? percValue + "% of emissions<br>come from agricolture" : "Missing data"
            tooltip.html(d.properties.name + ": " + percValue)
                .style("visibility", "visible");
        }

        let mouseLeave = function (d) {
            d3.selectAll(".Country")
                .style("opacity", .8)
            d3.select(this)
                .style("stroke", "transparent")
            tooltip.html(``).style("visibility", "hidden");
        }
        let mouseMove = () => {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        }

        // Draw the map
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
            // draw each country
            .attr("d", d3.geoPath()
                .projection(projection))
            .attr("nome", d => d.properties.name)
            // set the color of each country
            .attr("fill", function (d) {
                d.total = data.get(d.properties.name) || 0;
                return color(d.total);
            })
            .style("stroke", "transparent")
            .attr("class", function (d) { return "Country" })
            .style("opacity", .8)
            .on("mouseover", mouseOver)
            .on("mousemove", mouseMove)
            .on("mouseleave", mouseLeave)

        svg.append("text")
            .attr("x", 100)
            .attr("y", 150)
            .text(chemical)
            .attr("fill", colormap(60))
            .style("font-size", "35px")
            .style("font-weight", "bold")
    })
    // TODO aggiungere leggenda colorbar per entrambe le mappe
    // TODO rendere lo slider un menu a tendina
}

var slider = document.getElementById("myRange");
function redrawMaps(params) {
    var mapYear = this.value;
    document.getElementById("map1").innerHTML = "";
    document.getElementById("map2").innerHTML = "";
    drawMap("#map1", "/Project/map/CLEAN_nitro_perc.csv", d => d3.interpolateBlues(d / 100), mapYear, "N20")
    drawMap("#map2", "/Project/map/CLEAN_metano_perc.csv", d => d3.interpolateOranges(d / 100), mapYear, "CH4")
}

slider.oninput = redrawMaps
drawMap("#map1", "/Project/map/CLEAN_nitro_perc.csv", d => d3.interpolateBlues(d / 100), 2021, "N20")
drawMap("#map2", "/Project/map/CLEAN_metano_perc.csv", d => d3.interpolateOranges(d / 100), 2021, "CH4")
