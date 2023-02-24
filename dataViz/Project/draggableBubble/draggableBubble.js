function drawBubbles(scaleCriterion, country) {
    d3.csv("/Project/draggableBubble/animals_per_country.csv").then(function (graph, err) {

        document.getElementById("animalBubbles").innerHTML = '';
        // set the dimensions and margins of the graph
        const width = document.documentElement.clientWidth - 100;
        const height = 450

        // append the svg object to the body of the page
        const svg = d3.select("#animalBubbles")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        var countries = graph.map(x => x.Country)
        var animals = graph.columns.filter(el => !["Index", "Total", "Country"].includes(el))
        const animals_sizes = [80, 200, 2, 2, 1000]
        const land_use_per_1000_kcals = [116, 7, 6, 6, 119]
        const GHG_per_kg_of_food = [71, 12, 10, 25, 100]



        graph = graph.filter(e => e.Country == country)
        // normalize data as 
        data = []
        for (let i = 0; i < graph.length; i++) {
            line = graph[i];
            for (const animal in line) {
                if (Object.hasOwnProperty.call(line, animal) && !["Index", "Total", "Country"].includes(animal)) {
                    line[animal] /= parseInt(graph[i]["Total"])
                    line[animal] *= 100
                    for (let count = 0; count < Math.max(1, Math.round(line[animal])); count++) {
                        data.push({
                            "animal_idx": animals.indexOf(animal),
                            "animal_name": animal
                        })
                    }
                }
            }
        }

        // A scale that gives a X target position for each animal
        var spawnPoints = []
        for (let i = 0; i < width; i += ((width) / animals.length)) {
            spawnPoints.push(i)
        }
        const x = d3.scaleOrdinal()
            .domain(animals)
            .range(spawnPoints)

        // A color scale
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        scaleByWeight = false
        scaleByLandPerKcal = true
        var bubbleRadius = (scaleCriterion, d) => {
            switch (scaleCriterion) {
                case "fixedSize": highlightBubble("bubbleButton4"); return 10;
                case "scaleByWeight": highlightBubble("bubbleButton3"); return Math.max(animals_sizes[d.animal_idx] / 50, 1);
                case "LandPerKcal": highlightBubble("bubbleButton2"); return Math.max(land_use_per_1000_kcals[d.animal_idx] / 5, 1);
                case "GHGPer1000Kcal": highlightBubble("bubbleButton1"); return Math.max(GHG_per_kg_of_food[d.animal_idx] / 5, 1)
                default: return 10;
            }
        }
        // Initialize the circle: all located at the center of the svg area
        const node = svg.append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("r", d => bubbleRadius(scaleCriterion, d))
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", d => color(d.animal_idx))
            .style("fill-opacity", 0.8)
            .attr("stroke", "black")
            .style("stroke-width", 1)
            .call(d3.drag() // call specific function when circle is dragged
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))


        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(0.2).x(d => x(d.animal_idx)))
            .force("y", d3.forceY().strength(0.1).y(height / 2))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(0.1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(0.2).radius(d => bubbleRadius(scaleCriterion, d) + 2).iterations(1)) // Force that avoids circle overlapping

        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function (d) {
                node.attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });

        // What happens when a circle is dragged?
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }

        // just to start the simulation
        dragstarted("", "");

        //add legend
        for (let i = 0; i < animals.length; i++) {
            svg.append("text")
                .attr("x", x(animals[i]) + 80)
                .attr("y", height - 80)
                .text(animals[i])
        }
        // Add legend: circles
        var valuesToShow = [10]
        var textToShow = ["1% of total animals"]
        if (scaleCriterion == 'scaleByWeight') {
            valuesToShow = [Math.max(200 / 50, 1), Math.max(500 / 50, 1), Math.max(1000 / 50, 1)] // fix this
            textToShow = ["200 kg", "500 kg", "1000 kg"]
        }
        if (scaleCriterion == 'LandPerKcal') {
            valuesToShow = [Math.max(5 / 5, 1), Math.max(50 / 5, 1), Math.max(100 / 5, 1)] // fix this
            textToShow = ["5 m²", "50 m²", "100 m²"]
        }
        if (scaleCriterion == 'GHGPer1000Kcal') {
            valuesToShow = [Math.max(5 / 5, 1), Math.max(50 / 5, 1), Math.max(100 / 5, 1)] // fix this
            textToShow = ["5 tons", "50 tons", "100 tons"]
        }


        for (let i = 0; i < valuesToShow.length; i++) {
            var d = valuesToShow[i];
            svg.append("circle")
                .attr("cx", 50)
                .attr("cy", 30 + i * 30)
                .attr("r", d)
                .style("fill", "none")
                .attr("stroke", "black")
            svg.append("text")
                .attr("x", 70)
                .attr("y", 35 + i * 30)
                .style("fill", "black")
                .text(textToShow[i])
        }
    })
    // TODO capire bug allineamento bolle sopra testo
}

drawBubbles("GHGPer1000Kcal", "Spain")
highlightBubble("bubbleButton1")

document.getElementById('selectCountry').addEventListener('change', function () {
    let barplotButtons = ["bubbleButton1", "bubbleButton2", "bubbleButton3", "bubbleButton4"]
    let params = ['GHGPer1000Kcal', 'LandPerKcal', 'scaleByWeight', 'fixedSize']
    // get selected button
    for (let i = 0; i < barplotButtons.length; i++) {
        const id = barplotButtons[i];
        var button = document.getElementById(id);
        if(button.className.includes("selected"))
            drawBubbles(params[i], this.value);
    }
});

function highlightBubble(id) {
    let barplotButtons = ["bubbleButton1", "bubbleButton2", "bubbleButton3", "bubbleButton4"]
    barplotButtons.forEach(element => {
        var button = document.getElementById(element);
        if (element == id) {
            if (!button.className.includes("selected"))
                button.className += " selected"
        } else {
            if (button.className.includes("selected"))
                button.className -= " selected"
        }
    });
}