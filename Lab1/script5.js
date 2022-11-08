d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function (data) {

    var WIDTH = 750, HEIGHT = 600;

    const margin = { top: 30, right: 30, bottom: 70, left: 200 }
    width = WIDTH - margin.left - margin.right;
    height = HEIGHT - margin.top - margin.bottom;

    widthSquares = 20;
    heightSquares = 5;

    const circoscrizioni = data.map(d => d.circoscrizione);
    const plants = Object.keys(data[0]).filter(d => d != "circoscrizione");

    for (let circoscrizione = 0; circoscrizione < circoscrizioni.length; circoscrizione++) {

        var values = Object.values(data[circoscrizione]).splice(1);
        //console.log(values);
        var total = values.reduce((a, b) => parseInt(a) + parseInt(b), 0)
        values = values.map(v => Math.round(v * 100 / total));
        //console.log(values, "eccess of", values.reduce((a, b) => a + b, 0) - 100);
        // fix the eccess/lack due to the rounding by adjusting the "other" class
        values[values.length - 1] -= values.reduce((a, b) => a + b, 0) - 100;
        //console.log(values);
        var sm_margin = 5;
        var sm_width = 150;
        var sm_height = 170;
        var plantColor = d3.schemeTableau10
        var squareDimension = 10
        var squarePadding = 2

        const svg5 = d3.select("#graph5")
            .append("svg")
            .attr("width", sm_width + sm_margin + 10)
            .attr("height", sm_height)
            .append("g")
            .attr("transform", `translate(${sm_margin},${50})`)

        svg5.append("text")
            .attr("transform", "translate(" + (sm_width / 2) + " ," + -10 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15")
            .text(circoscrizioni[circoscrizione])// + " " + values)

        // add tooltip
        const tooltip5 = d3.select("body")
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

        var x = 0
        var y = 0
        for (let i = 0; i < values.length; i++) {
            for (let n_tree = 0; n_tree < values[i]; n_tree++) {
                //console.log("X", x, "Y", y);
                
                let className = "circ" + circoscrizione + plants[i].replaceAll(" ", "_");

                svg5.append("rect")
                    .attr("width", squareDimension)
                    .attr("height", squareDimension)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("transform", `translate(${15},0)`)
                    .attr("fill", plantColor[i])
                    .attr("class", className)
                    // on mouseover: red bar and show tooltip
                    .on("mouseover", function (d, j) {
                        tooltip5.html(plants[i])
                            .style("visibility", "visible");
                        d3.selectAll("." + className).style("opacity", 0.7);
                    })
                    // move tooltip on move
                    .on("mousemove", function () {
                        tooltip5
                            .style("top", (event.pageY - 10) + "px")
                            .style("left", (event.pageX + 10) + "px");
                    })
                    // on mouseout: blue bar and hide tooltip
                    .on("mouseout", function () {
                        tooltip5.html(``).style("visibility", "hidden");
                        d3.selectAll("." + className).style("opacity", 1);
                    });

                x += squareDimension + squarePadding
                if (x != x % ((squareDimension + squarePadding) * 10))
                    y += squareDimension + squarePadding
                x %= (squareDimension + squarePadding) * 10
            }
        }
    }
});