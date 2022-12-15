// Scatter plot

d3.csv("../assets/data5.csv").then(function (data) {

    const margin = { top: 10, right: 30, bottom: 10, left: 50 },
        width = 700 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

    const svg3 = d3.select("#graph3")
        .append("svg")
        .attr("width", 700 + margin.left + margin.right)
        .attr("height", 700 + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    const names = data.map(d => d.name)
    const names_uniq = [...new Set(names)];
    const names_ordered = names_uniq.sort((a, b) => a.localeCompare(b));

    // Add X axis
    const x = d3.scaleLinear()
        .domain([0, 50])
        .range([0, width]);
    svg3.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);
    svg3.append("g")
        .call(d3.axisLeft(y));

    // add axes labels
    svg3.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height - 10)
        .text("Tree height (m)");

    svg3.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("CO2 absorption (kg/year)");

    // Color scale: give me a specie name, I return a color
    const color = d3.scaleOrdinal()
        .domain(names_ordered)
        .range(d3.schemeTableau10);

    //TOOLTIP
    // -1- Create a tooltip div that is hidden by default:
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

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip3 = function (event, d) {
        // Highlight the specie that is hovered
        selected_specie = d.name

        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 5)

        d3.selectAll(".dot." + selected_specie.replace(/ /g, "."))
            .transition()
            .duration(200)
            .style("fill", color(selected_specie))
            .attr("r", 7)

        tooltip.html(`Specie: ${d.name}`)
            .style("visibility", "visible");
    }
    const moveTooltip3 = function (event, d) {
        tooltip.style("top", (event.pageY - 10) + "px")
            .style("left", (event.pageX + 10) + "px");
    }

    const hideTooltip3 = function (event, d) {

        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", d => color(d.name))
            .attr("r", 8)

            tooltip.html(``).style("visibility", "hidden");
    }

    // Add dots
    svg3.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
        .attr("class", function (d) { return "dot " + d.name })
        .attr("cx", function (d) { return x(parseFloat(d.height)); })
        .attr("cy", function (d) { return y(parseFloat(d.co2_absorption)); })
        .attr("r", 7)
        .style("fill", function (d) { return color(d.name) })
        .on("mouseover", showTooltip3)
        .on("mousemove", moveTooltip3)
        .on("mouseleave", hideTooltip3)
})