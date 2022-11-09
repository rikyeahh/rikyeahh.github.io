//Scatter plot
// append the svg object to the body of the page

//Read the data
d3.csv("../assets/data5.csv").then(function(data) {
  
  console.log(data)
  const margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 1000 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;

  const svg3 = d3.select("#graph3")
    .append("svg")
      .attr("width", 1000 + margin.left + margin.right)
      .attr("height", 2500 + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            `translate(${margin.left}, ${margin.top})`);
  

  const names = data.map(d => d.name)
  const names_uniq = [...new Set(names)];
  const names_ordered = names_uniq.sort((a, b) => a.localeCompare(b))

  


  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 50])
    .range([ 0, width ]);
  svg3.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([ height, 0]);
  svg3.append("g")
    .call(d3.axisLeft(y));

  // Color scale: give me a specie name, I return a color
  const color = d3.scaleOrdinal()
    .domain(names_ordered)
    .range(d3.schemeTableau10);
  
   // Highlight the specie that is hovered
   const highlight = function(event,d){

    selected_specie = d.name

    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", "lightgrey")
      .attr("r", 0.2)

    d3.selectAll("." + selected_specie)
      .transition()
      .duration(200)
      .style("fill", color(selected_specie))
      .attr("r", 5)
  }

   // Highlight the specie that is hovered
   const doNotHighlight = function(event,d){
    d3.selectAll(".dot")
      .transition()
      .duration(200)
      .style("fill", d => color(d.name))
      .attr("r", 5 )
  }


   // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.
  const tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  
  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  const mouseover = function(event, d) {
    tooltip
      .style("opacity", 1)
  }

  const mousemove = function(event, d) {
    tooltip
      .html(`The exact value of<br>the Ground Living area is: ${d.name}`)
      .style("left", (event.x)/2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (event.y)/2 + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  const mouseleave = function(event,d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
 
  // Add dots
  svg3.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("class", function (d) { return "dot " + d.name } )
      .attr("cx", function (d) { return x(parseFloat(d.height)); } )
      .attr("cy", function (d) { return y(parseFloat(d.co2_absorption)); } )
      .attr("r", 7)
      .style("fill", function (d) { return color(d.name) } )
    .on("mouseover", highlight)
    .on("mouseleave", doNotHighlight )

})