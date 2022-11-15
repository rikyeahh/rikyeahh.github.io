//Bubble plot
d3.csv("https://raw.githubusercontent.com/rikyeahh/rikyeahh.github.io/main/assets/data5.csv").then(function (data) {

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 20, bottom: 70, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg5 = d3.select("#graph5")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    // Add X axis
    const heights = data.map(d => d.height)
    const x = d3.scaleLinear()
        .domain([0, Math.max(...heights)]).nice()
        .range([0, width]);
    svg5.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));
    svg5.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text("Height (m)");

    // Add Y axis
    const co2_absorptions = data.map(d => d.co2_absorption)
    const y = d3.scaleLinear()
        .domain([0, Math.max(...co2_absorptions)]).nice()
        .range([height, 0]);
    svg5.append("g")
        .call(d3.axisLeft(y));

    svg5.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("CO2 absorptions (Kg/YY)");

    // Add a scale for bubble size
    const canopy_covers = data.map(d => d.canopy_cover)
    const z = d3.scaleLinear()
        .domain([0, Math.max(...canopy_covers)]).nice()
        .range([3, 35]);

    // Add a scale for bubble color
    const names = data.map(d => d.name)
    const names_uniq = [...new Set(names)];
    const names_ordered = names_uniq.sort((a, b) => a.localeCompare(b))
    const myColor = d3.scaleOrdinal()
        .domain(names_ordered)
        .range(d3.schemeTableau10);

    // -1- Create a tooltip div that is hidden by default:
    const tooltip = d3.select("#graph5")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = function (event, d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .style("color", myColor(d.name))
            .html("Tree: " + d.name +
                "<br>Canopy cover (m^2): " + d.canopy_cover +
                "<br>Height(m): " + d.height +
                "<br>CO2 absorption (Kg/YY): " + d.co2_absorption)
            .style("left", (event.x) + "px")
            .style("top", (event.y) + 30 + "px")
    }
    const moveTooltip = function (event, d) {
        tooltip
            .style("left", (event.x) / 2 + "px")
            .style("top", (event.y) / 2 + 30 + "px")
    }
    const hideTooltip = function (event, d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add dots
    svg5.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.height))
        .attr("cy", d => y(d.co2_absorption))
        .attr("r", d => z(d.canopy_cover))
        .style("fill", d => myColor(d.name))
        // -3- Trigger the functions
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)


    var size = d3.scaleSqrt()
        .domain([0, Math.max(...canopy_covers)]).nice()
        .range([3, 35]);

    // Add legend: circles
    var valuesToShow = [Math.max(...canopy_covers) / 8, Math.max(...canopy_covers) / 2, Math.max(...canopy_covers)]
    var xCircle = 550
    var xLabel = 700
    var yCircle = 90
    svg5
        .selectAll("#graph5")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return yCircle - size(d) })
        .attr("r", function (d) { return size(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg5
        .selectAll("#graph5")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + size(d) })
        .attr('x2', xLabel - 50)
        .attr('y1', function (d) { return yCircle - size(d) })
        .attr('y2', function (d) { return yCircle - 1.5 * size(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg5
        .selectAll("#graph5")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel - 50)
        .attr('y', function (d) { return yCircle - 1.5 * size(d) })
        .text(d => d + " (m^2)")
        .style("font-size", 15)
        .attr('alignment-baseline', 'center')

    // legend
    for (let i = 0; i < names_ordered.length; i++) {
        svg5.append("circle")
            .attr("cx", 550)
            .attr("cy", 100 + i * 18)
            .attr("r", 6)
            .style("fill", myColor(i))
        svg5.append("text")
            .attr("x", 570)
            .attr("y", 100 + i * 18)
            .text(names_ordered[i])
            .style("font-size", "15px")
            .attr("alignment-baseline", "middle")
    }
})

