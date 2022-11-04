var WIDTH = 750, HEIGHT = 600;

const margin = { top: 30, right: 30, bottom: 70, left: 200 }
width = WIDTH - margin.left - margin.right;
height = HEIGHT - margin.top - margin.bottom;

widthSquares = 20;
heightSquares = 5;

d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data2.csv").then(function (data) {

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

        const svg3 = d3.select("#graph5")
            .append("svg")
            .attr("width", sm_width + sm_margin + 10)
            .attr("height", sm_height)
            .append("g")
            .attr("transform", `translate(${sm_margin},${50})`)

        svg3.append("text")
            .attr("transform", "translate(" + (sm_width / 2) + " ," + -10 + ")")
            .style("text-anchor", "middle")
            .style("font-size", "15")
            .text(circoscrizioni[circoscrizione])// + " " + values)

        var x = 0
        var y = 0
        for (let i = 0; i < values.length; i++) {
            for (let n_tree = 0; n_tree < values[i]; n_tree++) {
                console.log("X", x, "Y", y);
                svg3.append("rect")
                    .attr("width", squareDimension)
                    .attr("height", squareDimension)
                    .attr("x", x)
                    .attr("y", y)
                    .attr("transform", `translate(${15},0)`)
                    .attr("fill", plantColor[i])
                x += squareDimension + squarePadding
                if (x != x % ((squareDimension + squarePadding) * 10))
                    y += squareDimension + squarePadding
                x %= (squareDimension + squarePadding) * 10
            }

        }
    }
});