d3.csv("animals_per_country.csv").then(function (graph, err) {

    // set the dimensions and margins of the graph
    const width = document.documentElement.clientWidth - 100;
    const height = 450

    // append the svg object to the body of the page
    const svg = d3.select("#graph2")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    var countries = graph.map(x => x.Country)
    var animals = graph.columns.filter(el => !["Index", "Total", "Country"].includes(el))
    const animals_sizes = [80, 130, 2, 2, 1000]
    const land_use_per_1000_kcals = [116, 7, 6, 6, 119]
    console.log(countries, animals);


    graph = graph.filter(e => e.Country == 'Spain')
    // normalize data as 
    data = []
    for (let i = 0; i < graph.length; i++) {
        line = graph[i];
        for (const animal in line) {
            if (Object.hasOwnProperty.call(line, animal) && !["Index", "Total", "Country"].includes(animal)) {
                line[animal] /= parseInt(graph[i]["Total"])
                line[animal] *= 100
                console.log(animal, line[animal]);
                for (let count = 0; count < Math.max(1, Math.round(line[animal])); count++) {
                    data.push({
                        "animal_idx": animals.indexOf(animal),
                        "animal_name": animal
                    })
                }
            }
        }
    }

    console.log("DATA", data);
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
    scaleByLandPerKcal = false
    var bubbleRadius = (d) => {
        if (scaleByWeight)
            return Math.max(animals_sizes[d.animal_idx] / 50, 1)
        if(scaleByLandPerKcal)
            return Math.max(land_use_per_1000_kcals[d.animal_idx] / 5, 1)
            
        return 10
    }
    // Initialize the circle: all located at the center of the svg area
    const node = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", d => bubbleRadius(d))
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
        .force("collide", d3.forceCollide().strength(0.2).radius(d => bubbleRadius(d) + 2).iterations(1)) // Force that avoids circle overlapping

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
})